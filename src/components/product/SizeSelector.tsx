"use client";
import React from "react";
import { useState } from "react";

type Size = { id: string; name: string; slug: string; sortOrder: number };

export default function SizeSelector({ sizes }: { sizes: Size[] }) {
  const unique = Array.from(new Map(sizes.map((s) => [s.id, s])).values()).sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
      {unique.map((s) => (
        <button
          key={s.id}
          onClick={() => setSelected(s.id)}
          className={`h-10 rounded border font-jost text-caption ${
            selected === s.id
              ? "border-dark-900 bg-dark-900 text-light-100"
              : "border-light-300 text-dark-900 bg-light-100"
          }`}
        >
          {s.name}
        </button>
      ))}
    </div>
  );
}
