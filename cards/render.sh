#!/bin/sh
# Renders card.html into two 1080x1920 PNG invitation cards using headless Edge.
cd "$(dirname "$0")"
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
DIR="$(cygpath -m "$PWD")"
for ev in holud reception; do
  "$EDGE" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --force-device-scale-factor=2 --window-size=540,960 --virtual-time-budget=8000 \
    --screenshot="$DIR/invitation-$ev.png" "file:///$DIR/card.html?event=$ev" 2>/dev/null
done
ls -l invitation-*.png
