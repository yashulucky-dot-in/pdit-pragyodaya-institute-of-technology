# PDIT Home Page — Design Brief

**Aesthetic:** Premium startup SaaS edtech. Clean, confident, conversion-focused. Gradients on text, card elevation hierarchy, alternating section backgrounds.

## Palette

| Token | Value | Purpose |
|-------|-------|---------|
| Primary | 0.498 0.24 264.2 (Indigo #4F46E5) | Brand, CTA, primary hierarchy |
| Secondary | 0.704 0.15 207.7 (Cyan #06B6D4) | Accents, highlights, whisper details |
| Background | 0.985 0.003 264 (Light #F9FAFB) | Default section background |
| Muted | 0.955 0.008 264 | Alternating section background |
| Foreground | 0.145 0.015 264 | Text, dark tones |
| Card | 1 0 0 (White) | Floating card layers |
| Destructive | 0.577 0.245 27.325 (Red) | Error states, warnings |

## Typography

| Layer | Font | Size | Weight |
|-------|------|------|--------|
| Display | Plus Jakarta Sans | 4xl–6xl | 700 |
| Section Heading | Plus Jakarta Sans | 3xl–4xl | 700 |
| Body | Poppins | base–lg | 400–600 |
| Mono | JetBrains Mono | sm–base | 400 |

## Structural Zones

| Zone | Background | Treatment |
|------|------------|-----------|
| Hero | Dark gradient overlay (`gradient-hero`) | Full viewport, centered text, CTA |
| Standard Sections | `bg-background` | White, py-16 md:py-24 |
| Alternate Sections | `bg-muted/30` | Light grey, for visual rhythm |
| Footer | `gradient-footer` (Indigo gradient) | Text white, centered content |

## Section Map

1. **Hero** – Dark gradient, headline, subheadline, CTA. Existing; no changes.
2. **Our Programs** – Course cards with image overlay, course name/desc (price hidden), "Enroll Now" opens popup. Alt bg.
3. **Expert Team** – Circular avatars with role badges, name, title. Standard bg.
4. **Career Growth Roadmap** – Horizontal step indicators (Step 1 → Step 2 → Step 3). Alt bg.
5. **Advantage** – 4 benefit cards (e.g., Job Guarantee, Industry Mentors, Lifetime Access, 100% Placement). Standard bg.
6. **Success Stories** – Testimonial cards with star ratings. Existing; maintain.
7. **Why Choose Us** – Checklist/feature list. Existing; maintain.
8. **Certificates** – Badge/icon cards showing certificate types. Alt bg.
9. **Transform Your Career Today** – Large CTA section with headline and button. Standard bg.
10. **Our Hiring Partners** – Logo grid (6–8 logos in responsive grid). Alt bg.
11. **Tutorials & Learning Hub** – Video card grid with play button icons, title, expert name. Standard bg.
12. **Our Resources** – Resource cards (blog, guide, tool icons). Alt bg.
13. **Alumni at Top Companies** – Video testimonial cards with star rating overlay. Standard bg.
14. **FAQs** – Collapsible accordion items. Alt bg.
15. **Ready to Start Your Journey** – CTA section with counselor image on right, form/button on left. Dark gradient bg.

## Component Patterns

- **Cards:** `rounded-lg`, `shadow-card`, `.card-hover` (lift on hover), white `bg-card`.
- **Buttons:** `.btn-primary` (indigo, rounded-full), `.btn-secondary` (outline indigo), rounded-full, `hover:scale-105`.
- **Headings:** `.heading-display` (Plus Jakarta Sans, bold), `.heading-section` (bold), optional `.text-gradient` or `.underline-accent` cyan whisper.
- **Section spacing:** `.section-padding` (py-16 md:py-24), alternate `.section-alt` (bg-muted/30).
- **Gradients:** `.gradient-primary` (Indigo → Cyan), `.gradient-footer`, `.gradient-hero`.

## Elevation & Depth

- **Card shadow:** `shadow-card` (indigo tint, 0.08 opacity).
- **Hover state:** `shadow-card-hover` (20px blur, indigo + cyan tint).
- **No deep glow:** Maintain clarity; shadows serve depth, not decoration.

## Motion

- `.float-up` — fade-in + translateY(30px), 0.6s ease-out. Use on cards entering viewport.
- `.slide-up` — subtle entry, 0.5s ease-out. Use on text blocks.
- `.pulse-subtle` — 2s ease-in-out infinite, opacity 0.8–1. Use on CTA buttons or live indicators.

## Spacing & Rhythm

- **Horizontal padding:** `px-4 sm:px-6 md:px-8 lg:px-16` (responsive container).
- **Vertical:** py-16 standard, md:py-24 desktop.
- **Grid gutter:** `gap-6 md:gap-8` for card grids.
- **Card padding:** `p-6 md:p-8` inside cards.

## Constraints

- **No raw hex or rgb():** Always use oklch() with CSS variables.
- **Mobile-first:** Design starts at sm, scale to lg.
- **Color hierarchy:** Indigo primary + cyan accent; no tertiary colors.
- **Typography:** Display font (Plus Jakarta Sans) for all headings, Poppins for body. Mono (JetBrains) only for code/stats if needed.
- **Border radius:** Use `--radius` (0.75rem), no sharp corners on cards.

## Signature Detail

Gradient text on major section headings (`.text-gradient` or `.text-gradient-cyan`) to signal premium SaaS aesthetic. Cyan underline whisper (`.underline-accent`) on key terms. Card entrance animations (`.float-up`) create micro-motion on page load. Counselor image in final CTA paired with form grid on left — asymmetric, modern layout.
