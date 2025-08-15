"use client";

import { useMemo, useState } from "react";

type Variant = {
  id: string;
  price: number;
  salePrice: number | null;
  inStock: number;
  size: { id: string; name: string; sortOrder: number };
};

export default function PDPClient({
  variants,
}: {
  variants: Variant[];
}) {
  const sizes = useMemo(() => {
    const map = new Map<string, { id: string; name: string; sortOrder: number; inStock: boolean; variantId?: string }>();
    for (const v of variants) {
      const key = v.size.id;
      if (!map.has(key)) {
        map.set(key, { ...v.size, inStock: v.inStock > 0, variantId: v.id });
      } else {
        const cur = map.get(key)!;
        cur.inStock = cur.inStock || v.inStock > 0;
        if (!cur.variantId) cur.variantId = v.id;
      }
    }
    return Array.from(map.values()).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [variants]);

  const [selected, setSelected] = useState<string | undefined>(sizes.find((s) => s.inStock)?.id);

  const price = useMemo(() => {
    const numbers = variants.map((v) => (v.salePrice ?? v.price));
    return Math.min(...numbers);
  }, [variants]);

  const onAdd = () => {
    const chosenVariant =
      variants.find((v) => v.size.id === selected) ?? variants[0];
    if (!chosenVariant) return;
    alert("Added to bag: " + chosenVariant.id);
  };

  const onFav = () => {
    alert("Added to favorites");
  };

  return (
    <div className="space-y-4">
      <p className="font-jost text-heading-3 text-dark-900">${price.toFixed(2)}</p>
      <p className="font-jost text-caption text-green">Extra 20% off w/ code SPORT</p>

      <div className="flex items-center justify-between mt-4">
        <p className="font-jost text-caption text-dark-900">Select Size</p>
        <a href="#" className="font-jost text-caption text-dark-700 underline">Size Guide</a>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {sizes.map((s) => {
          const active = selected === s.id;
          const disabled = !s.inStock;
          return (
            <button
              key={s.id}
              disabled={disabled}
              onClick={() => setSelected(s.id)}
              className={[
                "h-10 rounded border font-jost text-caption",
                disabled ? "text-dark-500 border-light-300" : "text-dark-900 border-light-300 hover:border-dark-900",
                active ? "border-dark-900" : "",
              ].join(" ")}
              aria-pressed={active}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <button
        onClick={onAdd}
        className="w-full h-12 rounded-full bg-dark-900 text-light-100 font-jost text-body-medium"
      >
        Add to Bag
      </button>

      <button
        onClick={onFav}
        className="w-full h-12 rounded-full border border-light-300 font-jost text-body-medium"
      >
        Favorite
      </button>
    </div>
  );
}
