#!/usr/bin/env bash
set -euo pipefail

pnpm concurrently \
  --names api,web \
  --prefix-colors blue,green \
  "pnpm dev:api" \
  "pnpm dev:gui"
