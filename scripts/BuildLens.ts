import matter from "gray-matter";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { PILLARS } from "./lib/types.ts";

const FRAMEWORK_SOURCE = "https://docs.aws.amazon.com/wellarchitected/latest/framework/";
const BP_DIR = "data/best-practices";
const PILLAR_DIR = "data/pillars";
const LENS_PATH = "data/aws-well-architected-lens.json";

type BpRecord = {
  id: string;
  pillar: string;
  pillarQuestion: string;
  title: string;
  sourceUrl: string;
  desiredOutcome: string;
  implementationGuidance: string;
};

type LensChoice = {
  id: string;
  title: string;
  helpfulResource: {
    displayText: string;
    url: string;
  };
  improvementPlan?: {
    displayText: string;
  };
};

type LensQuestion = {
  id: string;
  title: string;
  choices: LensChoice[];
  riskRules: Array<{
    condition: string;
    risk: "NO_RISK" | "HIGH_RISK";
  }>;
};

type LensPillar = {
  id: string;
  name: string;
  questions: LensQuestion[];
};

type Lens = {
  schemaVersion: "2021-11-01";
  name: string;
  description: string;
  pillars: LensPillar[];
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

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  if (maxLength <= 1) {
    return text.slice(0, maxLength);
  }
  return text.slice(0, maxLength - 1).trimEnd();
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`#*_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

async function readBestPractices(): Promise<BpRecord[]> {
  const files = (await safeReadDir(BP_DIR)).filter((file) => file.endsWith(".md")).sort();
  const records: BpRecord[] = [];

  for (const file of files) {
    const text = await Bun.file(path.join(BP_DIR, file)).text();
    const parsed = matter(text);
    const data = parsed.data as Record<string, unknown>;
    const sections = parseSections(parsed.content);
    records.push({
      id: stringField(data, "id"),
      pillar: stringField(data, "pillar"),
      pillarQuestion: stringField(data, "pillar_question"),
      title: stringField(data, "title"),
      sourceUrl: stringField(data, "source_url"),
      desiredOutcome: sections["Desired Outcome"] ?? "",
      implementationGuidance: sections["Implementation Guidance"] ?? "",
    });
  }

  return records.sort((a, b) => a.id.localeCompare(b.id));
}

async function readQuestionText(): Promise<Map<string, string>> {
  const questions = new Map<string, string>();

  for (const pillar of PILLARS) {
    const filePath = path.join(PILLAR_DIR, `${pillar.slug}.md`);
    const file = Bun.file(filePath);
    if (!(await file.exists())) {
      continue;
    }
    const text = await file.text();
    for (const line of text.split(/\r?\n/)) {
      const match = /^###\s+([A-Z]+\d{2})\s+—\s+(.+?)\s*$/.exec(line);
      if (match !== null) {
        questions.set(match[1], match[2]);
      }
    }
  }

  return questions;
}

function groupByQuestion(records: BpRecord[], pillarSlug: string): Map<string, BpRecord[]> {
  const grouped = new Map<string, BpRecord[]>();
  for (const record of records.filter((bp) => bp.pillar === pillarSlug)) {
    const group = grouped.get(record.pillarQuestion) ?? [];
    group.push(record);
    grouped.set(record.pillarQuestion, group);
  }
  return grouped;
}

function choiceId(bpId: string): string {
  return bpId.replaceAll("-", "_");
}

function buildImprovementPlan(bp: BpRecord, cap: number): string {
  const summary = stripMarkdown(`${bp.desiredOutcome} ${bp.implementationGuidance}`);
  return truncate(summary, cap);
}

function buildLens(records: BpRecord[], questionText: Map<string, string>, cap: number): { lens: Lens; warnings: string[] } {
  const warnings: string[] = [];
  const pillars: LensPillar[] = [];

  for (const pillar of PILLARS) {
    const grouped = groupByQuestion(records, pillar.slug);
    const questionIds = [...grouped.keys()].sort();
    if (questionIds.length > 20) {
      warnings.push(`pillar ${pillar.slug} has ${questionIds.length} questions, exceeding the custom-lens limit of 20`);
    }

    const questions: LensQuestion[] = [];
    for (const questionId of questionIds) {
      const allBps = (grouped.get(questionId) ?? []).sort((a, b) => a.id.localeCompare(b.id));
      const keptBps = allBps.slice(0, 15);
      const dropped = allBps.length - keptBps.length;
      if (dropped > 0) {
        warnings.push(`question ${questionId} has ${allBps.length} best practices; dropped ${dropped} choices from the custom lens`);
      }

      const realChoices: LensChoice[] = keptBps.map((bp) => ({
        id: choiceId(bp.id),
        title: truncate(bp.title, 128),
        helpfulResource: {
          displayText: `AWS documentation — ${bp.id}`,
          url: bp.sourceUrl,
        },
        improvementPlan: {
          displayText: buildImprovementPlan(bp, cap),
        },
      }));

      const noChoice: LensChoice = {
        id: `${questionId}_no`,
        title: "None of these",
        helpfulResource: {
          displayText: `AWS documentation — ${questionId}`,
          url: FRAMEWORK_SOURCE,
        },
      };
      const realChoiceIds = realChoices.map((choice) => choice.id);

      questions.push({
        id: questionId,
        title: truncate(questionText.get(questionId) ?? questionId, 128),
        choices: [...realChoices, noChoice],
        riskRules: [
          { condition: realChoiceIds.join(" && "), risk: "NO_RISK" },
          { condition: "default", risk: "HIGH_RISK" },
        ],
      });
    }

    pillars.push({
      id: pillar.lensPillarId,
      name: pillar.name,
      questions,
    });
  }

  return {
    lens: {
      schemaVersion: "2021-11-01",
      name: "AWS Well-Architected Framework (community mirror)",
      description: "UNOFFICIAL generated community mirror of the AWS Well-Architected Framework; see the repository for source, license, and refresh details.",
      pillars,
    },
    warnings,
  };
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
  const records = await readBestPractices();
  const questionText = await readQuestionText();
  const caps = [1000, 700, 450, 250];
  let selectedJson = "";
  let selectedCap = caps[caps.length - 1];
  let selectedWarnings: string[] = [];

  for (const cap of caps) {
    const { lens, warnings } = buildLens(records, questionText, cap);
    const json = `${JSON.stringify(lens, null, 2)}\n`;
    selectedJson = json;
    selectedCap = cap;
    selectedWarnings = warnings;
    if (Buffer.byteLength(json, "utf8") <= 480_000 || cap === 250) {
      break;
    }
  }

  for (const warning of selectedWarnings) {
    console.warn(`WARNING: ${warning}`);
  }

  const byteLength = Buffer.byteLength(selectedJson, "utf8");
  console.log(
    `Improvement plan cap used: ${selectedCap} chars (lens-size ceiling; full text retained in corpus + bundle)`,
  );
  if (byteLength > 500_000) {
    console.warn(`WARNING: lens JSON is ${byteLength} bytes, exceeding the 500000 byte hard limit`);
  }

  const written = await writeIfChanged(LENS_PATH, selectedJson);
  console.log(`${LENS_PATH}: ${written ? "written" : "unchanged"} (${byteLength} bytes)`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
