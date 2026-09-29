# Prototype build — 2026-09-30

Plan: `docs/superpowers/plans/2026-09-29-maproc-prototype.md`.
User authorised starting the proposed homepage + Bystronic prototype on 2026-09-30.

## Implementation decisions

- Next.js, TypeScript, Tailwind, custom editorial components; no shadcn dependency. The implementation plan's explicit choice settles the spec's earlier optional library reference.
- Work on `main`, as CLAUDE.md explicitly requests. Preserve pre-existing untracked files. Attribute new work to Codex, not Claude.
- Keep real imagery and all source data unchanged. This overrides Taste's general preference for generated imagery and rewritten short copy.
- Use a dark opening and closing around light product sections, as the MAPROC spec requests, despite the generic skill's single-theme rule.
- Bright orange on white fails even large-text contrast. Use darker orange for meaningful light-surface text/UI and dark text on bright orange buttons.
- Use the homepage's 30+ years wording consistently for this preview. The conflicting 35-year counter and footer are recorded for review, not silently resolved into a stronger claim. Other counters are verified from raw HTML data-count attributes.
- Prototype navigation links to implemented page/section destinations. Missing production routes remain explicitly tracked in REVIEW.md, rather than exposing internal 404s.
- Use meaningful content, contrast, keyboard, mobile, image, reduced-motion and form tests. Cosmetic components do not need implementation-mirroring unit tests.
- Browser plugin reports no available browsers (empty discovery list). Use the project's standalone Playwright runner for local visual and interaction verification.
- Keep a durable build log and review checklist in docs rather than disposable skill scratch files; group closely related component tasks into coherent commits.

## Interface pre-flight

- Content → sections/product cards: catalogue descriptions and specs are optional; omit absent specs, strip extraction annotations from display text without altering originals.
- Assets → components: use a generated source-URL map; only allowlisted authentic assets are synced, optimized, and referenced locally.
- Chrome/product CTAs → contact: all proposal links resolve to `/#contacto`.
- Reveal → all sections: content starts visible; motion is progressive enhancement and reduced motion disables it.
- Source metadata → routes: carry descriptions and canonicals; keep prototype noindex until production review.
- Plan refers to Tasks 10/11 but stops after Task 9: explicitly add parity/review docs, final build/lint/test and visual verification.

## Progress

- Read primary documentation, spec, plan and applicable skill guidance; inspected source copy/catalogue/assets.
- Scaffold installation started.

## Implementation and verification

- Content/contrast tests were written first and failed on missing modules; implementation passes 9 tests.
- Asset allowlist sync: 29 files, 2,904 KB of originals → 785 KB generated WebP/SVG assets. Originals unchanged, two source video thumbnails added.
- Two routes built as static pages; content layer reads original source files. Layout/components, mobile navigation, native video dialogs, local fonts, disabled form preview and accessible CTA palette implemented.
- Initial verification: lint clean, production build successful, 13 Playwright runs passed (one desktop skip for mobile-only test). Axe found no WCAG A/AA violations at tested widths; all page images loaded and no console errors. Desktop/mobile/320px and reduced-motion cases exercised.
- Sandbox prevented initial npm/DNS/local-port access and Turbopack CSS processing; authorised reruns succeeded. These were environment restrictions, not app failures.
- Independent read-only review (Superpowers required final reviewer): one Important source-copy omission and one Minor desktop Escape focus defect. Both received regression tests, observed failing before fixes. Restored original slider/innovation/consultancy text and automation quotation; desktop Escape now returns focus to the dropdown summary.
- Reviewer exclusions (accepted scope): production routes/forms/CMS and deployment remain pending; claims/rights/catalogues require client review; visual and runtime performance validation performed separately here. Cost: prototype is not launch-ready, explicitly recorded in REVIEW.md.
- Ruling: preserve source spelling and grammar rather than applying generic skill copy rewrites. Moved long slider innovation copy into the process section to preserve it without overfilling the hero; source CTA labels are consolidated by intent.
- Production-mode regression suite: 16 passed, 2 platform-specific skips, plus 9 unit tests. No automated WCAG A/AA violations or console errors; final screenshots inspected on desktop/mobile.
- Lighthouse initial run overlapped browser tests and scored 76/100 for homepage performance. Isolated rerun after prioritising hero images: homepage 97, Bystronic 98; accessibility and best practices 100 on both; CLS 0. Mobile simulated LCP 2.7s / 2.5s and TBT 50ms / 20ms. These are local lab measurements, not field Core Web Vitals. SEO 66 reflects intentional noindex.
- Lighthouse's experimental label-in-name check exposed redundant aria-labels diverging from visible nested text. Removed those overrides in favour of native accessible names, and added that experimental rule to the browser suite. Hero images now use the installed Next.js guidance's eager loading + high fetch priority instead of deprecated priority.
- No deferred code-review issues remain; production scope/approvals in REVIEW.md remain explicitly open.
- Final post-fix validation: lint and production build passed; 16 E2E runs passed / 2 platform-specific skips and 9 unit tests passed. Experimental accessible-label rule passes on both routes at desktop/mobile widths. No remaining reviewer findings.
- Production-mode local preview left running at http://localhost:3000. Live MAPROC site not deployed or changed.
