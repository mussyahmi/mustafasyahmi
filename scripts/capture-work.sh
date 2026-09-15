#!/usr/bin/env bash
# Captures a 390x844 phone viewport (2x) of each live app into public/work/.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
TMP_DIR=".qa/work"
mkdir -p "$TMP_DIR" public/work

capture() {
  local name="$1" url="$2"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --force-device-scale-factor=2 --window-size=390,844 \
    --virtual-time-budget=10000 \
    --screenshot="$TMP_DIR/$name.png" "$url"
  cwebp -quiet -q 82 -resize 780 0 "$TMP_DIR/$name.png" -o "public/work/$name.webp"
  echo "captured $name"
}

capture kirapoket https://kirapoket.web.app
capture marisolat https://marisolat.web.app
capture kadharilahir https://kadharilahir.web.app
capture lukislukis https://lukislukis.web.app
