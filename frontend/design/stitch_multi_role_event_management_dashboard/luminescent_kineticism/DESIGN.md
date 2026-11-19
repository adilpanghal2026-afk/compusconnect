---
name: Luminescent Kineticism
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#908fa0'
  outline-variant: '#464554'
  surface-tint: '#c0c1ff'
  primary: '#c0c1ff'
  on-primary: '#1000a9'
  primary-container: '#8083ff'
  on-primary-container: '#0d0096'
  inverse-primary: '#494bd6'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4edea3'
  on-tertiary: '#003824'
  tertiary-container: '#00885d'
  on-tertiary-container: '#000703'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style
The design system articulates an aura of high velocity, precision, and modern community energy tailored for collegiate and professional event operations. Designed to evoke the refined focus of developer-first productivity tools combined with the magnetic anticipation of high-production live gatherings, the interface balances executive clarity with vivid social momentum. 

Borrowing architectural cues from modern productivity suites and editorial guest-list experiences, the style centers on crisp structural grids, crystalline translucent overlays, fine 1px slate borders, and energetic kinetic feedback. The emotional tone is authoritative yet dynamic—instilling absolute confidence in institutional organizers while delivering an effortless, discovery-driven experience to attendees.

## Colors
The palette balances deep, light-absorbent slate foundations with vibrant spectral indigo and violet accents. 

- **Primary (`#6366F1`) & Secondary (`#8B5CF6`)**: Provide purposeful luminance across primary triggers, key active navigation points, dynamic timeline indicators, and high-visibility status indicators.
- **Tertiary (`#10B981`)**: Dedicated specifically to positive confirmation states, live attendance capacity thresholds, confirmed registrations, and verified tier check-ins.
- **Neutrals (`#0F172A`)**: Form an orchestrated hierarchy of layered slate surfaces ranging from deep canvas background tones (`#020617` and `#090D16`) to elevated card surfaces (`#0F172A`), delineated with precise hairline boundaries (`#1E293B` and `#334155`).

Text values preserve strict WCAG AAA legibility, maintaining stark optical white titles against subtle cool-slate secondary text strings.

## Typography
The typographic architecture pairs the geometric energy of Plus Jakarta Sans for prominent headers with the neutral, systematic utility of Inter for dense analytical data, listings, and workflows.

Headings leverage tight negative tracking to maintain punch and tension across dense operational dashboards. Body copy utilizes generous relative line heights to preserve swift scanning during high-volume event curation. Labels and status chips utilize condensed uppercase or high-weight medium-size configurations with tracking expanded up to `0.04em` to guarantee instant recognition under low ambient lighting.

## Layout & Spacing
The layout model employs a strict 12-column responsive fluid grid anchored within a maximum boundary of 1440px for desktop workflows, collapsing cleanly to 8 columns on tablet viewports and 4 columns on mobile canvases. 

Vertical cadence aligns to an 8px baseline rhythm. Margins transition from dense `1rem` on mobile boundaries up to `2rem` on wide desktop viewports. Layout elements rely on strict internal padding invariants: cards and actionable trays apply `space-lg` internally, while interactive controls utilize micro-steps (`space-xs` through `space-md`) to ensure pixel-perfect visual balance.

## Elevation & Depth
Visual hierarchy is constructed primarily through dark-spectrum tonal layering supplemented by crisp, hairline boundary articulation rather than muddy drop shadows. 

- **Level 0 (Canvas)**: Deep base canvas (`#030712`) providing the infinite stage background.
- **Level 1 (Card/Container Surfaces)**: Elevated slate surfaces (`#0F172A`) structured with 1px border outlines tinted at 12% opacity (`rgba(255, 255, 255, 0.08)` or `#1E293B`).
- **Level 2 (Dropdowns, Overlays & Popovers)**: Crystalline translucent planes (`rgba(15, 23, 42, 0.85)`) supported by a heavy backdrop blur (`backdrop-blur-md` / 16px blur) and an internal specular hairline ring (`inset 0 1px 0 0 rgba(255, 255, 255, 0.1)`).
- **Ambient Glows**: Reserved purely for active states, key interactive focal points, and live event indicators—implemented via tinted atmospheric glows (`0 0 24px -4px rgba(99, 102, 241, 0.35)`).

## Shapes
Geometry is smooth and contemporary, employing deliberate geometric smoothing. Major containers, modal canvases, feature cards, and metric summary modules adopt `rounded-2xl` (1rem / 16px to 1.5rem / 24px) to establish a sleek visual container language. Secondary elements, inputs, and internal panels scale down to `rounded-lg` (0.5rem / 8px). Micro-elements such as interactive chips, presence indicators, status badges, and dynamic pill filters utilize continuous full radii (`rounded-full`) to clearly signal micro-interactivity.

## Components

### Role Switcher Dropdown (Student / Organizer / Admin)
Integrated into the top navigation bar, the role switcher functions as an elevated identity anchor:
- **Collapsed State**: A sleek slate pill container (`rgba(30, 41, 59, 0.6)`) featuring an active identity dot (green for Student, indigo for Organizer, amber for Admin), the role title in `label-md`, and a subtle chevron icon. Encased with a 1px border (`#334155`).
- **Expanded State**: A floating frosted menu utilizing Level 2 elevation (`backdrop-blur-xl`), displaying available contextual roles with crisp metadata subtitles (e.g., "Active Permissions", "Campus Scope"), checkmark indicators, and subtle violet background selection highlights on hover.

### Action Buttons
- **Vibrant Primary CTA**: Saturated indigo-to-violet linear gradient background (`linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`), crisp white text, subtle specular top inset border (`inset 0 1px 0 rgba(255, 255, 255, 0.25)`), and an external violet ambient shadow on hover.
- **Secondary**: Slate fill (`#1E293B`) with a high-contrast 1px border (`#334155`) transitioning to white text on hover.
- **Ghost / Tertiary**: Transparent base with smooth background tinting (`rgba(99, 102, 241, 0.08)`) on interaction.

### Cards & Event Panels
Constructed at `rounded-2xl` with a slate core (`#0F172A`), enclosed by a razor-thin 1px border (`#1E293B`). Cards support an optional top-edge subtle gradient border bleed to highlight featured campus events. Internal padding is locked to `space-lg`.

### Status Badges & Chips
Ultra-compact, capsule-shaped containers (`rounded-full`) utilizing a tinted background fill at 12% opacity paired with high-contrast, saturated foreground typography:
- **Live / Active**: Emerald background (`rgba(16, 185, 129, 0.12)`) with bright emerald text and a pulsing micro-dot.
- **Upcoming / Registration Open**: Indigo background (`rgba(99, 102, 241, 0.12)`) with vibrant indigo text.
- **Sold Out / Past**: Slate background (`rgba(100, 116, 139, 0.12)`) with neutral text.

### Form Inputs & Selectors
Deep tinted backgrounds (`#090D16`) framed by a 1px slate ring (`#1E293B`). On focus, transitions swiftly via a 150ms ease curve to an indigo perimeter ring (`#6366F1`) backed by an ambient 2px outer glow (`rgba(99, 102, 241, 0.2)`).

### Lists & Activity Feeds
Edge-to-edge structural lists separated by 1px horizontal hairlines (`#1E293B`), featuring interactive row highlights on hover (`rgba(255, 255, 255, 0.02)`), integrated inline badges, and right-aligned action arrays.