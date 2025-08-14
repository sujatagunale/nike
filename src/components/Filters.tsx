'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { parseFilters, useUpdateUrlFilters, ProductQuery } from '@/lib/utils/query';
import { filterOptions } from '@/lib/data/products';

interface FiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Filters({ isOpen, onClose }: FiltersProps) {
  const searchParams = useSearchParams();
  const updateUrlFilters = useUpdateUrlFilters();
  const [filters, setFilters] = useState<ProductQuery>({});
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    color: true,
    size: true,
    price: true,
  });

  useEffect(() => {
    const currentFilters = parseFilters(searchParams);
    setFilters(currentFilters);
  }, [searchParams]);

  const updateFilters = (newFilters: ProductQuery) => {
    updateUrlFilters(newFilters);
  };

  const handleFilterChange = (filterType: keyof ProductQuery, value: string, checked: boolean) => {
    const currentValues = filters[filterType] as string[] || [];
    const newValues = checked 
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    const newFilters = {
      ...filters,
      [filterType]: newValues.length > 0 ? newValues : undefined,
      page: 1,
    };
    
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const handlePriceRangeChange = (range: { min: number; max: number }, checked: boolean) => {
    const newFilters = {
      ...filters,
      priceMin: checked ? range.min : undefined,
      priceMax: checked ? range.max : undefined,
      page: 1,
    };
    
    setFilters(newFilters);
    updateFilters(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = { page: 1 };
    setFilters(clearedFilters);
    updateFilters(clearedFilters);
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isPriceRangeSelected = (range: { min: number; max: number }) => {
    return filters.priceMin === range.min && filters.priceMax === range.max;
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-light-100 
        transform transition-transform duration-300 ease-in-out
        lg:transform-none lg:w-64 lg:flex-shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-jost text-heading-3 font-medium text-dark-900">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-light-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={clearAllFilters}
            className="w-full mb-6 px-4 py-2 text-body text-dark-700 hover:text-dark-900 border border-light-300 rounded-lg hover:bg-light-200 transition-colors"
          >
            Clear All Filters
          </button>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('gender')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-jost text-body-medium font-medium text-dark-900">
                Gender
              </h3>
              {expandedSections.gender ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.gender && (
              <div className="space-y-2">
                {filterOptions.genders.map((gender) => (
                  <label key={gender.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.gender?.includes(gender.slug) || false}
                      onChange={(e) => handleFilterChange('gender', gender.slug, e.target.checked)}
                      className="mr-3 w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                    />
                    <span className="font-jost text-body text-dark-700">
                      {gender.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('color')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-jost text-body-medium font-medium text-dark-900">
                Color
              </h3>
              {expandedSections.color ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.color && (
              <div className="space-y-2">
                {filterOptions.colors.map((color) => (
                  <label key={color.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.color?.includes(color.slug) || false}
                      onChange={(e) => handleFilterChange('color', color.slug, e.target.checked)}
                      className="mr-3 w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                    />
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-2 border border-light-300"
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <span className="font-jost text-body text-dark-700">
                        {color.name}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('size')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-jost text-body-medium font-medium text-dark-900">
                Size
              </h3>
              {expandedSections.size ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.size && (
              <div className="space-y-2">
                {filterOptions.sizes.map((size) => (
                  <label key={size.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.size?.includes(size.slug) || false}
                      onChange={(e) => handleFilterChange('size', size.slug, e.target.checked)}
                      className="mr-3 w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                    />
                    <span className="font-jost text-body text-dark-700">
                      {size.name}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mb-6">
            <button
              onClick={() => toggleSection('price')}
              className="flex items-center justify-between w-full mb-3"
            >
              <h3 className="font-jost text-body-medium font-medium text-dark-900">
                Shop By Price
              </h3>
              {expandedSections.price ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
            
            {expandedSections.price && (
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <label key={range.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isPriceRangeSelected(range)}
                      onChange={(e) => handlePriceRangeChange(range, e.target.checked)}
                      className="mr-3 w-4 h-4 text-dark-900 border-light-400 rounded focus:ring-dark-900"
                    />
                    <span className="font-jost text-body text-dark-700">
                      {range.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
