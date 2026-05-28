#!/usr/bin/env bash
set -euo pipefail

echo "[entrypoint] Running database migrations..."
if [ -f "node_modules/.bin/typeorm-ts-node-commonjs" ]; then
  node_modules/.bin/typeorm-ts-node-commonjs migration:run -d src/database/data-source.ts || {
    echo "[entrypoint] Migration via ts-node failed, attempting compiled migration runner..."
  }
fi

if [ -f "dist/database/data-source.js" ]; then
  node node_modules/typeorm/cli.js migration:run -d dist/database/data-source.js || {
    echo "[entrypoint] Compiled migration runner failed."
    exit 1
  }
fi

echo "[entrypoint] Starting application..."
exec "$@"
