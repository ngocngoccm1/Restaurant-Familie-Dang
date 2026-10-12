# QA report — Restaurant Familie Dang

Date: 10 October 2026. Browser: local Chromium 153 via Playwright. Both Vite development and compiled production preview were exercised. Production screenshots and machine-readable reports are in `qa/`.

## Passed

| Area | Evidence |
|---|---|
| Production build | `npm run build`: TypeScript and Vite pass |
| Menu completeness | 185 original numbered items + 6 extras; all expected IDs checked |
| Prices | All 318 price values match PDF extraction globally and per dish; integer cents |
| Categories | All 29 source categories tested in browser |
| Search | Dish name, number, German umlaut normalization, no-result state |
| Variants | Protein prices, drinks volume, still/sparkling water, Saft/Schorle, hot/cold coffee; every printed variant preserved |
| Extras and totals | Phở beef 14,90 + rice 3,50 + peanut sauce 3,00 = 21,40 per portion; 2 portions = 42,80; increment = 64,20 |
| Cart | Add, merge matching choices, distinct variants/options, decrement, remove, total, persistence on reload |
| Storage robustness | Malformed JSON and forged prices/unknown variants/extras tested; prices reconstructed from menu data |
| Order handoff | Clipboard contains the actual selection and accurate total; phone href matches Word; no auto-submit or fake success |
| Mobile cart | Sticky count/total, full-height drawer, fixed visible copy/phone controls, scrollable items |
| Dialogs | Product selection fits all seven viewports; Escape; native focus handling |
| Navigation | Mobile open/close, navigation destination and close after selection; valid section anchors |
| Gallery | All images load; lightbox opens/closes; illustrative source labels |
| Telephone/table inquiry | Actual Word phone links; explicitly inquiry rather than confirmed reservation |
| Maps | Correct client address in external link; no iframe or preloaded third-party map |
| Allergens | Source legend available; variant-specific codes; source ambiguities visibly flagged |
| Legal pages | `/impressum`, `/datenschutz` load and visibly identify missing operator details |
| PDF | Original pages 2–12 served; incorrect cover removed; recompressed to about 8.1 MB, all 318 prices preserved |
| Reduced motion | Hero animation disabled; reveal panels visible with reduced motion |
| Browser health | No page errors, console errors, failed responses or broken rendered images |
| Responsive | 375, 390, 430, 768, 1024, 1440, 1920px: no horizontal document overflow |

`npm run test:menu` passes. `npm run test:cart`: four meaningful calculation/persistence tests pass. `qa/functional.json` records the browser checks and dialog geometry. `qa/responsive.json` records document width, image loading and gallery note clearance. `qa/menu-validation.json` records the independent menu audit.

## Visual QA

Live reference full-page screenshots plus hero, story, menu, drinks, collage and footer were captured and visually inspected. Corresponding implementation desktop/mobile screens were inspected, revised, then captured again on production preview. Details and explicit adaptations are documented in `DESIGN_REFERENCE.md`. Header, hero, framed story, centered photographic menu discovery, horizontal category navigation on mobile, image rhythm, collage and footer were compared. No claim of pixel-identical reproduction is made.

Screenshots include desktop/mobile full-page, hero, menu, cart, gallery/contact, and selection dialog at all seven requested widths. Actual assets are from the supplied menu; some supplied source images are medium resolution, and no upscaling is presented as newly photographed restaurant imagery.

## Limits and pending client input

- No actual order submission/backend, online payment, WhatsApp account, pickup or delivery service was provided. The implemented copy/phone workflow works; restaurant acceptance/availability cannot be tested automatically.
- No booking service is supplied; telephone inquiry is implemented. Receiving the actual call or confirming a table was not tested.
- No validated social links exist; no fabricated links were added.
- Google Maps link is an address search, not a verified Business Profile. External map service/telephone dialing depend on user's device and provider.
- Allergen/source wording needs operator correction. Data retention preserves PDF codes rather than inventing safe dietary claims.
- Impressum and Datenschutz remain pending drafts because operator and hosting information are missing. See `CONTENT_REVIEW.md`.
- Image origin permissions beyond client-provided document need operator confirmation before public release.
- Vercel and Netlify configuration included; no public deployment or real domain configured. Canonical and absolute Open Graph URL await domain.
- Browser QA covers Chromium; real iOS Safari, Android hardware, real phone calls and a formal accessibility/SEO audit were not performed.

## GitHub Pages verification — 12 October 2026

- Built with `PAGES_BASE_PATH=/Restaurant-Familie-Dang/`; generated `dist/index.html`, `impressum.html`, and `datenschutz.html`.
- Served the compiled output under `/Restaurant-Familie-Dang/` using Python's static HTTP server, with no SPA fallback. Both legal documents and the PDF returned HTTP 200 directly.
- Re-ran the complete functional browser suite against that subpath: all 191 menu rows, 29 categories, prices, search, variants/extras, cart persistence, clipboard, phone handoff, mobile navigation and dialogs passed. No browser errors or failed responses.
- Re-ran responsive screenshots at 375, 390, 430, 768, 1024, 1440 and 1920px: no horizontal overflow, no broken images. Visually inspected desktop hero, mobile hero and mobile cart screenshots.
- Independent menu validation passed (318 printed prices); all four cart unit tests passed. Vite emitted a dependency-scan shutdown warning after the unit suite; the production build and browser suite completed without errors.
- Deployment workflow builds and uploads `dist` to Pages instead of serving the development source `index.html` directly. The GitHub Pages setup is documented in `GITHUB_PAGES.md`.
