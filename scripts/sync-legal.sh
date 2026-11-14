#!/usr/bin/env bash
#
# Copy the binding legal documents from the monorepo into this repo.
#
# WHY A COPY EXISTS AT ALL: lytebuy-web is its own git repository, so the
# monorepo's docs/legal/ is not present in the Amplify build container. A Vite
# import reaching ../../docs/legal/ resolves locally, where the folders sit side
# by side, and fails the deploy. That is not hypothetical - it broke the
# 2026-11-13 deploy, which went green on the old content because the build never
# produced the new pages.
#
# docs/legal/ in the monorepo REMAINS the source of truth. Edit there, then run
# this. src/lib/server/legal.test.ts asserts what the published pages must
# contain, so a stale copy fails the suite rather than reaching the store.

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$HERE/../docs/legal"
DEST="$HERE/src/lib/legal"

if [ ! -d "$SRC" ]; then
  echo "error: $SRC not found." >&2
  echo "Run this from a checkout that sits beside the monorepo's docs/ folder." >&2
  exit 1
fi

mkdir -p "$DEST"
for f in privacy-policy.md terms-of-use.md tax-responsibility.md; do
  cp "$SRC/$f" "$DEST/$f"
  echo "synced $f"
done

echo
echo "Now run: npm test"
