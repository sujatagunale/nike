'use client';

import React, { Suspense, useState } from 'react';
import { Filter } from 'lucide-react';
import Card from '@/components/Card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { parseFilters } from '@/lib/utils/query';
import { mockProducts, filterOptions } from '@/lib/data/products';
import { useSearchParams } from 'next/navigation';

function filterProducts(products: typeof mockProducts, filters: ReturnType<typeof parseFilters>) {
  return products.filter(product => {
    if (filters.gender && filters.gender.length > 0) {
      if (!filters.gender.includes(product.gender)) return false;
    }

    if (filters.color && filters.color.length > 0) {
      return true;
    }

    if (filters.size && filters.size.length > 0) {
      return true;
    }

    if (filters.priceMin !== undefined && product.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && product.price > filters.priceMax) return false;

    return true;
  });
}

function sortProducts(products: typeof mockProducts, sortBy?: string) {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.reverse();
    case 'featured':
    default:
      return sorted;
  }
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filters = parseFilters(searchParams);
  const filteredProducts = filterProducts(mockProducts, filters);
  const sortedProducts = sortProducts(filteredProducts, filters.sort);

  const activeFiltersCount = [
    filters.gender?.length || 0,
    filters.color?.length || 0,
    filters.size?.length || 0,
    filters.priceMin || filters.priceMax ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <Filters 
            isOpen={isFiltersOpen} 
            onClose={() => setIsFiltersOpen(false)} 
          />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-jost text-heading-2 font-bold text-dark-900 mb-2">
                New ({sortedProducts.length})
              </h1>
              
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.gender?.map(gender => (
                    <span key={gender} className="px-3 py-1 bg-light-200 text-dark-700 rounded-full text-caption">
                      {filterOptions.genders.find(g => g.slug === gender)?.label}
                    </span>
                  ))}
                  {filters.color?.map(color => (
                    <span key={color} className="px-3 py-1 bg-light-200 text-dark-700 rounded-full text-caption">
                      {filterOptions.colors.find(c => c.slug === color)?.name}
                    </span>
                  ))}
                  {filters.size?.map(size => (
                    <span key={size} className="px-3 py-1 bg-light-200 text-dark-700 rounded-full text-caption">
                      {filterOptions.sizes.find(s => s.slug === size)?.name}
                    </span>
                  ))}
                  {(filters.priceMin || filters.priceMax) && (
                    <span className="px-3 py-1 bg-light-200 text-dark-700 rounded-full text-caption">
                      {filterOptions.priceRanges.find(r => r.min === filters.priceMin && r.max === filters.priceMax)?.label}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Sort />
              
              <button 
                onClick={() => setIsFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-light-300 rounded-lg hover:bg-light-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="font-jost text-body">Filter</span>
              </button>
            </div>
          </div>

          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  title={product.name}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                  colors={product.colors}
                  badge={product.badge}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="font-jost text-body text-dark-700">
                No products found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
