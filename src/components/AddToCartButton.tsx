"use client";

import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart";

export function AddToCartButton({
  item,
  withQty = false,
  className = "",
}: {
  item: Omit<CartItem, "qty">;
  withQty?: boolean;
  className?: string;
}) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(item, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {withQty && (
        <div className="flex items-center rounded-lg border border-ink-300">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-ink-700 hover:bg-ink-100"
            aria-label="Azalt"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="px-3 py-2 text-ink-700 hover:bg-ink-100"
            aria-label="Arttır"
          >
            +
          </button>
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        className="flex-1 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
      >
        {added ? "✓ Sepete eklendi" : "Sepete Ekle"}
      </button>
    </div>
  );
}
