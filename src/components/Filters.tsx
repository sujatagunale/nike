'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { filterOptions } from '@/lib/data/products';
import { parseFilters, updateUrlFilters } from '@/lib/utils/query';

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    gender: true,
    color: true,
    size: true,
    price: true,
  });

  const currentFilters = parseFilters(searchParams);

  const toggleFilter = (filterType: keyof typeof currentFilters, value: string) => {
    const currentValues = currentFilters[filterType] as string[] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];

    const newFilters = {
      ...currentFilters,
      [filterType]: newValues.length > 0 ? newValues : undefined,
    };

    updateUrlFilters(newFilters, router, pathname);
  };

  const toggleGroup = (group: keyof typeof expandedGroups) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const FilterGroup = ({ 
    title, 
    groupKey, 
    children 
  }: { 
    title: string; 
    groupKey: keyof typeof expandedGroups; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-light-300 pb-4 mb-4">
      <button
        onClick={() => toggleGroup(groupKey)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-jost text-body-medium font-medium text-dark-900">
          {title}
        </h3>
        <svg
          className={`w-4 h-4 transition-transform ${
            expandedGroups[groupKey] ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expandedGroups[groupKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const filtersContent = (
    <div className="space-y-6">
      <FilterGroup title="Gender" groupKey="gender">
        {filterOptions.genders.map(gender => (
          <label key={gender.slug} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.gender?.includes(gender.slug) || false}
              onChange={() => toggleFilter('gender', gender.slug)}
              className="rounded border-light-400 text-dark-900 focus:ring-dark-900"
            />
            <span className="font-jost text-body text-dark-900">{gender.label}</span>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Color" groupKey="color">
        {filterOptions.colors.map(color => (
          <label key={color.slug} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={currentFilters.color?.includes(color.slug) || false}
              onChange={() => toggleFilter('color', color.slug)}
              className="rounded border-light-400 text-dark-900 focus:ring-dark-900"
            />
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full border border-light-400"
                style={{ backgroundColor: color.hexCode }}
              />
              <span className="font-jost text-body text-dark-900">{color.name}</span>
            </div>
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Size" groupKey="size">
        <div className="grid grid-cols-3 gap-2">
          {filterOptions.sizes.map(size => (
            <label key={size.slug} className="cursor-pointer">
              <input
                type="checkbox"
                checked={currentFilters.size?.includes(size.slug) || false}
                onChange={() => toggleFilter('size', size.slug)}
                className="sr-only"
              />
              <div className={`
                border-2 rounded-lg p-2 text-center font-jost text-body transition-colors
                ${currentFilters.size?.includes(size.slug)
                  ? 'border-dark-900 bg-dark-900 text-light-100'
                  : 'border-light-400 text-dark-900 hover:border-dark-700'
                }
              `}>
                {size.name}
              </div>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price Range" groupKey="price">
        {filterOptions.priceRanges.map(range => (
          <label key={range.slug} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              checked={currentFilters.priceRange === range.slug}
              onChange={() => {
                const newFilters = {
                  ...currentFilters,
                  priceRange: currentFilters.priceRange === range.slug ? undefined : range.slug,
                };
                updateUrlFilters(newFilters, router, pathname);
              }}
              className="text-dark-900 focus:ring-dark-900"
            />
            <span className="font-jost text-body text-dark-900">{range.label}</span>
          </label>
        ))}
      </FilterGroup>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-light-400 rounded-lg font-jost text-body"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      <div className="hidden lg:block">
        <h2 className="font-jost text-heading-3 font-bold text-dark-900 mb-6">Filters</h2>
        {filtersContent}
      </div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-light-100 shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-jost text-heading-3 font-bold text-dark-900">Filters</h2>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-light-200 rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {filtersContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
