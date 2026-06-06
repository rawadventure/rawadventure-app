#!/bin/bash
# capture-screenshots.sh — capture screenshots stores depuis simulator booté.
#
# Usage : ./scripts/capture-screenshots.sh <screen_name>
# Ex : ./scripts/capture-screenshots.sh 01-splash
#
# Pré-requis :
# - Simulator iPhone 17 Pro Max booté
# - App Raw Adventure installée + lancée
# - Navigation manuelle sur l'écran cible avant chaque capture

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <screen_name>"
  echo "Ex: $0 01-splash"
  exit 1
fi

SCREEN_NAME="$1"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/../assets/store-screenshots/iphone-6.9"
mkdir -p "$OUTPUT_DIR"

OUTPUT_PATH="$OUTPUT_DIR/${SCREEN_NAME}.png"
xcrun simctl io booted screenshot "$OUTPUT_PATH"
echo "✓ Saved: $OUTPUT_PATH"

# Affiche dimensions pour vérif
python3 -c "from PIL import Image; im = Image.open('$OUTPUT_PATH'); print(f'  Resolution: {im.size[0]}x{im.size[1]}')"
