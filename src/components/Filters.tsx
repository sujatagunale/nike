'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, ChevronUp, X, Menu } from 'lucide-react';
import { parseSearchParams, buildQueryString, toggleArrayParam, updateQueryParam, clearAllFilters, type FilterParams } from '@/lib/utils/query';

interface FilterOption {
  id: string;
  name?: string;
  label?: string;
  slug: string;
  hexCode?: string;
}

interface FilterOptions {
  genders: FilterOption[];
  sizes: FilterOption[];
  colors: FilterOption[];
}

interface FiltersProps {
  options: FilterOptions;
  currentFilters: FilterParams;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
  renderOption?: (option: FilterOption, isSelected: boolean) => React.ReactNode;
}

function FilterGroup({ title, options, selectedValues, onToggle, renderOption }: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border-b border-light-300 pb-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4 font-jost text-body-medium font-medium text-dark-900"
      >
        {title}
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.slug);
            const displayName = option.name || option.label || option.slug;

            return (
              <label
                key={option.id}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggle(option.slug)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded mr-3 flex items-center justify-center transition-colors ${
                  isSelected 
                    ? 'bg-dark-900 border-dark-900' 
                    : 'border-dark-500 group-hover:border-dark-900'
                }`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-light-100" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {renderOption ? renderOption(option, isSelected) : (
                  <span className={`font-jost text-body transition-colors ${
                    isSelected ? 'text-dark-900 font-medium' : 'text-dark-700 group-hover:text-dark-900'
                  }`}>
                    {displayName}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PriceRangeFilter({ 
  priceMin, 
  priceMax, 
  onPriceChange 
}: { 
  priceMin?: number; 
  priceMax?: number; 
  onPriceChange: (min?: number, max?: number) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localMin, setLocalMin] = useState(priceMin?.toString() || '');
  const [localMax, setLocalMax] = useState(priceMax?.toString() || '');

  const handleApply = () => {
    const min = localMin ? parseFloat(localMin) : undefined;
    const max = localMax ? parseFloat(localMax) : undefined;
    onPriceChange(min, max);
  };

  const handleClear = () => {
    setLocalMin('');
    setLocalMax('');
    onPriceChange(undefined, undefined);
  };

  return (
    <div className="border-b border-light-300 pb-6 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full mb-4 font-jost text-body-medium font-medium text-dark-900"
      >
        Price Range
        {isExpanded ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full px-3 py-2 border border-light-400 rounded-md font-jost text-body focus:outline-none focus:border-dark-900"
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full px-3 py-2 border border-light-400 rounded-md font-jost text-body focus:outline-none focus:border-dark-900"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2 bg-dark-900 text-light-100 rounded-md font-jost text-body-medium font-medium hover:bg-dark-700 transition-colors"
            >
              Apply
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 border border-dark-500 text-dark-700 rounded-md font-jost text-body-medium hover:border-dark-900 hover:text-dark-900 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Filters({ options, currentFilters }: FiltersProps) {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const updateFilters = (newFilters: FilterParams) => {
    const queryString = buildQueryString(newFilters);
    const newUrl = queryString ? `/products?${queryString}` : '/products';
    router.push(newUrl, { scroll: false });
  };

  const handleToggleFilter = (type: 'gender' | 'size' | 'color', value: string) => {
    const newFilters = toggleArrayParam(currentFilters, type, value);
    updateFilters(newFilters);
  };

  const handlePriceChange = (min?: number, max?: number) => {
    let newFilters = { ...currentFilters };
    newFilters = updateQueryParam(newFilters, 'priceMin', min);
    newFilters = updateQueryParam(newFilters, 'priceMax', max);
    updateFilters(newFilters);
  };

  const handleClearAll = () => {
    updateFilters(clearAllFilters());
  };

  const hasActiveFilters = !!(
    currentFilters.gender?.length ||
    currentFilters.size?.length ||
    currentFilters.color?.length ||
    currentFilters.priceMin !== undefined ||
    currentFilters.priceMax !== undefined
  );

  const renderColorOption = (option: FilterOption, isSelected: boolean) => (
    <div className="flex items-center">
      <div
        className="w-4 h-4 rounded-full border border-light-400 mr-2"
        style={{ backgroundColor: option.hexCode }}
      />
      <span className={`font-jost text-body transition-colors ${
        isSelected ? 'text-dark-900 font-medium' : 'text-dark-700 group-hover:text-dark-900'
      }`}>
        {option.name}
      </span>
    </div>
  );

  const FiltersContent = () => (
    <div className="bg-light-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-jost text-heading-3 font-medium text-dark-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="font-jost text-body text-dark-700 hover:text-dark-900 underline"
          >
            Clear All
          </button>
        )}
      </div>

      <FilterGroup
        title="Gender"
        options={options.genders}
        selectedValues={currentFilters.gender || []}
        onToggle={(value) => handleToggleFilter('gender', value)}
      />

      <FilterGroup
        title="Size"
        options={options.sizes}
        selectedValues={currentFilters.size || []}
        onToggle={(value) => handleToggleFilter('size', value)}
      />

      <FilterGroup
        title="Color"
        options={options.colors}
        selectedValues={currentFilters.color || []}
        onToggle={(value) => handleToggleFilter('color', value)}
        renderOption={renderColorOption}
      />

      <PriceRangeFilter
        priceMin={currentFilters.priceMin}
        priceMax={currentFilters.priceMax}
        onPriceChange={handlePriceChange}
      />
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-dark-500 rounded-md font-jost text-body-medium hover:border-dark-900 transition-colors"
        >
          <Menu className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="bg-dark-900 text-light-100 text-caption px-2 py-0.5 rounded-full">
              {(currentFilters.gender?.length || 0) + 
               (currentFilters.size?.length || 0) + 
               (currentFilters.color?.length || 0) +
               (currentFilters.priceMin !== undefined || currentFilters.priceMax !== undefined ? 1 : 0)}
            </span>
          )}
        </button>
      </div>

      <div className="hidden lg:block">
        <FiltersContent />
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-dark-900 bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-80 bg-light-100 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-jost text-heading-3 font-medium text-dark-900">
                  Filters
                </h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-light-200 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FiltersContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
