"use client";

import Link from "next/link";
import { useCart } from "@/lib/store/cart";
import { Trash } from "lucide-react";

export default function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clear } = useCart();
  const rows = Object.values(items);
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <h1 className="font-jost text-heading-3 text-dark-900">Shopping Cart</h1>

      {rows.length === 0 ? (
        <div className="py-12">
          <p className="font-jost text-body text-dark-700">Your bag is empty.</p>
          <Link href="/" className="underline font-jost text-body mt-2 inline-block">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {rows.map((it) => (
              <div key={it.variantId} className="border border-light-300 rounded-lg p-4 flex items-center gap-4">
                <div className="w-24 h-24 rounded bg-light-200" />
                <div className="flex-1">
                  <p className="font-jost text-body-medium text-dark-900">{it.name}</p>
                  <p className="font-jost text-caption text-dark-700 mt-1">
                    {it.color} • {it.size}
                  </p>
                  <p className="font-jost text-body text-dark-900 mt-2">${it.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={it.quantity}
                    onChange={(e) => updateQuantity(it.variantId, parseInt(e.target.value))}
                    className="border border-light-300 rounded px-2 py-1 font-jost text-body"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <p className="font-jost text-body text-dark-900 min-w-20 text-right">
                    ${(it.price * it.quantity).toFixed(2)}
                  </p>
                  <button
                    aria-label="Remove"
                    onClick={() => removeItem(it.variantId)}
                    className="text-dark-900 hover:text-dark-700"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="border border-light-300 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="font-jost text-body-medium text-dark-900">Subtotal</p>
              <p className="font-jost text-body-medium text-dark-900">${subtotal.toFixed(2)}</p>
            </div>
            <p className="font-jost text-caption text-dark-700 mt-1">{totalItems} items</p>
            <button
              onClick={() => clear()}
              className="w-full mt-4 min-h-12 rounded-full border border-light-300 bg-light-100 text-dark-900 font-jost text-body-medium"
            >
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
