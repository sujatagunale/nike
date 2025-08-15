"use client";

import React from "react";

export default function SizePicker({ sizes }: { sizes: string[] }) {
  if (!sizes?.length) return null;

  return (
    <div className="space-y-2">
      <p className="font-jost text-caption text-dark-700">Select Size</p>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
        {sizes.map((s) => (
          <button
            key={s}
            className="h-12 rounded-md border border-light-400 hover:border-dark-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 font-jost text-body"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
