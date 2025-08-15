"use client";

import React, { useState } from "react";

const SIZES = ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"];

export default function SizePicker() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-jost text-caption text-dark-700">Select Size</p>
        <a className="font-jost text-caption underline">Size Guide</a>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {SIZES.map((s) => {
          const active = s === selected;
          return (
            <button
              key={s}
              onClick={() => setSelected(active ? null : s)}
              className={`h-10 rounded-md border font-jost text-caption ${
                active ? "border-dark-900" : "border-light-300"
              } focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900`}
              aria-pressed={active}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
