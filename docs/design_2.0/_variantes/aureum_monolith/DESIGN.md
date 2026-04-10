# Design System Specification: The Architectural Monolith

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Monolith"**
This design system rejects the "flatness" of modern SaaS. It is inspired by the weight of marble, the precision of architectural blueprints, and the atmospheric lighting of a high-end gallery. Instead of standard grids, we embrace **Intentional Asymmetry** and **Tonal Depth**. The goal is to make the user feel like they are flipping through a limited-edition architectural monograph. We achieve this through "The Stack"—layering dense gradients, marble textures, and razor-thin metallic accents to create a tactile, three-dimensional experience.

---

## 2. Colors & Atmospheric Depth
Our palette is rooted in the "Void and Ore" philosophy. We use deep obsidian blacks as the foundation, punctuated by the "warmth" of engineering materials like copper and gold.

### The Palette (Material Mapping)
*   **Surface (Main Background):** `#0A0A0A` — The base layer.
*   **Surface-Container (Cards/Sections):** `#111111` to `#1A1A1A`.
*   **Primary (Gold/Copper):** `#C9A55A` (The core "Metal" accent).
*   **Primary-Active (Hover):** `#E8C675` (The "Light" accent).
*   **Secondary (Terracotta):** `#B5501B` (Used for structural highlights).
*   **On-Surface (Text):** `#F5F0E8` (Off-white to reduce eye strain and feel premium).
*   **On-Surface-Variant (Secondary Text):** `#A89F91` (Muted stone).
*   **Error:** `#7B2D42` (Deep wine; avoids the "cheap" bright red of standard UI).

### The Editorial Rules
*   **The "No-Line" Rule:** Prohibit 1px solid gray borders for sectioning. Boundaries must be defined solely through background color shifts (e.g., a `surface-container-lowest` card sitting on a `surface` background) or subtle tonal transitions.
*   **The Glass & Gradient Rule:** For CTAs and hero sections, use a radial gradient overlay (from `#C9A55A` to `#B5501B` at 15% opacity) over a dark marble texture. Floating elements must utilize Backdrop Blur (20px+) to feel like frosted glass suspended over the layout.
*   **Signature Textures:** Incorporate a low-opacity (3-5%) marble grain overlay across the entire `surface`. This breaks the digital perfection and adds organic "soul."

---

## 3. Typography: The Editorial Scale
We contrast the classic authority of **Playfair Display** (Serif) with the modern engineering precision of **Outfit** (Sans-serif).

*   **Display & Headlines (Playfair Display):** These are our "Art" layers. Use `display-lg` (3.5rem) for high-impact statements. Tighten letter spacing slightly (-2%) to give it an authoritative, "printed" feel.
*   **Body & UI (Outfit):** Used for all functional data and body copy.
    *   **Label-MD:** Use all-caps with increased letter spacing (0.1rem) for metadata and categories to mimic architectural annotations.
*   **Visual Hierarchy:** Headlines should never be "just text." Overlap them with images or containers to break the boxy feel of traditional layouts.

---

## 4. Elevation & Depth (The Layering Principle)
Depth is achieved through **Tonal Layering**, not structural lines.

*   **Tiers of Surface:**
    1.  **Level 0 (Base):** `surface` (`#0A0A0A`)
    2.  **Level 1 (Nesting):** `surface-container-low` (`#111111`) for primary content cards.
    3.  **Level 2 (Interaction):** `surface-container-high` (`#1A1A1A`) for navigation and persistent footers.
*   **Ambient Shadows:** Use shadows sparingly. When required, use a "Copper Glow": a large 40px blur with 5% opacity using the `secondary` color (`#B5501B`) rather than black.
*   **The "Ghost Border":** If a container requires a border for focus, use the `primary` token (`#C9A55A`) at 15% opacity. It should feel like a faint gold thread, not a solid wall.

---

## 5. Signature Components

### Buttons: The Beveled Ingot
*   **Primary:** A solid fill of `#C9A55A` with `on-primary` text. No rounded corners (`0.125rem` max). Use a subtle linear gradient to give it a "brushed metal" look.
*   **Secondary:** No fill. A "Ghost Border" of gold (20% opacity). On hover, the border moves to 100% opacity and a faint glow is applied.

### Cards & Projects
*   **The Rule:** Forbid divider lines. Separate content using vertical white space from the spacing scale (multiples of 8px).
*   **Interaction:** On hover, a card should not move "up." Instead, the internal marble texture should scale slightly (1.05x), and the "Ghost Border" should brighten.

### Input Fields: The Blueprint Style
*   Inputs are not boxes. They are single lines using the `outline-variant` token. Labels use `label-md` (Outfit, All-Caps) and sit *above* the line.
*   **Error State:** Instead of a red box, the bottom line changes to `#7B2D42` (Wine) and the text becomes italicized Playfair Display.

### The Navigation Monolith
*   The Navbar (`#1A1A1A`) should use a `backdrop-filter: blur(15px)` with 90% opacity. It must feel heavy and grounded, spanning the full width but with content aligned to an asymmetric grid (e.g., Logo at 10%, Menu at 60%).

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use extreme scale. A 56pt headline next to a 12pt label creates premium tension.
*   **Do** allow images to bleed off the edge of the screen or overlap container boundaries.
*   **Do** use "Optical Centering"—sometimes an element looks better slightly off-center in this maximalist style.

### Don’t:
*   **Don’t** use pure white (`#FFFFFF`). It breaks the luxury immersion. Always use `on-surface` (`#F5F0E8`).
*   **Don’t** use "Standard" icons. Use ultra-thin (1pt) stroke icons that match the `primary` gold color.
*   **Don’t** use heavy rounded corners. Keep it sharp (`sm` or `none`) to reflect engineering precision and stone-cutting.
*   **Don’t** use generic stock photography. Use high-contrast, desaturated imagery with architectural shadows.