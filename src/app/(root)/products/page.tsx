import { Suspense } from 'react';
import Card from '@/components/Card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { parseFilters } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function ActiveFilters({ filters }: { filters: ReturnType<typeof parseFilters> }) {
  const activeFilters = [];

  if (filters.gender?.length) {
    activeFilters.push(...filters.gender.map(g => ({ type: 'Gender', value: g })));
  }
  if (filters.color?.length) {
    activeFilters.push(...filters.color.map(c => ({ type: 'Color', value: c })));
  }
  if (filters.size?.length) {
    activeFilters.push(...filters.size.map(s => ({ type: 'Size', value: s })));
  }
  if (filters.priceRange) {
    const priceRanges = {
      'under-150': 'Under $150',
      '150-200': '$150 - $200',
      '200-250': '$200 - $250',
      'over-250': 'Over $250',
    };
    const label = priceRanges[filters.priceRange as keyof typeof priceRanges];
    if (label) {
      activeFilters.push({ type: 'Price', value: label });
    }
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full bg-dark-900 text-light-100 font-jost text-caption"
          >
            {filter.type}: {filter.value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const searchParamsObj = new URLSearchParams(
    Object.entries(resolvedSearchParams).flatMap(([key, value]) =>
      Array.isArray(value) ? value.map(v => [key, v]) : [[key, value as string]]
    )
  );
  
  const filters = parseFilters(searchParamsObj);
  const { products, totalCount } = await getAllProducts(filters);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Suspense fallback={<div>Loading filters...</div>}>
            <Filters />
          </Suspense>
        </aside>
        
        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-heading-3 font-jost font-bold text-dark-900">
              Products ({totalCount})
            </h1>
            <Suspense fallback={<div>Loading sort...</div>}>
              <Sort />
            </Suspense>
          </div>

          <ActiveFilters filters={filters} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
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

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark-700 font-jost text-body mb-4">
                No products found matching your filters.
              </p>
              <p className="text-dark-500 font-jost text-caption">
                Try adjusting your filters or browse all products.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
