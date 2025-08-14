'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { parseFilters, useUpdateUrlFilters } from '@/lib/utils/query';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Sort() {
  const searchParams = useSearchParams();
  const updateUrlFilters = useUpdateUrlFilters();
  const [isOpen, setIsOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState('featured');

  useEffect(() => {
    const filters = parseFilters(searchParams);
    setCurrentSort(filters.sort || 'featured');
  }, [searchParams]);

  const handleSortChange = (sortValue: string) => {
    const currentFilters = parseFilters(searchParams);
    const newFilters = {
      ...currentFilters,
      sort: sortValue === 'featured' ? undefined : sortValue,
      page: 1,
    };
    
    updateUrlFilters(newFilters);
    setIsOpen(false);
  };

  const currentSortLabel = sortOptions.find(option => option.value === currentSort)?.label || 'Featured';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2 bg-light-100 border border-light-300 rounded-lg hover:bg-light-200 transition-colors"
      >
        <span className="font-jost text-body text-dark-900">
          Sort By: {currentSortLabel}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-light-100 border border-light-300 rounded-lg shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`w-full px-4 py-2 text-left font-jost text-body hover:bg-light-200 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                currentSort === option.value ? 'text-dark-900 font-medium' : 'text-dark-700'
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
