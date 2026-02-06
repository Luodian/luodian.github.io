#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TARGET_PUBLIC_DIR="${ROOT_DIR}/next-site/public"

mkdir -p "${TARGET_PUBLIC_DIR}"

rm -rf "${TARGET_PUBLIC_DIR}/assets"
cp -R "${ROOT_DIR}/docs/assets" "${TARGET_PUBLIC_DIR}/assets"

mkdir -p "${TARGET_PUBLIC_DIR}/projects"
rm -rf "${TARGET_PUBLIC_DIR}/projects/genbench"
cp -R "${ROOT_DIR}/docs/projects/genbench" "${TARGET_PUBLIC_DIR}/projects/genbench"

echo "Synced assets and project static files into next-site/public."
