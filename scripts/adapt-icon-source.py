"""
Adapte l'icône ChatGPT (round disc Mimi & Jacky + gradient ring) aux 4 formats Expo.

Source : /Users/ASUS/Downloads/ChatGPT Image 4 juin 2026 à 12_08_07.png (1254x1254 RGB)

Outputs :
- icon.png : 1024x1024 RGB — image source resized, corners noirs gardés (iOS auto-round)
- adaptive-icon.png : 1024x1024 RGBA — extract content disc (no gradient ring) centred in safe area 720x720
- favicon.png : 192x192 RGB — same as icon, resized
- splash-icon.png : 1024x1024 RGB — icon avec padding cream (Expo splash resizeMode contain)
"""
from PIL import Image, ImageDraw
import os

SRC = "/Users/ASUS/Downloads/ChatGPT Image 4 juin 2026 à 12_08_07.png"
ASSETS = "/Users/ASUS/RawAdventureRN/assets"

DEEP = (45, 62, 51)
CREAM = (245, 241, 232)


def main():
    src = Image.open(SRC).convert("RGB")
    w, h = src.size
    print(f"Source: {w}x{h}")

    # 1. icon.png : resize source to 1024x1024 RGB
    icon = src.resize((1024, 1024), Image.LANCZOS)
    icon.save(os.path.join(ASSETS, "icon.png"))
    print("icon.png 1024x1024 OK")

    # 2. favicon.png : 192x192
    favicon = src.resize((192, 192), Image.LANCZOS)
    favicon.save(os.path.join(ASSETS, "favicon.png"))
    print("favicon.png 192x192 OK")

    # 3. splash-icon.png : 1024x1024 RGB, source réduit centré sur cream
    splash_bg = Image.new("RGB", (1024, 1024), CREAM)
    # Resize source à 760px et coller centré
    splash_content = src.resize((760, 760), Image.LANCZOS)
    splash_bg.paste(splash_content, ((1024 - 760) // 2, (1024 - 760) // 2))
    splash_bg.save(os.path.join(ASSETS, "splash-icon.png"))
    print("splash-icon.png 1024x1024 OK")

    # 4. adaptive-icon.png : Android — RGBA, extract le disc central (sans gradient ring)
    # Source = disc d'environ ~1180px de diamètre sur 1254. Le gradient ring fait ~30-40px d'épaisseur.
    # On va extraire un disc plus petit de rayon ~530px (= ~85% du rayon total) pour exclure le ring.
    src_w, src_h = src.size
    src_cx, src_cy = src_w // 2, src_h // 2

    # Crop circulaire du contenu interne (sans gradient ring)
    inner_radius = int((src_w / 2) * 0.88)  # 88% du rayon = exclut anneau
    inner_size = inner_radius * 2

    # Crée masque circulaire
    mask = Image.new("L", (inner_size, inner_size), 0)
    ImageDraw.Draw(mask).ellipse([0, 0, inner_size, inner_size], fill=255)

    # Crop carré centré sur le disc, puis applique masque
    bbox = (src_cx - inner_radius, src_cy - inner_radius,
            src_cx + inner_radius, src_cy + inner_radius)
    inner_crop = src.crop(bbox).convert("RGBA")
    inner_crop.putalpha(mask)

    # Compose sur 1024x1024 transparent, dans safe area 720x720 centrée
    adaptive = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    # Resize inner_crop à 720x720 (safe area)
    inner_resized = inner_crop.resize((720, 720), Image.LANCZOS)
    adaptive.paste(inner_resized, ((1024 - 720) // 2, (1024 - 720) // 2), inner_resized)
    adaptive.save(os.path.join(ASSETS, "adaptive-icon.png"))
    print("adaptive-icon.png 1024x1024 RGBA OK")


if __name__ == "__main__":
    main()
