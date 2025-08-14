"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterOptions } from "@/lib/data/products";
import {
  ProductQuery,
  parseFilters,
  stringifyFilters,
  toggleMulti,
  clearFilters,
  Gender,
} from "@/lib/utils/query";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    gender: true,
    size: true,
    color: true,
    price: true,
  });

  const query = useMemo(
    () => parseFilters(Object.fromEntries(searchParams.entries())),
    [searchParams]
  );

  const update = (next: ProductQuery) => {
    const url = `${pathname}?${stringifyFilters(next)}`;
    router.replace(url, { scroll: false });
  };

  const onToggle = (key: "gender" | "size" | "color" | "price", value: string) =>
    update(toggleMulti(query, key, value));

  const clearAll = () => update(clearFilters(query));

  const Sidebar = (
    <aside className="w-full md:w-64">
      <div className="flex items-center justify-between md:hidden mb-4">
        <h2 className="font-jost text-body-medium text-dark-900">Filters</h2>
        <button
          onClick={() => setDrawerOpen(false)}
          className="px-3 py-2 rounded-md border border-light-300 font-jost text-caption"
        >
          Close
        </button>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-jost text-body-medium text-dark-900">Refine</h3>
          <button
            className="font-jost text-caption text-dark-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark-900"
            onClick={clearAll}
          >
            Clear all
          </button>
        </div>

        <fieldset>
          <legend
            className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900"
            onClick={() => setExpanded((s) => ({ ...s, gender: !s.gender }))}
          >
            Gender
            <span className="text-dark-700">{expanded.gender ? "−" : "+"}</span>
          </legend>
          {expanded.gender && (
            <ul className="mt-3 space-y-2">
              {filterOptions.genders.map((g) => {
                const checked = (query.gender || []).includes(g.value as Gender);
                return (
                  <li key={g.value} className="flex items-center gap-2">
                    <input
                      id={`gender-${g.value}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle("gender", g.value)}
                      className="size-4 rounded border-light-300"
                    />
                    <label htmlFor={`gender-${g.value}`} className="font-jost text-body text-dark-900">
                      {g.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>

        <fieldset>
          <legend
            className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900"
            onClick={() => setExpanded((s) => ({ ...s, size: !s.size }))}
          >
            Size
            <span className="text-dark-700">{expanded.size ? "−" : "+"}</span>
          </legend>
          {expanded.size && (
            <ul className="mt-3 grid grid-cols-3 gap-2">
              {filterOptions.sizes.map((s) => {
                const checked = (query.size || []).includes(s);
                return (
                  <li key={s} className="flex items-center gap-2">
                    <input
                      id={`size-${s}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle("size", s)}
                      className="size-4 rounded border-light-300"
                    />
                    <label htmlFor={`size-${s}`} className="font-jost text-caption text-dark-900">
                      {s}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>

        <fieldset>
          <legend
            className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900"
            onClick={() => setExpanded((s) => ({ ...s, color: !s.color }))}
          >
            Color
            <span className="text-dark-700">{expanded.color ? "−" : "+"}</span>
          </legend>
          {expanded.color && (
            <ul className="mt-3 space-y-2">
              {filterOptions.colors.map((c) => {
                const checked = (query.color || []).includes(c);
                return (
                  <li key={c} className="flex items-center gap-2">
                    <input
                      id={`color-${c}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle("color", c)}
                      className="size-4 rounded border-light-300"
                    />
                    <label htmlFor={`color-${c}`} className="font-jost text-body text-dark-900 capitalize">
                      {c}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>

        <fieldset>
          <legend
            className="flex items-center justify-between cursor-pointer font-jost text-body-medium text-dark-900"
            onClick={() => setExpanded((s) => ({ ...s, price: !s.price }))}
          >
            Price Range
            <span className="text-dark-700">{expanded.price ? "−" : "+"}</span>
          </legend>
          {expanded.price && (
            <ul className="mt-3 space-y-2">
              {filterOptions.price.map((p) => {
                const checked = (query.price || []).includes(p.value);
                return (
                  <li key={p.value} className="flex items-center gap-2">
                    <input
                      id={`price-${p.value}`}
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle("price", String(p.value))}
                      className="size-4 rounded border-light-300"
                    />
                    <label htmlFor={`price-${p.value}`} className="font-jost text-body text-dark-900">
                      {p.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </fieldset>
      </div>
    </aside>
  );

  return (
    <>
      <div className="md:hidden mb-4">
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 rounded-md border border-light-300 font-jost text-body"
        >
          Filters
        </button>
      </div>

      <div className="hidden md:block">{Sidebar}</div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-light-100 p-4 shadow-xl">
            {Sidebar}
          </div>
        </div>
      )}
    </>
  );
}
