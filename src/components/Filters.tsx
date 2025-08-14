"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { filterOptions } from "@/lib/data/products";
import {
  mergeQuery,
  parseQuery,
  ProductQuery,
  toggleMultiValue,
} from "@/lib/utils/query";

type GroupKey = "gender" | "size" | "color" | "price";

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
    gender: true,
    size: true,
    color: true,
    price: true,
  });

  const query = useMemo<ProductQuery>(() => parseQuery(searchParams.toString()), [searchParams]);

  function pushQuery(q: Partial<ProductQuery>) {
    const next = mergeQuery(searchParams.toString(), q);
    const url = next ? `${pathname}?${next}` : pathname;
    router.push(url, { scroll: false });
  }

  function onToggleGroup(key: GroupKey) {
    setExpanded((e) => ({ ...e, [key]: !e[key] }));
  }

  function onToggleValue(key: GroupKey, value: string) {
    const current = query[key] as string[] | undefined;
    const nextValues = toggleMultiValue(current, value);
    pushQuery({ [key]: nextValues } as Partial<ProductQuery>);
  }

  function onClearAll() {
    router.push(pathname, { scroll: false });
  }


  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const ActiveBadges = () => {
    const parts: { key: GroupKey; value: string }[] = [];
    (query.gender || []).forEach((g) => parts.push({ key: "gender", value: g }));
    (query.size || []).forEach((s) => parts.push({ key: "size", value: s }));
    (query.color || []).forEach((c) => parts.push({ key: "color", value: c }));
    (query.price || []).forEach((p) => parts.push({ key: "price", value: p }));

    if (!parts.length) return null;

    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {parts.map((p, idx) => (
          <button
            key={`${p.key}-${p.value}-${idx}`}
            onClick={() => onToggleValue(p.key, p.value)}
            className="flex items-center gap-2 bg-light-200 text-dark-900 px-3 py-1 rounded-full font-jost text-caption focus:outline-none focus:ring-2 focus:ring-dark-700"
          >
            <span>
              {p.key === "gender" ? p.value[0].toUpperCase() + p.value.slice(1) : p.value}
            </span>
            <span aria-hidden>×</span>
          </button>
        ))}
        <button
          onClick={onClearAll}
          className="ml-2 underline decoration-light-300 underline-offset-4 text-dark-700 font-jost text-caption hover:text-dark-900"
        >
          Clear all
        </button>
      </div>
    );
  };

  const SidebarContent = () => (
    <div className="w-72 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-jost text-body-medium font-medium text-dark-900">Filters</h3>
        <button
          onClick={onClearAll}
          className="underline decoration-light-300 underline-offset-4 text-dark-700 font-jost text-caption hover:text-dark-900"
        >
          Clear
        </button>
      </div>

      <div className="mt-4 space-y-4">
        <FilterGroup
          title="Gender"
          expanded={expanded.gender}
          onToggle={() => onToggleGroup("gender")}
        >
          <CheckboxList
            options={filterOptions.genders.map((g) => ({ label: g.label, value: g.value }))}
            selected={new Set(query.gender || [])}
            onToggle={(v) => onToggleValue("gender", v)}
          />
        </FilterGroup>

        <FilterGroup
          title="Size"
          expanded={expanded.size}
          onToggle={() => onToggleGroup("size")}
        >
          <CheckboxList
            options={filterOptions.sizes.map((s) => ({ label: s, value: s }))}
            selected={new Set(query.size || [])}
            onToggle={(v) => onToggleValue("size", v)}
          />
        </FilterGroup>

        <FilterGroup
          title="Color"
          expanded={expanded.color}
          onToggle={() => onToggleGroup("color")}
        >
          <CheckboxList
            options={filterOptions.colors.map((c) => ({
              label: c[0].toUpperCase() + c.slice(1),
              value: c,
            }))}
            selected={new Set(query.color || [])}
            onToggle={(v) => onToggleValue("color", v)}
          />
        </FilterGroup>

        <FilterGroup
          title="Price Range"
          expanded={expanded.price}
          onToggle={() => onToggleGroup("price")}
        >
          <CheckboxList
            options={filterOptions.priceRanges.map((r) => ({
              label: r.label,
              value: r.id,
            }))}
            selected={new Set(query.price || [])}
            onToggle={(v) => onToggleValue("price", v)}
          />
        </FilterGroup>
      </div>

      <ActiveBadges />
    </div>
  );

  return (
    <>
      <div className="hidden md:block border-r border-light-300">
        <SidebarContent />
      </div>

      <div className="md:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="px-4 py-2 border border-light-300 rounded-md font-jost text-body text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-700"
        >
          Filters
        </button>

        {drawerOpen && (
          <>
            <div
              aria-hidden
              className="fixed inset-0 bg-dark-900/40 z-30"
              onClick={() => setDrawerOpen(false)}
            />
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-y-0 left-0 w-80 bg-light-100 shadow-xl z-40 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-light-300">
                <h3 className="font-jost text-body-medium font-medium text-dark-900">Filters</h3>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-3 py-1 rounded-md border border-light-300 font-jost text-caption"
                >
                  Close
                </button>
              </div>
              <SidebarContent />
            </div>
          </>
        )}
      </div>
    </>
  );
}

function FilterGroup({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-2 font-jost text-body-medium text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-700 rounded"
        aria-expanded={expanded}
      >
        <span>{title}</span>
        <span aria-hidden>{expanded ? "−" : "+"}</span>
      </button>
      {expanded && <div className="mt-2">{children}</div>}
    </section>
  );
}

function CheckboxList({
  options,
  selected,
  onToggle,
}: {
  options: { label: string; value: string }[];
  selected: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <ul className="space-y-2" role="group">
      {options.map((opt) => {
        const id = `chk-${opt.value}`;
        const isChecked = selected.has(opt.value);
        return (
          <li key={opt.value} className="flex items-center gap-3">
            <input
              id={id}
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(opt.value)}
              className="size-4 rounded border-light-300 text-dark-900 focus:ring-dark-700"
            />
            <label
              htmlFor={id}
              className="font-jost text-body text-dark-900 cursor-pointer select-none"
            >
              {opt.label}
            </label>
          </li>
        );
      })}
    </ul>
  );
}
