# Codex handoff — 2026-09-30

This is the initial assessment before implementation. For the current build status, read `CLAUDE.md`, `docs/BUILD-LOG.md` and `docs/REVIEW.md`.

## Project state at handoff

Primary documentation: `CLAUDE.md`. The repository contains scraped HTML, extracted content, a 22-product catalogue spanning five brands, local assets, and extraction scripts. There is no `web/` app yet. Root `package.json` contains Playwright only and has no app scripts.

Read alongside the primary documentation:
- `docs/superpowers/specs/2026-09-29-maproc-prototype-design.md`
- `docs/superpowers/plans/2026-09-29-maproc-prototype.md`

These describe a two-page prototype (homepage and Bystronic fibre lasers), pt-PT content, Next.js/TypeScript/Tailwind, navy/orange branding, alternating dark/light sections, and restrained motion. The spec is marked awaiting user review, although it also calls the prototype stack confirmed. Do not infer final production approval from this inconsistent status.

Existing untracked files at handoff: the implementation plan directory, root `package.json`, and root `package-lock.json`. Preserve them.

## Reconcile before implementation

- `CLAUDE.md` leaves the stack open; the prototype documents select Next.js for the prototype. The spec includes shadcn; the implementation plan explicitly excludes it.
- The plan incorrectly permits brand orange `#ff6700` on white for large text and non-text UI while reporting a 2.92:1 ratio. That is below the 3:1 requirement for large text and applicable meaningful UI graphics. Check actual foreground/background pairs; use a darker accessible orange where needed.
- Claude-specific commit trailers must not misattribute contributions from another assistant.
- The prototype intentionally excludes most production pages, live forms, CMS, and deployment. Prototype completion does not establish full content parity or launch readiness.

## Claude skills available locally

Inspected the installed-plugin registry and relevant skill guidance under `~/.claude/plugins/cache/`. These files can be consulted from Codex; their Claude hooks, slash commands, tool bindings, and account integrations do not automatically transfer.

| Skills | Fit for this project |
| --- | --- |
| taste-skill / frontend-design | Useful for typography, composition, industrial brand character, and avoiding generic layouts. Choose a coherent design direction rather than stacking every aesthetic rule. |
| redesign-skill | Useful audit checklist. Its advice against alternating backgrounds and its placeholder-image suggestions must yield to the project spec and authentic asset requirements. |
| minimalist-skill / soft-skill | Selective inspiration only. Their palette, shadows, radii, and button rules conflict; neither should govern the entire site. |
| brandkit | Optional generated identity boards. Not necessary for sampling the existing logo palette or implementing CSS tokens. |
| Vercel nextjs / react-best-practices | Relevant engineering references for the proposed prototype. Installed Vercel version is 0.50.0; check current framework documentation during implementation. |
| Vercel shadcn | Relevant only if the component-library decision calls for it; not required for a marketing site. |
| Superpowers | Planning, debugging, and verification guidance is reusable. Adapt Claude-specific execution mechanisms to available tools and the user's preferred workflow. |
| scroll-world | Explicitly outside the prototype scope. Its generated-video workflow requires external tools/accounts and paid rendering; reading the skill does not establish those are usable here. |
| Apple skills | Not relevant to this website build. |

The active Codex session already offers browser testing/control and image-generation capabilities. Use genuine manufacturer assets for products; generated art must not invent or misrepresent machinery. No extra skill installation is required to start the prototype.

## Launch work still outstanding

Full source-content/URL mapping, remaining pages, real contact/newsletter integrations and spam protection, mobile/accessibility/performance verification, client resolution of disputed hours/claims/specs, missing manufacturer content, image rights confirmation, and hosting/DNS decisions.
