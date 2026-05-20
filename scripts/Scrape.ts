import matter from "gray-matter";
import { createHash } from "node:crypto";
import { mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { extractBestPractice } from "./lib/extract.ts";
import { classifyDeviations, loadBaseline, serializeBaseline } from "./lib/baseline.ts";
import { fetchTocBpNodes } from "./lib/toc.ts";
import { PILLARS, SECTION_KEYS, type BestPractice, type Deviation, type Meta, type TocBpNode } from "./lib/types.ts";

const FRAMEWORK_SOURCE = "https://docs.aws.amazon.com/wellarchitected/latest/framework/";
const CACHE_DIR = ".cache";
const BP_DIR = "data/best-practices";
const PILLAR_DIR = "data/pillars";
const META_PATH = "data/_meta.json";
const BASELINE_PATH = "data/_structure-baseline.json";
const AWS_SOURCE = "Amazon Web Services — docs.aws.amazon.com";
const AWS_LICENCE = "© Amazon Web Services. Reproduced under AWS documentation terms — see NOTICE.";

type Flags = {
  offline: boolean;
  concurrency: number;
  blessBaseline: boolean;
};

type PageResult = {
  node: TocBpNode;
  html: string;
};

type FetchError = {
  id: string;
  message: string;
};

type WriteStats = {
  written: number;
  skipped: number;
  deleted: number;
  pillarsWritten: number;
  metaWritten: boolean;
};

function parseFlags(argv: string[]): Flags {
  let offline = false;
  let concurrency = 8;
  let blessBaseline = false;

  for (const arg of argv) {
    if (arg === "--offline") {
      offline = true;
    } else if (arg === "--bless-baseline") {
      blessBaseline = true;
    } else if (arg.startsWith("--concurrency=")) {
      const raw = arg.slice("--concurrency=".length);
      const parsed = Number.parseInt(raw, 10);
      if (!Number.isFinite(parsed) || parsed < 1) {
        throw new Error(`Invalid --concurrency value: ${raw}`);
      }
      concurrency = parsed;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return { offline, concurrency, blessBaseline };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sha256Hex(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

// Emits a GitHub Actions workflow annotation only when running inside CI.
// Outside GitHub Actions it is a no-op so local runs stay quiet.
export function ghAnnotate(level: "warning" | "error", message: string): void {
  if (process.env.GITHUB_ACTIONS === "true") {
    console.log(`::${level}::${message}`);
  }
}

function contentHash(bp: BestPractice): string {
  const canonical = [
    bp.id,
    bp.pillarSlug,
    bp.questionId,
    bp.question,
    bp.title,
    bp.riskLevel,
    bp.sourceUrl,
    bp.statement,
    bp.desiredOutcome,
    bp.commonAntiPatterns,
    bp.benefits,
    bp.implementationGuidance,
    bp.resources,
    structureFingerprint(bp),
  ].join(" ");
  return `sha256:${sha256Hex(canonical)}`;
}

function structureFingerprint(bp: BestPractice): string {
  const sectionBits = SECTION_KEYS.map((section) => (bp.sectionPresence[section] ? "1" : "0")).join(",");
  return `${sectionBits}|risk:${bp.riskLevel !== "UNKNOWN" ? "1" : "0"}`;
}

function sourceUrl(node: TocBpNode): string {
  return `${FRAMEWORK_SOURCE}${node.href}`;
}

async function readTextIfExists(filePath: string): Promise<string | undefined> {
  const file = Bun.file(filePath);
  if (!(await file.exists())) {
    return undefined;
  }
  return await file.text();
}

async function writeIfChanged(filePath: string, text: string): Promise<boolean> {
  const existing = await readTextIfExists(filePath);
  if (existing === text) {
    return false;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await Bun.write(filePath, text);
  return true;
}

async function fetchWithRetry(url: string): Promise<string> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      if (response.ok) {
        return await response.text();
      }

      const retriable = response.status === 429 || response.status >= 500;
      if (!retriable || attempt === 2) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastError = new Error(message);
      if (attempt === 2) {
        break;
      }
    } finally {
      clearTimeout(timeout);
    }

    await sleep(500 * 2 ** attempt);
  }

  throw lastError ?? new Error("fetch failed");
}

async function loadHtml(node: TocBpNode, offline: boolean): Promise<string> {
  const cachePath = path.join(CACHE_DIR, node.href);

  if (offline) {
    const cached = await readTextIfExists(cachePath);
    if (cached === undefined) {
      throw new Error(`missing cache file ${cachePath}`);
    }
    return cached;
  }

  const html = await fetchWithRetry(sourceUrl(node));
  await mkdir(path.dirname(cachePath), { recursive: true });
  await Bun.write(cachePath, html);
  return html;
}

async function loadPages(nodes: TocBpNode[], flags: Flags): Promise<{ pages: PageResult[]; errors: FetchError[] }> {
  const pages = new Array<PageResult | undefined>(nodes.length);
  const errors: FetchError[] = [];
  let next = 0;

  async function worker(): Promise<void> {
    while (true) {
      const index = next;
      next += 1;
      if (index >= nodes.length) {
        return;
      }

      const node = nodes[index];
      try {
        pages[index] = { node, html: await loadHtml(node, flags.offline) };
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        errors.push({ id: node.id, message });
      }
    }
  }

  const workerCount = Math.min(flags.concurrency, nodes.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return {
    pages: pages.filter((page): page is PageResult => page !== undefined),
    errors,
  };
}

function bodyForBestPractice(bp: BestPractice): string {
  const sections: Array<[string, string]> = [
    ["Statement", bp.statement],
    ["Desired Outcome", bp.desiredOutcome],
    ["Common Anti-Patterns", bp.commonAntiPatterns],
    ["Benefits", bp.benefits],
    ["Implementation Guidance", bp.implementationGuidance],
    ["Resources", bp.resources],
  ];

  const lines = [`# ${bp.id} — ${bp.title}`];
  for (const [heading, content] of sections) {
    if (content.trim().length > 0) {
      lines.push("", `## ${heading}`, "", content.trim());
    }
  }
  return `${lines.join("\n")}\n`;
}

async function writeBestPractices(bestPractices: BestPractice[], hashes: Map<string, string>): Promise<Pick<WriteStats, "written" | "skipped" | "deleted">> {
  await mkdir(BP_DIR, { recursive: true });
  let written = 0;
  let skipped = 0;

  for (const bp of bestPractices) {
    const filePath = path.join(BP_DIR, `${bp.id}.md`);
    const hash = hashes.get(bp.id);
    if (hash === undefined) {
      throw new Error(`missing content hash for ${bp.id}`);
    }

    const existing = await readTextIfExists(filePath);
    if (existing !== undefined) {
      const parsed = matter(existing);
      if (parsed.data["content_hash"] === hash) {
        skipped += 1;
        continue;
      }
    }

    const frontmatter = {
      id: bp.id,
      pillar: bp.pillarSlug,
      pillar_question: bp.questionId,
      title: bp.title,
      risk_level: bp.riskLevel,
      source_url: bp.sourceUrl,
      scraped_at: new Date().toISOString().slice(0, 10),
      source: AWS_SOURCE,
      licence: AWS_LICENCE,
      content_hash: hash,
      extraction_warnings: bp.warnings,
      sections_present: bp.sectionPresence,
    };
    const markdown = matter.stringify(bodyForBestPractice(bp), frontmatter);
    await Bun.write(filePath, markdown.endsWith("\n") ? markdown : `${markdown}\n`);
    written += 1;
  }

  const currentIds = new Set(bestPractices.map((bp) => bp.id));
  let deleted = 0;
  const existingFiles = await safeReadDir(BP_DIR);
  for (const fileName of existingFiles) {
    if (!fileName.endsWith(".md")) {
      continue;
    }
    const id = fileName.slice(0, -".md".length);
    if (!currentIds.has(id)) {
      await rm(path.join(BP_DIR, fileName));
      deleted += 1;
    }
  }

  return { written, skipped, deleted };
}

function isErrorDeviation(deviation: Deviation): boolean {
  return deviation.kind === "REGRESSION" || deviation.kind === "REMOVED_BP";
}

function deviationMessage(deviation: Deviation): string {
  return deviation.section === undefined
    ? `${deviation.kind} ${deviation.bpId}`
    : `${deviation.kind} ${deviation.bpId} ${deviation.section}`;
}

function printStructureDrift(deviations: Deviation[]): void {
  if (deviations.length === 0) {
    console.log("Structure drift: 0 deviations");
    return;
  }

  const errorCount = deviations.filter(isErrorDeviation).length;
  const warningCount = deviations.length - errorCount;
  console.log(`Structure drift: ${deviations.length} deviations (${errorCount} errors, ${warningCount} warnings)`);
  for (const deviation of deviations) {
    console.log(`  - ${deviationMessage(deviation)}`);
  }
}

async function blessStructureBaseline(bestPractices: BestPractice[]): Promise<void> {
  if (process.env.CI) {
    console.error("--bless-baseline refuses to run under CI (process.env.CI is set); blessing is a human-only action");
    process.exit(1);
  }

  const oldBaseline = await loadBaseline(BASELINE_PATH);
  await mkdir(path.dirname(BASELINE_PATH), { recursive: true });
  await Bun.write(BASELINE_PATH, serializeBaseline(bestPractices));
  console.log(`Structure baseline written: ${BASELINE_PATH}`);
  if (oldBaseline !== undefined) {
    printStructureDrift(classifyDeviations(bestPractices, oldBaseline));
  } else {
    console.log("Previous structure baseline: none");
  }
  process.exit(0);
}

async function enforceStructureBaseline(bestPractices: BestPractice[]): Promise<void> {
  const baseline = await loadBaseline(BASELINE_PATH);
  if (baseline === undefined) {
    console.log(`Notice: no structure baseline at ${BASELINE_PATH} — skipping drift gate. Run with --bless-baseline to create one.`);
    return;
  }

  const deviations = classifyDeviations(bestPractices, baseline);
  for (const deviation of deviations) {
    ghAnnotate(isErrorDeviation(deviation) ? "error" : "warning", deviationMessage(deviation));
  }
  printStructureDrift(deviations);
  if (deviations.some(isErrorDeviation)) {
    process.exit(1);
  }
}

async function safeReadDir(dir: string): Promise<string[]> {
  try {
    return await readdir(dir);
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

function pillarMarkdown(slug: string, bestPractices: BestPractice[]): string {
  const pillar = PILLARS.find((item) => item.slug === slug);
  if (pillar === undefined) {
    throw new Error(`unknown pillar slug ${slug}`);
  }

  const byQuestion = new Map<string, { question: string; bps: BestPractice[] }>();
  for (const bp of bestPractices.filter((item) => item.pillarSlug === slug)) {
    const group = byQuestion.get(bp.questionId) ?? { question: bp.question, bps: [] };
    group.bps.push(bp);
    byQuestion.set(bp.questionId, group);
  }

  const lines = [
    "---",
    `pillar: ${slug}`,
    `name: ${JSON.stringify(pillar.name)}`,
    `question_count: ${byQuestion.size}`,
    `bp_count: ${bestPractices.filter((bp) => bp.pillarSlug === slug).length}`,
    "---",
    "",
    `# ${pillar.name}`,
    "",
    "## Questions",
  ];

  for (const questionId of [...byQuestion.keys()].sort()) {
    const group = byQuestion.get(questionId);
    if (group === undefined) {
      continue;
    }
    lines.push("", `### ${questionId} — ${group.question}`, "");
    for (const bp of group.bps.sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`- [${bp.id}](../best-practices/${bp.id}.md) — ${bp.title}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

async function writePillars(bestPractices: BestPractice[]): Promise<number> {
  await mkdir(PILLAR_DIR, { recursive: true });
  let written = 0;
  for (const pillar of PILLARS) {
    const text = pillarMarkdown(pillar.slug, bestPractices);
    if (await writeIfChanged(path.join(PILLAR_DIR, `${pillar.slug}.md`), text)) {
      written += 1;
    }
  }
  return written;
}

async function writeMeta(bestPractices: BestPractice[], hashes: Map<string, string>): Promise<boolean> {
  const sortedIds = bestPractices.map((bp) => bp.id).sort();
  const pairs = sortedIds.map((id) => {
    const hash = hashes.get(id);
    if (hash === undefined) {
      throw new Error(`missing content hash for ${id}`);
    }
    return `${id}:${hash}`;
  });
  const aggregateHash = `sha256:${sha256Hex(pairs.join("\n"))}`;

  const existing = await readTextIfExists(META_PATH);
  if (existing !== undefined) {
    const parsed = JSON.parse(existing) as Partial<Meta>;
    if (parsed.content_hash === aggregateHash) {
      return false;
    }
  }

  const bestPracticeHashes: Record<string, string> = {};
  for (const id of sortedIds) {
    const hash = hashes.get(id);
    if (hash === undefined) {
      throw new Error(`missing content hash for ${id}`);
    }
    bestPracticeHashes[id] = hash;
  }

  const meta: Meta = {
    generated_at: new Date().toISOString(),
    framework_source: FRAMEWORK_SOURCE,
    bp_count: bestPractices.length,
    pillar_count: PILLARS.length,
    content_hash: aggregateHash,
    best_practices: bestPracticeHashes,
  };

  await mkdir(path.dirname(META_PATH), { recursive: true });
  await Bun.write(META_PATH, `${JSON.stringify(meta, null, 2)}\n`);
  return true;
}

function printSummary(bestPractices: BestPractice[], stats: WriteStats): void {
  const counts = new Map<string, number>();
  for (const pillar of PILLARS) {
    counts.set(pillar.slug, 0);
  }
  for (const bp of bestPractices) {
    counts.set(bp.pillarSlug, (counts.get(bp.pillarSlug) ?? 0) + 1);
  }

  console.log("BP count per pillar:");
  for (const pillar of PILLARS) {
    console.log(`  ${pillar.slug}: ${counts.get(pillar.slug) ?? 0}`);
  }
  console.log(`BP files: ${stats.written} written, ${stats.skipped} skipped, ${stats.deleted} deleted`);
  console.log(`Pillar files written: ${stats.pillarsWritten}`);
  const warningCount = bestPractices.reduce((sum, bp) => sum + bp.warnings.length, 0);
  console.log(`Extraction warnings: ${warningCount}`);
  console.log(`_meta.json rewritten: ${stats.metaWritten ? "yes" : "no"}`);

  const withWarnings = bestPractices.filter((bp) => bp.warnings.length > 0);
  if (withWarnings.length > 0) {
    console.log("Extraction warning details:");
    for (const bp of withWarnings) {
      console.log(`  ${bp.id}:`);
      for (const warning of bp.warnings) {
        console.log(`    - ${warning}`);
      }
    }
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(Bun.argv.slice(2));
  const nodes = await fetchTocBpNodes();

  if (nodes.length < 280) {
    console.error(`Layout break guard failed: TOC returned ${nodes.length} best practices, expected at least 280.`);
    process.exit(1);
  }

  const { pages, errors } = await loadPages(nodes, flags);
  if (errors.length > 0) {
    for (const error of errors) {
      console.error(`${error.id}: ${error.message}`);
    }
    process.exit(1);
  }

  const bestPractices = pages.map(({ node, html }) =>
    extractBestPractice(html, {
      id: node.id,
      title: node.title,
      pillarSlug: node.pillarSlug,
      question: node.question,
      sourceUrl: sourceUrl(node),
    }),
  );
  bestPractices.sort((a, b) => a.id.localeCompare(b.id));

  if (bestPractices.length < 280) {
    console.error(`Layout break guard failed: extracted ${bestPractices.length} best practices, expected at least 280.`);
    process.exit(1);
  }

  if (flags.blessBaseline) {
    await blessStructureBaseline(bestPractices);
  }
  await enforceStructureBaseline(bestPractices);

  const hashes = new Map<string, string>();
  for (const bp of bestPractices) {
    hashes.set(bp.id, contentHash(bp));
  }

  const bpStats = await writeBestPractices(bestPractices, hashes);
  const pillarsWritten = await writePillars(bestPractices);
  const metaWritten = await writeMeta(bestPractices, hashes);
  printSummary(bestPractices, { ...bpStats, pillarsWritten, metaWritten });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
