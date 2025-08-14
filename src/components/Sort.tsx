"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { parseFilters, setParam, stringifyFilters, SortKey } from "@/lib/utils/query";

export default function Sort({ current }: { current: SortKey }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = parseFilters(Object.fromEntries(searchParams.entries()));

  const onChange = (value: SortKey) => {
    const next = setParam(query, "sort", value);
    const url = `${pathname}?${stringifyFilters(next)}`;
    router.replace(url, { scroll: false });
  };

  return (
    <label className="inline-flex items-center gap-2">
      <span className="font-jost text-caption text-dark-700">Sort By</span>
      <select
        className="border border-light-300 rounded-md px-3 py-2 text-body focus-visible:outline focus-visible:outline-2 focus-visible:outline-dark-900"
        value={current}
        onChange={(e) => onChange(e.target.value as SortKey)}
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price_desc">Price (High → Low)</option>
        <option value="price_asc">Price (Low → High)</option>
      </select>
    </label>
  );
}
