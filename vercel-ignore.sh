#!/bin/bash

# Get files changed in the current commit
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD)

# Check whether every changed file is README.md or LICENSE
for file in $CHANGED_FILES; do
    if [[ "$file" != "README.md" && "$file" != "LICENSE" ]]; then
        echo "Application files changed. Proceeding with deployment."
        exit 1
    fi
done

echo "Only README.md and/or LICENSE changed. Skipping deployment."
exit 0