#!/usr/bin/env bash
set -euo pipefail

frontend_revision=296f5aae805548cd799c9f1e355b679b1f8b8843
project_root="$(pwd)"
frontend_source="$(mktemp -d)"
trap 'rm -rf "$frontend_source"' EXIT

git -C "$frontend_source" init --quiet
git -C "$frontend_source" fetch --quiet --depth 1 https://github.com/shamsiddin-devv/job-board-frontend.git "$frontend_revision"
git -C "$frontend_source" checkout --quiet --detach FETCH_HEAD

cd "$frontend_source"
npm ci --include=dev --no-audit --no-fund
VITE_API_URL=/api npm run build -- --outDir "$project_root/frontend-dist" --emptyOutDir
