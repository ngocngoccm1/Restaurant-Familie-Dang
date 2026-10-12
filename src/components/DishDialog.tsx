import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { CodeInfo } from "./CodeInfo";
import type { Dish, Selection } from "../types";
import { extrasFor, money, unitPrice } from "../lib/cart";
import { Dialog, Arrow } from "./UI";
export default function DishDialog({
  dish,
  onClose,
  onAdd,
}: {
  dish: Dish;
  onClose: () => void;
  onAdd: (selection: Selection) => void;
}) {
  const [variantId, setVariant] = useState(dish.variants[0]?.id);
  const [extras, setExtras] = useState<string[]>([]);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (dish.optionGroups ?? []).map((g) => [g.id, g.options[0]]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const selection = { itemId: dish.id, variantId, extras, options, quantity };
  const variant = dish.variants.find((v) => v.id === variantId);
  return (
    <Dialog
      title={`Nr. ${dish.number || "Extra"} · ${dish.category}`}
      onClose={onClose}
      className="dish-dialog"
    >
      <div className="dialog-body">
        <h2>{dish.name}</h2>
        {dish.description && <p>{dish.description}</p>}
        {dish.size && !dish.name.includes("STK.") && (
          <span className="size-label">{dish.size}</span>
        )}
        {dish.spicy && <span className="size-label">{dish.spicy}</span>}
        {dish.alcohol && (
          <p className="fine-print">
            Alkoholisches Getränk. Altersanforderungen bitte mit dem Restaurant
            klären.
          </p>
        )}
        {dish.variants.length > 0 && (
          <fieldset>
            <legend>Variante wählen</legend>
            <div className="variant-list">
              {dish.variants.map((v) => (
                <label
                  className={`option-row ${v.id === variantId ? "selected" : ""}`}
                  key={v.id}
                >
                  <input
                    type="radio"
                    name="variant"
                    value={v.id}
                    checked={v.id === variantId}
                    onChange={() => setVariant(v.id)}
                  />
                  <span>
                    {dish.number.startsWith("A") ? "" : v.id + ". "}
                    {v.label}
                    <small>
                      {v.codes.length
                        ? "Kennzeichnung: " + v.codes.join(", ")
                        : ""}
                    </small>
                  </span>
                  <b>{money(v.priceCents)}</b>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {(dish.optionGroups ?? []).map((g) => (
          <fieldset key={g.id}>
            <legend>{g.label}</legend>
            <div className="choice-buttons">
              {g.options.map((o) => (
                <label key={o} className={options[g.id] === o ? "active" : ""}>
                  <input
                    type="radio"
                    name={g.id}
                    checked={options[g.id] === o}
                    onChange={() => setOptions({ ...options, [g.id]: o })}
                  />
                  {o}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {extrasFor(dish).length > 0 && (
          <fieldset>
            <legend>
              Extras <span>optional</span>
            </legend>
            {extrasFor(dish).map((extra) => (
              <label className="option-row" key={extra.id}>
                <input
                  type="checkbox"
                  checked={extras.includes(extra.id)}
                  onChange={() =>
                    setExtras((c) =>
                      c.includes(extra.id)
                        ? c.filter((id) => id !== extra.id)
                        : [...c, extra.id],
                    )
                  }
                />
                <span>{extra.name}</span>
                <b>+ {money(extra.priceCents)}</b>
              </label>
            ))}
          </fieldset>
        )}
        {dish.categoryNote && <p className="fine-print">{dish.categoryNote}</p>}
        <div className="allergen-note">
          <CodeInfo
            codes={[...new Set([...dish.codes, ...(variant?.codes ?? [])])]}
          />
          <p>
            Angaben laut Speisekarte. Bei Allergien bitte vor der Bestellung mit
            dem Restaurant sprechen. Auch Soßen und Extras können Allergene
            enthalten.
          </p>
        </div>
      </div>
      <div className="dialog-bottom">
        <div className="quantity">
          <button
            aria-label="Menge verringern"
            disabled={quantity === 1}
            onClick={() => setQuantity((q) => q - 1)}
          >
            <Minus size={17} />
          </button>
          <span aria-live="polite">{quantity}</span>
          <button
            aria-label="Menge erhöhen"
            disabled={quantity === 99}
            onClick={() => setQuantity((q) => q + 1)}
          >
            <Plus size={17} />
          </button>
        </div>
        <button
          className="button solid"
          onClick={() => {
            onAdd(selection);
            onClose();
          }}
        >
          Hinzufügen · {money(unitPrice(selection) * quantity)} <Arrow />
        </button>
      </div>
    </Dialog>
  );
}
