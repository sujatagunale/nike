"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface FilterProps {
  currentFilters: Record<string, string | undefined>;
}

interface FilterSection {
  title: string;
  key: string;
  options: { label: string; value: string; color?: string }[];
}

const filterSections: FilterSection[] = [
  {
    title: "Gender",
    key: "gender",
    options: [
      { label: "Men", value: "men" },
      { label: "Women", value: "women" },
      { label: "Unisex", value: "unisex" },
    ],
  },
  {
    title: "Category",
    key: "category",
    options: [
      { label: "Running", value: "running" },
      { label: "Basketball", value: "basketball" },
      { label: "Casual", value: "casual" },
      { label: "Training", value: "training" },
      { label: "Skateboarding", value: "skateboarding" },
    ],
  },
  {
    title: "Color",
    key: "color",
    options: [
      { label: "Black", value: "black", color: "#000000" },
      { label: "White", value: "white", color: "#FFFFFF" },
      { label: "Red", value: "red", color: "#FF0000" },
      { label: "Blue", value: "blue", color: "#0000FF" },
      { label: "Gray", value: "gray", color: "#808080" },
      { label: "Green", value: "green", color: "#008000" },
      { label: "Orange", value: "orange", color: "#FFA500" },
      { label: "Purple", value: "purple", color: "#800080" },
    ],
  },
  {
    title: "Size",
    key: "size",
    options: [
      { label: "6", value: "6" },
      { label: "6.5", value: "6.5" },
      { label: "7", value: "7" },
      { label: "7.5", value: "7.5" },
      { label: "8", value: "8" },
      { label: "8.5", value: "8.5" },
      { label: "9", value: "9" },
      { label: "9.5", value: "9.5" },
      { label: "10", value: "10" },
      { label: "10.5", value: "10.5" },
      { label: "11", value: "11" },
      { label: "11.5", value: "11.5" },
      { label: "12", value: "12" },
    ],
  },
];

const priceRanges = [
  { label: "$25 - $50", min: "25", max: "50" },
  { label: "$50 - $100", min: "50", max: "100" },
  { label: "$100 - $150", min: "100", max: "150" },
  { label: "Over $150", min: "150", max: "" },
];

export default function Filter({ currentFilters }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: true,
    category: false,
    color: false,
    size: false,
    price: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (currentFilters[key] === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    
    if (key === 'priceMin' || key === 'priceMax') {
      if (key === 'priceMin') {
        params.delete('priceMax');
      } else {
        params.delete('priceMin');
      }
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const updatePriceFilter = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    const currentMin = currentFilters.priceMin;
    const currentMax = currentFilters.priceMax;
    
    if (currentMin === min && currentMax === max) {
      params.delete('priceMin');
      params.delete('priceMax');
    } else {
      if (min) params.set('priceMin', min);
      if (max) params.set('priceMax', max);
      if (!min) params.delete('priceMin');
      if (!max) params.delete('priceMax');
    }
    
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const sort = searchParams.get('sort');
    if (sort) params.set('sort', sort);
    router.push(`/products?${params.toString()}`, { scroll: false });
  };

  const hasActiveFilters = Object.keys(currentFilters).some(key => 
    currentFilters[key] && key !== 'sort'
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-heading-3 font-jost font-medium text-dark-900">
          Filters
        </h2>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-caption font-jost text-dark-700 hover:text-dark-900 underline"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {filterSections.map((section) => (
          <div key={section.key} className="border-b border-light-300 pb-4">
            <button
              onClick={() => toggleSection(section.key)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-body font-jost font-medium text-dark-900">
                {section.title}
              </h3>
              <svg
                className={`w-4 h-4 transition-transform ${
                  expandedSections[section.key] ? 'rotate-180' : ''
                }`}
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
            </button>

            {expandedSections[section.key] && (
              <div className="mt-3 space-y-2">
                {section.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={currentFilters[section.key] === option.value}
                      onChange={() => updateFilter(section.key, option.value)}
                      className="w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                    />
                    <div className="flex items-center space-x-2">
                      {option.color && (
                        <div
                          className="w-4 h-4 rounded-full border border-light-400"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="text-caption font-jost text-dark-900">
                        {option.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="border-b border-light-300 pb-4">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-body font-jost font-medium text-dark-900">
              Shop By Price
            </h3>
            <svg
              className={`w-4 h-4 transition-transform ${
                expandedSections.price ? 'rotate-180' : ''
              }`}
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
          </button>

          {expandedSections.price && (
            <div className="mt-3 space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={`${range.min}-${range.max}`}
                  className="flex items-center space-x-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      currentFilters.priceMin === range.min &&
                      currentFilters.priceMax === range.max
                    }
                    onChange={() => updatePriceFilter(range.min, range.max)}
                    className="w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                  />
                  <span className="text-caption font-jost text-dark-900">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
