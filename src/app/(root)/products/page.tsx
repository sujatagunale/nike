import { Suspense } from 'react';
import Card from '@/components/Card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import { mockProducts, filterOptions } from '@/lib/data/products';
import { parseFilters } from '@/lib/utils/query';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function filterProducts(products: typeof mockProducts, filters: ReturnType<typeof parseFilters>) {
  let filtered = [...products];

  if (filters.gender?.length) {
    filtered = filtered.filter(product => 
      filters.gender!.some(g => product.gender.toLowerCase() === g.toLowerCase())
    );
  }

  if (filters.color?.length) {
    filtered = filtered.filter(product =>
      filters.color!.some(c => product.colors.some(pc => pc.toLowerCase() === c.toLowerCase()))
    );
  }

  if (filters.size?.length) {
    filtered = filtered.filter(product =>
      filters.size!.some(s => product.sizes.includes(s))
    );
  }

  if (filters.priceRange) {
    const range = filterOptions.priceRanges.find(r => r.slug === filters.priceRange);
    if (range) {
      filtered = filtered.filter(product => {
        const price = product.salePrice || product.price;
        return price >= range.min && price <= range.max;
      });
    }
  }

  switch (filters.sort) {
    case 'price_asc':
      filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      break;
    case 'price_desc':
      filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      break;
    case 'newest':
      filtered.reverse();
      break;
    default:
      break;
  }

  return filtered;
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
    const range = filterOptions.priceRanges.find(r => r.slug === filters.priceRange);
    if (range) {
      activeFilters.push({ type: 'Price', value: range.label });
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
  const filteredProducts = filterProducts(mockProducts, filters);

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
              Products ({filteredProducts.length})
            </h1>
            <Suspense fallback={<div>Loading sort...</div>}>
              <Sort />
            </Suspense>
          </div>

          <ActiveFilters filters={filters} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <Card
                key={product.id}
                title={product.name}
                category={product.category}
                price={product.salePrice || product.price}
                image={product.image}
                colors={product.colors.length}
                badge={product.badge}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
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
