"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Check } from "lucide-react";
import type { ProductVariant } from "@/lib/mocks/productById";

type Props = {
  variants: ProductVariant[];
  onChange?: (variant: ProductVariant) => void;
};

export default function ColorPicker({ variants, onChange }: Props) {
  const valid = useMemo(
    () => variants.filter((v) => (v.images ?? []).filter(Boolean).length > 0),
    [variants]
  );
  const [active, setActive] = useState(valid[0]?.id ?? "");

  useEffect(() => {
    const v = valid.find((x) => x.id === active) ?? valid[0];
    if (v && onChange) onChange(v);
  }, [active, valid, onChange]);

  if (!valid.length) return null;

  return (
    <div className="space-y-2">
      <p className="font-jost text-caption text-dark-700">Colors</p>
      <div className="flex items-center gap-3">
        {valid.map((v) => {
          const selected = v.id === active;
          return (
            <button
              key={v.id}
              aria-label={v.label}
              onClick={() => setActive(v.id)}
              className={`relative h-10 w-10 rounded-full border ${
                selected ? "border-dark-900" : "border-light-300"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900`}
            >
              <span className={`absolute inset-1 rounded-full ${v.swatchClass}`} />
              {selected && (
                <Check className="absolute inset-0 m-auto h-4 w-4 text-dark-900" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
