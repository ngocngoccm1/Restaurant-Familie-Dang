# Design reference — Restaurant Familie Dang

Primary and sole visual blueprint: https://caytrerestaurant.co.uk/ (Cây Tre, London). Inspected live on 10 October 2026 using Chromium at 1440×1000 and 390×844. This document was created before frontend implementation.

## Research and choice

- Cây Tre: matching Vietnamese cuisine; floating white navigation, photographic full-height hero, fine ornamental frames, balanced image/text pairs, warm border, brown asymmetric image collage. Selected.
- Dishoom https://www.dishoom.com/: inspected live, screenshot saved. Strong editorial storytelling, but extensive history and multi-location content would require unsupported restaurant claims. Not used as a visual source.
- CODA https://coda-berlin.com/en/home/: inspected live, screenshot saved. Dark fine-dining modular architecture; less suited to the extensive everyday Vietnamese/sushi menu. Not used as a visual source.
- L’Osteria https://losteria.net/de/ and Peter Pane https://peterpane.de/: read official pages for navigation/ordering research. Not visual sources.
- Monsieur Vuong https://www.monsieurvuong.de/: read official site as a relevant Vietnamese restaurant candidate. Not visual source.

No reference source code, brand art, images or text is copied into the application.

## Measured architecture and content mapping

Reference at desktop: 14px warm ochre page edge; photographic hero 926px high in a 1000px viewport. White floating header at x295/y32, width850/height68, about 10px corner radius. Body content around 1130px across. Story: two approximately equal 520px-wide panels, 68px apart; framed text at left, photograph at right. Navigation stays fixed on scroll. Narrow typographic ribbon follows hero. Centered menu section has long horizontal rules, short centered introduction, three close-set rectangular portrait photographs with overlaid category names and separate outlined CTA below. This three-tile composition is retained because it is observed in the chosen blueprint.

Then: pale warm drinks section with left visual/right framed text; full-width photographic break; image-left/text-right booking panel; chocolate collage section with offset landscape and portrait images and a fine inner frame; location section; warm brown footer.

Mobile at 390×844: 6px page edge; floating header at x16/y16, width358/height53; full-height cropped hero; compact navigation; sticky actions; story, menu photographs and framed text stack; asymmetric collage remains recognizable. Preserve this hierarchy with minimum 44px touch targets and sticky cart.

## Typography, colors, details

Computed families on reference: Darker Grotesque, Quicksand, Helvetica Neue. Use the first two, independently obtained open-source Google Fonts and hosted locally, with German glyphs. Rounded sans paragraph text, uppercase larger headings, small tracked labels; no luxury serif substitution. Reference's white, pale straw, ochre accent and chocolate surfaces adapted to supplied PDF identity. Tokens: page border #efdab1, white #fffdf9, straw #fff5d5, gold #9d642e, brown #4d403a, ink #352d28, muted #74675c. Gold is darkened for readable small text.

Frames: thin lines, open corner intersections and curved corner marks. Pills are limited to reference-style CTAs; menu dishes are editorial rows, not rounded ecommerce cards. Image crops remain rectangular. Hover uses subtle scale and arrow translation. Hero reveal uses a short clipped image entrance; selected frame reveals use IntersectionObserver. No perpetual marquee or aggressive parallax; reduced motion supported.

## Adaptations justified by supplied content

- Main hero photograph is a sushi sharing plate extracted from supplied PDF page 9, not imagery from Cây Tre. Small bottom-left brand panel gives cuisine and one menu CTA; reference hero is photography-only. No competing central headline.
- Story is cuisine introduction, not invented restaurant history. Story photo shows menu bowls; no supplied interiors exist.
- Three menu photograph choices map to Vietnamese dishes, sushi and drinks.
- Complete searchable HTML menu is an additional functional section, matching the same framed visual system.
- Booking panel maps to a telephone inquiry; orders map to a real selection/cart plus copying and phone contact. Pickup and delivery availability are not asserted.
- No fake locations, newsletter, awards, reviews or competitor photos.
- Gallery contains supplied menu images, clearly identified as menu illustrations rather than verified interior photographs.
- Location uses a typographic address and external map link, avoiding an automatic third-party map embed.

## Captured evidence and comparison

Reference full-page: `research/caytre-desktop.png`, `research/caytre-mobile.png`. Detail captures: `research/caytre-hero.png`, `research/caytre-mobile-hero.png`, `research/caytre-story.png`, `research/caytre-menus.png`, `research/caytre-drinks.png`, `research/caytre-gallery.png`, `research/caytre-footer.png`. Lazy-loaded imagery was triggered by scrolling before capture. Computed font evidence: `research/caytre-style.json`.

Implementation screenshots and final comparison will be recorded below after browser QA.

## Final visual comparison

Reference and implementation were both captured at 1440×1000 and 390×844; all reference hero/story/menu/drinks/collage/footer screenshots were inspected. Implementation full-page and detail captures are in `qa/`, with additional hero and variant captures for 375/390/430/768/1024/1440/1920.

Preserved: narrow warm page surround; white floating fixed header; near-full-screen photograph; narrow typography ribbon; two balanced story columns (framed copy left / image right); centered rule-separated menu introduction; three close-set rectangular image tiles with centered uppercase labels and detached pill links; pale drinks panel with visual left/frame right; photographic break; image-left/order-frame-right pairing; chocolate asymmetric framed collage; framed location information and chocolate footer. German fonts are the same open-source families as the reference, obtained independently.

Revisions after screenshot review: reduced header from 1050px to 980px to bring proportions nearer the 850px reference while accommodating the longer restaurant wordmark and actual cart; reduced hero caption width 490→420px and heading 56→48px to preserve image dominance; moved discovery labels into the reference's centered composition; increased mobile description and cart disclaimer font sizes; extended desktop/tablet gallery canvas to stop coffee image obscuring its source note; captured full-page shots from scroll position zero to keep fixed header at the correct position.

Deliberate differences are visible, not concealed: a compact hero identity/CTA panel is added because supplied restaurant has no separate logo; supplied sushi photography is darker than Cây Tre's bright dining photograph; the functional digital menu is inserted directly after menu discovery; no proprietary illustration is copied; the absent newsletter/interior/locations/booking backend are replaced by confirmed address, telephone inquiry and truthful selection handoff. This is an adapted reconstruction of the reference architecture, not a pixel-identical clone.

Comparison artifacts: `qa/comparison-desktop.jpg`, `qa/comparison-mobile.jpg` (reference at left, implementation at right). No competitor media appears in `public/` or production output.

## Client revision — 15 October 2026

The client explicitly requested the visual character of the printed menu: deeper brown/gold contrast and larger, heavier lettering. This takes priority over the original Cây Tre palette/type treatment. The floating header, offset hero panel, framed story pairs, full-width photographic break and asymmetric gallery retain the existing visual architecture. Typography changes to **Saira**, the actual embedded font family identified in the source PDF, with bolder headings and larger text on desktop and mobile. The digital menu and header now use brown/gold contrast; the drinks/gallery sections use a deeper brown. Three client-supplied sushi photos replace the former PDF sushi images in the hero, story, category discovery, photographic break and gallery. Details and provenance: `research/CLIENT_ASSETS_2026-10-15.md`.
