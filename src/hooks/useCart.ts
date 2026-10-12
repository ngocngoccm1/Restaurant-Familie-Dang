import { useEffect, useState } from "react";
import { addLine, cartTotal, restoreCart } from "../lib/cart";
import type { Selection } from "../types";
const storageKey = "familie-dang-cart-v1";
export function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      return restoreCart(localStorage.getItem(storageKey));
    } catch {
      return [];
    }
  });
  const [storageWarning, setStorageWarning] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cart));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [cart]);
  return {
    cart,
    storageWarning,
    total: cartTotal(cart),
    count: cart.reduce((s, l) => s + l.quantity, 0),
    add: (s: Selection) => setCart((c) => addLine(c, s)),
    change: (key: string, delta: number) =>
      setCart((c) =>
        c
          .map((l) =>
            l.key === key
              ? { ...l, quantity: Math.min(99, l.quantity + delta) }
              : l,
          )
          .filter((l) => l.quantity > 0),
      ),
    remove: (key: string) => setCart((c) => c.filter((l) => l.key !== key)),
    clear: () => setCart([]),
  };
}
export type CartController = ReturnType<typeof useCart>;
