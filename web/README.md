# MAPROC website prototype

Next.js App Router, TypeScript and Tailwind v4. Read `../CLAUDE.md` first.

## Run locally

```sh
cd web
npm ci
npm run dev
```

Open http://localhost:3000. Implemented routes:

- `/` — homepage
- `/portfolios/maquinas-corte-laser/` — five Bystronic models

For a production-mode local preview: `npm run build` then `npm start`.

## Verify

```sh
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

E2E checks desktop/mobile images, console errors, axe accessibility, opt-in video keyboard interaction, mobile navigation, catalogue content and reduced motion at 320px. Screenshots are saved under `test-results/` (ignored).

## Content and assets

`lib/content.ts` reads the original JSON from `../data/content/`; never edit scraped data to suit the layout. Source website inconsistencies and remaining routes are tracked in `../docs/REVIEW.md`.

`npm run sync:assets` converts the explicit asset allowlist into local WebP images. It runs automatically before dev/build; originals stay under `../data/assets/`. No network calls are needed to regenerate images. Manrope is self-hosted through next/font/local. Video iframes are loaded only after a click, using youtube-nocookie.com; closing a video removes its iframe.

## Prototype limits

The contact form is disabled and labelled; mailto/tel links work. Newsletter/CMS/backend and all other production routes are pending. The preview is noindex; do not deploy over the existing website until the parity checklist, metadata, image rights, privacy and hosting decisions are complete.
