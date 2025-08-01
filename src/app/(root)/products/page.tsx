import { Suspense } from 'react';
import Card from '@/components/Card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { MOCK_PRODUCTS, getFilteredProducts } from '@/lib/data/products';
import { parseFiltersFromUrl } from '@/lib/utils/query';

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      urlSearchParams.set(key, Array.isArray(value) ? value.join(',') : value);
    }
  });

  const filters = parseFiltersFromUrl(urlSearchParams);
  const sort = (searchParams.sort as string) || 'featured';
  const filteredProducts = getFilteredProducts(MOCK_PRODUCTS, filters, sort);

  const activeFilters = Object.entries(filters).flatMap(([key, values]) =>
    values?.map(value => ({ key, value })) || []
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <Filters initialFilters={filters} />
          </Suspense>
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-heading-3 font-jost font-bold text-dark-900">
                New ({filteredProducts.length})
              </h1>
              
              {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {activeFilters.map(({ key, value }) => (
                    <span
                      key={`${key}-${value}`}
                      className="inline-flex items-center px-3 py-1 rounded-full text-caption font-medium bg-light-200 text-dark-900"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0">
              <Sort initialSort={sort} />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => {
                const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
                const minPrice = Math.min(...product.variants.map(v => v.salePrice || v.price));
                const colors = [...new Set(product.variants.map(v => v.color.name))];
                
                return (
                  <Card
                    key={product.id}
                    title={product.name}
                    category={product.category.name}
                    price={minPrice}
                    image={primaryImage.url}
                    colors={colors.length}
                    badge={product.variants.some(v => v.salePrice) ? 'Sale' : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-body text-dark-700">No products found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
