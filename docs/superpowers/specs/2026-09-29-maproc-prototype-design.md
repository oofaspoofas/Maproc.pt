# Maproc.pt redesign — prototype design

Date: 2026-09-29 · Status: prototype build authorised 2026-09-30; implemented, awaiting visual feedback.

Implementation decisions and validation: `docs/BUILD-LOG.md`. Content parity and launch blockers: `docs/REVIEW.md`. The implementation uses custom components without shadcn, as the implementation plan specifies.

## Goal
A design prototype of a tasteful, dynamic redesign of maproc.pt: cinematic and polished (inspired by the
scroll-world aesthetic) without making scroll-scrubbed video the core. Content stays faithful to the current site
(see CLAUDE.md). No invented specs, prices, models or claims. Portuguese (pt-PT) only.

## Scope
In: homepage (`/`) and one product page (`/portfolios/maquinas-corte-laser/`, Bystronic fibre lasers).
Out: other product pages, About/Contact pages, newsletter, real form backend, CMS, i18n, deployment cut-over.
Success: both pages render responsively at desktop and mobile widths, match the visual direction below, contain only
source-derived content, and pass the Playwright checks in "Verification".

## Stack and structure (assumption: Next.js is the leading candidate in CLAUDE.md; confirmed for the prototype only)
- Next.js (App Router), TypeScript, Tailwind, shadcn. Local prototype; Vercel preview only if requested.
- Routes: `/` and `/portfolios/maquinas-corte-laser/` (old URL kept for SEO mapping).
- Content: typed loaders read `data/content/*.json` and `products.json`. `data/raw/` is never edited; no invented copy.
- Images: only assets already in `data/assets/`, served via `next/image` (WebP/AVIF). Excluded: broken images
  (`2024/05/sobrenos.jpg`, `2024/03/cortealaser.jpg`), theme-demo imagery, hot-linked template icons. The Bystronic logo
  is unavailable (source URL returns 401) so it gets a clearly marked placeholder.
- Design tokens: navy and orange sampled from `data/assets/maproc/logo1.png` into CSS variables; two token sets
  (dark, light) for the hybrid theme.
- One component per section (`Hero`, `ValueProps`, `BrandStory`, `ProductGrid`, `PartnerStrip`, `ContactSection`, ...).
- Contact form is UI only (no backend, no spam protection); real form work is later.

## Visual direction: hybrid
Dark cinematic sections (hero, value props, about/partners, contact) and light editorial sections (machines, HBD,
product body) so manufacturer photos with white backgrounds sit naturally. Navy surfaces, orange used only as the
accent ("laser line"), large editorial type, generous spacing.

## Homepage
1. Dark hero: "WE SERVE SUCCESS", tagline, two calls to action; the two source YouTube videos as poster + click-to-play.
2. Dark value props: Consultoria pró-ativa, Formação, Máquinas corte a laser, Suporte; reveal on scroll.
3. Dark-to-light brand story: pinned (sticky) heading while Bystronic, LVD, ESAB, Flow, HBD cards scroll past.
   Plain sticky positioning, no video scrubbing.
4. Light machines: "Explore as nossas máquinas" cards and LVD/Flow highlights from `products.json`.
5. Light HBD 3D printers.
6. Dark about blurb and "Representante Oficial" logo strip.
7. Dark contact: details, Helder Ramires card, form UI.

## Bystronic product page
Compact dark hero (brand + title). Light body with one card per model (ByCut Star, ByStar, Smart, Eco, Robot) showing
only published specs. Catalogue links go to the manufacturer; PDFs are not re-hosted. Sticky "Pedir proposta" call to
action linking to the contact section.

## Known source problems and handling
- "PorCut Star" corrected to ByCut Star.
- ByCut Smart sheet size "40,02 x 8,20 pés" shown as published and flagged for the client.
- "mais de 30 anos" vs "mais de 35 anos" and Seg–Sex vs Seg–Sáb hours: one value each, both listed in `REVIEW.md`.
- Missing content (Flow, Voortman, Estrutura Metálica, HBD descriptions) marked as placeholders, not invented.
- Third-party imagery rights (CLAUDE.md issue 10) are listed in `REVIEW.md` for client confirmation.

## Motion and quality
Reveal-on-scroll, hover states, subtle hero parallax; `prefers-reduced-motion` respected. WCAG AA contrast,
responsive. No scroll-scrubbed video (scroll-world optional and out of this prototype).

## Verification
Playwright: screenshots at desktop and mobile widths for both pages, zero console errors, no horizontal overflow,
all images load, key sections present. Results reported honestly, including failures.

## Skills for the build
taste-skill (core, plus redesign-skill and minimalist/soft flavour, brandkit for the palette), vercel:nextjs,
vercel:shadcn, vercel:react-best-practices, then superpowers:writing-plans for the plan.
