import { mkdir } from "node:fs/promises";
import path from "node:path";

import { pillarForPrefix, type TocBpNode } from "./types.ts";

const TOC_URL =
  "https://docs.aws.amazon.com/wellarchitected/latest/framework/toc-contents.json";
const CACHE_DIR = ".cache";
const TOC_CACHE_PATH = path.join(CACHE_DIR, "toc-contents.json");
const MAX_FETCH_ATTEMPTS = 3;
const FETCH_TIMEOUT_MS = 30_000;
const BP_TITLE_RE = /^([A-Z]{2,4}\d{2}-BP\d{2})\s+(.+)$/;

type TocEntry = {
  title: string;
  href?: string;
  contents?: TocEntry[];
};

type TocRoot = {
  contents: TocEntry[];
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateTocEntry(value: unknown, path: string): TocEntry {
  if (!isRecord(value)) {
    throw new Error(`Invalid TOC shape at ${path}: expected object`);
  }
  const title = value["title"];
  if (typeof title !== "string" || title.trim() === "") {
    throw new Error(`Invalid TOC shape at ${path}.title: expected non-empty string`);
  }

  const hrefValue = value["href"];
  const href = typeof hrefValue === "string" && hrefValue.trim() !== "" ? hrefValue : undefined;

  const contentsValue = value["contents"];
  let contents: TocEntry[] | undefined;
  if (contentsValue !== undefined) {
    if (!Array.isArray(contentsValue)) {
      throw new Error(`Invalid TOC shape at ${path}.contents: expected array`);
    }
    contents = contentsValue.map((child, index) => validateTocEntry(child, `${path}.contents[${index}]`));
  }

  return { title, href, contents };
}

function validateTocRoot(value: unknown): TocRoot {
  if (!isRecord(value)) {
    throw new Error("Invalid TOC response: expected object root");
  }
  const contents = value["contents"];
  if (!Array.isArray(contents)) {
    throw new Error("Invalid TOC response: expected root.contents array");
  }
  return {
    contents: contents.map((entry, index) => validateTocEntry(entry, `contents[${index}]`)),
  };
}

async function fetchJsonWithRetry(url: string): Promise<unknown> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= MAX_FETCH_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (response.ok) {
        return await response.json();
      }

      const retryable = response.status === 429 || response.status >= 500;
      const message = `TOC fetch failed for ${url}: HTTP ${response.status} ${response.statusText}`;
      if (!retryable || attempt === MAX_FETCH_ATTEMPTS) {
        throw new Error(message);
      }
      lastError = new Error(message);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lastError = new Error(`TOC fetch attempt ${attempt} failed for ${url}: ${message}`);
      const retryable = message.includes("HTTP 429") || /HTTP 5\d\d/.test(message) || !message.includes("HTTP ");
      if (!retryable || attempt === MAX_FETCH_ATTEMPTS) {
        throw lastError;
      }
    } finally {
      clearTimeout(timeout);
    }

    await sleep(250 * 2 ** (attempt - 1));
  }

  throw lastError ?? new Error(`TOC fetch failed for ${url} without a reported error`);
}

function walkToc(entry: TocEntry, parentTitle: string | undefined, nodes: TocBpNode[]): void {
  const match = BP_TITLE_RE.exec(entry.title.trim());
  if (match !== null) {
    const [, id, title] = match;
    if (entry.href === undefined) {
      throw new Error(`TOC best-practice node ${id} is missing href`);
    }
    if (parentTitle === undefined || parentTitle.trim() === "") {
      throw new Error(`TOC best-practice node ${id} is missing a parent question`);
    }

    const prefixMatch = /^([A-Z]{2,4})/.exec(id);
    if (prefixMatch === null) {
      throw new Error(`Unable to derive pillar prefix from best-practice id ${id}`);
    }
    const prefix = prefixMatch[1];
    const pillar = pillarForPrefix(prefix);
    nodes.push({
      id,
      title: title.trim(),
      href: entry.href,
      question: parentTitle,
      pillarSlug: pillar.slug,
      prefix,
      questionId: id.split("-")[0] ?? id,
    });
  }

  if (entry.contents !== undefined) {
    for (const child of entry.contents) {
      walkToc(child, entry.title, nodes);
    }
  }
}

async function loadTocJson(offline: boolean): Promise<unknown> {
  if (offline) {
    // Offline replay reads the snapshot only — it never touches the network,
    // so the Verify.ts idempotency gate cannot fail on a transient TOC fetch
    // error or a TOC change landing between the scrape step and the check.
    const cached = Bun.file(TOC_CACHE_PATH);
    if (!(await cached.exists())) {
      throw new Error(
        `missing TOC cache file ${TOC_CACHE_PATH} — run an online scrape first`,
      );
    }
    return JSON.parse(await cached.text());
  }

  // Online: fetch the live TOC and snapshot it next to the cached page HTML so
  // a subsequent --offline run replays from a consistent, deterministic state.
  const raw = await fetchJsonWithRetry(TOC_URL);
  await mkdir(CACHE_DIR, { recursive: true });
  await Bun.write(TOC_CACHE_PATH, JSON.stringify(raw));
  return raw;
}

export async function fetchTocBpNodes(offline = false): Promise<TocBpNode[]> {
  const toc = validateTocRoot(await loadTocJson(offline));
  const nodes: TocBpNode[] = [];
  for (const entry of toc.contents) {
    walkToc(entry, undefined, nodes);
  }

  if (nodes.length < 250) {
    throw new Error(`TOC layout guard failed: expected at least 250 best practices, found ${nodes.length}`);
  }

  return nodes.sort((left, right) => left.id.localeCompare(right.id));
}
