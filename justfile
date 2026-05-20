# aws-well-architected-corpus — task runner

# Scrape AWS docs, regenerate the corpus + JSON outputs
refresh:
    bun scripts/Scrape.ts
    bun scripts/BuildLens.ts
    bun scripts/BuildBundle.ts

# Run the acceptance-criteria checks
verify:
    bun scripts/Verify.ts

# Report whether a release would be cut, without cutting one
release-dryrun:
    bun scripts/BuildRelease.ts --dry-run

# Cut a release if content changed (used by CI)
release:
    bun scripts/BuildRelease.ts

# Install dependencies
install:
    bun install
