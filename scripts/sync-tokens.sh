#!/bin/bash
# Pull the canonical design tokens from the qdns repo.
# Run at build time on Cloudflare Pages (set as Build command).
set -e

UPSTREAM="${TOKENS_UPSTREAM:-https://raw.githubusercontent.com/vikasswaminh/qdns/main/packages/tokens/tokens.css}"
DEST="${TOKENS_DEST:-tokens.css}"

echo "[sync-tokens] pulling $UPSTREAM -> $DEST"
if command -v curl >/dev/null; then
  curl -sSfL "$UPSTREAM" -o "$DEST"
elif command -v wget >/dev/null; then
  wget -qO "$DEST" "$UPSTREAM"
else
  echo "[sync-tokens] neither curl nor wget available — failing"
  exit 1
fi

# Append a notice so contributors don't edit the synced copy
cat >> "$DEST" <<'EOF'

/* ============================================================
 * NOTE: this file is synced from the qdns repo at build time.
 * Edit packages/tokens/tokens.css in qdns; do NOT edit here.
 * ============================================================ */
EOF

echo "[sync-tokens] ok — $(wc -c < $DEST) bytes"
