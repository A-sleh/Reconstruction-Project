# DESIGN.md — Agent Skill Design System Contract

> **This file is the absolute source of truth.** Any component, page, or fragment generated, reviewed, or modified by the Agent MUST conform to every rule below. If a requested change conflicts with this document, the Agent must flag the conflict instead of silently overriding a token or pattern. No token, spacing value, radius, or color may be invented ad hoc — pull only from what is declared here.

---

## 0. FRONTMATTER / DESIGN TOKENS

```yaml
skill:
  name: identity-community-platform
  domain: "dark-mode identity / avatar / community product"
  tech_stack:
    framework: "Next.js 15 (App Router, RSC by default, 'use client' only for interactive leaves)"
    styling: "Tailwind CSS v4"
    components: "shadcn/ui (Radix Primitives underneath)"
    icons: "lucide-react"
    motion: "Framer Motion (micro-interactions only, never for layout)"
  brand_vibe: >
    High-contrast near-black canvas, confident geometric sans type,
    single acid-lime accent used sparingly as the "action" color,
    saturated gradient avatar/identity cards as the only place color
    is allowed to run wild. Product feels premium, playful-but-controlled,
    community-native — not corporate SaaS, not neon-cyberpunk.

tokens:
  color:
    canvas:
      base: "#0A0A0C"        # page background
      elevated: "#131316"    # cards, panels, nav pill
      overlay: "#1C1C20"     # modals, popovers, dropdown surfaces
      border: "#2A2A2E"      # 1px hairlines on dark surfaces
    ink:
      primary: "#F5F5F7"     # headings, primary text
      secondary: "#A1A1AA"   # body copy, descriptions
      tertiary: "#6B6B70"    # placeholders, disabled text, timestamps
      inverse: "#0A0A0C"     # text placed on light/accent surfaces
    brand:
      primary: "#D7FF3D"     # lime — CTAs, active states, focus accents
      primary-ink: "#0A0A0C" # text/icon color when placed ON primary
      secondary: "#2DD4BF"   # teal — tags, secondary badges (e.g. "Robert" pill)
      secondary-ink: "#0A0A0C"
    identity-gradients:      # RESERVED exclusively for avatar/persona cards — never for UI chrome
      violet: ["#8E7CFF", "#5B4FD6"]
      coral:  ["#FF6B7A", "#E23A57"]
      teal:   ["#22D3C9", "#0E8E86"]
      lime:   ["#B8F24C", "#7BC62D"]
      indigo: ["#5B6EF5", "#2F3BB8"]
    semantic:
      success: "#22C55E"
      success-surface: "#123821"
      warning: "#F5A623"
      warning-surface: "#3A2A0C"
      error: "#F0435C"
      error-surface: "#3A1420"
      info: "#3AA0FF"
      info-surface: "#0F2438"
  radius:
    xs: "6px"     # checkboxes, small chips
    sm: "10px"    # inputs, buttons (default)
    md: "16px"    # cards, dropdowns, modals
    lg: "28px"    # hero panels, avatar/identity cards
    pill: "9999px" # nav container, badge pills, primary CTA buttons
  shadow:
    ambient: "0 1px 2px rgba(0,0,0,0.4)"
    raised: "0 8px 24px -8px rgba(0,0,0,0.6)"
    glow-brand: "0 0 0 4px rgba(215,255,61,0.15)"   # focus/hover halo on lime elements
  spacing_unit: "4px"   # ALL spacing must be a multiple of this — see §1.2
  typography:
    font_family:
      display: "'General Sans', 'Inter', ui-sans-serif, system-ui, sans-serif"
      body: "'Inter', ui-sans-serif, system-ui, sans-serif"
      mono: "'JetBrains Mono', ui-monospace, monospace"
    weight:
      regular: 400
      medium: 500
      semibold: 600
      bold: 700
    accent_treatment: >
      A single lowercase italic display letter (e.g. the swash "c" in
      "Connect") may be used ONCE per hero/page as a brand signature.
      Never repeat this treatment inside product UI, cards, or body copy.
  motion:
    duration_fast: "120ms"
    duration_base: "200ms"
    duration_slow: "320ms"
    easing: "cubic-bezier(0.16, 1, 0.3, 1)"   # ease-out-expo, use for all enter/hover transitions
```

---

## 1. VISUAL PHILOSOPHY & IDENTITY

### 1.1 Typographic Scale (locked — do not interpolate new sizes)

| Token | Size / Line-height | Weight | Usage |
|---|---|---|---|
| `text-display-xl` | 56px / 60px | 700 | Hero H1 only |
| `text-display-lg` | 40px / 44px | 700 | Section headers |
| `text-title` | 24px / 32px | 600 | Card titles, modal headers |
| `text-subtitle` | 18px / 26px | 500 | Card subtitles, panel labels |
| `text-body` | 15px / 22px | 400 | Default UI copy |
| `text-body-sm` | 13px / 18px | 400 | Helper text, table cells |
| `text-caption` | 12px / 16px | 500 | Badges, timestamps, metadata (often uppercase, +0.02em tracking) |

Rule: never generate a font-size outside this table. If a design brief implies "slightly smaller," round to the nearest defined token — do not compute `14.5px`.

### 1.2 Spacing Rhythm — 4px Grid

- **Base unit = 4px.** Every margin, padding, gap, and offset must resolve to `n × 4px` (Tailwind's default scale already enforces this: `p-1`=4px … `p-6`=24px … `p-8`=32px).
- **Component-internal padding** uses the 8px sub-rhythm (`p-2`, `p-3`, `p-4`) — never `p-2.5` or arbitrary values like `p-[13px]`.
- **Section-level spacing** (between major blocks) uses the 8px multiple of 8 rhythm: 32px / 48px / 64px / 96px.
- **Icon-to-label gap** inside buttons/badges is fixed at `gap-2` (8px). Never `gap-1` or `gap-3` for this pairing.

### 1.3 Accessibility Constraints (non-negotiable)

- **Text contrast:** body/caption text on `canvas.base` or `canvas.elevated` must meet **WCAG AA (4.5:1)** minimum; primary headings target **AAA (7:1)** where feasible given `ink.primary` on `canvas.base` (already ~15:1 — safe).
- **Brand lime (`#D7FF3D`) is never used as a text color on dark canvas for body copy** — it fails ink-on-ink legibility at small sizes. Lime is a **surface/border/icon** color only, or text color when the ink is `primary-ink` (dark) on a lime surface.
- **Focus visibility:** every interactive element MUST have a non-removable `focus-visible` ring (see §2). `outline: none` without a replacement focus style is a hard build failure.
- **Touch targets:** minimum 40×40px hit area for icon buttons, even if the visual glyph is smaller (pad with invisible hit-slop).
- **Motion:** respect `prefers-reduced-motion` — all Framer Motion transitions must degrade to instant/opacity-only.

### 1.4 Hard Anti-Patterns — the Agent must NEVER

1. **No decorative gradients on UI chrome** (buttons, inputs, nav, sidebars). Gradients are reserved exclusively for `identity-gradients` avatar/persona cards.
2. **No arbitrary Tailwind values** (`p-[17px]`, `text-[15.3px]`, `w-[342px]`) unless replicating a fixed external asset (e.g., a logo mark) — always resolve to the nearest token/scale step.
3. **No drop-shadows on flat UI surfaces** outside the two defined shadow tokens (`ambient`, `raised`). No `shadow-2xl`, no colored glows except `glow-brand` on focus.
4. **No mixed border-radius within a single component** (e.g., a card with `rounded-tl-lg rounded-br-sm`) — radius must be uniform per component per §0 radius tokens.
5. **No pure black (`#000`) or pure white (`#FFF`)** anywhere — always route through `canvas`/`ink` tokens for correct dark-mode contrast behavior.
6. **No more than one accent color per interactive element.** A button is lime OR teal OR neutral — never a lime border with a teal icon.
7. **No system default focus rings, no removed focus states.**
8. **No centered body paragraphs.** Body copy is always left-aligned; only hero/marketing headlines may be centered.
9. **No emoji as functional UI icons** — use `lucide-react` exclusively for iconography.
10. **No skeuomorphic textures, noise overlays, or glassmorphism blur** unless explicitly specified for a modal scrim (`backdrop-blur-sm` max).

---

## 2. COMPONENT SPECIFICATIONS & INTERACTION STATES

### 2.1 Navigation Pill (top bar)

- Container: `canvas.elevated` surface, `radius.pill`, horizontal padding `px-2`, vertical `py-1.5`, sits centered atop `canvas.base`.
- Active nav item: `canvas.overlay` background pill behind the label, `ink.primary` text.
- Inactive nav item: transparent background, `ink.secondary` text; hover → `ink.primary` text + `canvas.overlay` background at 60% opacity, `duration_fast` transition.
- Primary CTA (e.g., "Contact"): `ink.primary` background / `ink.inverse` text, `radius.pill`, never lime (lime is reserved for the single strongest action on a page, e.g. "Get Started").

### 2.2 Buttons

| Variant | Default | Hover | Focus-visible | Disabled |
|---|---|---|---|---|
| **Primary (lime)** | bg `brand.primary`, text `brand.primary-ink`, `radius.pill` | bg darken 8% (`#C4EB2E`), `duration_fast` | 2px ring `brand.primary` at 40% opacity offset 2px (`glow-brand`) | bg `canvas.overlay`, text `ink.tertiary`, `cursor-not-allowed`, no hover transform |
| **Secondary (outline)** | 1px border `canvas.border`, transparent bg, text `ink.primary` | border → `ink.secondary`, bg `canvas.elevated` | ring `2px` `brand.primary` offset 2px | border `canvas.border` at 40%, text `ink.tertiary` |
| **Ghost** | transparent, text `ink.secondary` | text `ink.primary`, bg `canvas.elevated` | ring `2px` `brand.primary` offset 2px | text `ink.tertiary`, no hover |
| **Destructive** | bg `error.surface`, text `error`, 1px border `error` at 30% | bg `error` at 15% opacity | ring `2px` `error` offset 2px | text `ink.tertiary`, border `canvas.border` |

All buttons: `h-10` default / `h-9` small / `h-11` large. Icon-only buttons are always square (`aspect-square`) at those same heights.

### 2.3 Identity / Avatar Card (the signature component)

- Base shape: `radius.lg` (28px), full-bleed gradient fill from `identity-gradients`, `p-6` internal padding, `aspect-[3/4]` on desktop, stacks to `aspect-square` on mobile.
- Card title: `text-title`, `ink.primary` (gradients are dark/saturated enough to guarantee AA — verify programmatically per gradient pair).
- Card subtitle: `text-body-sm`, `ink.primary` at 75% opacity.
- Fan/carousel layout (as in reference): sibling cards rotate ±6°/±3° with `translateY` offset, center card scales `1.0`, side cards `0.92`, using `duration_slow` ease on hover-to-focus swap. Only the **center card** may host a floating CTA badge.
- Floating name-tag badges (e.g., "Robert", "Clarissa"): `radius.pill`, `px-3 py-1.5`, `text-caption` weight 600, background is a **solid** semantic or secondary token (never a gradient), small triangular pointer anchored via CSS `clip-path`, never an image asset.

### 2.4 Form Inputs — State Matrix

| State | Border | Background | Ring | Notes |
|---|---|---|---|---|
| **Default** | 1px `canvas.border` | `canvas.elevated` | none | placeholder text = `ink.tertiary` |
| **Hover** | 1px `ink.tertiary` | `canvas.elevated` | none | `duration_fast` |
| **Focus** | 1px `brand.primary` | `canvas.elevated` | `2px` `brand.primary` @ 25% opacity, `offset-2` | label (if floating) transitions to `text-caption` above field |
| **Filled/Valid** | 1px `canvas.border` | `canvas.elevated` | none | optional small `success` check icon, right-aligned |
| **Error** | 1px `error` | `error.surface` @ 8% mixed into `canvas.elevated` | `2px` `error` @ 25% opacity | helper text below field switches to `error` color, `text-body-sm`, prefixed with alert icon |
| **Disabled** | 1px `canvas.border` @ 50% | `canvas.overlay` | none | text + placeholder `ink.tertiary`, `cursor-not-allowed`, no hover/focus transitions fire |

Input radius: `radius.sm` (10px), height `h-10`, horizontal padding `px-3.5`. Never mix pill-radius inputs with rectangular buttons in the same form row.

### 2.5 Badges / Tags / Chips

- `radius.pill`, `px-2.5 py-1`, `text-caption`.
- Semantic badges (status): background = `{semantic}.surface`, text = `{semantic}`, 1px border `{semantic}` @ 20%.
- Neutral badges: background `canvas.overlay`, text `ink.secondary`.
- Never use `identity-gradients` on functional status badges — gradients communicate "persona," not "state."

---

## 3. RESPONSIVE & LAYOUT CONSTRAINTS

### 3.1 Breakpoints (Tailwind defaults — do not redefine)

| Token | Min-width | Container max-width | Grid columns (default) |
|---|---|---|---|
| `base` (mobile) | 0px | 100%, `px-4` gutter | 1 |
| `sm` | 640px | 100%, `px-6` gutter | 2 |
| `md` | 768px | 720px | 4 |
| `lg` | 1024px | 960px | 8 |
| `xl` | 1280px | 1152px | 12 |
| `2xl` | 1536px | 1320px | 12 |

Page shell always: `mx-auto w-full max-w-[var(--container)] px-4 sm:px-6 lg:px-8`.

### 3.2 Dense Data Layouts (tables, dynamic input rows)

- Below `md`: tables collapse to **stacked card rows** — each row becomes a `canvas.elevated` card, `radius.md`, with label/value pairs stacked vertically (`flex flex-col gap-1`). Never force horizontal scroll on primary data at mobile width as a first resort; horizontal scroll is the fallback only for ≥6-column dense grids explicitly marked `data-dense="true"`.
- `md`–`lg`: table reverts to a real `<table>` or CSS grid with a fixed first column (`sticky left-0`) for row identifiers when >5 columns.
- Dynamic/repeatable input rows (e.g., "add another field"): each row is a `grid grid-cols-[1fr_1fr_auto] gap-3 items-start` on `md+`, collapsing to `flex flex-col gap-2` below `md`. The trailing `auto` column is always the remove/drag-handle icon button — fixed width `w-10`, never reflowed into the stack.
- Row-add action is always a `Ghost` button, left-aligned, icon-leading, positioned directly under the last row with `mt-2`.

### 3.3 Identity Card Fan/Grid

- `base`–`sm`: single card, swipeable carousel (no fan rotation — rotation transforms are disabled below `sm` for touch legibility).
- `md+`: fan layout re-enables, max 5 visible cards, center-anchored, overflow cards clipped at container edge with `overflow-visible` on the row and `mask-image` fade at the container's outer 10%.

### 3.4 Vertical Rhythm Between Sections

Hero → Section gap: `py-24` desktop / `py-16` mobile. Card-grid → Card-grid gap: `gap-6` desktop / `gap-4` mobile. Never collapse section padding below `py-12` regardless of viewport.

---

## 4. CODESPACE INTEGRATION / COHESION

### 4.1 Tailwind Class Ordering (enforced, not stylistic preference)

Classes must always be written in this exact left-to-right sequence. A linter/formatter (e.g., `prettier-plugin-tailwindcss`) should be configured to auto-sort, but the Agent must author in this order by default so diffs stay clean pre-format:

1. **Layout** — `flex`, `grid`, `block`, `absolute`, `relative`, `inset-*`, `z-*`
2. **Sizing** — `w-*`, `h-*`, `min-*`, `max-*`, `aspect-*`
3. **Spacing** — `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`, `space-x-*`/`space-y-*`
4. **Flex/Grid alignment** — `items-*`, `justify-*`, `grid-cols-*`, `flex-*`
5. **Typography** — `text-*`, `font-*`, `leading-*`, `tracking-*`
6. **Border** — `border*`, `rounded-*`, `divide-*`
7. **Background/Color** — `bg-*`, `text-{color}`, `fill-*`, `stroke-*`
8. **Effects** — `shadow-*`, `opacity-*`, `blur-*`, `backdrop-*`
9. **Transitions/Animation** — `transition-*`, `duration-*`, `ease-*`, `animate-*`
10. **State variants last, grouped by prefix** — all `hover:`, then all `focus-visible:`, then all `disabled:`, then all `sm:`/`md:`/`lg:` responsive variants, in that fixed order.

```tsx
// CORRECT ordering example
<button className="flex items-center justify-center gap-2 h-10 px-4 rounded-pill text-body font-medium bg-brand-primary text-brand-primary-ink shadow-ambient transition-colors duration-fast hover:bg-[#C4EB2E] focus-visible:ring-2 focus-visible:ring-brand-primary/40 disabled:bg-canvas-overlay disabled:text-ink-tertiary">
```

### 4.2 Token Consumption Rule

- **Never hardcode hex values in component files.** All colors resolve through Tailwind theme extensions mapped 1:1 to §0 tokens (e.g., `bg-canvas-base`, `text-ink-secondary`, `border-canvas-border`). If a required color isn't in `tailwind.config`, the Agent must add it to the config's `theme.extend` block first — it may never inline `bg-[#0A0A0C]`.
- `identity-gradients` are implemented as named utility classes (`.gradient-violet`, `.gradient-coral`, etc.) defined once in `globals.css`, not regenerated inline per component.

### 4.3 Component File Cohesion

- Every new component under `/components/ui/` that wraps a shadcn primitive must preserve the primitive's `data-slot`/`asChild` API — no forking shadcn internals.
- Shared variant logic uses `cva` (class-variance-authority); the Agent must extend existing `cva` variant maps rather than creating parallel one-off variant unions.
- Any new component must be accompanied by a Storybook/preview entry (or equivalent route in `/app/(preview)/`) demonstrating all states from §2's state matrices — a component without documented Default/Hover/Focus/Disabled/Error states is considered incomplete.
- Before merging, the Agent self-checks against §1.4 Anti-Patterns as a literal checklist — each of the 10 items gets an explicit pass/fail, not a general "looks fine."

---

**Document status:** locked v1.0. Any token change requires updating this file in the same commit as the code change — the two must never drift.