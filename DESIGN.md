# DESIGN.md — Agent Skill Design System Contract

> **This file is the absolute source of truth.** Any component, page, or fragment generated, reviewed, or modified by the Agent MUST conform to every rule below. If a requested change conflicts with this document, the Agent must flag the conflict instead of silently overriding a token or pattern. No token, spacing value, radius, or color may be invented ad hoc — pull only from what is declared here.

---

## 0. FRONTMATTER / DESIGN TOKENS

```yaml
skill:
  name: reconstruction-platform
  domain: "multi-role marketplace for post-war reconstruction in Syria"
  tech_stack:
    framework: "Vite 7 + React 19 + React Router v7"
    styling: "Tailwind CSS v4 (@theme directive in globals.css)"
    components: "shadcn/ui (radix-nova style, Radix Primitives)"
    icons: "lucide-react + react-icons"
    motion: "Framer Motion (micro-interactions, scroll reveals, page transitions)"
    state: "Zustand (client) + TanStack React Query (server)"
    forms: "React Hook Form + Zod"
    i18n: "i18next + react-i18next (Arabic primary, English secondary, full RTL support)"
    maps: "Leaflet + React-Leaflet"
    3d: "Three.js via React Three Fiber + Drei"
  brand_vibe: >
    Professional, trustworthy, clean. A light-mode-first construction/reconstruction
    marketplace. Teal primary conveys reliability and growth. Emerald and gold accents
    add warmth. White cards on warm-gray backgrounds with subtle shadows. Arabic-first
    typography with Noto Kufi Arabic. Not corporate SaaS — grounded, practical, builder-native.

tokens:
  color:
    background: "hsl(0 20% 96%)"          # warm light gray page canvas (~#f4f2ef)
    foreground: "hsl(220 20% 20%)"         # dark gray text (~#2b2d35)
    card: "#ffffff"                         # white card surfaces
    card-foreground: "hsl(220 20% 20%)"    # same as foreground
    border: "hsl(220 10% 85%)"             # light gray borders (~#d4d6db)
    muted: "hsl(220 10% 92%)"              # light gray backgrounds
    muted-foreground: "hsl(220 10% 50%)"   # medium gray secondary text
    primary: "hsl(170.46 100% 19.54%)"     # dark teal — main brand color
    primary-foreground: "#ffffff"           # white text on primary
    primary-hover: "#054239"               # darker teal for hover
    primary-hover-two: "#428177"           # medium teal for secondary hover
    secondary: "#ffffff"                   # white
    secondary-hover: "#b9a779"             # muted gold
    secondary-hover-two: "#edebe07e"       # light beige translucent
    emerald: "hsl(160 84% 39%)"            # emerald green accent
    emerald-soft: "hsl(160 84% 95%)"       # very light emerald for surfaces
    slate: "hsl(215 25% 27%)"              # dark blue-gray
    gold: "hsl(38 92% 50%)"               # gold/amber accent
    destructive: "hsl(0 75% 50%)"          # red for errors/destructive actions
    destructive-foreground: "#ffffff"
    success: "hsl(145 60% 40%)"            # green for success states
    success-foreground: "#ffffff"
    warning: "hsl(38 92% 50%)"             # gold/amber for warnings
    warning-foreground: "hsl(215 30% 15%)"
    # Dark mode tokens (exist but NOT actively used — no dark mode toggle)
    primary-dark: "#161616"
    primary-dark-hover: "#2d2a3b"
    primary-dark-hover-two: "#ffffff"
  gradient:
    primary: "linear-gradient(135deg, hsl(170.46 100% 19.54% / 89%) 0%, hsl(170.46 100% 35%) 100%)"
    emerald: "linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(160 84% 29%) 100%)"
    accent: "linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(170.46 100% 25%) 100%)"
    hero: "linear-gradient(135deg, hsl(170.46 100% 19.54% / 89%) 5%, hsl(170.46 100% 19.54%) 60%, hsl(136.23 100% 89.53%) 140%)"
  radius:
    sm: "0.125rem"    # 2px — checkboxes, small chips
    md: "0.25rem"     # 4px — inputs, buttons
    lg: "0.5rem"      # 8px — cards, modals, dropdowns
  shadow:
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
    accent: "0 0 0 3px hsl(160 84% 39% / 0.15)"
  spacing_unit: "4px"
  typography:
    font_family:
      primary: "'Noto Kufi Arabic', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      # Noto Kufi Arabic is loaded with all 9 weights (100–900) via @font-face
      # Additional bundled fonts (not primary): Noto Sans, Playpen Sans Arabic
    weight:
      thin: 100
      extralight: 200
      light: 300
      regular: 400
      medium: 500
      semibold: 600
      bold: 700
      extrabold: 800
      black: 900
    # Arabic-first: all body text defaults to Noto Kufi Arabic
    # English text inherits the same font — no separate Latin font face loaded
  motion:
    duration_fast: "120ms"
    duration_base: "200ms"
    duration_smooth: "250ms"
    duration_slow: "320ms"
    easing: "cubic-bezier(0.4, 0, 0.2, 1)"  # ease-in-out for transitions
    easing_spring: "cubic-bezier(0.16, 1, 0.3, 1)"  # for enter/hover transitions
  animation:
    fade_in: "fade-in 2.5s ease-in-out"
    infinite_loop: "infinit-loop 16s ease-in-out infinite"
```

---

## 1. VISUAL PHILOSOPHY & IDENTITY

### 1.1 Mode: Light-First

This application is **light mode only**. No dark mode toggle exists. All design decisions assume light backgrounds with dark text.

- Page background: warm light gray (`background` token)
- Card/panel surfaces: white (`card` token)
- Text: dark gray (`foreground` token)
- Borders: light gray (`border` token)

### 1.2 Typographic Scale

| Token | Usage |
|---|---|
| `text-4xl` / `text-5xl` | Hero headings on landing page |
| `text-2xl` / `text-3xl` | Section headers |
| `text-xl` | Card titles, modal headers |
| `text-lg` | Card subtitles, panel labels |
| `text-base` (16px) | Default body copy |
| `text-sm` (14px) | Helper text, table cells |
| `text-xs` (12px) | Badges, timestamps, metadata |

- **Primary font**: Noto Kufi Arabic — an Arabic-first geometric sans-serif. Used for ALL text.
- **RTL support**: Full Arabic/English switching via i18next. Layout flips via `dir="rtl"` / `dir="ltr"`.
- Body text color: `foreground` token. Muted text: `muted-foreground` token.
- Never use font sizes outside Tailwind's default scale.

### 1.3 Spacing Rhythm — 4px Grid

- **Base unit = 4px.** Every margin, padding, gap, and offset must resolve to `n × 4px`.
- **Component-internal padding** uses `p-2` (8px), `p-3` (12px), `p-4` (16px), `p-6` (24px).
- **Section-level spacing**: `py-12` (48px), `py-16` (64px), `py-24` (96px).
- **Icon-to-label gap** inside buttons/badges: `gap-2` (8px).

### 1.4 Accessibility Constraints (non-negotiable)

- **Text contrast:** body text on `background` or `card` must meet **WCAG AA (4.5:1)** minimum.
- **Focus visibility:** every interactive element MUST have a visible focus style (`focus-visible:ring-2` with `ring-accent` color).
- **Touch targets:** minimum 40×40px hit area for icon buttons.
- **Motion:** respect `prefers-reduced-motion`.
- **RTL:** all components must work in both LTR and RTL layouts. Use logical properties (`ms-*`, `me-*`, `ps-*`, `pe-*`) where possible.

### 1.5 Hard Anti-Patterns — the Agent must NEVER

1. **No dark mode assumptions** — do not add `dark:` variants unless explicitly requested. The app has no dark mode.
2. **No arbitrary Tailwind values** (`p-[17px]`, `text-[15.3px]`) unless replicating a fixed external asset — always resolve to the nearest token/scale step.
3. **No pure black (`#000`) or pure white (`#FFF`)** for text — always use `foreground`/`card-foreground` tokens for correct contrast.
4. **No emoji as functional UI icons** — use `lucide-react` or `react-icons` exclusively.
5. **No generic placeholder text** — use realistic Arabic or English content relevant to reconstruction/construction.
6. **No inline styles for colors** — always use Tailwind classes mapped to theme tokens.
7. **No mixing of the two Button systems** without understanding context:
   - `src/components/ui/button.tsx` (shadcn) — for app pages (MarketPlace, forms, dashboards)
   - `src/components/inputs/Button.tsx` (custom) — for landing page and marketing sections
8. **No font-family overrides** — Noto Kufi Arabic is the single font for all text. Do not introduce Inter, Roboto, or other Latin fonts.
9. **No gradients on functional UI elements** — gradients are reserved for hero sections, marketing backgrounds, and CTA buttons. Cards, inputs, and nav use flat colors.
10. **No center-aligned body copy** — body text is always left-aligned (LTR) or right-aligned (RTL). Only hero/marketing headlines may be centered.

---

## 2. COMPONENT SPECIFICATIONS & INTERACTION STATES

### 2.1 Navigation Bar

- Container: `bg-white shadow-sm`, full-width, sticky top.
- Active nav item: `bg-primary text-white` with `rounded-md`.
- Inactive nav item: `text-foreground hover:bg-primary/50 hover:text-white`.
- Logo: left-aligned (LTR) / right-aligned (RTL).
- Language toggle: present in navbar, switches between Arabic and English.
- Mobile: collapses to hamburger menu with slide-out sheet.

### 2.2 Buttons

#### shadcn Button (`src/components/ui/button.tsx`)

| Variant | Default | Hover | Disabled |
|---|---|---|---|
| **default** | bg `primary`, text `primary-foreground` | bg `primary-hover` | opacity-50, pointer-events-none |
| **destructive** | bg `destructive`, text `destructive-foreground` | bg `destructive/90` | opacity-50 |
| **outline** | border `border-gray-300`, bg white, text `foreground` | bg `primary`, text white | opacity-50 |
| **secondary** | bg `secondary`, text `secondary-foreground` | bg `secondary/80` | opacity-50 |
| **ghost** | transparent, text `foreground` | bg `muted` | opacity-50 |
| **link** | text `primary`, underline-offset-4 | underline | opacity-50 |
| **accent** | gradient-accent, text white, with glow shadow | shadow-accent-glow, -translate-y-0.5 | opacity-50 |
| **hero** | gradient-primary, text white, with elegant shadow | shadow-elegant, -translate-y-0.5 | opacity-50 |

Sizes: `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10).

#### Custom Button (`src/components/inputs/Button.tsx`)

| Variant | Styling |
|---|---|
| **solid** | `bg-primary text-primary-foreground` |
| **outline** | `border border-primary text-primary` |
| **secondary** | `bg-secondary text-foreground` |
| **primary** | gradient-primary with brand tokens |

### 2.3 Cards

- Background: `bg-white` (card token).
- Border: `border border-gray-300` or `border-border`.
- Shadow: `shadow-card`.
- Radius: `rounded-lg` (8px).
- Internal padding: `p-4` to `p-6` depending on card size.
- KPI cards (`KpiCard.tsx`): icon + value + label layout, often with colored left border accent.

### 2.4 Form Inputs

| State | Border | Background | Ring |
|---|---|---|---|
| **Default** | 1px `border` | `card` (white) | none |
| **Hover** | 1px `muted-foreground` | `card` | none |
| **Focus** | 1px `primary` | `card` | 2px `primary` @ 15% opacity, offset-2 |
| **Error** | 1px `destructive` | `destructive` @ 5% mixed into white | 2px `destructive` @ 15% opacity |
| **Disabled** | 1px `border` @ 50% | `muted` | none |

Input radius: `rounded-md` (4px), height `h-10` or `h-11`.

### 2.5 Badges / Tags / Chips

- Radius: `rounded-full` (pill shape).
- Padding: `px-2.5 py-1`.
- Font: `text-xs font-medium`.
- Semantic badges: bg `success`/`warning`/`destructive` @ 10% opacity, text matching semantic color.
- Neutral badges: bg `muted`, text `muted-foreground`.

### 2.6 Tables

- Header: `bg-muted` or `bg-gray-300`.
- Rows: `border-b border-gray-300`.
- Row hover: `hover:bg-muted/50`.
- Mobile: tables collapse to stacked card rows (each row becomes a card with label/value pairs).
- RTL-aware: table component handles direction switching.

### 2.7 Modals / Sheets

- Overlay: `overlay-black` utility (fixed, `rgba(0,0,0,0.65)`, z-50).
- Content: `bg-white rounded-lg shadow-lg`.
- Sheet: slides from left (LTR) or right (RTL).
- Always include `SheetTitle` / `DialogTitle` for accessibility.

---

## 3. RESPONSIVE & LAYOUT CONSTRAINTS

### 3.1 Breakpoints (Tailwind defaults)

| Token | Min-width | Behavior |
|---|---|---|
| `base` (mobile) | 0px | Single column, `px-4` gutter |
| `sm` | 640px | 2-column grids possible |
| `md` | 768px | Tables visible, 4-column grids |
| `lg` | 1024px | Full layout, 8-column grids |
| `xl` | 1280px | Max content width, 12-column grids |

### 3.2 Page Shell

- Main layout: `bg-background text-slate-950`, centered content with `max-w-380` (for app pages).
- Landing page: full-width, no max-width constraint.
- Auth layout: split — decorative image left (LTR) / form right, `bg-primary` outer shell.

### 3.3 Dense Data Layouts

- Below `md`: tables → stacked card rows with `flex flex-col gap-1`.
- `md`+: real `<table>` or CSS grid with sticky first column for row identifiers.
- Dynamic input rows: `grid grid-cols-[1fr_1fr_auto] gap-3` on `md+`, `flex flex-col gap-2` below `md`.

### 3.4 Vertical Rhythm

- Hero → Section gap: `py-16` mobile / `py-24` desktop.
- Card grid gap: `gap-4` mobile / `gap-6` desktop.
- Never collapse section padding below `py-12`.

---

## 4. GRADIENTS & DECORATIVE ELEMENTS

### 4.1 Gradient Usage Rules

Gradients are defined as CSS custom properties and exposed as utility classes:

| Class | Gradient |
|---|---|
| `gradient-primary` / `bg-gradient-primary` | Teal gradient (135deg) |
| `gradient-accent` / `bg-gradient-accent` | Emerald → Teal (135deg) |
| `bg-gradient-emerald` | Emerald gradient (135deg) |
| `gradient-hero` | Teal → light green (135deg) |

- **Allowed on:** hero sections, CTA buttons (`accent`/`hero` variants), marketing backgrounds, landing page feature sections.
- **NOT allowed on:** cards, inputs, nav, tables, functional UI chrome.

### 4.2 Shadows

| Class | Shadow |
|---|---|
| `shadow-card` | Subtle card lift (default for all cards) |
| `shadow-lg` / `shadow-elegant` | Elevated panels, modals |
| `shadow-accent-glow` | Focus/hover ring glow (emerald, 15% opacity) |

- No `shadow-2xl`, no colored shadows beyond `shadow-accent`.
- Cards use `shadow-card` by default. Elevated elements use `shadow-lg`.

### 4.3 Overlay

- `.overlay-black`: fixed full-screen dark overlay at 65% opacity, z-50. Used for modal backdrops.

---

## 5. CODESPACE INTEGRATION / COHESION

### 5.1 Tailwind Class Ordering

Classes should be written in this left-to-right sequence:

1. **Layout** — `flex`, `grid`, `absolute`, `relative`, `inset-*`, `z-*`
2. **Sizing** — `w-*`, `h-*`, `min-*`, `max-*`
3. **Spacing** — `p-*`, `px-*`, `py-*`, `m-*`, `gap-*`
4. **Flex/Grid alignment** — `items-*`, `justify-*`, `grid-cols-*`
5. **Typography** — `text-*`, `font-*`, `leading-*`, `tracking-*`
6. **Border** — `border*`, `rounded-*`
7. **Background/Color** — `bg-*`, `text-{color}`
8. **Effects** — `shadow-*`, `opacity-*`
9. **Transitions** — `transition-*`, `duration-*`, `animate-*`
10. **State variants** — `hover:`, `focus-visible:`, `disabled:`, responsive `sm:`/`md:`/`lg:`

### 5.2 Token Consumption Rule

- **Use Tailwind theme tokens** (`bg-primary`, `text-foreground`, `border-border`) whenever possible.
- **Raw hex/Tailwind colors** (`bg-white`, `border-gray-300`, `bg-[#142015]`) are acceptable when tokens don't cover the use case — the project uses both.
- **Gradient utilities** are pre-defined in `globals.css` — use the class names, not inline gradients.
- **Custom utility classes** (`shadow-elegant`, `shadow-accent-glow`, `transition-smooth`, `overlay-black`) are defined in `globals.css` `@layer utilities`.

### 5.3 Component File Cohesion

- shadcn components live in `src/components/ui/` — do not fork shadcn internals.
- Shared variant logic uses `cva` (class-variance-authority).
- Custom components live in `src/components/common/`, `src/components/shared/`, `src/components/inputs/`.
- Feature-specific components live in `src/features/{feature}/components/`.
- All route-level views are in `src/pages/` and are lazy-loaded with `<Suspense>` + `<Loader />`.
- RTL support: use `react-i18next` `useTranslation()` and layout direction from i18n context. The `Table` and `Progress` components have built-in RTL awareness.

### 5.4 Two Button Systems (important)

This project has **two Button components**:

1. **`src/components/ui/button.tsx`** (shadcn) — Used in app pages (dashboards, forms, marketplace). Has 8 variants including `accent` and `hero` with gradient support.
2. **`src/components/inputs/Button.tsx`** (custom) — Used in landing page and marketing sections. Has 4 variants (`solid`, `outline`, `secondary`, `primary`).

When building app pages, use the shadcn Button. When building landing/marketing sections, use the custom Button. Do not mix them within the same visual section.

---

**Document status:** v2.0 — Rewritten to match actual project implementation. Any token change requires updating this file in the same commit as the code change.
