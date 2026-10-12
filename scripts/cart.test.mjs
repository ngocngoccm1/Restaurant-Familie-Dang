import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
const server = await createServer({ server: { middlewareMode: true } });
const {
  normalizeSelection,
  unitPrice,
  addLine,
  cartTotal,
  restoreCart,
  orderText,
} = await server.ssrLoadModule("/src/lib/cart.ts");
const pick = (itemId, variantId, extras = [], options = {}, quantity = 1) => ({
  itemId,
  variantId,
  extras,
  options,
  quantity,
});
test("variant and extras use authoritative integer prices", () => {
  const line = normalizeSelection(
    pick("21", "C", ["extra-rice", "extra-peanut"]),
  );
  assert.equal(unitPrice(line), 2140);
  assert.equal(cartTotal([{ ...line, quantity: 3 }]), 6420);
});
test("same selection merges; different variants and water options stay separate", () => {
  let cart = addLine([], pick("21", "A"));
  cart = addLine(cart, pick("21", "A", [], {}, 2));
  cart = addLine(cart, pick("21", "B"));
  cart = addLine(cart, pick("A1", "1", [], { water: "Still" }));
  cart = addLine(cart, pick("A1", "1", [], { water: "Sprudel" }));
  assert.equal(cart.length, 4);
  assert.equal(cart[0].quantity, 3);
  assert.equal(cartTotal(cart), 6000);
});
test("corrupted and tampered persistence cannot inject prices or extras", () => {
  assert.deepEqual(restoreCart("{broken"), []);
  assert.deepEqual(restoreCart("{}"), []);
  assert.deepEqual(restoreCart('[null,3,"x"]'), []);
  const cart = restoreCart(
    JSON.stringify([
      {
        ...pick("21", "C", ["extra-unagi", "invalid", "extra-rice"]),
        priceCents: 1,
      },
      { ...pick("unknown", undefined) },
      { ...pick("21", "unknown") },
      { ...pick("21", "A", [], {}, -3) },
      { ...pick("A1", "0", [], { water: "invalid" }) },
    ]),
  );
  assert.equal(cart.length, 1);
  assert.deepEqual(cart[0].extras, ["extra-rice"]);
  assert.equal(unitPrice(cart[0]), 1840);
});
test("drink volume, juice presentation, temperature, and quantities survive reload", () => {
  const selections = [
    pick("A2", "1"),
    pick("A8", "1", [], { juice: "Schorle" }),
    pick("A32", undefined, [], { temperature: "Kalt" }),
    pick("M19", undefined, [], {}, 2),
  ];
  let cart = selections.reduce(addLine, []);
  assert.equal(unitPrice(cart[0]), 350);
  assert.equal(unitPrice(cart[1]), 390);
  assert.equal(unitPrice(cart[2]), 490);
  assert.deepEqual(restoreCart(JSON.stringify(cart)), cart);
  assert.equal(
    normalizeSelection(pick("1", undefined, [], {}, 1000)).quantity,
    99,
  );
  const text = orderText(cart);
  assert(text.includes("Schorle"));
  assert(text.includes("Kalt"));
  assert(text.includes("86,90") === false);
  assert(text.includes("173,80"));
  assert(text.includes("noch keine bestätigte Bestellung"));
});
await server.close();
