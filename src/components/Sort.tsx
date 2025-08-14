"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { mergeQuery, parseQuery, ProductSort, stringifyQuery } from "@/lib/utils/query";

const options: { label: string; value: ProductSort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price (High → Low)", value: "price_desc" },
  { label: "Price (Low → High)", value: "price_asc" },
];

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentValue = useMemo(() => {
    const q = parseQuery(searchParams.toString());
    return q.sort || "featured";
  }, [searchParams]);

  const [open, setOpen] = useState(false);

  function onChange(next: ProductSort) {
    const query = mergeQuery(searchParams.toString(), { sort: next, page: 1 });
    const url = query ? `${pathname}?${query}` : pathname;
    router.push(url, { scroll: false });
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="px-4 py-2 border border-light-300 rounded-md font-jost text-body text-dark-900 hover:bg-light-200 focus:outline-none focus:ring-2 focus:ring-dark-700"
      >
        Sort: {options.find((o) => o.value === currentValue)?.label ?? "Featured"}
      </button>

      {open && (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 mt-2 w-56 bg-light-100 border border-light-300 rounded-md shadow-lg focus:outline-none z-20"
        >
          {options.map((opt) => (
            <li key={opt.value}>
              <button
                role="option"
                aria-selected={currentValue === opt.value}
                onClick={() => onChange(opt.value)}
                className={`w-full text-left px-4 py-2 font-jost text-body hover:bg-light-200 ${
                  currentValue === opt.value ? "text-dark-900" : "text-dark-700"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
