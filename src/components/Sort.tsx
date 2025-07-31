"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SortProps {
  currentSort?: string;
}

const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: High to Low", value: "price-high" },
  { label: "Price: Low to High", value: "price-low" },
];

export default function Sort({ currentSort = "featured" }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === "featured") {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };


  return (
    <div className="relative">
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="appearance-none bg-light-100 border border-light-400 rounded px-4 py-2 pr-8 text-body font-jost text-dark-900 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:border-transparent"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            Sort By: {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-dark-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
