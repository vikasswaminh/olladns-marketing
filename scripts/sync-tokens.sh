#!/bin/bash
# Local-only — pull canonical design tokens from the (private) qdns repo.
# Requires GH_TOKEN env var with read access to vikasswaminh/qdns.
# Not run by CF Pages (uses the committed copy).
set -e

: "${GH_TOKEN:?Need a GH_TOKEN with read access to qdns. Generate at https://github.com/settings/tokens}"
UPSTREAM="https://api.github.com/repos/vikasswaminh/qdns/contents/packages/tokens/tokens.css"
DEST="${TOKENS_DEST:-tokens.css}"

echo "[sync-tokens] pulling $UPSTREAM -> $DEST"
curl -sSfL \
  -H "Authorization: Bearer $GH_TOKEN" \
  -H "Accept: application/vnd.github.raw" \
  "$UPSTREAM" -o "$DEST"

cat >> "$DEST" <<'EONOTE'

/* ============================================================
 * NOTE: this file is synced from the (private) qdns repo.
 * Edit packages/tokens/tokens.css in qdns; sync here, commit, push.
 * ============================================================ */
EONOTE

echo "[sync-tokens] ok — $(wc -c < $DEST) bytes"
