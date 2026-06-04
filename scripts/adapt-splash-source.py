"""
Adapte l'image splash GPT (1024x1536 RGBA transparent) au format splash-icon Expo.

Stratégie : centrer le contenu vertical sur un canvas carré 2048x2048 transparent.
Expo splash avec resizeMode 'contain' + backgroundColor #F5F1E8 → bg cream
s'affiche autour du contenu transparent.
"""
from PIL import Image
import os

SRC = "/Users/ASUS/Downloads/ChatGPT Image 4 juin 2026 à 13_36_07.png"
DST = "/Users/ASUS/RawAdventureRN/assets/splash-icon.png"


def main():
    src = Image.open(SRC).convert("RGBA")
    w, h = src.size
    print(f"Source: {w}x{h} RGBA")

    # Canvas carré au plus grand côté du source
    size = max(w, h)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))

    # Centre le contenu
    x = (size - w) // 2
    y = (size - h) // 2
    canvas.paste(src, (x, y), src)

    # Resize à 2048x2048 pour qualité
    final = canvas.resize((2048, 2048), Image.LANCZOS)
    final.save(DST)
    print(f"splash-icon.png 2048x2048 RGBA -> {DST}")


if __name__ == "__main__":
    main()
