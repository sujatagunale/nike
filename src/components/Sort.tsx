'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { SORT_OPTIONS, buildQueryString, parseFiltersFromUrl } from '@/lib/utils/query';

interface SortProps {
  initialSort: string;
}

export default function Sort({ initialSort }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState(initialSort);

  const handleSortChange = (sortValue: string) => {
    setCurrentSort(sortValue);
    setIsOpen(false);
    
    const filters = parseFiltersFromUrl(searchParams);
    const queryStr = buildQueryString(filters, sortValue);
    const newUrl = queryStr ? `/products?${queryStr}` : '/products';
    router.push(newUrl, { scroll: false });
  };

  const currentSortLabel = SORT_OPTIONS.find(option => option.value === currentSort)?.label || 'Featured';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 border border-dark-500 rounded-lg font-jost text-body-medium font-medium text-dark-900 bg-light-100"
      >
        <span>Sort By: {currentSortLabel}</span>
        <ChevronDown className={`h-4 w-4 text-dark-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-light-100 border border-dark-500 rounded-lg shadow-lg z-10">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full px-4 py-2 text-left font-jost text-body hover:bg-light-200 first:rounded-t-lg last:rounded-b-lg ${
                currentSort === option.value ? 'bg-light-200 font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
