#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_LEGACY_DIR="${ROOT_DIR}/next-site/legacy"
SOURCE_DOCS_DIR="${ROOT_DIR}/docs"

rm -rf "${TARGET_LEGACY_DIR}"
mkdir -p "${TARGET_LEGACY_DIR}"

while IFS= read -r html_file; do
  relative_path="${html_file#${SOURCE_DOCS_DIR}/}"
  target_path="${TARGET_LEGACY_DIR}/${relative_path}"
  mkdir -p "$(dirname "${target_path}")"
  cp "${html_file}" "${target_path}"
done < <(find "${SOURCE_DOCS_DIR}" -type f -name "*.html" | sort)

echo "Synced legacy HTML pages into next-site/legacy."
