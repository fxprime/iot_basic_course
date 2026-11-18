#!/bin/bash
# Validate source registry, tracking behavior, and the rendered course.
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -x "$PROJECT_DIR/.venv/bin/mkdocs" ]; then
    MKDOCS_BIN="$PROJECT_DIR/.venv/bin/mkdocs"
else
    MKDOCS_BIN="$(command -v mkdocs)" || { echo "Run ./build.sh to install MkDocs first."; exit 1; }
fi
CHECK_SITE_DIR="$(mktemp -d "${TMPDIR:-/tmp}/iot-course-check.XXXXXX")"
trap 'rm -rf "$CHECK_SITE_DIR"' EXIT
node "$PROJECT_DIR/generate-section-registry.js" --check
node --test "$PROJECT_DIR/scripts/progress-tracker.test.js"
"$MKDOCS_BIN" build --config-file "$PROJECT_DIR/mkdocs.yml" --site-dir "$CHECK_SITE_DIR" --clean
node "$PROJECT_DIR/scripts/check-course.js" "$CHECK_SITE_DIR"
