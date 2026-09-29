# Maproc.pt Prototype Implementation Plan

> Execution status (2026-09-30): the two-page prototype is implemented in `web/`. Tasks 1–9 are covered by the app, content layer, asset pipeline, chrome, homepage sections and Bystronic page. Source parity/review documentation and automated/visual checks were added to complete the verification work referenced but not expanded in this original plan. See `docs/BUILD-LOG.md` for deviations and evidence, and `docs/REVIEW.md` for remaining production scope. The unchecked steps below preserve the original proposed commands/examples; they are not the current task queue.

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a design prototype of the maproc.pt redesign — the homepage and the Bystronic fibre-laser product page — rendering only content extracted from the current site.

**Architecture:** A Next.js App Router app in `web/`, reading the already-scraped JSON in `data/content/` at build time through a typed content layer. Sections are one component each, alternating dark cinematic and light editorial surfaces. No CMS, no form backend, no invented copy.

**Tech Stack:** Next.js (App Router), TypeScript, Tailwind v4, Vitest (content layer), Playwright + axe-core (verification). No shadcn — this is editorial marketing UI, not app UI.

**Spec:** `docs/superpowers/specs/2026-09-29-maproc-prototype-design.md`

## Global Constraints

- **Language:** European Portuguese (pt-PT). Copy is reproduced verbatim from `data/content/` unless this plan names a specific correction.
- **No invented content.** No specs, prices, model names, or claims that are not in `data/content/`. Missing content renders as an explicit gap, never as filler.
- **`data/raw/` and `data/content/` are read-only.** The app reads them; it never writes to them.
- **App location:** `web/`. Root-level `data/`, `scripts/`, `docs/` are untouched.
- **Brand tokens (sampled from `data/assets/maproc/logo1.png`, exact values):** navy `#003686`, orange `#ff6700`.
- **Accessibility:** WCAG AA. **Brand orange `#ff6700` scores 2.92:1 on white — it must never be body text on a light surface.** On light surfaces use `#c44800` (4.91:1 on white) for orange text; `#ff6700` is permitted on light only for large display type (≥24px bold / ≥30px regular) and non-text UI. On the dark surface `#0a1628`, `#ff6700` scores 6.21:1 and is unrestricted.
- **Excluded assets:** `2024/05/sobrenos.jpg` and `2024/03/cortealaser.jpg` (404 on source), all "Industrie" theme demo imagery, and the `industrie.rstheme.com` hot-linked arrow icon.
- **No PDF re-hosting.** Catalogue links point at the manufacturer URL in `products.json`.
- **Commits:** small and descriptive on `main`, trailer `Co-Authored-By: Claude Code <noreply@anthropic.com>`.

## Review Focus

Five failure modes the spec implies but no task's happy path exercises. Each has a test pinned to the task that owns the code.

1. **Orange used as body text on a light surface** fails AA at 2.92:1 — the machines/HBD/product-body sections are light and the accent is orange. *(Task 1 + Task 11 axe scan)*
2. **`prefers-reduced-motion`** — reveal-on-scroll, sticky brand story and hero parallax must render content fully visible and static, not blank. A reveal that never fires leaves an empty page. *(Task 6 + Task 11)*
3. **Products with empty `specs: []`** — 14 of 22 products have no specs; ByCut Star, ByCut Eco and Robot Installation among them. Cards must omit the spec list entirely, never render an empty `<ul>` or `undefined`. *(Task 2 + Task 9)*
4. **Long pt-PT strings at 320px** — "Impressão metálica 3D", "Consultoria pró-ativa", and the 40-word HBD 400 blurb must not cause horizontal overflow. *(Task 11)*
5. **Click-to-play video must be keyboard operable** — a `<div onClick>` poster is invisible to keyboard and screen-reader users, and nothing may autoplay. *(Task 5)*

## File Structure

```
web/
├── app/
│   ├── layout.tsx                              # html lang="pt-PT", fonts, Header/Footer
│   ├── globals.css                             # Tailwind v4 @theme tokens
│   ├── page.tsx                                # homepage, composes home sections
│   └── portfolios/maquinas-corte-laser/page.tsx
├── components/
│   ├── chrome/{Header,Footer}.tsx
│   ├── home/{Hero,ValueProps,Counters,BrandStory,MachineGrid,HbdSection,AboutPartners,ContactSection}.tsx
│   ├── product/{ProductHero,ModelCard,SalesContact}.tsx
│   └── ui/{Reveal,SectionHeading,VideoPoster,BrandWordmark}.tsx
├── lib/
│   ├── content.ts                              # typed loaders over ../data/content
│   ├── content.test.ts
│   └── site.ts                                 # business constants + resolved conflicts
├── scripts/sync-assets.mjs                     # data/assets -> public/assets, fetch posters
├── public/assets/{maproc,third-party,video}/
└── tests/e2e/pages.spec.ts                     # Playwright + axe
docs/REVIEW.md                                  # client questions + parity checklist
```

`lib/content.ts` is the only module that touches the filesystem. Components receive plain typed objects, so they stay trivially renderable and testable.

---

### Task 1: Scaffold `web/`, design tokens, and a contrast guard

**Files:**
- Create: `web/` (via `create-next-app`), `web/app/globals.css`, `web/lib/tokens.ts`, `web/lib/tokens.test.ts`
- Create: `web/vitest.config.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `tokens` object from `web/lib/tokens.ts` with `navy`, `orange`, `orangeInk`, `surfaceDark`, `surfaceLight`, `textOnDark`, `textMutedOnDark` as hex strings; `contrast(a: string, b: string): number`. CSS variables `--color-navy`, `--color-orange`, `--color-orange-ink`, `--color-surface-dark`, `--color-surface-light` available as Tailwind utilities (`bg-navy`, `text-orange-ink`, …).

- [ ] **Step 1: Scaffold the app**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
npx create-next-app@latest web --ts --tailwind --app --eslint --no-src-dir --turbopack --import-alias "@/*"
cd web && npm install -D vitest
```

- [ ] **Step 2: Write the failing contrast test**

Create `web/lib/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrast, tokens } from './tokens';

describe('brand tokens', () => {
  it('uses the exact hexes sampled from logo1.png', () => {
    expect(tokens.navy).toBe('#003686');
    expect(tokens.orange).toBe('#ff6700');
  });

  it('brand orange is NOT safe as body text on light surfaces', () => {
    // Documents why tokens.orangeInk exists. If this ever passes 4.5,
    // the brand changed and the light-surface rule can be revisited.
    expect(contrast(tokens.orange, tokens.surfaceLight)).toBeLessThan(4.5);
  });

  it('orangeInk passes AA for body text on light surfaces', () => {
    expect(contrast(tokens.orangeInk, tokens.surfaceLight)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.orangeInk, '#ffffff')).toBeGreaterThanOrEqual(4.5);
  });

  it('orange and body text pass AA on the dark surface', () => {
    expect(contrast(tokens.orange, tokens.surfaceDark)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.textOnDark, tokens.surfaceDark)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(tokens.textMutedOnDark, tokens.surfaceDark)).toBeGreaterThanOrEqual(4.5);
  });

  it('navy passes AA as text on light and as a surface under white text', () => {
    expect(contrast(tokens.navy, tokens.surfaceLight)).toBeGreaterThanOrEqual(4.5);
    expect(contrast('#ffffff', tokens.navy)).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `cd web && npx vitest run lib/tokens.test.ts`
Expected: FAIL — `Failed to resolve import "./tokens"`.

- [ ] **Step 4: Implement the tokens module**

Create `web/lib/tokens.ts`:

```ts
export const tokens = {
  navy: '#003686',
  orange: '#ff6700',
  /** AA-safe orange for text on light surfaces (4.91:1 on white). */
  orangeInk: '#c44800',
  surfaceDark: '#0a1628',
  surfaceLight: '#f8fafc',
  textOnDark: '#e2e8f0',
  textMutedOnDark: '#94a3b8',
} as const;

function channel(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: string, b: string): number {
  const [la, lb] = [luminance(a), luminance(b)];
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd web && npx vitest run lib/tokens.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 6: Wire the tokens into Tailwind**

Replace the contents of `web/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #003686;
  --color-orange: #ff6700;
  --color-orange-ink: #c44800;
  --color-surface-dark: #0a1628;
  --color-surface-light: #f8fafc;
  --color-on-dark: #e2e8f0;
  --color-on-dark-muted: #94a3b8;

  --font-display: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

html { scroll-behavior: smooth; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 7: Verify the app boots**

Run: `cd web && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/ .gitignore
git commit -m "feat(web): scaffold Next.js prototype with brand tokens and contrast guard

Tokens sampled from data/assets/maproc/logo1.png: navy #003686, orange #ff6700.
Brand orange is 2.92:1 on white, so orangeInk #c44800 is added for body text
on light surfaces. A unit test pins these ratios.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 2: Typed content layer over `data/content/`

**Files:**
- Create: `web/lib/content.ts`, `web/lib/content.test.ts`, `web/lib/site.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `type Product = { brand: string; category?: string; page?: string; name: string; description_pt?: string; specs: string[]; catalog_url?: string; cta?: string; note?: string }`
  - `loadProducts(): Product[]`
  - `productsByBrand(brand: string): Product[]`
  - `type SalesContact = { role: string; name: string; phone: string; availability: string; territory: string }`
  - `loadSalesContact(): SalesContact`
  - `site` object from `lib/site.ts` (address, phones, emails, hours, socials, yearsOfExperience, counters).

- [ ] **Step 1: Write the failing test**

Create `web/lib/content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { loadProducts, loadSalesContact, productsByBrand } from './content';

describe('loadProducts', () => {
  it('loads all 22 scraped products', () => {
    expect(loadProducts()).toHaveLength(22);
  });

  it('always exposes specs as an array, never undefined', () => {
    // 14 of 22 products have no specs; cards must be able to check .length.
    for (const p of loadProducts()) {
      expect(Array.isArray(p.specs)).toBe(true);
    }
  });

  it('carries the corrected Bystronic model names, not the source typo', () => {
    const names = productsByBrand('Bystronic').map((p) => p.name);
    expect(names).toContain('ByCut Star 4020');
    expect(names.join(' ')).not.toContain('PorCut');
  });
});

describe('productsByBrand', () => {
  it('returns the five Bystronic models', () => {
    expect(productsByBrand('Bystronic')).toHaveLength(5);
  });

  it('returns an empty array for a brand with no products', () => {
    expect(productsByBrand('Voortman')).toEqual([]);
  });
});

describe('loadSalesContact', () => {
  it('reads Helder Ramires from products.json meta', () => {
    const c = loadSalesContact();
    expect(c.name).toContain('Helder Ramires');
    expect(c.phone).toBe('+351 919 847 589');
    expect(c.territory).toBe('Portugal / Espanha');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd web && npx vitest run lib/content.test.ts`
Expected: FAIL — `Failed to resolve import "./content"`.

- [ ] **Step 3: Implement the content layer**

Create `web/lib/content.ts`:

```ts
import fs from 'node:fs';
import path from 'node:path';

/** data/ lives one level above web/. Read-only: never write here. */
const CONTENT_DIR = path.join(process.cwd(), '..', 'data', 'content');

export type Product = {
  brand: string;
  category?: string;
  page?: string;
  name: string;
  description_pt?: string;
  specs: string[];
  catalog_url?: string;
  cta?: string;
  note?: string;
};

export type SalesContact = {
  role: string;
  name: string;
  phone: string;
  availability: string;
  territory: string;
};

type ProductsFile = {
  meta: { sales_contact: SalesContact };
  products: Array<Omit<Product, 'specs'> & { specs?: string[] }>;
};

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8')) as T;
}

export function loadProducts(): Product[] {
  return readJson<ProductsFile>('products.json').products.map((p) => ({
    ...p,
    specs: p.specs ?? [],
  }));
}

export function productsByBrand(brand: string): Product[] {
  return loadProducts().filter((p) => p.brand === brand);
}

export function loadSalesContact(): SalesContact {
  return readJson<ProductsFile>('products.json').meta.sales_contact;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `cd web && npx vitest run lib/content.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Add the business constants**

Create `web/lib/site.ts`. The two source conflicts are resolved to one value each here and recorded in `docs/REVIEW.md` in Task 10.

```ts
export const site = {
  name: 'MAPROC',
  tagline: 'WE SERVE SUCCESS',
  address: 'Gafanha da Nazaré, Praia da Barra, Ílhavo, Aveiro, PORTUGAL',
  phone: '+351 234 096 465',
  emails: { sales: 'comercial@maproc.pt', hr: 'rh@maproc.pt' },

  /**
   * CONFLICT (see docs/REVIEW.md): homepage says "Seg–Sex 08:30–20:00",
   * contact page says "Seg–Sáb 08.30–20.00". Using the narrower claim.
   */
  hours: 'Seg–Sex 08:30–20:00',

  /**
   * CONFLICT (see docs/REVIEW.md): body copy says "mais de 30 anos",
   * the footer and the homepage counter (data-count="35") say 35.
   * Using 35 consistently.
   */
  yearsOfExperience: 35,

  /** Verbatim from the homepage counters (data-count attributes). */
  counters: [
    { value: 35, label: 'Anos de Experiência' },
    { value: 421, label: 'Quinadoras', suffix: '+' },
    { value: 100, label: 'Punçonadoras', suffix: '+' },
    { value: 789, label: 'Lasers', suffix: '+' },
  ],
  projectsCounter: { value: 650, label: 'Projectos com sucesso' },

  socials: [
    { label: 'Facebook', href: 'https://www.facebook.com/maprocessamento' },
    { label: 'YouTube', href: 'https://www.youtube.com/@maprocportugal6805' },
    { label: 'Instagram', href: 'https://www.instagram.com/maprocessamento/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/m%C3%A1quinas-e-processos-para-chapa/' },
  ],
} as const;
```

- [ ] **Step 6: Re-run the whole suite**

Run: `cd web && npx vitest run`
Expected: PASS, 11 tests across both files.

- [ ] **Step 7: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/lib/
git commit -m "feat(web): typed content layer reading data/content

loadProducts normalises missing specs to [], so cards can branch on length.
site.ts resolves the two documented source conflicts (hours, years) to a
single value each, with the reasoning inline.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 3: Asset pipeline and video posters

The app cannot serve files from `../data/assets`, so a sync script copies the assets actually used into `web/public/assets/`. The same script fetches the two YouTube posters once, so nothing is hot-linked at runtime.

**Files:**
- Create: `web/scripts/sync-assets.mjs`
- Create: `data/assets/video/` (downloaded posters — originals live with the other source assets)
- Modify: `web/package.json` (add `sync:assets` and wire it into `prebuild`/`predev`)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `web/public/assets/maproc/*`, `web/public/assets/third-party/*`, `web/public/assets/video/{m9wsTmZPO-c,ycHS9QzxS0c}.jpg`. Components reference these as `/assets/...`.

- [ ] **Step 1: Write the sync script**

Create `web/scripts/sync-assets.mjs`:

```js
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(import.meta.dirname, '..', '..');
const SRC = path.join(ROOT, 'data', 'assets');
const OUT = path.join(import.meta.dirname, '..', 'public', 'assets');

/** Broken on the source site (404) — never ship these. See CLAUDE.md issue 6. */
const EXCLUDE = new Set(['sobrenos.jpg', 'cortealaser.jpg']);

/** The two homepage videos (maproc's own YouTube channel). */
const VIDEOS = ['m9wsTmZPO-c', 'ycHS9QzxS0c'];

function copyDir(from, to) {
  if (!fs.existsSync(from)) return 0;
  fs.mkdirSync(to, { recursive: true });
  let n = 0;
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (!entry.isFile() || EXCLUDE.has(entry.name)) continue;
    fs.copyFileSync(path.join(from, entry.name), path.join(to, entry.name));
    n++;
  }
  return n;
}

async function fetchPosters() {
  const dir = path.join(SRC, 'video');
  fs.mkdirSync(dir, { recursive: true });
  for (const id of VIDEOS) {
    const file = path.join(dir, `${id}.jpg`);
    if (fs.existsSync(file)) continue;
    // maxresdefault is absent for some uploads; hqdefault always exists.
    for (const q of ['maxresdefault', 'hqdefault']) {
      const res = await fetch(`https://img.youtube.com/vi/${id}/${q}.jpg`);
      if (!res.ok) continue;
      fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
      console.log(`  fetched ${id}.jpg (${q})`);
      break;
    }
    if (!fs.existsSync(file)) throw new Error(`Could not fetch a poster for ${id}`);
  }
}

await fetchPosters();
const counts = {
  maproc: copyDir(path.join(SRC, 'maproc'), path.join(OUT, 'maproc')),
  'third-party': copyDir(path.join(SRC, 'third-party'), path.join(OUT, 'third-party')),
  video: copyDir(path.join(SRC, 'video'), path.join(OUT, 'video')),
};
console.log('synced assets:', counts);
```

- [ ] **Step 2: Wire it into the npm scripts**

In `web/package.json`, add to `"scripts"`:

```json
"sync:assets": "node scripts/sync-assets.mjs",
"predev": "npm run sync:assets",
"prebuild": "npm run sync:assets"
```

- [ ] **Step 3: Run it and verify the output**

```bash
cd web && npm run sync:assets
ls public/assets/video/ && ls public/assets/third-party/ | wc -l
```

Expected: two `.jpg` posters in `public/assets/video/`, 22 files in `public/assets/third-party/`, and no `sobrenos.jpg` or `cortealaser.jpg` anywhere under `public/assets/`.

- [ ] **Step 4: Ignore the generated copies**

Add to `web/.gitignore`:

```
/public/assets
```

The originals in `data/assets/` are committed; the copies under `public/` are build output.

- [ ] **Step 5: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/scripts/ web/package.json web/.gitignore data/assets/video/
git commit -m "feat(web): asset sync script and locally hosted video posters

Copies only the assets the pages use into public/, skipping the two images
that 404 on the source site. Fetches both YouTube posters once into
data/assets/video/ so nothing is hot-linked at runtime.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 4: Page chrome — header and footer

**Files:**
- Create: `web/components/chrome/Header.tsx`, `web/components/chrome/Footer.tsx`, `web/components/ui/BrandWordmark.tsx`
- Modify: `web/app/layout.tsx`

**Interfaces:**
- Consumes: `site` from `lib/site.ts` (Task 2); `/assets/maproc/logo1.png` (Task 3).
- Produces: `<Header />`, `<Footer />`, and `<BrandWordmark brand="Bystronic" />` — a typographic stand-in used wherever a brand logo is unavailable (Task 9 uses it for Bystronic, whose source logo URL returns 401).

Nav mirrors the source, including the four items that have no page. Those render as disabled `<span>` with `aria-disabled`, never as links to `#` — a link that goes nowhere is worse than a visibly inactive item.

- [ ] **Step 1: Build the wordmark**

Create `web/components/ui/BrandWordmark.tsx`:

```tsx
export function BrandWordmark({ brand, className = '' }: { brand: string; className?: string }) {
  return (
    <span
      className={`font-display text-2xl font-bold tracking-[0.2em] uppercase ${className}`}
      // Not an image: the manufacturer logo is not licensed/available here.
    >
      {brand}
    </span>
  );
}
```

- [ ] **Step 2: Build the header**

Create `web/components/chrome/Header.tsx`:

```tsx
import Image from 'next/image';
import Link from 'next/link';

type NavItem = { label: string; href?: string; children?: NavItem[] };

const NAV: NavItem[] = [
  { label: 'Sobre nós', href: '/sobre-maproc' },
  {
    label: 'Chapa',
    children: [
      { label: 'Corte a Laser', href: '/portfolios/maquinas-corte-laser' },
      { label: 'Quinadoras', href: '/portfolios/quinadoras-novas' },
      { label: 'Corte Tubo a Laser', href: '/portfolios/corte-laser-tubo' },
    ],
  },
  { label: 'ESAB', href: '/portfolios/esab-maquinas-cnc' },
  { label: 'Flow' },
  { label: 'Impressão metálica 3D' },
  { label: 'Estrutura Metálica' },
  { label: 'Voortman' },
  { label: 'Contactos', href: '/contact' },
];

function NavLabel({ item }: { item: NavItem }) {
  if (!item.href) {
    return (
      <span aria-disabled="true" className="cursor-default text-on-dark-muted">
        {item.label}
      </span>
    );
  }
  return (
    <Link href={item.href} className="text-on-dark transition-colors hover:text-orange">
      {item.label}
    </Link>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-dark/90 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-4">
        <Link href="/" className="shrink-0">
          <Image src="/assets/maproc/logo1.png" alt="MAPROC" width={48} height={48} priority />
        </Link>
        <ul className="hidden flex-wrap items-center gap-6 text-sm lg:flex">
          {NAV.map((item) => (
            <li key={item.label} className="group relative">
              <NavLabel item={item} />
              {item.children && (
                <ul className="absolute left-0 top-full hidden min-w-56 flex-col gap-2 border border-white/10 bg-surface-dark p-4 group-hover:flex group-focus-within:flex">
                  {item.children.map((child) => (
                    <li key={child.label}>
                      <NavLabel item={child} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <a
          href="#contacto"
          className="ml-auto shrink-0 bg-orange px-5 py-2.5 text-sm font-semibold text-surface-dark transition-opacity hover:opacity-90"
        >
          Pedir proposta
        </a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 3: Build the footer**

Create `web/components/chrome/Footer.tsx`:

```tsx
import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="bg-surface-dark px-4 py-16 text-on-dark">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-lg font-semibold">Sobre nós</h2>
          <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
            A MAPROC é especializada em máquinas corte a laser e em processos e equipamentos de
            corte e deformação de chapa, com mais de {site.yearsOfExperience} anos de experiência em
            lasers industriais.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Contactos</h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-on-dark-muted">
            <p>{site.address}</p>
            <p>
              <a className="hover:text-orange" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                {site.phone}
              </a>
            </p>
            <p>
              <a className="hover:text-orange" href={`mailto:${site.emails.sales}`}>
                {site.emails.sales}
              </a>
            </p>
            <p>{site.hours}</p>
          </address>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Redes Sociais</h2>
          <ul className="mt-4 space-y-2 text-sm text-on-dark-muted">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a className="hover:text-orange" href={s.href} rel="noopener noreferrer" target="_blank">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-on-dark-muted">
        © {new Date().getFullYear()} {site.name} — {site.tagline}
      </p>
    </footer>
  );
}
```

- [ ] **Step 4: Wire them into the layout**

Replace `web/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Footer } from '@/components/chrome/Footer';
import { Header } from '@/components/chrome/Header';
import './globals.css';

export const metadata: Metadata = {
  title: 'MAPROC: Máquinas para chapa',
  description:
    'Máquinas para chapa, A MAPROC é especializada em máquinas corte a laser, em processos para chapa e equipamentos de corte e deformação.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-PT">
      <body className="bg-surface-dark font-display text-on-dark antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-orange focus:px-4 focus:py-2 focus:text-surface-dark"
        >
          Saltar para o conteúdo
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify it builds and renders**

Run: `cd web && npm run build && npm run dev`
Expected: build passes; `http://localhost:3000` shows the header, the four inactive nav items rendered as muted non-links, and the footer reading "mais de 35 anos".

- [ ] **Step 6: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/components/ web/app/layout.tsx
git commit -m "feat(web): header, footer and brand wordmark

Nav items with no destination render as aria-disabled spans rather than
links to '#'. BrandWordmark stands in for manufacturer logos we cannot
source, starting with Bystronic (source URL returns 401).

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 5: Homepage dark opening — hero, value props, counters

This task also sets up Playwright, because it owns the first assertion that needs a real browser (Review Focus #5: the video poster must be keyboard operable).

**Files:**
- Create: `web/components/ui/VideoPoster.tsx`, `web/components/home/{Hero,ValueProps,Counters}.tsx`
- Create: `web/playwright.config.ts`, `web/tests/e2e/home.spec.ts`
- Modify: `web/app/page.tsx`

**Interfaces:**
- Consumes: `site` (Task 2); `/assets/video/*.jpg` (Task 3); `Header`/`Footer` already in the layout (Task 4).
- Produces: `<Hero />`, `<ValueProps />`, `<Counters />`, and `<VideoPoster videoId title />` — reused by no other task but kept separate because it owns the click-to-play state.

All copy below is verbatim from `data/content/home.md`.

- [ ] **Step 1: Build the accessible video poster**

Create `web/components/ui/VideoPoster.tsx`:

```tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

export function VideoPoster({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="aspect-video w-full border-0"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
    >
      <Image
        src={`/assets/video/${videoId}.jpg`}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <span className="absolute inset-0 grid place-items-center bg-surface-dark/40">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-orange text-surface-dark">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="sr-only">Reproduzir vídeo: {title}</span>
    </button>
  );
}
```

- [ ] **Step 2: Build the hero**

Create `web/components/home/Hero.tsx`:

```tsx
import { VideoPoster } from '@/components/ui/VideoPoster';
import { site } from '@/lib/site';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-dark px-4 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange">
          {site.tagline}
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
          Avançamos consigo.
          <span className="block text-on-dark-muted">Seja pioneiro na tecnologia.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-on-dark-muted">
          Nas últimas décadas, testemunhamos a evolução da tecnologia. Comprometidos em liderar a
          inovação, esforçamos para fornecer soluções que vão além das suas expectativas. Avançe
          connosco!
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#contacto"
            className="bg-orange px-8 py-4 font-semibold text-surface-dark transition-opacity hover:opacity-90"
          >
            Conheça-nos
          </a>
          <a
            href="#maquinas"
            className="border border-white/20 px-8 py-4 font-semibold transition-colors hover:border-orange hover:text-orange"
          >
            Ver equipamentos
          </a>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          <VideoPoster videoId="m9wsTmZPO-c" title="MAPROC — apresentação" />
          <VideoPoster videoId="ycHS9QzxS0c" title="MAPROC — equipamentos" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build the value props**

Create `web/components/home/ValueProps.tsx`. The source numbers the four cards `01`, `Ex`, `EQ`, `04` — clearly broken template output, so this renders a clean `01`–`04`.

```tsx
const PROPS = [
  {
    n: '01',
    title: 'Consultoria pró-ativa',
    body: 'Analisamos se a máquina de corte a laser é mantida adequadamente nas instalações do cliente e operada por pessoal qualificado.',
  },
  {
    n: '02',
    title: 'Formação',
    body: 'Os nossos instrutores levam ao cliente conhecimento do setor e experiência prática para cada formação.',
  },
  {
    n: '03',
    title: 'Máquinas corte a laser',
    body: 'Tecnologia de corte de alta potência, produção automatizada flexível, tecnologia de quinagem, produtos e serviços de corte de ultraprecisão.',
  },
  {
    n: '04',
    title: 'Suporte',
    body: 'A MAPROC está sempre ao seu lado para ajudá-lo a resolver vários problemas antes e depois da compra.',
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-white/10 bg-surface-dark px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map((p) => (
          <article key={p.n}>
            <p className="text-5xl font-bold text-orange">{p.n}</p>
            <h2 className="mt-5 text-xl font-semibold">{p.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-on-dark-muted">{p.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Build the counters**

Create `web/components/home/Counters.tsx`. Values are the `data-count` attributes from the source, rendered statically — an animated count-up that starts at zero is content that is briefly wrong.

```tsx
import { site } from '@/lib/site';

export function Counters() {
  return (
    <section className="bg-navy px-4 py-20">
      <dl className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {site.counters.map((c) => (
          <div key={c.label}>
            <dt className="sr-only">{c.label}</dt>
            <dd>
              <span className="block text-5xl font-bold text-white">
                {c.value}
                {'suffix' in c && c.suffix ? <span className="text-orange">{c.suffix}</span> : null}
              </span>
              <span className="mt-2 block text-sm uppercase tracking-widest text-white/70">
                {c.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 5: Compose the homepage so far**

Replace `web/app/page.tsx`:

```tsx
import { Counters } from '@/components/home/Counters';
import { Hero } from '@/components/home/Hero';
import { ValueProps } from '@/components/home/ValueProps';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Counters />
    </>
  );
}
```

- [ ] **Step 6: Set up Playwright and write the failing accessibility test**

```bash
cd web && npm install -D @playwright/test @axe-core/playwright && npx playwright install chromium
```

Create `web/playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list']],
  use: { baseURL: 'http://localhost:3000', trace: 'on-first-retry' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

Create `web/tests/e2e/home.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('hero video is a real button, keyboard operable, and does not autoplay', async ({ page }) => {
  await page.goto('/');

  const play = page.getByRole('button', { name: /Reproduzir vídeo/ }).first();
  await expect(play).toBeVisible();

  // Nothing embedded until the user asks for it.
  await expect(page.locator('iframe')).toHaveCount(0);

  await play.focus();
  await expect(play).toBeFocused();
  await page.keyboard.press('Enter');

  await expect(page.locator('iframe').first()).toBeVisible();
});

test('counters render the published values', async ({ page }) => {
  await page.goto('/');
  for (const value of ['35', '421', '100', '789']) {
    await expect(page.getByText(value, { exact: true }).first()).toBeVisible();
  }
});
```

- [ ] **Step 7: Run the tests**

Run: `cd web && npx playwright test tests/e2e/home.spec.ts`
Expected: PASS on both the desktop and mobile projects (4 test runs).

- [ ] **Step 8: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/components/ web/app/page.tsx web/tests/ web/playwright.config.ts web/package.json web/package-lock.json
git commit -m "feat(web): homepage hero, value props and counters

Video posters are buttons, not click-handlers on divs, so they are keyboard
operable and nothing autoplays. Counters render the source data-count values
statically rather than animating up from zero.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 6: Brand story — sticky heading, reveal on scroll, reduced motion

Owns Review Focus #2: if the reveal never fires, the section is blank. The implementation starts visible and animation is an enhancement, so a failed observer or a reduced-motion preference degrades to plain content.

**Files:**
- Create: `web/components/ui/Reveal.tsx`, `web/components/home/BrandStory.tsx`
- Modify: `web/app/page.tsx`, `web/tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: nothing new.
- Produces: `<Reveal>{children}</Reveal>` — used by Tasks 7, 8 and 9 for all scroll reveals. `<BrandStory />`.

- [ ] **Step 1: Build the reveal primitive**

Create `web/components/ui/Reveal.tsx`:

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';

export function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  // Starts hidden only if we know we can animate; see the effect below.
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    const el = ref.current;
    if (!el) return;

    setShown(false);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Build the brand story**

Create `web/components/home/BrandStory.tsx`. Brand blurbs come from `data/content/home.md` and `products.json` meta; Voortman has none, so it says so.

```tsx
import { Reveal } from '@/components/ui/Reveal';

const BRANDS = [
  { name: 'Bystronic', line: 'Corte a laser por fibra', body: 'Corte rápido sem interrupções. Rápido, flexível e preciso.', href: '/portfolios/maquinas-corte-laser' },
  { name: 'LVD', line: 'Quinadoras e corte de tubo', body: 'Quinadoras hidráulicas de última geração, com tecnologia de dobra adaptativa Easy-Form®.', href: '/portfolios/quinadoras-novas' },
  { name: 'ESAB', line: 'Máquinas CNC', body: 'Soluções CNC de corte para chapa.', href: '/portfolios/esab-maquinas-cnc' },
  { name: 'Flow', line: 'Corte com jato de água', body: 'Corte praticamente qualquer material, qualquer forma, qualquer espessura com um jato de água Flow.' },
  { name: 'HBD', line: 'Impressão metálica 3D', body: 'Máquinas aditivas para aeroespacial, odontologia, ortopedia, moldes e matrizes.' },
  { name: 'Voortman', line: 'Estrutura metálica', body: null },
];

export function BrandStory() {
  return (
    <section className="bg-surface-dark px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,22rem)_1fr]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange">Marcas</p>
          <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
            Representamos os fabricantes que definem o setor.
          </h2>
        </div>
        <ul className="space-y-6">
          {BRANDS.map((b) => (
            <li key={b.name}>
              <Reveal>
                <article className="border border-white/10 p-8 transition-colors hover:border-orange/50">
                  <h3 className="text-2xl font-bold">{b.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-widest text-orange">{b.line}</p>
                  {b.body ? (
                    <p className="mt-4 leading-relaxed text-on-dark-muted">{b.body}</p>
                  ) : (
                    <p className="mt-4 text-sm italic text-on-dark-muted">
                      Conteúdo por fornecer pelo cliente.
                    </p>
                  )}
                  {b.href && (
                    <a href={b.href} className="mt-6 inline-block font-semibold text-orange hover:underline">
                      Saiba mais
                    </a>
                  )}
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add it to the homepage**

In `web/app/page.tsx`, import `BrandStory` and render it after `<Counters />`.

- [ ] **Step 4: Write the failing reduced-motion test**

Append to `web/tests/e2e/home.spec.ts`:

```ts
test.describe('prefers-reduced-motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('revealed content is visible without scrolling into view', async ({ page }) => {
    await page.goto('/');
    // Last brand card is far below the fold; with motion reduced it must
    // still be in the DOM and fully opaque rather than waiting on an observer.
    const card = page.getByRole('heading', { name: 'Voortman', level: 3 });
    await expect(card).toBeAttached();
    await expect(card).toBeVisible();
  });
});
```

- [ ] **Step 5: Run the tests**

Run: `cd web && npx playwright test tests/e2e/home.spec.ts`
Expected: PASS on both projects.

- [ ] **Step 6: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/components/ web/app/page.tsx web/tests/
git commit -m "feat(web): brand story section with reduced-motion-safe reveals

Reveal starts visible and only hides itself once it confirms it can animate,
so reduced-motion users and browsers without IntersectionObserver get the
content rather than an empty section. Voortman is marked as missing content
rather than filled with invented copy.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 7: Homepage light sections — machines and HBD

The design flips to a light surface here so the manufacturer cut-outs (white backgrounds, transparent PNGs) sit naturally. **Orange text in this task must use `text-orange-ink`, never `text-orange`** (Global Constraints).

**Files:**
- Create: `web/components/ui/SectionHeading.tsx`, `web/components/home/{MachineGrid,HbdSection}.tsx`
- Modify: `web/app/page.tsx`

**Interfaces:**
- Consumes: `Reveal` (Task 6); `productsByBrand` (Task 2); `/assets/maproc/*` and `/assets/third-party/*` (Task 3).
- Produces: `<SectionHeading eyebrow title dark? />`, `<MachineGrid />`, `<HbdSection />`.

- [ ] **Step 1: Build the shared section heading**

Create `web/components/ui/SectionHeading.tsx`:

```tsx
export function SectionHeading({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div className="max-w-3xl">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.3em] ${
          dark ? 'text-orange' : 'text-orange-ink'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-5 text-4xl font-bold leading-tight md:text-5xl ${
          dark ? 'text-on-dark' : 'text-navy'
        }`}
      >
        {title}
      </h2>
    </div>
  );
}
```

- [ ] **Step 2: Build the machines grid**

Create `web/components/home/MachineGrid.tsx`. The four cards and their images come from the source `portfolio-slider`; the Bystronic card has no image in that widget, so it borrows the model shot already used on its own page.

```tsx
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const MACHINES = [
  { title: 'ESAB Máquinas CNC', href: '/portfolios/esab-maquinas-cnc', img: '/assets/maproc/mut1477936999890979049.jpg' },
  { title: 'LVD corte tubo a laser', href: '/portfolios/corte-laser-tubo', img: '/assets/maproc/icon.jpg' },
  { title: 'LVD Quinadoras', href: '/portfolios/quinadoras-novas', img: '/assets/maproc/quinadora.jpg' },
  { title: 'Bystronic', href: '/portfolios/maquinas-corte-laser', img: '/assets/third-party/bystronic__ByCut-Star-4020_title.png' },
];

const HIGHLIGHTS = [
  {
    brand: 'LVD',
    title: 'Quinadoras hidráulicas de última geração',
    body: 'A série Easy-Form® são dobradeiras inteligentes e altamente precisas, através da integração de tecnologia de dobra adaptativa. Qualquer variação na espessura da chapa, encruamento por esforço e direção da fibra será corrigida em tempo real. Em capacidades de dobra de 80 a 640 tons.',
    img: '/assets/maproc/lvd.jpg',
    href: '/portfolios/quinadoras-novas',
  },
  {
    brand: 'Flow',
    title: 'Tecnologia de Corte com Jato de Água',
    body: 'Corte praticamente qualquer material, qualquer forma, qualquer espessura com um jato de água Flow. Série Mach, Echo Jet e Nano Jet.',
    img: '/assets/maproc/flow.jpg',
    href: null,
  },
];

export function MachineGrid() {
  return (
    <section id="maquinas" className="bg-surface-light px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="tecnologias" title="Explore as nossas máquinas." />

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {MACHINES.map((m) => (
            <li key={m.title}>
              <Reveal>
                <Link
                  href={m.href}
                  className="group block overflow-hidden border border-navy/10 bg-white transition-shadow hover:shadow-lg"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden bg-surface-light">
                    <Image
                      src={m.img}
                      alt={m.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="block border-t border-navy/10 p-5 font-semibold text-navy">
                    {m.title}
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-8 lg:grid-cols-2">
          {HIGHLIGHTS.map((h) => (
            <Reveal key={h.brand}>
              <article className="flex h-full flex-col border border-navy/10 bg-white">
                <div className="relative aspect-[16/9]">
                  <Image src={h.img} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <p className="text-sm font-semibold uppercase tracking-widest text-orange-ink">{h.brand}</p>
                  <h3 className="mt-3 text-2xl font-bold text-navy">{h.title}</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-slate-700">{h.body}</p>
                  {h.href ? (
                    <Link href={h.href} className="mt-6 font-semibold text-orange-ink hover:underline">
                      Saiba mais
                    </Link>
                  ) : (
                    <p className="mt-6 text-sm italic text-slate-500">
                      Página Flow por publicar — conteúdo por fornecer pelo cliente.
                    </p>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Build the HBD section**

Create `web/components/home/HbdSection.tsx`. Products are read from `products.json`; images map to the four HBD files in source order.

```tsx
import Image from 'next/image';
import { productsByBrand } from '@/lib/content';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

/** Source order in data/content/home.md: HBD 400, HBD150/150D, HBD350, HBD 500. */
const IMAGES = [
  '/assets/third-party/hbd__6089c097-3f65-486c-a001-1cd66c0437e9.png_640xaf.png',
  '/assets/third-party/hbd__9eb6fc63-27a2-4d7f-9223-ba05297f40ab.png_640xaf.png',
  '/assets/third-party/hbd__4ade64eb-ea89-4720-810b-4ebd4dfa4d3b.png_640xaf.png',
  '/assets/third-party/hbd__a4244c27-3106-4a63-834d-da7853dae04f.png_640xaf.png',
];

export function HbdSection() {
  const printers = productsByBrand('HBD');

  return (
    <section className="border-t border-navy/10 bg-white px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Impressão metálica 3D : HBD" title="HBD Máquinas aditivas" />
        <p className="mt-6 max-w-3xl leading-relaxed text-slate-700">
          Fundada em 2007 e localizada em Guangdong e Xangai, China, com certificação SGS-CE,
          ISO9001, AS9100D e mais de 200 tecnologias patenteadas e mais de 30 invenções patentes
          atendendo aeroespacial, odontológica, ortopédica, moldes e matrizes, automotiva, petróleo e
          gás, educação e pesquisa, etc.
        </p>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {printers.map((p, i) => (
            <li key={p.name}>
              <Reveal>
                <article className="flex h-full flex-col border border-navy/10">
                  <div className="relative aspect-square bg-surface-light">
                    <Image
                      src={IMAGES[i]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-contain p-6"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-bold text-navy">{p.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                      {p.description_pt}
                    </p>
                    {p.catalog_url && (
                      <a
                        href={p.catalog_url}
                        rel="noopener noreferrer"
                        target="_blank"
                        className="mt-5 text-sm font-semibold text-orange-ink hover:underline"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add both to the homepage**

In `web/app/page.tsx`, render `<MachineGrid />` then `<HbdSection />` after `<BrandStory />`.

- [ ] **Step 5: Verify**

Run: `cd web && npm run build && npx playwright test`
Expected: build passes, existing tests still pass. Visually confirm at `npm run dev` that no orange text on the light sections uses the bright `#ff6700` — all accent text should be `#c44800`.

- [ ] **Step 6: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/components/ web/app/page.tsx
git commit -m "feat(web): light machines and HBD sections

Light surfaces use orange-ink (#c44800) for accent text; the bright brand
orange fails AA on white. Flow is shown as an unpublished page rather than
linked to a placeholder.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 8: Homepage close — about, partner strip, contact

**Files:**
- Create: `web/components/home/{AboutPartners,ContactSection}.tsx`
- Modify: `web/app/page.tsx`

**Interfaces:**
- Consumes: `site`, `loadSalesContact` (Task 2); `Reveal`, `SectionHeading` (Tasks 6–7).
- Produces: `<AboutPartners />`, `<ContactSection />` — the latter renders `id="contacto"`, the target of every "Pedir proposta" link in the app.

The source "Representante Oficial" strip is LVD, Flow, ESAB, HBD, Voortman (Bystronic has no logo there). The contact form is UI only — it has no action and is explicitly labelled as such, so nobody mistakes it for working.

- [ ] **Step 1: Build the about and partners section**

Create `web/components/home/AboutPartners.tsx`:

```tsx
import Image from 'next/image';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/lib/site';

const PARTNERS = [
  { name: 'LVD', src: '/assets/maproc/transferir.png' },
  { name: 'Flow', src: '/assets/maproc/flow-waterjet-logo.jpg' },
  { name: 'ESAB', src: '/assets/maproc/esab-logo.png' },
  { name: 'HBD', src: '/assets/maproc/hdb-logo2.jpg' },
  { name: 'Voortman', src: '/assets/maproc/voortman-logo.jpg' },
];

export function AboutPartners() {
  return (
    <section className="bg-surface-dark px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Sobre nós" title="O nosso objetivo é a promoção de tecnologias de produção no mercado metalúrgico e metalomecânico." dark />
        <p className="mt-6 max-w-3xl leading-relaxed text-on-dark-muted">
          A MAPROC é especializada em máquinas corte a laser e em processos e equipamentos de corte e
          deformação de chapa, com mais de {site.yearsOfExperience} anos de experiência em lasers
          industriais.
        </p>

        <p className="mt-20 text-sm font-semibold uppercase tracking-[0.3em] text-orange">
          Portugal · Representante Oficial
        </p>
        <ul className="mt-8 flex flex-wrap items-center gap-x-12 gap-y-8">
          {PARTNERS.map((p) => (
            <li key={p.name} className="relative h-12 w-32">
              <Image
                src={p.src}
                alt={p.name}
                fill
                sizes="128px"
                className="object-contain opacity-70 transition-opacity hover:opacity-100"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build the contact section**

Create `web/components/home/ContactSection.tsx`:

```tsx
import Image from 'next/image';
import { loadSalesContact } from '@/lib/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { site } from '@/lib/site';

export function ContactSection() {
  const sales = loadSalesContact();

  return (
    <section id="contacto" className="border-t border-white/10 bg-surface-dark px-4 py-24">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Contactos" title="Tem um projecto em mente?" dark />

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="uppercase tracking-widest text-on-dark-muted">Morada</dt>
              <dd className="mt-1">{site.address}</dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-on-dark-muted">Telefone</dt>
              <dd className="mt-1">
                <a className="hover:text-orange" href={`tel:${site.phone.replace(/\s/g, '')}`}>
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-on-dark-muted">Email</dt>
              <dd className="mt-1">
                <a className="hover:text-orange" href={`mailto:${site.emails.sales}`}>
                  {site.emails.sales}
                </a>
              </dd>
            </div>
            <div>
              <dt className="uppercase tracking-widest text-on-dark-muted">Horário</dt>
              <dd className="mt-1">{site.hours}</dd>
            </div>
          </dl>

          <article className="mt-10 flex items-center gap-5 border border-white/10 p-6">
            <Image
              src="/assets/maproc/helder-ramires2.jpg"
              alt=""
              width={72}
              height={72}
              className="h-18 w-18 rounded-full object-cover"
            />
            <div>
              <p className="text-sm uppercase tracking-widest text-orange">{sales.role}</p>
              <p className="mt-1 text-lg font-bold">Helder Ramires</p>
              <p className="mt-1 text-sm text-on-dark-muted">
                <a className="hover:text-orange" href={`tel:${sales.phone.replace(/\s/g, '')}`}>
                  {sales.phone}
                </a>
                {' · '}
                {sales.availability} · {sales.territory}
              </p>
            </div>
          </article>
        </div>

        <form
          className="space-y-5"
          aria-describedby="form-nota"
          onSubmit={undefined}
          action={undefined}
        >
          <p id="form-nota" className="border border-orange/40 bg-orange/10 p-4 text-sm">
            Protótipo — este formulário ainda não envia. O backend e a proteção anti-spam ficam para
            a fase seguinte.
          </p>
          {[
            { id: 'nome', label: 'Nome', type: 'text' },
            { id: 'email', label: 'Email', type: 'email' },
            { id: 'telefone', label: 'Telefone', type: 'tel' },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="block text-sm font-medium">
                {f.label}
              </label>
              <input
                id={f.id}
                name={f.id}
                type={f.type}
                disabled
                className="mt-2 w-full border border-white/20 bg-white/5 px-4 py-3 disabled:cursor-not-allowed"
              />
            </div>
          ))}
          <div>
            <label htmlFor="mensagem" className="block text-sm font-medium">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              rows={5}
              disabled
              className="mt-2 w-full border border-white/20 bg-white/5 px-4 py-3 disabled:cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled
            className="bg-orange px-8 py-4 font-semibold text-surface-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Complete the homepage**

`web/app/page.tsx` final composition:

```tsx
import { AboutPartners } from '@/components/home/AboutPartners';
import { BrandStory } from '@/components/home/BrandStory';
import { ContactSection } from '@/components/home/ContactSection';
import { Counters } from '@/components/home/Counters';
import { HbdSection } from '@/components/home/HbdSection';
import { Hero } from '@/components/home/Hero';
import { MachineGrid } from '@/components/home/MachineGrid';
import { ValueProps } from '@/components/home/ValueProps';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Counters />
      <BrandStory />
      <MachineGrid />
      <HbdSection />
      <AboutPartners />
      <ContactSection />
    </>
  );
}
```

- [ ] **Step 4: Verify**

Run: `cd web && npm run build && npx playwright test`
Expected: build passes, all existing tests pass. The "Pedir proposta" button in the header now scrolls to the contact section.

- [ ] **Step 5: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/components/ web/app/page.tsx
git commit -m "feat(web): about, partner strip and contact section

Form fields are disabled and carry a visible note that the prototype does
not send, so it cannot be mistaken for a working contact route.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---

### Task 9: Bystronic product page

Owns Review Focus #3: three of the five Bystronic models have `specs: []`, so `ModelCard` must omit the list entirely rather than render an empty `<ul>`.

**Files:**
- Create: `web/app/portfolios/maquinas-corte-laser/page.tsx`
- Create: `web/components/product/{ProductHero,ModelCard,SalesContact}.tsx`
- Create: `web/tests/e2e/bystronic.spec.ts`

**Interfaces:**
- Consumes: `productsByBrand`, `loadSalesContact` (Task 2); `BrandWordmark` (Task 4); `Reveal`, `SectionHeading` (Tasks 6–7).
- Produces: `<ProductHero brand title lead />`, `<ModelCard product image />`, `<SalesContact />`.

- [ ] **Step 1: Build the product hero**

Create `web/components/product/ProductHero.tsx`:

```tsx
import Link from 'next/link';
import { BrandWordmark } from '@/components/ui/BrandWordmark';

export function ProductHero({ brand, title, lead }: { brand: string; title: string; lead: string }) {
  return (
    <section className="bg-surface-dark px-4 pb-20 pt-16">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Migalhas" className="text-sm text-on-dark-muted">
          <Link href="/" className="hover:text-orange">
            MAPROC
          </Link>
          <span className="mx-2">/</span>
          <span>Corte a Laser</span>
          <span className="mx-2">/</span>
          <span className="text-on-dark">{brand}</span>
        </nav>

        <BrandWordmark brand={brand} className="mt-10 block text-orange" />
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-dark-muted">{lead}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Build the model card**

Create `web/components/product/ModelCard.tsx`:

```tsx
import Image from 'next/image';
import type { Product } from '@/lib/content';

export function ModelCard({ product, image }: { product: Product; image: string }) {
  return (
    <article className="flex h-full flex-col border border-navy/10 bg-white">
      <div className="relative aspect-[4/3] bg-surface-light">
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-6"
        />
      </div>
      <div className="flex flex-1 flex-col p-8">
        <h3 className="text-2xl font-bold text-navy">{product.name}</h3>
        {product.description_pt && (
          <p className="mt-4 leading-relaxed text-slate-700">{product.description_pt}</p>
        )}

        {/* 3 of 5 Bystronic models publish no specs — render nothing rather than an empty list. */}
        {product.specs.length > 0 && (
          <ul className="mt-6 space-y-2 border-t border-navy/10 pt-6 text-sm text-slate-700">
            {product.specs.map((s) => (
              <li key={s} className="flex gap-3">
                <span aria-hidden="true" className="text-orange-ink">
                  —
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-4 pt-8">
          <a
            href="#contacto"
            className="bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            {product.cta ?? 'Pedir cotação'}
          </a>
          {product.catalog_url && (
            <a
              href={product.catalog_url}
              rel="noopener noreferrer"
              target="_blank"
              className="px-6 py-3 text-sm font-semibold text-orange-ink hover:underline"
            >
              Ver catálogo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 3: Build the sales contact block**

Create `web/components/product/SalesContact.tsx`:

```tsx
import { loadSalesContact } from '@/lib/content';

export function SalesContact() {
  const c = loadSalesContact();
  const rows = [
    { label: 'Gestor Comercial', value: 'Helder Ramires' },
    { label: 'Contacto', value: c.phone },
    { label: 'Disponibilidade', value: c.availability },
    { label: 'Zona de Atuação', value: c.territory },
  ];

  return (
    <section id="contacto" className="bg-surface-dark px-4 py-20">
      <dl className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="text-sm uppercase tracking-widest text-orange">{r.label}</dt>
            <dd className="mt-2 text-lg font-semibold">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: Build the page**

Create `web/app/portfolios/maquinas-corte-laser/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { ModelCard } from '@/components/product/ModelCard';
import { ProductHero } from '@/components/product/ProductHero';
import { SalesContact } from '@/components/product/SalesContact';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { productsByBrand } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Máquinas Corte a Laser por Fibra — Bystronic | MAPROC',
  description:
    'As máquinas de corte a laser Bystronic melhoram o seu rendimento e garantem alta qualidade e maior produtividade.',
};

/** Source order in products.json. */
const IMAGES: Record<string, string> = {
  'ByCut Star 4020': '/assets/third-party/bystronic__ByCut-Star-4020-two-doors-title.png',
  'ByStar Fibra': '/assets/third-party/bystronic__ByStar-Fiber-20kW_closed_transparent.jpg',
  'ByCut Smart': '/assets/third-party/bystronic__ByCut-Smart-6225-title.png',
  'ByCut Eco': '/assets/third-party/bystronic__ByCut_Eco_title.png',
  'Robot Installation (automação)': '/assets/third-party/bystronic__01_Smart-Factory.jpg',
};

export default function BystronicPage() {
  const models = productsByBrand('Bystronic');

  return (
    <>
      <ProductHero
        brand="Bystronic"
        title="Corte rápido sem interrupções."
        lead="As máquinas de corte a laser Bystronic melhoram o seu rendimento e garantem alta qualidade e maior produtividade. A versão automatizada permite tanto a produção sem intervenção humana como um rápido retorno à maquinação manual."
      />

      <section className="bg-surface-light px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Modelos disponíveis" title="Rápido, flexível e preciso" />

          <ul className="mt-14 grid gap-8 lg:grid-cols-2">
            {models.map((m) => (
              <li key={m.name}>
                <Reveal className="h-full">
                  <ModelCard product={m} image={IMAGES[m.name]} />
                </Reveal>
              </li>
            ))}
          </ul>

          <blockquote className="mt-20 border-l-4 border-orange-ink pl-8">
            <p className="text-2xl font-medium leading-relaxed text-navy">
              “Aproveite ao máximo o potencial das nossas soluções de automação — isso garante uma
              taxa de utilização ideal para as suas máquinas de corte a laser.”
            </p>
            <footer className="mt-4 text-sm uppercase tracking-widest text-slate-600">
              Helder Ramires — MAPROC
            </footer>
          </blockquote>
        </div>
      </section>

      <SalesContact />

      <a
        href="#contacto"
        className="fixed bottom-6 right-6 z-40 bg-orange px-6 py-4 font-semibold text-surface-dark shadow-lg transition-opacity hover:opacity-90"
      >
        Pedir proposta
      </a>
    </>
  );
}
```

- [ ] **Step 5: Write the failing tests**

Create `web/tests/e2e/bystronic.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

const URL = '/portfolios/maquinas-corte-laser';

test('renders all five Bystronic models', async ({ page }) => {
  await page.goto(URL);
  for (const name of ['ByCut Star 4020', 'ByStar Fibra', 'ByCut Smart', 'ByCut Eco']) {
    await expect(page.getByRole('heading', { name, level: 3 })).toBeVisible();
  }
  await expect(page.getByRole('heading', { level: 3 })).toHaveCount(5);
});

test('does not reproduce the source typo', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('body')).not.toContainText('PorCut');
});

test('models without published specs render no spec list', async ({ page }) => {
  await page.goto(URL);

  // ByStar Fibra publishes one spec; ByCut Eco publishes none.
  const eco = page.getByRole('article').filter({ hasText: 'ByCut Eco' });
  await expect(eco.locator('ul')).toHaveCount(0);

  const byStar = page.getByRole('article').filter({ hasText: 'ByStar Fibra' });
  await expect(byStar.locator('ul li')).toContainText(['Potência do laser: até 20 kW']);
});

test('publishes the sheet-size spec exactly as the source states it', async ({ page }) => {
  await page.goto(URL);
  // Flagged in docs/REVIEW.md as a probable unit error; not silently converted.
  await expect(page.getByText('40,02 x 8,20 pés')).toBeVisible();
});

test('catalogue links point at the manufacturer, not a re-hosted PDF', async ({ page }) => {
  await page.goto(URL);
  const links = page.getByRole('link', { name: 'Ver catálogo' });
  await expect(links.first()).toHaveAttribute('href', /^https:\/\/btp\.bystronic\.com\//);
});
```

- [ ] **Step 6: Run the tests**

Run: `cd web && npx playwright test tests/e2e/bystronic.spec.ts`
Expected: PASS on both projects (10 runs).

- [ ] **Step 7: Commit**

```bash
cd /Users/joao.martins/Desktop/KikoDadWebsite
git add web/app/portfolios/ web/components/product/ web/tests/
git commit -m "feat(web): Bystronic fibre laser product page

Models come from products.json, so the source 'PorCut Star' typo does not
reach the page. Cards with no published specs omit the list entirely. The
'40,02 x 8,20 pes' figure is shown as published and flagged for the client
rather than silently converted.

Co-Authored-By: Claude Code <noreply@anthropic.com>"
```

---
