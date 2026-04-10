# Design System Document: High-End Editorial Engineering

## 1. Overview & Creative North Star
**Creative North Star: "The Architectural Monolith"**

This design system is built to evoke the same presence as a bespoke high-rise: heavy, permanent, and undeniably luxury. We are moving away from the "generic SaaS" look to embrace **Dark Luxury Maximalism**. This means we reject the thin, airy layouts of modern web design in favor of deep tonal layering, rich textures, and bold editorial typography.

The system breaks the standard grid through **intentional asymmetry**. Expect to see elements overlapping, oversized serif typography that bleeds off-center, and a "physical" sense of depth where surfaces feel like stacked slabs of Nero Marquina marble and brushed brass.

---

## 2. Colors & Surface Philosophy
The palette is rooted in deep obsidian and metallic warmth. We do not use "Grey." Every neutral is slightly warmed or cooled to maintain a premium feel.

### The Palette
- **Primary (Gold):** `#C9A55A` — Used for high-intent actions and structural highlights.
- **Primary-Bright:** `#E8C675` — For hover states and "glow" effects.
- **Secondary (Terracotta):** `#B5501B` — Reserved for badges, specialized status, and organic warmth.
- **Error (Wine):** `#7B2D42` — A sophisticated alternative to bright red, used for critical alerts.
- **On-Surface (Off-White):** `#F5F0E8` — The primary reading color, high contrast against the dark base.

### The "No-Line" Rule
Standard 1px solid borders are strictly prohibited for sectioning. We define space through:
1.  **Background Shifts:** Moving from `surface` (#0A0A0A) to `surface-container` (#111111).
2.  **Tonal Transitions:** Using the `surface-container-high` (#1A1A1A) for navigation without a hard line.
3.  **Shadow Depth:** See the Elevation section.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
- **Base Layer:** `surface` (#0A0A0A).
- **Secondary Layer:** `surface-container` (#111111) for large cards or content blocks.
- **Tertiary Layer:** `surface-container-high` (#1A1A1A) for navigation and floating elements.
- **The "Glass" Rule:** Floating elements (modals, dropdowns) should use `surface-container-highest` with a `backdrop-blur(12px)` and 40% opacity to allow the underlying marble textures to bleed through.

---

## 3. Typography
The tension between the classical **Playfair Display** and the modern **Outfit** creates a signature "Editorial Engineering" look.

| Role | Font Family | Size | Weight | Note |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | Playfair Display | 3.5rem | 700 | Use -2% letter spacing for a "tight" editorial feel. |
| **Headline** | Playfair Display | 2rem | 600 | Often used for section headers. |
| **Title** | Outfit | 1.125rem | 500 | All-caps for a technical, precise feel. |
| **Body** | Outfit | 1rem | 400 | High legibility, generous line height (1.6). |
| **Label** | Outfit | 0.75rem | 600 | Used for badges and small UI metadata. |

---

## 4. Elevation & Depth
In this system, depth is a narrative tool.

- **The Layering Principle:** Depth is achieved by "stacking." Place a `surface-container-lowest` card on a `surface-container-low` section to create a soft, natural "recessed" look.
- **Ambient Shadows:** Shadows must be ultra-diffused. 
  *   *Token:* `0px 20px 40px rgba(0, 0, 0, 0.6)`. 
  *   Never use grey shadows; they must be black or a tinted version of the background.
- **The "Ghost Border":** If a container requires a border for accessibility, use the `primary` (Gold) token at **15% opacity**. This creates a "glint" of light rather than a structural wall.
- **Signature Texture:** Apply a subtle noise or a low-opacity "Dark Marble" SVG pattern to `surface-container` elements. This removes the flat "digital" look and provides a tactile, material quality.

---

## 5. Components

### Buttons
- **Primary:** Background: `primary` (#C9A55A), Text: `#0A0A0A`. Sharp corners (`0.25rem`) to maintain architectural rigidity.
- **Secondary (The Glass Button):** Border: 1px `primary` at 30% opacity. Backdrop-blur: 8px. Text: `primary`.
- **States:** On hover, the primary button should gain a "Golden Glow" (`box-shadow: 0 0 20px #C9A55A40`).

### Cards & Containers
- **The Rule:** No dividers. Use vertical white space (32px, 48px, or 64px) to separate content.
- **Layout:** Cards should feel like heavy slabs. Use `surface-container` (#111111) with a subtle `outline-variant` (#4D4638) ghost border.

### Input Fields
- **Style:** Underline only. Avoid the "box" look. 
- **Active State:** The underline transitions from `outline` (#998F7F) to `primary` (Gold) with a subtle outer glow.
- **Typography:** Placeholder text uses `on-surface-variant` (#D1C5B3) in Outfit.

### Chips & Badges
- **Engineering Badges:** Use `secondary` (Terracotta) for status or categories. 
- **Shape:** Rectangular with very slight rounding (`0.125rem`). Avoid "Pill" shapes as they feel too casual for this system.

---

## 6. Do's and Don'ts

### Do
- **Do** use large, high-quality architectural photography with dark overlays.
- **Do** allow typography to overlap image boundaries to create a magazine-style layout.
- **Do** use "Dead Space" (large empty areas of `#0A0A0A`) to frame important content.
- **Do** use gold sparingly as an "accent," not a "paint."

### Don't
- **Don't** use standard blue/green for success/info states; use Gold for everything positive.
- **Don't** use 100% opaque, high-contrast borders. It breaks the "Monolith" illusion.
- **Don't** use rounded corners above `0.5rem`. This system is sharp, precise, and masculine.
- **Don't** use generic icon libraries. Use thin-stroke, high-detail icons that match the `primary` color weight.