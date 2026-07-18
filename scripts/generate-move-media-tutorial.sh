#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/media"
TMP="${TMPDIR:-/tmp}/uploadflow-move-media-tutorial"
FONT="/System/Library/Fonts/Supplemental/Arial Bold.ttf"
CURSOR="$ROOT/public/social/cursor.png"
RING="$ROOT/public/social/click-ring.png"

rm -rf "$TMP"
mkdir -p "$TMP" "$OUT"

caption() {
  local title="$1"
  local detail="$2"
  local output="$3"
  magick -size 1920x220 xc:none \
    -fill '#090c0ee8' -draw 'roundrectangle 48,24 1872,202 28,28' \
    -font "$FONT" -fill '#eefb7a' -pointsize 48 -gravity northwest -annotate +88+56 "$title" \
    -font "$FONT" -fill '#ffffffb8' -pointsize 25 -gravity northwest -annotate +88+130 "$detail" \
    "$output"
}

scene() {
  local image="$1"
  local caption_image="$2"
  local start_x="$3"
  local start_y="$4"
  local end_x="$5"
  local end_y="$6"
  local output="$7"

  ffmpeg -hide_banner -loglevel error -y \
    -loop 1 -t 4 -i "$image" \
    -loop 1 -t 4 -i "$CURSOR" \
    -loop 1 -t 4 -i "$RING" \
    -loop 1 -t 4 -i "$caption_image" \
    -filter_complex "
      [0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(1+on*0.00022,1.026)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30[bg];
      [1:v]scale=58:-1[cursor];
      [2:v]scale=94:-1[ring];
      [bg][ring]overlay=x='$end_x-47':y='$end_y-47':enable='between(t,3.05,3.55)'[clicked];
      [clicked][cursor]overlay=x='$start_x+($end_x-$start_x)*min(max((t-0.45)/2.55,0),1)':y='$start_y+($end_y-$start_y)*min(max((t-0.45)/2.55,0),1)'[pointed];
      [pointed][3:v]overlay=0:840:enable='gte(t,0.2)',format=yuv420p[out]
    " \
    -map '[out]' -t 4 -an -r 30 -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart "$output"
}

caption '01  CAPTURE THE SOURCE' 'Hover or right-click media you are authorized to reuse.' "$TMP/caption-1.png"
caption '02  SAVE URL TO YOUR PRIVATE SHELF' 'Keep the source reference available while you move between tabs.' "$TMP/caption-2.png"
caption '03  OPEN THE DESTINATION' 'Click its file input and choose media from UploadFlow.' "$TMP/caption-3.png"
caption '04  REVIEW AND CONTINUE' 'Confirm the file, then return it to the original upload flow.' "$TMP/caption-4.png"
caption 'MEDIA MOVED  ·  DOWNLOAD SKIPPED' 'The destination receives the approved file. Originals stay untouched.' "$TMP/caption-5.png"

scene "$ROOT/public/features/cross-site-handoff.png" "$TMP/caption-1.png" 220 420 485 610 "$TMP/scene-1.mp4"
scene "$ROOT/public/features/media-shelf-actual.png" "$TMP/caption-2.png" 1240 260 1805 170 "$TMP/scene-2.mp4"
scene "$ROOT/public/features/product-overview-actual.png" "$TMP/caption-3.png" 680 720 1280 700 "$TMP/scene-3.mp4"
scene "$ROOT/public/features/product-overview-actual.png" "$TMP/caption-4.png" 1030 620 1295 930 "$TMP/scene-4.mp4"
scene "$ROOT/public/features/cross-site-handoff.png" "$TMP/caption-5.png" 860 500 1450 475 "$TMP/scene-5.mp4"

printf "file '%s'\n" "$TMP/scene-1.mp4" "$TMP/scene-2.mp4" "$TMP/scene-3.mp4" "$TMP/scene-4.mp4" "$TMP/scene-5.mp4" > "$TMP/concat.txt"

ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$TMP/concat.txt" -c copy "$OUT/uploadflow-move-media-tutorial.mp4"
ffmpeg -hide_banner -loglevel error -y -ss 1.2 -i "$OUT/uploadflow-move-media-tutorial.mp4" -frames:v 1 -q:v 2 "$OUT/uploadflow-move-media-tutorial-poster.jpg"

echo "Created $OUT/uploadflow-move-media-tutorial.mp4"
