# Menu review

Source: `[2026] 21(+). Familie Dang.pdf`, all 12 pages read; page 1 intentionally excluded from website content and public PDF because client Word says the cover address is wrong.

Extracted with native PDF text, independently by whole page and by left/right columns. Pages rendered for visual review in `research/pdf-pages/`; overview `research/all-pages.jpg`. Structured data: `src/data/menu.json`. Original names, descriptions, codes, source page and per-item source text are retained. Currency labels retain German decimals and euro symbols. Calculations use integer cents.

## Completeness

185 numbered records: 1–38, 3.A, 50–124, M1–M19, S1–S3, and every A-prefixed drink actually printed in the document. Plus 6 unnumbered extras: rice, peanut sauce, hoisin sauce, dark sauce, cocktail sauce, unagi sauce. Total 191 records, 318 individual priced choices, 29 printed categories. Numeric gaps are from the original; no missing records were invented.

All 318 prices match the original extracted price values, including per-record verification. Drinks with two prices retain both printed volumes. A1 also provides still/sparkling choice; juices provide juice/Schorle, A32 hot/cold, A57 cold/warm. These presentations have no invented surcharge. Six actual extras are selectable for the corresponding main/sushi groups and also listed independently. No fee, tax adjustment or delivery surcharge is added.

## Client review required

1. Cover conflict: PDF lists Platenstraße 19, Nürnberg, different phone numbers, and weekend closing 23:00. Word overrides all these: Dillinger Str. 17, 89420 Höchstädt an der Donau, 017687889979 / 090744299172, weekdays 11:00–22:00 and weekends 12:00–22:00. The incorrect cover is not shipped in public PDF.
2. Allergen legend is inconsistent with some dish ingredients. In particular `k` is printed as Schalenfrüchte but appears on avocado, edamame and sushi; `f` is Sesamsamen, and `o` is Pilze. Codes are preserved exactly, not silently remapped. No dietary suitability is inferred from tofu or vegetable ingredients; only dish 1 is marked vegetarian because it explicitly says so.
3. `c` / `n` have corrupted wording “Schalenkere” / “Weichkere”. Dishes 57/58 are salmon/tuna yet list `c`; dish 75 salmon skin also has `c`. Soup variants, sushi sauces and bowls may have incomplete codes. These require operator review; website clearly says the source is not an independently verified complete allergen list.
4. Legend uses uppercase `I` for mustard, easily confused with lowercase `i` for gluten. Preserved distinction.
5. Additives 12/13 occur on Cola Zero / Aperol but are not explained. Printed legend omits 6; some definitions are text-corrupted (“AnkoxidakonsmiDel”, “koffeinhalkg geschwätzt”, “SüßungsmiDel”, “chininhalkg”). Kept as original, visibly marked. Restaurant must supply corrected legend before publication.
6. Typographical issues kept in data: “FRIBERTE”, “HOSIN”, “Korriander”, “Süßkartofel”, “friZerte”, “Ananassag/Mangosag”, “China-Sammel”, “BEYREUTH”, “VIETNAMESICHER”. These are not newly authored recipes.
7. Dish 29 description ends at “Zwiebeln und”; missing ingredient is not guessed. Dish 20 is placed under Salat in the PDF, and stays there even though it is a mixed appetizer platter.
8. Red and rosé wine second volumes are printed `0,4L` with 15,90€, while white wine uses `0,75L`. Preserved; confirm whether 0,4L is a source error. A46 has no volume; none is invented. A50 uses the printed 0,2L heading. Sake uses 18CL as printed.
9. A1 water prices (0,25L / 0,75L) and A2–A7 soft drinks (0,2L / 0,4L) are independently preserved.
10. Repeated source note “In Garnelen besteht zu 40% aus Wasser” is retained in menu metadata and allergen information, not rewritten as a product claim.
11. Images embedded in client PDF are illustrative menu photographs, not verified captures of this restaurant or guaranteed exact plating. No competitor imagery is used. Client must confirm original photo rights before public release.
12. No backend, online order URL, explicit WhatsApp, pickup/delivery availability, or payment service was supplied. Cart prepares an order; copy and phone handoff are real. There is no fake order-success message.
