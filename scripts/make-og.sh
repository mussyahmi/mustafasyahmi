#!/usr/bin/env bash
# Renders scripts/og.html to public/og.jpg at 1200x630, under 300 KB for WhatsApp previews.
set -euo pipefail

mkdir -p .qa

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=5000 \
  --screenshot=".qa/og.png" "file://$PWD/scripts/og.html"

sips -s format jpeg -s formatOptions 82 .qa/og.png --out public/og.jpg
sips -g pixelWidth -g pixelHeight public/og.jpg
stat -f%z public/og.jpg
