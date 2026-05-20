import matter from "gray-matter";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { PILLARS } from "./lib/types.ts";

const BP_DIR = "data/best-practices";
const PILLAR_DIR = "data/pillars";
const META_PATH = "data/_meta.json";
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

function requireRecord(value: unknown, label: string): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} is not an object`);
  }
  return value as Record<string, unknown>;
}

async function checkExistence(): Promise<string> {
  const requiredDirs = ["scripts", BP_DIR, PILLAR_DIR];
  const requiredFiles = [LENS_PATH, BUNDLE_PATH, META_PATH, ".github/workflows/refresh.yml"];
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
  if (files.length !== meta.bp_count) {
    throw new Error(`file count ${files.length} does not equal _meta.json bp_count ${meta.bp_count}`);
  }
  if (files.length < 280 || files.length > 340) {
    throw new Error(`BP count ${files.length} outside inclusive range 280-340`);
  }
  return `${files.length} best-practice files`;
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
  }

  if (invalid.length > 0) {
    throw new Error(`missing or empty fields: ${invalid.join(", ")}`);
  }
  return "required BP frontmatter fields are populated";
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
    ["BP COUNT", checkBpCount],
    ["PILLAR FILES", checkPillarFiles],
    ["FILENAMES", checkFilenames],
    ["FRONTMATTER", checkFrontmatter],
    ["LENS", checkLens],
    ["BUNDLE", checkBundle],
    ["IDEMPOTENCY REMINDER", async () => "true idempotency check: bun scripts/Scrape.ts --offline followed by git diff --stat data/"],
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
