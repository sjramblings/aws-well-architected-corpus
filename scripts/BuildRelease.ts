import matter from "gray-matter";
import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import type { Meta } from "./lib/types.ts";

const META_PATH = "data/_meta.json";
const ARTIFACT_DIR = "release-artifacts";
const LENS_PATH = "data/aws-well-architected-lens.json";
const BUNDLE_PATH = "data/aws-well-architected.json";

type CommandResult = {
  ok: boolean;
  exitCode: number;
  stdout: string;
  stderr: string;
};

type Diff = {
  added: string[];
  removed: string[];
  changed: string[];
};

function isDryRun(argv: string[]): boolean {
  for (const arg of argv) {
    if (arg === "--dry-run") {
      return true;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }
  return false;
}

async function runCommand(argv: string[]): Promise<CommandResult> {
  try {
    const proc = Bun.spawn(argv, { stdout: "pipe", stderr: "pipe" });
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(proc.stdout).text(),
      new Response(proc.stderr).text(),
      proc.exited,
    ]);
    return { ok: exitCode === 0, exitCode, stdout, stderr };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, exitCode: 127, stdout: "", stderr: message };
  }
}

async function readCurrentMeta(): Promise<Meta> {
  const file = Bun.file(META_PATH);
  if (!(await file.exists())) {
    throw new Error(`${META_PATH} is missing`);
  }
  return JSON.parse(await file.text()) as Meta;
}

async function tagList(): Promise<string[]> {
  const result = await runCommand(["git", "tag", "--list", "v*", "--sort=-v:refname"]);
  if (!result.ok) {
    throw new Error(`git tag failed: ${result.stderr.trim()}`);
  }
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter((line) => line.length > 0);
}

function latestReleaseTag(tags: string[]): string | undefined {
  return tags.find((tag) => /^v\d{4}\.\d{2}\.\d{2}/.test(tag));
}

async function readPriorMeta(tag: string | undefined): Promise<{ firstRelease: boolean; meta?: Meta }> {
  if (tag === undefined) {
    return { firstRelease: true };
  }

  const result = await runCommand(["git", "show", `${tag}:data/_meta.json`]);
  if (!result.ok) {
    return { firstRelease: true };
  }

  return { firstRelease: false, meta: JSON.parse(result.stdout) as Meta };
}

function diffBestPractices(current: Meta, prior: Meta | undefined): Diff {
  if (prior === undefined) {
    return {
      added: Object.keys(current.best_practices).sort(),
      removed: [],
      changed: [],
    };
  }

  const currentIds = new Set(Object.keys(current.best_practices));
  const priorIds = new Set(Object.keys(prior.best_practices));
  const added = [...currentIds].filter((id) => !priorIds.has(id)).sort();
  const removed = [...priorIds].filter((id) => !currentIds.has(id)).sort();
  const changed = [...currentIds]
    .filter((id) => priorIds.has(id) && current.best_practices[id] !== prior.best_practices[id])
    .sort();

  return { added, removed, changed };
}

function todayTagBase(): string {
  return `v${new Date().toISOString().slice(0, 10).replaceAll("-", ".")}`;
}

function selectTag(tags: string[]): string {
  const existing = new Set(tags);
  const base = todayTagBase();
  if (!existing.has(base)) {
    return base;
  }

  for (let suffix = 2; ; suffix += 1) {
    const candidate = `${base}-${suffix}`;
    if (!existing.has(candidate)) {
      return candidate;
    }
  }
}

function printDecision(firstRelease: boolean, warranted: boolean, diff: Diff): void {
  console.log(warranted ? "release warranted" : "no release");
  if (firstRelease) {
    console.log("first release: yes");
  }
  console.log(`added (${diff.added.length}): ${diff.added.join(", ") || "none"}`);
  console.log(`removed (${diff.removed.length}): ${diff.removed.join(", ") || "none"}`);
  console.log(`changed (${diff.changed.length}): ${diff.changed.join(", ") || "none"}`);
}

async function titleFor(id: string): Promise<string | undefined> {
  const file = Bun.file(path.join("data/best-practices", `${id}.md`));
  if (!(await file.exists())) {
    return undefined;
  }
  const parsed = matter(await file.text());
  const title = (parsed.data as Record<string, unknown>)["title"];
  return typeof title === "string" ? title : undefined;
}

async function releaseNotes(tag: string, diff: Diff): Promise<string> {
  const lines = [`# ${tag}`, "", "## Added"];
  for (const id of diff.added) {
    const title = await titleFor(id);
    lines.push(`- ${title === undefined ? id : `${id} — ${title}`}`);
  }
  if (diff.added.length === 0) {
    lines.push("- none");
  }

  lines.push("", "## Removed");
  for (const id of diff.removed) {
    lines.push(`- ${id}`);
  }
  if (diff.removed.length === 0) {
    lines.push("- none");
  }

  lines.push("", "## Changed");
  for (const id of diff.changed) {
    const title = await titleFor(id);
    lines.push(`- ${title === undefined ? id : `${id} — ${title}`}`);
  }
  if (diff.changed.length === 0) {
    lines.push("- none");
  }

  return `${lines.join("\n")}\n`;
}

async function createArtifacts(tag: string, diff: Diff): Promise<string[]> {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  const zipPath = path.join(ARTIFACT_DIR, `aws-well-architected-corpus-${tag}.zip`);
  const lensArtifact = path.join(ARTIFACT_DIR, path.basename(LENS_PATH));
  const bundleArtifact = path.join(ARTIFACT_DIR, path.basename(BUNDLE_PATH));
  const notesPath = path.join(ARTIFACT_DIR, `RELEASE_NOTES_${tag}.md`);

  const zip = await runCommand(["zip", "-r", zipPath, "data/best-practices", "data/pillars", META_PATH]);
  if (!zip.ok) {
    throw new Error(`zip failed: ${zip.stderr.trim()}`);
  }

  await cp(LENS_PATH, lensArtifact);
  await cp(BUNDLE_PATH, bundleArtifact);
  await Bun.write(notesPath, await releaseNotes(tag, diff));

  return [zipPath, lensArtifact, bundleArtifact, notesPath];
}

async function createGitHubRelease(tag: string, artifactPaths: string[]): Promise<void> {
  const result = await runCommand(["gh", "release", "create", tag, "--title", tag, "--notes-file", path.join(ARTIFACT_DIR, `RELEASE_NOTES_${tag}.md`), ...artifactPaths]);
  if (!result.ok) {
    console.error("gh release create failed. Ensure the gh CLI is installed and authenticated via GH_TOKEN, GITHUB_TOKEN, or gh auth.");
    console.error(result.stderr.trim());
    process.exit(1);
  }
}

async function main(): Promise<void> {
  const dryRun = isDryRun(Bun.argv.slice(2));
  const current = await readCurrentMeta();
  const tags = await tagList();
  const prior = await readPriorMeta(latestReleaseTag(tags));
  const diff = diffBestPractices(current, prior.meta);
  const warranted = prior.firstRelease || diff.added.length + diff.removed.length + diff.changed.length > 0;
  const tag = selectTag(tags);

  printDecision(prior.firstRelease, warranted, diff);
  console.log(`candidate tag: ${tag}`);

  if (dryRun) {
    process.exit(0);
  }

  if (!warranted) {
    console.log("no release — corpus content unchanged");
    process.exit(0);
  }

  const artifactPaths = await createArtifacts(tag, diff);
  await createGitHubRelease(tag, artifactPaths);
  console.log(`created release ${tag}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
