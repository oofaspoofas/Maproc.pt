# MAPROC prototype review

Two-page design prototype, authorised 2026-09-30. Not a production replacement.

## Implemented content parity

| Source page / section | Prototype destination | Handling |
| --- | --- | --- |
| Homepage slogan, videos | `/` opening | Source slogan; both YouTube videos behind keyboard-operable opt-in controls. No external embed request before interaction. Locally saved thumbnails. |
| Original slider text | Hero + process section | Slider headlines preserved in hero, innovation paragraph beside process stories, waterjet question in Flow story. Original CTA labels consolidated into the corresponding machine/contact links. |
| Consultancy ticker | Below services | Original NEWS text preserved as static copy, without a moving marquee. |
| Four services | `/` services | All four titles and descriptions from source widgets. Broken numeric labels dropped. |
| LVD Easy-Form highlight | `/` process section | Complete source paragraph and three categories. |
| Flow highlight | `/#flow` | Complete homepage description and all three named series. No fabricated Flow page copy. |
| Machine carousel | `/#maquinas` | All four original categories/images, with a source Bystronic model photo replacing that card's empty image. Presented as a responsive grid. |
| 650 projects counter | `/` below machines | Source raw HTML value, static rather than initially displaying zero. |
| Four HBD models | `/#hbd` | All four source models, widget descriptions, real images and manufacturer catalogue links. Descriptions existed in widgets despite being absent from products.json. |
| About blurb / objective | `/#sobre` | Original paragraphs, using real Bystronic experience-centre imagery rather than the broken About image. Image alt text names the manufacturer; no claim it is MAPROC premises. |
| Four business counters | `/` about section | 421+ / 100+ / 789+ verified against raw HTML. 30+ uses body copy pending resolution of conflicting 35-year count. |
| Representative logos | `/#parceiros` | LVD, Flow, ESAB, HBD, Voortman in source order. |
| Contact details / sales manager | `/#contacto` | Address, phone, decoded sales email, hours, Helder Ramires, sales number, territory and availability. Working mailto/tel links. |
| Homepage contact form | `/#contacto` | Labelled, disabled preview; email alternative. Math captcha and 24-hour response promise omitted from inactive form. Production backend pending. |
| Recruitment / social links | Footer | Recruitment mailto and all four source social links. |
| Bystronic introduction | `/portfolios/maquinas-corte-laser/` | Original headline, introduction, automation and productivity paragraphs. |
| Five Bystronic models | `#modelos` on laser page | Five source models, descriptions, known specs and corresponding images. Empty specifications omitted. |
| Bystronic catalogues | Model cards | Three catalogues assigned in products.json retained. Extra conflicting source label/link “BySmart Fibra” withheld pending correct model mapping; no invented Eco/Robot catalogue. |
| Bystronic additional copy | Below model list | Source productivity and process paragraphs preserved. |
| Bystronic automation quotation | Introduction | Original quotation retained with Helder Ramires attribution; ambiguous CEO title omitted pending confirmation. |
| Bystronic sales / contact | Bottom section + proposal bar | Sales contact details and proposal CTA. Name/role used without ambiguous CEO attribution. |
| Metadata | Both routes | Source descriptions and canonicals; pt-PT; noindex for this preview. Broken source OG image omitted. |

## Production pages still to build

| Original URL | Current preview handling / next step |
| --- | --- |
| `/sobre-maproc/` | Homepage About anchor only. Full História / Missão / Visão page remains to build. |
| `/contact/` | Homepage contact anchor only. Full contact route and live backend remain to build. |
| `/portfolios/quinadoras-novas/` | Homepage card leads to contact. Build full LVD page. |
| `/portfolios/corte-laser-tubo/` | Homepage card leads to contact. Build full LVD tube page. |
| `/portfolios/esab-maquinas-cnc/` | Homepage card leads to contact. Build ESAB page, excluding documented Bystronic contamination. |
| `/portfolios/corte-jato-de-agua/` | Homepage Flow content retained. Build real Flow page after approved copy. |
| `/portfolios/bystronic-quinadoras/` | Legacy redirect must be implemented when target page is ready. |
| `/portfolios/bystronic-corte-tubo-laser/` | Legacy redirect must be implemented when target page is ready. |
| `/newsletter/`, `/inscricao-na-newsletter/` | Signup/unsubscribe integration and pages pending. |
| `/portfolio-category/corte-a-laser/`, `/portfolio-category/quinadoras/` | Archive handling/redirect mapping pending full catalogue. |
| Voortman / Estrutura Metálica `#` links | Voortman logo retained. No empty nav links or fabricated pages; client copy needed. |

Prototype navigation is intentionally consolidated into Sobre nós, Máquinas, Marcas, Contactos. All visible internal links lead to implemented content. Production URL parity is incomplete and blocks cut-over.

## Client confirmations before launch

- Hours: homepage says Monday–Friday; contact page says Monday–Saturday. Preview uses Monday–Friday 08:30–20:00.
- Experience: 30+ in body vs 35 in counters/footer. Preview consistently uses 30+.
- ByCut Smart: preserve published 40,02 × 8,20 pés and visibly flag the unit for confirmation; model/catalogue naming also conflicts.
- Obtain licensed Bystronic logo; preview uses normal brand text and does not manufacture a substitute logo.
- Confirm manufacturer image rights and catalogue destinations, especially HBD 500 vs E500. External catalogue availability is not guaranteed by local tests.
- Source Flow, ESAB, Voortman and Estrutura Metálica descriptions. Never reuse incorrect ESAB/Bystronic copy from the Flow page.
- Confirm editing workflow, supported languages, form handling, privacy/cookie requirements and newsletter service.
- Confirm hosting/domain control before deployment. Disable noindex only after production review.

## Intentional removals / transformations

Theme demo imagery, broken image URLs, decorative template leftovers, raw counter zeroes, obsolete carousel scroll instructions, and extraction-only English annotations are excluded. Source files remain untouched. `PorCut Star` is displayed as ByCut Star, as documented in CLAUDE.md.

The spec's five-brand sticky story is represented without duplicating product text: LVD/Flow feature stories, Bystronic/ESAB machine cards, and HBD cards. No scroll-scrubbed video or continuous parallax is added. Sticky positioning, entry transforms and hover feedback provide restrained motion, with static reduced-motion fallbacks.
