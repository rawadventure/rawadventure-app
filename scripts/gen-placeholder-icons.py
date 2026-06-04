"""
Generate Raw Adventure placeholder app icons.

Brand colors :
- Deep green #2D3E33
- Cream #F5F1E8

Output : 4 PNG files in assets/.
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Colors
DEEP = (45, 62, 51)     # #2D3E33
CREAM = (245, 241, 232) # #F5F1E8

# Output dir
ASSETS = os.path.expanduser("~/RawAdventureRN/assets")

# Font
FONT_PATH = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


def make_icon(size: int, mark_diameter_ratio: float = 0.70,
              text: str = "ra", text_ratio: float = 0.42) -> Image.Image:
    """
    Layout : solid cream background, deep green circle centered,
    cream lowercase "ra" inside circle.
    """
    img = Image.new("RGB", (size, size), CREAM)
    draw = ImageDraw.Draw(img)

    # Circle
    d = int(size * mark_diameter_ratio)
    x0 = (size - d) // 2
    y0 = (size - d) // 2
    draw.ellipse([x0, y0, x0 + d, y0 + d], fill=DEEP)

    # Text
    target_text_h = int(size * text_ratio)
    font = ImageFont.truetype(FONT_PATH, target_text_h)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    # PIL textbbox top offset; compensate
    tx = (size - tw) // 2 - bbox[0]
    ty = (size - th) // 2 - bbox[1]
    draw.text((tx, ty), text, fill=CREAM, font=font)

    return img


def make_adaptive(size: int = 1024) -> Image.Image:
    """
    Adaptive icon : foreground only. Content must fit in 720x720 safe area
    (66% of 1080). Background is set in app.json (`adaptiveIcon.backgroundColor`).
    We center a deep green disc + cream "ra" on transparent.
    """
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Safe area : 66% of size
    safe = int(size * 0.66)
    d = int(safe * 0.95)
    x0 = (size - d) // 2
    y0 = (size - d) // 2
    draw.ellipse([x0, y0, x0 + d, y0 + d], fill=DEEP + (255,))

    target_text_h = int(safe * 0.55)
    font = ImageFont.truetype(FONT_PATH, target_text_h)
    bbox = draw.textbbox((0, 0), "ra", font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (size - tw) // 2 - bbox[0]
    ty = (size - th) // 2 - bbox[1]
    draw.text((tx, ty), "ra", fill=CREAM + (255,), font=font)

    return img


def main():
    # iOS main icon : 1024x1024, no transparency
    icon = make_icon(1024)
    icon.save(os.path.join(ASSETS, "icon.png"))
    print("icon.png 1024x1024")

    # Splash icon : 1024x1024 (Expo splash centers it)
    splash = make_icon(1024, mark_diameter_ratio=0.55, text_ratio=0.32)
    splash.save(os.path.join(ASSETS, "splash-icon.png"))
    print("splash-icon.png 1024x1024")

    # Favicon (web) : 48x48
    favicon = make_icon(192)
    favicon.save(os.path.join(ASSETS, "favicon.png"))
    print("favicon.png 192x192")

    # Adaptive Android foreground : 1024x1024 RGBA
    adaptive = make_adaptive(1024)
    adaptive.save(os.path.join(ASSETS, "adaptive-icon.png"))
    print("adaptive-icon.png 1024x1024")


if __name__ == "__main__":
    main()
