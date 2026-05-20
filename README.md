# aws-well-architected-corpus

> Unofficial, machine-readable mirror of the **AWS Well-Architected Framework** — refreshed daily, released on change.

AWS publishes the Well-Architected Framework only as HTML documentation. There is no OSCAL-style machine-readable release, and the WA Tool `ExportLens` API explicitly **cannot** export AWS-official content. This repo fills that gap: it scrapes the framework daily and publishes it as a structured corpus you can ingest programmatically — for AI agents, GRC tooling, or Well-Architected reviews.

It is the AWS analogue of [`AustralianCyberSecurityCentre/ism-oscal`](https://github.com/AustralianCyberSecurityCentre/ism-oscal): a self-maintaining mirror that ships **date-versioned GitHub Releases** whenever the upstream content changes.

## What's in here

| Path | What |
|------|------|
| `data/best-practices/*.md` | One Markdown file per best practice (~306), keyed by ID (`SEC01-BP01`) |
| `data/pillars/*.md` | Six pillar overview + question-index files |
| `data/aws-well-architected-lens.json` | A WA Tool-importable **custom lens** (`aws wellarchitected import-lens`) |
| `data/aws-well-architected.json` | A single bundled JSON of every best practice, for machine ingest |
| `data/_meta.json` | Generation metadata + content hash |

## Consuming it

**Pin a release** (recommended) — every release is tagged `vYYYY.MM.DD`:

```bash
gh release download --repo sjramblings/aws-well-architected-corpus --pattern '*.json'
# or, for the whole corpus:
git clone https://github.com/sjramblings/aws-well-architected-corpus
git -C aws-well-architected-corpus checkout vYYYY.MM.DD
```

Each best-practice file carries YAML frontmatter (`id`, `pillar`, `risk_level`, `source_url`, `content_hash`, …) so it drops straight into a RAG index or an agent tool-call lookup — one document per best practice is already the right chunk size.

## How it stays current

A GitHub Actions cron runs daily: it re-scrapes `docs.aws.amazon.com/wellarchitected/latest/framework/`, regenerates `data/`, and commits any diff. When best-practice **content** actually changes (not just cosmetics), it cuts a release tagged with the date, with auto-generated notes listing which best practices were added, removed, or changed.

The git history of `data/` is therefore a free time-series of how the framework evolves.

## Building locally

```bash
bun install
just refresh        # scrape + regenerate all outputs
just verify         # run acceptance checks
just release-dryrun # report whether a release would be cut
```

## Attribution

Best-practice content is © Amazon Web Services — see [`NOTICE`](./NOTICE). This is an unofficial mirror; the [official documentation](https://docs.aws.amazon.com/wellarchitected/latest/framework/) is authoritative. Generator tooling is MIT-licensed.
