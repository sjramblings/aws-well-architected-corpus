import matter from "gray-matter";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { PILLARS } from "./lib/types.ts";

const FRAMEWORK_SOURCE = "https://docs.aws.amazon.com/wellarchitected/latest/framework/";
const BP_DIR = "data/best-practices";
const PILLAR_DIR = "data/pillars";
const BUNDLE_PATH = "data/aws-well-architected.json";

type PillarBundle = {
  slug: string;
  name: string;
  question_count: number;
  bp_count: number;
};

type BestPracticeBundle = {
  id: string;
  pillar: string;
  pillar_question: string;
  question: string;
  title: string;
  risk_level: string;
  source_url: string;
  sections: {
    statement: string;
    desiredOutcome: string;
    commonAntiPatterns: string;
    benefits: string;
    implementationGuidance: string;
    resources: string;
  };
};

type Bundle = {
  framework_source: string;
  bp_count: number;
  pillar_count: number;
  pillars: PillarBundle[];
  best_practices: BestPracticeBundle[];
};

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

function stringField(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  return typeof value === "string" ? value : "";
}

function numberField(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  return typeof value === "number" ? value : 0;
}

function parseSections(markdown: string): Record<string, string> {
  const sections: Record<string, string> = {};
  let current: string | undefined;
  let buffer: string[] = [];

  for (const line of markdown.split(/\r?\n/)) {
    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (match !== null) {
      if (current !== undefined) {
        sections[current] = buffer.join("\n").trim();
      }
      current = match[1];
      buffer = [];
    } else if (current !== undefined) {
      buffer.push(line);
    }
  }

  if (current !== undefined) {
    sections[current] = buffer.join("\n").trim();
  }

  return sections;
}

async function readPillars(): Promise<{ pillars: PillarBundle[]; questions: Map<string, string> }> {
  const pillars: PillarBundle[] = [];
  const questions = new Map<string, string>();

  for (const pillar of PILLARS) {
    const filePath = path.join(PILLAR_DIR, `${pillar.slug}.md`);
    const text = await Bun.file(filePath).text();
    const parsed = matter(text);
    const data = parsed.data as Record<string, unknown>;

    pillars.push({
      slug: pillar.slug,
      name: stringField(data, "name") || pillar.name,
      question_count: numberField(data, "question_count"),
      bp_count: numberField(data, "bp_count"),
    });

    for (const line of parsed.content.split(/\r?\n/)) {
      const match = /^###\s+([A-Z]+\d{2})\s+—\s+(.+?)\s*$/.exec(line);
      if (match !== null) {
        questions.set(match[1], match[2]);
      }
    }
  }

  return { pillars, questions };
}

async function readBestPractices(questions: Map<string, string>): Promise<BestPracticeBundle[]> {
  const files = (await safeReadDir(BP_DIR)).filter((file) => file.endsWith(".md")).sort();
  const bestPractices: BestPracticeBundle[] = [];

  for (const file of files) {
    const text = await Bun.file(path.join(BP_DIR, file)).text();
    const parsed = matter(text);
    const data = parsed.data as Record<string, unknown>;
    const sections = parseSections(parsed.content);
    const pillarQuestion = stringField(data, "pillar_question");

    bestPractices.push({
      id: stringField(data, "id"),
      pillar: stringField(data, "pillar"),
      pillar_question: pillarQuestion,
      question: questions.get(pillarQuestion) ?? "",
      title: stringField(data, "title"),
      risk_level: stringField(data, "risk_level"),
      source_url: stringField(data, "source_url"),
      sections: {
        statement: sections["Statement"] ?? "",
        desiredOutcome: sections["Desired Outcome"] ?? "",
        commonAntiPatterns: sections["Common Anti-Patterns"] ?? "",
        benefits: sections["Benefits"] ?? "",
        implementationGuidance: sections["Implementation Guidance"] ?? "",
        resources: sections["Resources"] ?? "",
      },
    });
  }

  return bestPractices.sort((a, b) => a.id.localeCompare(b.id));
}

async function writeIfChanged(filePath: string, text: string): Promise<boolean> {
  const file = Bun.file(filePath);
  if ((await file.exists()) && (await file.text()) === text) {
    return false;
  }
  await mkdir(path.dirname(filePath), { recursive: true });
  await Bun.write(filePath, text);
  return true;
}

async function main(): Promise<void> {
  const { pillars, questions } = await readPillars();
  const bestPractices = await readBestPractices(questions);
  const bundle: Bundle = {
    framework_source: FRAMEWORK_SOURCE,
    bp_count: bestPractices.length,
    pillar_count: PILLARS.length,
    pillars,
    best_practices: bestPractices,
  };
  const json = `${JSON.stringify(bundle, null, 2)}\n`;
  const written = await writeIfChanged(BUNDLE_PATH, json);
  console.log(`${BUNDLE_PATH}: ${written ? "written" : "unchanged"}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
