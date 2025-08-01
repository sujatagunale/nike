'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { FilterState, buildQueryString } from '@/lib/utils/query';

interface FiltersProps {
  initialFilters: FilterState;
}

const FILTER_OPTIONS = {
  gender: [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
  ],
  size: [
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ],
  color: [
    { label: 'Black', value: 'black' },
    { label: 'White', value: 'white' },
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Gray', value: 'gray' },
    { label: 'Green', value: 'green' },
  ],
  priceRange: [
    { label: '$0 - $50', value: '0-50' },
    { label: '$50 - $100', value: '50-100' },
    { label: '$100 - $150', value: '100-150' },
    { label: 'Over $150', value: '150+' },
  ],
};

export default function Filters({ initialFilters }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    gender: true,
    size: true,
    color: true,
    priceRange: true,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
    const currentSort = searchParams.get('sort') || 'featured';
    const queryStr = buildQueryString(newFilters, currentSort);
    const newUrl = queryStr ? `/products?${queryStr}` : '/products';
    router.push(newUrl, { scroll: false });
  };

  const handleFilterChange = (filterType: keyof FilterState, value: string, checked: boolean) => {
    const currentValues = filters[filterType] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    updateFilters({
      ...filters,
      [filterType]: newValues,
    });
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const clearAllFilters = () => {
    updateFilters({});
  };

  const renderFilterGroup = (title: string, filterKey: keyof FilterState, options: { label: string; value: string }[]) => (
    <div key={filterKey} className="border-b border-light-300 pb-4">
      <button
        onClick={() => toggleGroup(filterKey)}
        className="flex items-center justify-between w-full py-2 text-left"
      >
        <span className="font-jost text-body-medium font-medium text-dark-900">{title}</span>
        {expandedGroups[filterKey] ? (
          <ChevronUp className="h-4 w-4 text-dark-700" />
        ) : (
          <ChevronDown className="h-4 w-4 text-dark-700" />
        )}
      </button>
      
      {expandedGroups[filterKey] && (
        <div className="mt-3 space-y-2">
          {options.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters[filterKey]?.includes(option.value) || false}
                onChange={(e) => handleFilterChange(filterKey, option.value, e.target.checked)}
                className="h-4 w-4 text-dark-900 border-dark-500 rounded focus:ring-dark-900"
              />
              <span className="ml-2 font-jost text-body text-dark-900">{option.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center justify-center w-full py-2 px-4 border border-dark-500 rounded-lg font-jost text-body-medium font-medium text-dark-900"
        >
          Filter & Sort
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-jost text-body-medium font-medium text-dark-900">Filters</h2>
            <button
              onClick={clearAllFilters}
              className="font-jost text-caption text-dark-700 hover:text-dark-900"
            >
              Clear All
            </button>
          </div>
          
          {renderFilterGroup('Gender', 'gender', FILTER_OPTIONS.gender)}
          {renderFilterGroup('Size', 'size', FILTER_OPTIONS.size)}
          {renderFilterGroup('Color', 'color', FILTER_OPTIONS.color)}
          {renderFilterGroup('Price Range', 'priceRange', FILTER_OPTIONS.priceRange)}
        </div>
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 bg-light-100 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-jost text-body-medium font-medium text-dark-900">Filters</h2>
              <button onClick={() => setIsMobileOpen(false)}>
                <X className="h-6 w-6 text-dark-900" />
              </button>
            </div>
            
            <div className="space-y-6">
              {renderFilterGroup('Gender', 'gender', FILTER_OPTIONS.gender)}
              {renderFilterGroup('Size', 'size', FILTER_OPTIONS.size)}
              {renderFilterGroup('Color', 'color', FILTER_OPTIONS.color)}
              {renderFilterGroup('Price Range', 'priceRange', FILTER_OPTIONS.priceRange)}
              
              <button
                onClick={clearAllFilters}
                className="w-full py-2 px-4 border border-dark-500 rounded-lg font-jost text-body-medium font-medium text-dark-900"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
