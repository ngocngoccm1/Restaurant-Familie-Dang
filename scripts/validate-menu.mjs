import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
const menu = JSON.parse(readFileSync("src/data/menu.json", "utf8"));
const expected = [
  ...Array.from({ length: 38 }, (_, i) => String(i + 1)),
  "3.A",
  ...Array.from({ length: 75 }, (_, i) => String(i + 50)),
  ...Array.from({ length: 19 }, (_, i) => "M" + (i + 1)),
  ...Array.from({ length: 3 }, (_, i) => "S" + (i + 1)),
  ...Array.from({ length: 23 }, (_, i) => "A" + (i + 1)),
  ...Array.from({ length: 5 }, (_, i) => "A" + (i + 25)),
  "A32",
  ...Array.from({ length: 11 }, (_, i) => "A" + (i + 33)),
  "A45",
  "A46",
  "A48",
  "A49",
  "A50",
  "A51",
  "A54",
  "A56",
  "A57",
];
const actual = menu.items
  .filter((i) => !i.id.startsWith("extra"))
  .map((i) => i.id);
assert.deepEqual(actual.sort(), expected.sort());
assert.equal(new Set(menu.items.map((i) => i.id)).size, 191);
const pdfPrices = [
  ...readFileSync("research/menu-columns.txt", "utf8").matchAll(
    /(\d+,\d{2})\s*€/g,
  ),
]
  .map((m) => Number(m[1].replace(",", "")))
  .sort((a, b) => a - b);
const prices = menu.items
  .flatMap((i) =>
    i.variants.length ? i.variants.map((v) => v.priceCents) : [i.priceCents],
  )
  .sort((a, b) => a - b);
assert.deepEqual(prices, pdfPrices);
for (const item of menu.items) {
  assert(item.name.trim().length);
  assert(item.sourcePage >= 2 && item.sourcePage <= 12);
  assert(menu.categories.includes(item.category));
  assert(Number.isInteger(item.priceCents));
  if (item.variants.length)
    assert.equal(
      item.priceCents,
      Math.min(...item.variants.map((v) => v.priceCents)),
    );
  const sourcePrices = [...item.sourceText.matchAll(/(\d+,\d{2})\s*€/g)]
    .map((m) => Number(m[1].replace(",", "")))
    .sort((a, b) => a - b);
  assert.deepEqual(
    (item.variants.length
      ? item.variants.map((v) => v.priceCents)
      : [item.priceCents]
    ).sort((a, b) => a - b),
    sourcePrices,
  );
}
const report = {
  passed: true,
  numberedItems: actual.length,
  extras: 6,
  totalItems: menu.items.length,
  pricedChoices: prices.length,
  categories: menu.categories.length,
  description:
    "Expected IDs, unique IDs, every per-dish price and global PDF price multiset validated. Source text from separately extracted PDF columns.",
};
writeFileSync("qa/menu-validation.json", JSON.stringify(report, null, 2));
console.log(report);
