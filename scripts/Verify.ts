import matter from "gray-matter";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { classifyDeviations, loadBaseline } from "./lib/baseline.ts";
import {
  EXPECTED_BP_COUNT,
  EXPECTED_BP_COUNT_BY_PREFIX,
  PILLARS,
  SECTION_KEYS,
  type BestPractice,
  type Deviation,
  type RiskLevel,
  type SectionKey,
} from "./lib/types.ts";

const BP_DIR = "data/best-practices";
const PILLAR_DIR = "data/pillars";
const META_PATH = "data/_meta.json";
const BASELINE_PATH = "data/_structure-baseline.json";
const LENS_PATH = "data/aws-well-architected-lens.json";
const BUNDLE_PATH = "data/aws-well-architected.json";

type CheckResult = {
  name: string;
  ok: boolean;
  message: string;
};

type MetaShape = {
  bp_count: number;
};

type LensShape = {
  pillars?: Array<{
    questions?: Array<{
      choices?: Array<{ id?: string }>;
      riskRules?: Array<{ condition?: string }>;
    }>;
  }>;
};

type BundleShape = {
  best_practices?: unknown[];
};

type CommandResult = {
  exitCode: number;
  stdout: string;
  stderr: string;
};

async function exists(filePath: string): Promise<boolean> {
  return await Bun.file(filePath).exists();
}

async function dirExists(dir: string): Promise<boolean> {
  try {
    await readdir(dir);
    return true;
  } catch (error) {
    const code = error instanceof Error && "code" in error ? String(error.code) : "";
    if (code === "ENOENT") {
      return false;
    }
    throw error;
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

function printResult(result: CheckResult): void {
  console.log(`${result.ok ? "PASS" : "FAIL"} ${result.name}: ${result.message}`);
}

async function runCheck(name: string, fn: () => Promise<string>): Promise<CheckResult> {
  try {
    return { name, ok: true, message: await fn() };
  } catch (error) {
    return { name, ok: false, message: error instanceof Error ? error.message : String(error) };
  }
}

async function bpFiles(): Promise<string[]> {
  return (await safeReadDir(BP_DIR)).filter((file) => file.endsWith(".md")).sort();
}

async function readMeta(): Promise<MetaShape> {
  return JSON.parse(await Bun.file(META_PATH).text()) as MetaShape;
}

async function runCommand(command: string[]): Promise<CommandResult> {
  const subprocess = Bun.spawn(command, {
    cwd: process.cwd(),
    stdin: "ignore",
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(subprocess.stdout).text(),
    new Response(subprocess.stderr).text(),
    subprocess.exited,
  ]);
  return { exitCode, stdout, stderr };
}

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is not an object`);
  }
  return value as Record<string, unknown>;
}

function requireSectionPresence(value: unknown, label: string): Record<SectionKey, boolean> {
  const record = requireRecord(value, label);
  const sectionPresence = {} as Record<SectionKey, boolean>;
  const extraKeys = Object.keys(record).filter((key) => !SECTION_KEYS.includes(key as SectionKey));
  if (extraKeys.length > 0) {
    throw new Error(`${label} has unexpected keys: ${extraKeys.join(", ")}`);
  }

  for (const section of SECTION_KEYS) {
    const present = record[section];
    if (typeof present !== "boolean") {
      throw new Error(`${label}.${section} is not a boolean`);
    }
    sectionPresence[section] = present;
  }
  return sectionPresence;
}

function riskLevelFromFrontmatter(value: unknown): RiskLevel {
  return value === "HIGH" || value === "MEDIUM" || value === "LOW" || value === "UNKNOWN" ? value : "UNKNOWN";
}

function prefixFromId(id: string): string {
  const match = /^(OPS|SEC|REL|PERF|COST|SUS)/.exec(id);
  if (match === null) {
    throw new Error(`cannot derive pillar prefix from BP id ${id}`);
  }
  return match[1];
}

function isErrorDeviation(deviation: Deviation): boolean {
  return deviation.kind === "REGRESSION" || deviation.kind === "REMOVED_BP";
}

function deviationMessage(deviation: Deviation): string {
  return deviation.section === undefined
    ? `${deviation.kind} ${deviation.bpId}`
    : `${deviation.kind} ${deviation.bpId} ${deviation.section}`;
}

async function checkExistence(): Promise<string> {
  const requiredDirs = ["scripts", BP_DIR, PILLAR_DIR];
  const requiredFiles = [LENS_PATH, BUNDLE_PATH, META_PATH, BASELINE_PATH, ".github/workflows/refresh.yml"];
  const missing: string[] = [];

  for (const dir of requiredDirs) {
    if (!(await dirExists(dir))) {
      missing.push(dir);
    }
  }
  for (const file of requiredFiles) {
    if (!(await exists(file))) {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    throw new Error(`missing ${missing.join(", ")}`);
  }
  return "required directories and files exist";
}

async function checkBpCount(): Promise<string> {
  const files = await bpFiles();
  const meta = await readMeta();
  if (files.length !== EXPECTED_BP_COUNT) {
    throw new Error(`BP file count ${files.length} does not equal expected ${EXPECTED_BP_COUNT}`);
  }
  if (meta.bp_count !== EXPECTED_BP_COUNT) {
    throw new Error(`_meta.json bp_count ${meta.bp_count} does not equal expected ${EXPECTED_BP_COUNT}`);
  }

  const countsByPrefix = new Map<string, number>();
  for (const file of files) {
    const id = file.slice(0, -".md".length);
    const prefix = prefixFromId(id);
    countsByPrefix.set(prefix, (countsByPrefix.get(prefix) ?? 0) + 1);
  }

  const unexpectedPrefixes = [...countsByPrefix.keys()].filter((prefix) => EXPECTED_BP_COUNT_BY_PREFIX[prefix] === undefined);
  if (unexpectedPrefixes.length > 0) {
    throw new Error(`unexpected BP prefixes: ${unexpectedPrefixes.join(", ")}`);
  }

  for (const [prefix, expectedCount] of Object.entries(EXPECTED_BP_COUNT_BY_PREFIX)) {
    const actualCount = countsByPrefix.get(prefix) ?? 0;
    if (actualCount !== expectedCount) {
      throw new Error(`${prefix} count ${actualCount} does not equal expected ${expectedCount}`);
    }
  }
  return `${files.length} best-practice files match expected total and per-prefix counts`;
}

async function checkPillarFiles(): Promise<string> {
  const validSlugs = new Set<string>(PILLARS.map((pillar) => pillar.slug));
  const missing = [];
  for (const pillar of PILLARS) {
    if (!(await exists(path.join(PILLAR_DIR, `${pillar.slug}.md`)))) {
      missing.push(pillar.slug);
    }
  }
  if (missing.length > 0) {
    throw new Error(`missing pillar files for ${missing.join(", ")}`);
  }

  const bad: string[] = [];
  for (const file of await bpFiles()) {
    const parsed = matter(await Bun.file(path.join(BP_DIR, file)).text());
    const data = parsed.data as Record<string, unknown>;
    const pillar = data["pillar"];
    if (typeof pillar !== "string" || !validSlugs.has(pillar)) {
      bad.push(file);
    }
  }

  if (bad.length > 0) {
    throw new Error(`invalid pillar frontmatter in ${bad.join(", ")}`);
  }
  return "all pillar files exist and BP pillar slugs are valid";
}

async function checkFilenames(): Promise<string> {
  const invalid = (await bpFiles()).filter((file) => !/^(OPS|SEC|REL|PERF|COST|SUS)\d{2}-BP\d{2}\.md$/.test(file));
  if (invalid.length > 0) {
    throw new Error(`invalid filenames: ${invalid.join(", ")}`);
  }
  return "all BP filenames match expected pattern";
}

async function checkFrontmatter(): Promise<string> {
  const required = ["id", "risk_level", "source_url", "source", "licence", "content_hash"];
  const invalid: string[] = [];

  for (const file of await bpFiles()) {
    const parsed = matter(await Bun.file(path.join(BP_DIR, file)).text());
    const data = parsed.data as Record<string, unknown>;
    for (const key of required) {
      const value = data[key];
      if (typeof value !== "string" || value.trim().length === 0) {
        invalid.push(`${file}:${key}`);
      }
    }

    const sectionsPresent = data["sections_present"];
    if (sectionsPresent === null || typeof sectionsPresent !== "object" || Array.isArray(sectionsPresent)) {
      invalid.push(`${file}:sections_present`);
    } else {
      try {
        requireSectionPresence(sectionsPresent, `${file}:sections_present`);
      } catch {
        invalid.push(`${file}:sections_present`);
      }
    }

    const extractionWarnings = data["extraction_warnings"];
    if (!Array.isArray(extractionWarnings) || extractionWarnings.some((warning) => typeof warning !== "string")) {
      invalid.push(`${file}:extraction_warnings`);
    }
  }

  if (invalid.length > 0) {
    throw new Error(`missing or empty fields: ${invalid.join(", ")}`);
  }
  return "required BP frontmatter fields are populated";
}

function bestPracticeFromFrontmatter(file: string, data: Record<string, unknown>): BestPractice {
  const id = typeof data["id"] === "string" && data["id"].trim().length > 0 ? data["id"] : file.slice(0, -".md".length);
  return {
    id,
    pillarSlug: "",
    prefix: prefixFromId(id),
    questionId: "",
    question: "",
    title: "",
    riskLevel: riskLevelFromFrontmatter(data["risk_level"]),
    sourceUrl: "",
    statement: "",
    desiredOutcome: "",
    commonAntiPatterns: "",
    benefits: "",
    implementationGuidance: "",
    resources: "",
    warnings: [],
    sectionPresence: requireSectionPresence(data["sections_present"], `${file}:sections_present`),
  };
}

async function checkStructureBaseline(): Promise<string> {
  const baseline = await loadBaseline(BASELINE_PATH);
  if (baseline === undefined) {
    throw new Error(`missing or invalid structure baseline ${BASELINE_PATH}`);
  }

  const bestPractices: BestPractice[] = [];
  for (const file of await bpFiles()) {
    const parsed = matter(await Bun.file(path.join(BP_DIR, file)).text());
    bestPractices.push(bestPracticeFromFrontmatter(file, parsed.data as Record<string, unknown>));
  }

  const deviations = classifyDeviations(bestPractices, baseline);
  const errorDeviations = deviations.filter(isErrorDeviation);
  if (errorDeviations.length > 0) {
    throw new Error(`structure baseline errors: ${errorDeviations.map(deviationMessage).join(", ")}`);
  }

  return `frontmatter matches structure baseline with ${deviations.length} non-error deviation(s)`;
}

async function checkLens(): Promise<string> {
  const text = await Bun.file(LENS_PATH).text();
  const byteLength = Buffer.byteLength(text, "utf8");
  if (byteLength > 500_000) {
    throw new Error(`lens is ${byteLength} bytes, exceeding 500000`);
  }

  const lens = JSON.parse(text) as LensShape;
  const pillars = lens.pillars ?? [];
  if (pillars.length > 10) {
    throw new Error(`lens has ${pillars.length} pillars`);
  }

  for (const [pillarIndex, pillar] of pillars.entries()) {
    const questions = pillar.questions ?? [];
    if (questions.length > 20) {
      throw new Error(`pillar ${pillarIndex} has ${questions.length} questions`);
    }

    for (const [questionIndex, question] of questions.entries()) {
      const choices = question.choices ?? [];
      const realChoices = choices.filter((choice) => typeof choice.id === "string" && !choice.id.endsWith("_no"));
      if (realChoices.length > 15) {
        throw new Error(`pillar ${pillarIndex} question ${questionIndex} has ${realChoices.length} real choices`);
      }
      const hasDefault = (question.riskRules ?? []).some((rule) => rule.condition === "default");
      if (!hasDefault) {
        throw new Error(`pillar ${pillarIndex} question ${questionIndex} has no default risk rule`);
      }
    }
  }

  return `lens parses and is ${byteLength} bytes`;
}

async function checkBundle(): Promise<string> {
  const bundle = JSON.parse(await Bun.file(BUNDLE_PATH).text()) as BundleShape;
  const count = (bundle.best_practices ?? []).length;
  const files = await bpFiles();
  if (count !== files.length) {
    throw new Error(`bundle best_practices length ${count} does not equal BP file count ${files.length}`);
  }
  return "bundle parses and BP count matches files";
}

async function captureDataDiff(): Promise<string> {
  const result = await runCommand(["git", "diff", "--", "data/"]);
  if (result.exitCode !== 0) {
    throw new Error(`git diff -- data/ failed with exit ${result.exitCode}: ${result.stderr.trim()}`);
  }
  return result.stdout;
}

async function checkIdempotency(): Promise<string> {
  const beforeDiff = await captureDataDiff();
  const scrape = await runCommand(["bun", "scripts/Scrape.ts", "--offline"]);
  if (scrape.exitCode !== 0) {
    const details = [scrape.stderr.trim(), scrape.stdout.trim()].filter((part) => part.length > 0).join("\n");
    throw new Error(`offline scrape failed with exit ${scrape.exitCode}${details.length > 0 ? `: ${details}` : ""}`);
  }

  const afterDiff = await captureDataDiff();
  if (afterDiff !== beforeDiff) {
    throw new Error("offline scrape changed data/ beyond the pre-existing diff");
  }

  return "offline scrape leaves data/ diff byte-identical";
}

async function checkLensIdIntegrity(): Promise<string> {
  const lens = JSON.parse(await Bun.file(LENS_PATH).text()) as LensShape;
  const missing: string[] = [];

  for (const pillar of lens.pillars ?? []) {
    for (const question of pillar.questions ?? []) {
      for (const choice of question.choices ?? []) {
        const id = choice.id;
        if (typeof id !== "string" || id.endsWith("_no")) {
          continue;
        }
        const bpId = id.replaceAll("_", "-");
        if (!(await exists(path.join(BP_DIR, `${bpId}.md`)))) {
          missing.push(id);
        }
      }
    }
  }

  if (missing.length > 0) {
    throw new Error(`lens choices without BP files: ${missing.join(", ")}`);
  }
  return "all real lens choice ids resolve to BP files";
}

async function checkAttribution(): Promise<string> {
  const missing: string[] = [];
  for (const file of await bpFiles()) {
    const text = await Bun.file(path.join(BP_DIR, file)).text();
    if (!text.includes("Amazon Web Services")) {
      missing.push(file);
    }
  }

  if (missing.length > 0) {
    throw new Error(`missing attribution in ${missing.join(", ")}`);
  }
  return "all BP files contain Amazon Web Services attribution";
}

async function main(): Promise<void> {
  const checks: Array<[string, () => Promise<string>]> = [
    ["EXISTENCE", checkExistence],
    ["BP COUNT EXACT", checkBpCount],
    ["PILLAR FILES", checkPillarFiles],
    ["FILENAMES", checkFilenames],
    ["FRONTMATTER", checkFrontmatter],
    ["STRUCTURE BASELINE", checkStructureBaseline],
    ["LENS", checkLens],
    ["BUNDLE", checkBundle],
    ["IDEMPOTENCY", checkIdempotency],
    ["LENS ID INTEGRITY", checkLensIdIntegrity],
    ["ATTRIBUTION", checkAttribution],
  ];

  const results: CheckResult[] = [];
  for (const [name, fn] of checks) {
    const result = await runCheck(name, fn);
    results.push(result);
    printResult(result);
  }

  const failures = results.filter((result) => !result.ok);
  if (failures.length > 0) {
    console.error(`${failures.length} verification check(s) failed`);
    process.exit(1);
  }

  console.log("all verification checks passed");
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
