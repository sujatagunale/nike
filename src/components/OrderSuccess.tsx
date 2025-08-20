"use client";

import React from "react";
import { CheckCircle } from "lucide-react";

type Item = {
  id: string;
  name?: string;
  quantity: number;
  priceAtPurchaseCents: number | null;
};

export default function OrderSuccess({
  orderId,
  items,
  totalCents,
}: {
  orderId: string;
  items: Item[];
  totalCents: number | null;
}) {
  const format = (cents: number | null) => {
    const v = cents ?? 0;
    return `$${(v / 100).toFixed(2)}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-light-100 rounded-lg border border-light-300">
      <div className="flex items-center gap-3 mb-4">
        <CheckCircle className="text-green-600" />
        <h1 className="font-jost text-heading-3 text-dark-900">Thank you for your purchase!</h1>
      </div>
      <p className="font-jost text-body text-dark-700 mb-6">
        Your order <span className="font-medium text-dark-900">#{orderId}</span> has been placed successfully.
      </p>

      <div className="space-y-3">
        {items.map((it) => (
          <div key={it.id} className="flex justify-between text-dark-900 font-jost text-body">
            <span>
              {it.name ?? "Item"} × {it.quantity}
            </span>
            <span>{format(it.priceAtPurchaseCents !== null ? it.priceAtPurchaseCents * it.quantity : 0)}</span>
          </div>
        ))}
      </div>

      <hr className="my-4 border-light-300" />

      <div className="flex justify-between font-jost text-body font-medium text-dark-900">
        <span>Total</span>
        <span>{format(totalCents)}</span>
      </div>
    </div>
  );
}
