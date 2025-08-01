'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { parseSearchParams, buildQueryString, updateQueryParam } from '@/lib/utils/query';

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

interface SortProps {
  currentSort?: string;
}

export default function Sort({ currentSort }: SortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const currentOption = sortOptions.find(option => option.value === (currentSort || '')) || sortOptions[0];

  const handleSortChange = (sortValue: string) => {
    const currentFilters = parseSearchParams(searchParams);
    const newFilters = updateQueryParam(currentFilters, 'sort', sortValue || undefined);
    
    const queryString = buildQueryString(newFilters);
    const newUrl = queryString ? `/products?${queryString}` : '/products';
    router.push(newUrl, { scroll: false });
    
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-dark-500 rounded-md font-jost text-body-medium hover:border-dark-900 transition-colors min-w-[180px] justify-between"
      >
        <span>Sort by: {currentOption.label}</span>
        <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-light-100 border border-light-300 rounded-md shadow-lg z-20">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-3 text-left font-jost text-body hover:bg-light-200 transition-colors first:rounded-t-md last:rounded-b-md ${
                  option.value === (currentSort || '') 
                    ? 'bg-light-200 text-dark-900 font-medium' 
                    : 'text-dark-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
