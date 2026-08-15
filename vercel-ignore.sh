#!/bin/bash
set -euo pipefail

# Vercel provides the previous deployed commit and the current commit.
# This correctly handles pushes containing multiple commits.
PREV_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR_SHA="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

deploy() {
    echo "Application files changed. Proceeding with deployment."
    exit 1
}

skip() {
    echo "Only README.md and/or LICENSE changed. Skipping deployment."
    exit 0
}

# Fall back to HEAD^ when Vercel's previous SHA is unavailable.
# If this is the first commit, there is nothing safe to compare against,
# so deploy.
if [[ -z "$PREV_SHA" ]]; then
    if git rev-parse --verify --quiet HEAD^ >/dev/null; then
        PREV_SHA="HEAD^"
    else
        deploy
    fi
fi

# Sanity check both refs actually exist (e.g. shallow clone edge cases)
if ! git rev-parse --verify --quiet "$PREV_SHA" >/dev/null || \
   ! git rev-parse --verify --quiet "$CURR_SHA" >/dev/null; then
    echo "Could not resolve commit range. Deploying to be safe."
    deploy
fi

# Inspect every changed file using null-terminated output so filenames
# containing spaces, tabs, or newlines are handled safely.
CHANGED=0
while IFS= read -r -d '' file; do
    CHANGED=1
    if [[ "$file" != "README.md" && "$file" != "LICENSE" ]]; then
        deploy
    fi
done < <(git diff --name-only -z "$PREV_SHA" "$CURR_SHA")

# No changed files means there is nothing to deploy.
if [[ "$CHANGED" -eq 0 ]]; then
    echo "No files changed. Skipping deployment."
    skip
fi

# At this point every changed file was either README.md or LICENSE.
skip