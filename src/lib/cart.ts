import data from "../data/menu.json";
import type { CartLine, Dish, Selection } from "../types.ts";
export const dishes = data.items as Dish[];
export const dishById = new Map(dishes.map((dish) => [dish.id, dish]));
export const money = (cents: number) =>
  new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
export const extrasFor = (dish: Dish) =>
  dishes.filter(
    (extra) =>
      extra.group ===
      (["Hauptgerichte", "Große Suppen", "Salat"].includes(dish.category)
        ? "main"
        : [
              "Nigiri",
              "Maki",
              "Inside-out Sushi",
              "Family Dang",
              "Frittierte Maki",
              "Große frittierte Rollen",
              "Sushi Bowls",
              "Sashimi mit Algensalat",
              "Menü Family Dang",
            ].includes(dish.category)
          ? "sushi"
          : "none"),
  );
export function normalizeSelection(raw: Selection): CartLine | null {
  const dish = dishById.get(raw.itemId);
  if (!dish || !Number.isInteger(raw.quantity) || raw.quantity < 1) return null;
  const variant = dish.variants.find((v) => v.id === raw.variantId);
  if (dish.variants.length && !variant) return null;
  const permitted = new Set(extrasFor(dish).map((e) => e.id));
  const extras = [
    ...new Set(
      Array.isArray(raw.extras)
        ? raw.extras.filter((id) => permitted.has(id))
        : [],
    ),
  ].sort();
  const options: Record<string, string> = {};
  for (const group of dish.optionGroups ?? []) {
    if (!raw.options || !group.options.includes(raw.options[group.id]))
      return null;
    options[group.id] = raw.options[group.id];
  }
  const selected = {
    itemId: dish.id,
    variantId: variant?.id,
    extras,
    options,
    quantity: Math.min(99, raw.quantity),
  };
  return {
    ...selected,
    key: JSON.stringify([dish.id, variant?.id, extras, options]),
  };
}
export function unitPrice(line: Selection): number {
  const dish = dishById.get(line.itemId)!;
  return (
    (dish.variants.find((v) => v.id === line.variantId)?.priceCents ??
      dish.priceCents) +
    line.extras.reduce(
      (sum, id) => sum + (dishById.get(id)?.priceCents ?? 0),
      0,
    )
  );
}
export const cartTotal = (cart: CartLine[]) =>
  cart.reduce((sum, line) => sum + unitPrice(line) * line.quantity, 0);
export function addLine(cart: CartLine[], selection: Selection): CartLine[] {
  const line = normalizeSelection(selection);
  if (!line) return cart;
  return cart.some((old) => old.key === line.key)
    ? cart.map((old) =>
        old.key === line.key
          ? { ...old, quantity: Math.min(99, old.quantity + line.quantity) }
          : old,
      )
    : [...cart, line];
}
export function restoreCart(value: string | null): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .slice(0, 300)
      .reduce<
        CartLine[]
      >((cart, raw) => (raw && typeof raw === "object" ? addLine(cart, raw as Selection) : cart), []);
  } catch {
    return [];
  }
}
export function orderText(cart: CartLine[]): string {
  return [
    "Restaurant Familie Dang — Speisenauswahl",
    ...cart.map((line) => {
      const dish = dishById.get(line.itemId)!;
      const details = [
        dish.variants.find((v) => v.id === line.variantId)?.label,
        ...Object.values(line.options),
        ...line.extras.map((id) => dishById.get(id)!.name),
      ]
        .filter(Boolean)
        .join(" · ");
      return `${line.quantity} × ${dish.number ? "Nr. " + dish.number + " " : ""}${dish.name}${details ? " (" + details + ")" : ""} — ${money(unitPrice(line) * line.quantity)}`;
    }),
    "",
    `Gesamtsumme: ${money(cartTotal(cart))}`,
    "Bitte Verfügbarkeit und die Möglichkeit zur Abholung oder Lieferung telefonisch klären.",
    "Diese Auswahl ist noch keine bestätigte Bestellung.",
  ].join("\n");
}
