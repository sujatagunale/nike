'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterSection {
  title: string;
  key: string;
  options: FilterOption[];
  type: 'checkbox' | 'radio' | 'range';
}

const filterSections: FilterSection[] = [
  {
    title: 'Gender',
    key: 'gender',
    type: 'radio',
    options: [
      { label: 'Men', value: 'men' },
      { label: 'Women', value: 'women' },
      { label: 'Kids', value: 'kids' },
      { label: 'Unisex', value: 'unisex' },
    ],
  },
  {
    title: 'Kids',
    key: 'kids',
    type: 'checkbox',
    options: [
      { label: 'Boys', value: 'boys' },
      { label: 'Girls', value: 'girls' },
    ],
  },
  {
    title: 'Shop By Price',
    key: 'price',
    type: 'checkbox',
    options: [
      { label: '$25 - $50', value: '25-50' },
      { label: '$50 - $100', value: '50-100' },
      { label: '$100 - $150', value: '100-150' },
      { label: 'Over $150', value: '150+' },
    ],
  },
  {
    title: 'Size',
    key: 'size',
    type: 'checkbox',
    options: [
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
    ],
  },
  {
    title: 'Color',
    key: 'color',
    type: 'checkbox',
    options: [
      { label: 'Black', value: 'black' },
      { label: 'White', value: 'white' },
      { label: 'Red', value: 'red' },
      { label: 'Blue', value: 'blue' },
      { label: 'Green', value: 'green' },
      { label: 'Yellow', value: 'yellow' },
    ],
  },
  {
    title: 'Sports',
    key: 'category',
    type: 'checkbox',
    options: [
      { label: 'Lifestyle', value: 'lifestyle' },
      { label: 'Running', value: 'running' },
      { label: 'Basketball', value: 'basketball' },
      { label: 'Training', value: 'training' },
      { label: 'Skateboarding', value: 'skateboarding' },
    ],
  },
];

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['gender', 'price'])
  );
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const updateURL = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      if (key === 'price') {
        const [min, max] = value.includes('-') ? value.split('-') : [value.replace('+', ''), ''];
        if (min) params.set('minPrice', min);
        if (max) params.set('maxPrice', max);
        params.delete('price');
      } else {
        params.set(key, value);
      }
    } else {
      params.delete(key);
      if (key === 'price') {
        params.delete('minPrice');
        params.delete('maxPrice');
      }
    }

    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey);
    } else {
      newExpanded.add(sectionKey);
    }
    setExpandedSections(newExpanded);
  };

  const isFilterActive = (key: string, value: string) => {
    if (key === 'price') {
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const [min, max] = value.includes('-') ? value.split('-') : [value.replace('+', ''), ''];
      return minPrice === min && (max === '' || maxPrice === max);
    }
    return searchParams.get(key) === value;
  };

  const clearAllFilters = () => {
    router.push('/products', { scroll: false });
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(key => 
    key !== 'sort' && searchParams.get(key)
  ).length;

  const FilterSection = ({ section }: { section: FilterSection }) => {
    const isExpanded = expandedSections.has(section.key);
    
    return (
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection(section.key)}
          className="flex items-center justify-between w-full py-2 font-jost text-body-medium font-medium text-dark-900 hover:text-dark-700"
        >
          {section.title}
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isExpanded && (
          <div className="mt-3 space-y-2">
            {section.options.map((option) => {
              const isActive = isFilterActive(section.key, option.value);
              
              return (
                <label
                  key={option.value}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type={section.type === 'radio' ? 'radio' : 'checkbox'}
                    name={section.type === 'radio' ? section.key : undefined}
                    checked={isActive}
                    onChange={(e) => {
                      if (section.type === 'radio') {
                        updateURL(section.key, e.target.checked ? option.value : null);
                      } else {
                        updateURL(section.key, isActive ? null : option.value);
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 border border-dark-500 rounded-sm mr-3 flex items-center justify-center ${
                    isActive ? 'bg-dark-900 border-dark-900' : 'group-hover:border-dark-700'
                  }`}>
                    {isActive && (
                      <svg className="w-3 h-3 text-light-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-jost text-caption ${
                    isActive ? 'text-dark-900 font-medium' : 'text-dark-700 group-hover:text-dark-900'
                  }`}>
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center justify-between w-full p-4 bg-light-200 rounded-lg font-jost text-body-medium font-medium text-dark-900"
        >
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          <svg
            className={`w-5 h-5 transition-transform ${isMobileFiltersOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Panel */}
      <div className={`${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Filter Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-jost text-body-medium font-medium text-dark-900 hidden lg:block">
            Filters
          </h2>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="font-jost text-caption text-dark-700 hover:text-dark-900 underline"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Filter Categories */}
        <div className="space-y-6">
          {/* Category Navigation */}
          <div className="space-y-2">
            <div className="font-jost text-caption text-dark-700 space-y-1">
              <button 
                onClick={() => updateURL('category', 'low-top')}
                className="block hover:text-dark-900"
              >
                Low Top
              </button>
              <button 
                onClick={() => updateURL('category', 'high-top')}
                className="block hover:text-dark-900"
              >
                High Top
              </button>
              <button 
                onClick={() => updateURL('category', 'skateboarding')}
                className="block hover:text-dark-900"
              >
                Skateboarding
              </button>
              <button 
                onClick={() => updateURL('category', 'nike-by-you')}
                className="block hover:text-dark-900"
              >
                Nike By You
              </button>
            </div>
          </div>

          {/* Dynamic Filter Sections */}
          {filterSections.map((section) => (
            <FilterSection key={section.key} section={section} />
          ))}
        </div>
      </div>
    </>
  );
}
