# CLAUDE.md — Maproc.pt redesign

## Purpose
Redesign and revamp **https://maproc.pt** (MAPROC — "WE SERVE SUCCESS"), a Portuguese distributor of sheet-metal
processing machinery. The new site must **carry over every product and all information from the current site**, in a
more dynamic, visually appealing build. Nothing from the old site gets dropped silently; if something is intentionally
left out (see "Known source-site issues"), say so.

- Repo: https://github.com/oofaspoofas/Maproc.pt (`origin`, branch `main`). Everything we do is pushed here.
- Primary language of content: **European Portuguese (pt-PT)**. Keep original wording unless asked to rewrite.
- Do not invent specs, prices, model names or claims. Only publish what the source states.

## Status
- [x] Repo initialised, remote connected
- [x] Source site scraped (content, structure, assets) — see "Data" below
- [ ] Stack decision (open — see "Open decisions")
- [ ] Design direction / brand refresh
- [ ] Build

## The source site (as of 2026-09-29)
WordPress + Elementor (theme: "Industrie" by rstheme, demo leftovers throughout), Revolution Slider, Mailster
(newsletter), Complianz (cookies), Yoast SEO, behind Cloudflare (emails are obfuscated in HTML — decoded values below).
WooCommerce is installed but has **0 products**; the catalogue lives in a `portfolios` custom post type (not exposed
via REST) rendered as Elementor pages. The Elementor pages are what must be reproduced.

### Sitemap (pages to carry over)
| Source URL | Content |
|---|---|
| `/` | Home: hero slider (2 YouTube videos), 4 value props (Consultoria pró-ativa, Formação, Máquinas corte a laser, Suporte), about blurb, LVD + Flow highlight cards, "Explore as nossas máquinas" slider, HBD 3D printers, "Representante Oficial" logo strip, contact form |
| `/sobre-maproc/` | About: História / Missão / Visão |
| `/contact/` | Contact + form (math captcha) |
| `/portfolios/maquinas-corte-laser/` | Bystronic fibre lasers |
| `/portfolios/quinadoras-novas/` | LVD press brakes (nav also uses `/portfolios/bystronic-quinadoras/`, which redirects here) |
| `/portfolios/corte-laser-tubo/` | LVD tube laser (nav alias `/portfolios/bystronic-corte-tubo-laser/` redirects here) |
| `/portfolios/esab-maquinas-cnc/` | ESAB CNC cutting |
| `/portfolios/corte-jato-de-agua/` | Flow water jet (page is mostly copy-paste — see issues) |
| `/newsletter/`, `/inscricao-na-newsletter/` | Newsletter signup / unsubscribe (Mailster) |
| `/portfolio-category/corte-a-laser/`, `/portfolio-category/quinadoras/` | Archive templates, no unique content |

Nav: Sobre nós · Chapa (LVD → Corte a Laser, Quinadoras, Corte Tubo a Laser) · ESAB · Flow · Impressão metálica 3D ·
Estrutura Metálica · Voortman · Contactos. (Flow, Impressão metálica 3D, Estrutura Metálica, Voortman are `#` — no pages.)
Socials: facebook.com/maprocessamento · youtube.com/@maprocportugal6805 · instagram.com/maprocessamento/ ·
linkedin.com/company/máquinas-e-processos-para-chapa

### Business facts (verified against the live site)
- **Address:** Gafanha da Nazaré, Praia da Barra, Ílhavo, Aveiro, PORTUGAL
- **Phone (HQ):** +351 234 096 465 · **Email:** comercial@maproc.pt (proposals) · rh@maproc.pt (recruitment)
- **Hours:** Seg–Sex 08:30–20:00 on home, Seg–Sáb 08.30–20.00 on contact page (**conflict — confirm with client**)
- **Sales manager:** Helder Ramires, Gestor Comercial — +351 919 847 589, 08:00–21:00, Portugal / Espanha
- **Brands represented:** Bystronic, LVD, ESAB, Flow, HBD (China, metal 3D printing), Voortman (logo only)
- **Company:** root company founded 1994, Iberian market focus, "mais de 30 anos" in industrial lasers

## Data (all scraped 2026-09-29 — do not hand-edit `raw/`)
```
data/raw/html/          verbatim HTML of every page (source of truth for re-extraction)
data/raw/api/pages.json WordPress REST pages export
data/content/*.md|json  extracted text/images/links per page (widget by widget, document order)
data/content/site.json  nav + footer chrome
data/content/products.json   structured catalogue: 22 products / 5 brands, with per-item notes on source problems
data/content/media-manifest.json   WP media library (637 files; see note)
data/content/image-urls.json       the 41 images actually used by pages
data/assets/maproc/     downloaded first-party images/logos actually used (incl. logo1.png, favicon)
data/assets/third-party/ manufacturer images (Bystronic, LVD, ESAB, Flow, HBD)
data/assets/assets-manifest.json   source URL ↔ local file
```
Re-run: `python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt && .venv/bin/python scripts/extract_content.py`
(re-download HTML first if the live site changed; the scraper used plain `curl`, no Firecrawl — not installed/keyed here).

**Media library note:** 637 files are public via REST (header claimed 683; the rest are not exposed) but only ~45 are real
business content. The remainder is stock from the "Industrie" theme demo (team photos, `about-h*`, `team_img_*`, etc.).
**Do not reuse theme demo imagery** as if it were Maproc content.

## Known source-site issues (do not blindly copy these across)
1. **Flow page has no Flow content.** `/portfolios/corte-jato-de-agua/` is a copy of the ESAB page + Bystronic cards. Flow models
   (Série Mach, Echo Jet, Nano Jet) appear only on the homepage. Needs real content from the client/Flow.
2. **ESAB page contains Bystronic laser cards** (ByCut Star, ByStar, Smart, Eco, Robot) and a "download do catálogo dos modelos
   corte a laser" line — copy-paste leftovers. The ESAB "Shark CS" catalog link points to a Bystronic URL.
3. Only ESAB Combirex CS and Suprarex HDX have working catalog links; Phoenix CS, Crossbow HD, Ergostar EXA have none.
4. **Inconsistencies:** "mais de 30 anos" (home, about) vs "mais de 35 anos" (footer); hours (above); homepage phone shown as
   `234096465` without country code; Bystronic model label typo "PorCut Star" (= ByCut Star); "ByCut Inteligente" vs "BySmart Fibra".
5. **Template leftovers:** About page has "Preços de aço inoxidável e níquel." and a link to `industrie.rstheme.com/main/about/`;
   a homepage arrow icon is hot-linked from `industrie.rstheme.com`. Drop these.
6. **Broken images (404 on the live site):** `2024/05/sobrenos.jpg` (homepage About section), `2024/03/cortealaser.jpg`.
7. Unit oddity: ByCut Smart sheet size published as "40,02 x 8,20 pés" (feet) — almost certainly should be metric; confirm before shipping.
8. Bystronic logo on the laser page is a token-signed URL (`seccdn.smint.io`) that now returns 401 — source a proper logo.
9. HBD images are hot-linked from a Chinese CDN that requires a `Referer: https://maproc.pt/` header; we saved local copies.
10. **Rights:** third-party manufacturer imagery/PDF catalogs are used by Maproc as an authorised reseller. Confirm with the client
    before republishing them under a new design; prefer linking to catalogs over re-hosting PDFs.
11. Contact/newsletter forms use a math-captcha and Mailster; the redesign needs a real form backend + spam protection (e.g. BotID/Turnstile).

## Working conventions
- Preserve content parity first, then improve presentation. Keep a checklist mapping every source page/section → new page/section.
- Accessibility (WCAG AA), responsive, fast (Core Web Vitals) — the old site is heavy (~300 KB HTML/page, Elementor).
- Keep SEO equity: preserve or 301-redirect every old URL above; carry over meta descriptions from `data/content/*.json`.
- Optimise/convert images (WebP/AVIF) at build; keep originals in `data/assets/`.
- No secrets in git. `.env*` is ignored.
- Commit small, descriptive commits on `main` and push to `origin`. Commit trailer: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`.

## Open decisions (ask the user before assuming)
- **Stack.** Not chosen yet. Leading candidate: Next.js (App Router) + TypeScript + Tailwind/shadcn, content from `data/content/*.json`,
  deployed on Vercel. Alternative: Astro (content-heavy, mostly static). Needs the user's OK.
- **Editing workflow:** does the business need to edit content themselves (headless CMS) or is developer-maintained fine?
- **Languages:** Portuguese only, or add English/Spanish (territory is Portugal/Spain)?
- **Brand:** keep the current logo/colours (`data/assets/maproc/logo1.png`) or refresh? Brand colours not yet extracted.
- **Domain/hosting** cut-over plan and who controls DNS.
- Missing content the client must supply (Flow models, ESAB descriptions, Voortman, Estrutura Metálica, HBD descriptions).
