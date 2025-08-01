'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { parseFilters, updateUrlFilters } from '@/lib/utils/query';

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Price: Low to High', value: 'price_asc' },
];

export default function Sort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentFilters = parseFilters(searchParams);
  const currentSort = currentFilters.sort || 'featured';
  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Featured';

  const handleSortChange = (sortValue: string) => {
    const newFilters = {
      ...currentFilters,
      sort: sortValue as 'featured' | 'newest' | 'price_asc' | 'price_desc',
    };

    updateUrlFilters(newFilters, router, pathname);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 border border-light-400 rounded-lg font-jost text-body hover:border-dark-700 transition-colors"
      >
        <span>Sort By: {currentSortLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-light-100 border border-light-300 rounded-lg shadow-lg z-10">
          <div className="py-2">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`
                  w-full text-left px-4 py-2 font-jost text-body hover:bg-light-200 transition-colors
                  ${currentSort === option.value ? 'bg-light-200 font-medium' : ''}
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
