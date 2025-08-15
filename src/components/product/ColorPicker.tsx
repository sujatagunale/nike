"use client";

import React from "react";
import { Check } from "lucide-react";

type Variant = { id: string; name: string; colorHex: string; images: string[] };

const colorClassFor = (hex: string) => {
  const h = hex.toLowerCase();
  if (h.includes("7b2a3b") || h.includes("7b2a3")) return "bg-rose-800";
  if (h.includes("cfd2d6") || h.includes("cfd2d")) return "bg-zinc-300";
  if (h.includes("06b6d4")) return "bg-cyan-500";
  if (h.includes("84cc16")) return "bg-lime-500";
  return "bg-zinc-400";
};

export default function ColorPicker({
  variants,
  value,
  onChange,
}: {
  variants: Variant[];
  value: string | null;
  onChange: (variantId: string) => void;
}) {
  const valid = variants.filter((v) => v.images && v.images.length > 0);

  if (!valid.length) return null;

  return (
    <div className="space-y-2">
      <p className="font-jost text-caption text-dark-700">Color</p>
      <div className="flex gap-3">
        {valid.map((v) => (
          <button
            key={v.id}
            aria-label={v.name}
            onClick={() => onChange(v.id)}
            className={`h-10 w-10 rounded-full border transition relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 ${value === v.id ? "border-dark-900" : "border-light-400"} ${colorClassFor(v.colorHex)}`}
          >
            {value === v.id && (
              <span className="absolute inset-0 flex items-center justify-center text-light-100">
                <Check className="h-5 w-5" />
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
