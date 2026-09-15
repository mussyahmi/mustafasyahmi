#!/usr/bin/env bash
# Renders scripts/og.html to public/og.png at 1200x630.
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --virtual-time-budget=5000 \
  --screenshot="public/og.png" "file://$PWD/scripts/og.html"
sips -g pixelWidth -g pixelHeight public/og.png
