import { siteUrl } from "../lib/urls";
import { useEffect, useState } from "react";
import { Copy, Minus, Plus, ShoppingBag, Trash2, Phone, MessageCircle } from "lucide-react";
import restaurant from "../data/restaurant.json";
import { dishById, money, orderText, unitPrice, whatsappOrderUrl } from "../lib/cart";
import type { CartController } from "../hooks/useCart";
import { Dialog, Arrow } from "./UI";
export default function CartDrawer({
  cart,
  onClose,
}: {
  cart: CartController;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false),
    [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    setCopied(false);
    setCopyFailed(false);
  }, [cart.cart]);
  async function copy() {
    try {
      await navigator.clipboard.writeText(orderText(cart.cart));
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  }
  return (
    <Dialog
      title={`Dein Warenkorb (${cart.count})`}
      className="cart-dialog"
      onClose={onClose}
    >
      <div className="dialog-body cart-body">
        {!cart.count ? (
          <div className="empty-cart">
            <ShoppingBag size={46} strokeWidth={1} />
            <h2>Ein guter Anfang?</h2>
            <p>
              Entdecke unsere Speisekarte und stelle deine Auswahl zusammen.
            </p>
            <a className="button" href={siteUrl("#speisekarte")} onClick={onClose}>
              Speisekarte entdecken <Arrow />
            </a>
          </div>
        ) : (
          <>
            <h2>
              Zum Teilen.
              <br />
              Zum Genießen.
            </h2>
            <p className="fine-print">
              Deine Auswahl für die Bestellung per WhatsApp.
            </p>
            <div className="cart-lines">
              {cart.cart.map((line) => {
                const dish = dishById.get(line.itemId)!;
                const details = [
                  dish.variants.find((v) => v.id === line.variantId)?.label,
                  ...Object.values(line.options),
                  ...line.extras.map((id) => dishById.get(id)!.name),
                ].filter(Boolean);
                return (
                  <article className="cart-line" key={line.key}>
                    <div className="line-title">
                      <div>
                        <small>
                          {dish.number ? "Nr. " + dish.number : "Extra"} ·{" "}
                          {dish.category}
                        </small>
                        <h3>{dish.name}</h3>
                        {details.length > 0 && <p>{details.join(" · ")}</p>}
                      </div>
                      <button
                        className="icon-button"
                        aria-label={`${dish.name} entfernen`}
                        onClick={() => cart.remove(line.key)}
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                    <div className="line-actions">
                      <div className="quantity">
                        <button
                          aria-label={`${dish.name}: Menge verringern`}
                          onClick={() => cart.change(line.key, -1)}
                        >
                          <Minus size={15} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          disabled={line.quantity === 99}
                          aria-label={`${dish.name}: Menge erhöhen`}
                          onClick={() => cart.change(line.key, 1)}
                        >
                          <Plus size={15} />
                        </button>
                      </div>
                      <b>{money(unitPrice(line) * line.quantity)}</b>
                    </div>
                  </article>
                );
              })}
            </div>
            {cart.storageWarning && (
              <p role="status" className="fine-print">
                Der Browser kann deine Auswahl nicht speichern. Sie bleibt für
                diesen Besuch erhalten.
              </p>
            )}
            <details className="order-details">
              <summary>Bestelltext ansehen</summary>
              <textarea
                aria-label="Bestelltext zum Kopieren"
                readOnly
                value={orderText(cart.cart)}
              />
            </details>
          </>
        )}
      </div>
      {cart.count > 0 && (
        <div className="cart-checkout">
          <div className="total">
            <span>Gesamtsumme</span>
            <b>{money(cart.total)}</b>
          </div>
          <a
            className="button solid whatsapp-order"
            href={whatsappOrderUrl(cart.cart)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            Über WhatsApp bestellen
            <Arrow />
          </a>
          <div className="cart-alternatives">
            <button className="button" onClick={copy}>
              <Copy size={16} />
              {copied ? "Auswahl kopiert" : "Auswahl kopieren"}
            </button>
            <a className="button" href={restaurant.phoneHref}>
              <Phone size={16} />
              Restaurant anrufen
            </a>
          </div>
          <p className="fine-print">
            WhatsApp öffnet deinen Bestelltext. Dort auf „Senden“ tippen.
            Deine Bestellung gilt erst nach Bestätigung durch das Restaurant.
          </p>
          {copyFailed && (
            <p className="fine-print" role="status">
              Kopieren ist hier nicht verfügbar. Du kannst den Bestelltext oben
              markieren und kopieren.
            </p>
          )}
        </div>
      )}
    </Dialog>
  );
}
