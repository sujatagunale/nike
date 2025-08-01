import { Suspense } from 'react';
import { parseSearchParams, type FilterParams } from '@/lib/utils/query';
import Card from '@/components/Card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';

interface ProductWithDetails {
  id: string;
  name: string;
  description: string | null;
  category: { name: string };
  gender: { label: string; slug: string };
  brand: { name: string };
  image: string;
  minPrice: number;
  maxPrice: number;
  colorCount: number;
  createdAt: Date;
}

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

interface ProductsPageProps {
  searchParams: SearchParams;
}

async function getFilterOptions() {
  return {
    genders: [
      { id: '1', label: 'Men', slug: 'men' },
      { id: '2', label: 'Women', slug: 'women' },
      { id: '3', label: 'Kids', slug: 'kids' },
    ],
    sizes: [
      { id: '1', label: 'XS', slug: 'xs', sortOrder: 1 },
      { id: '2', label: 'S', slug: 's', sortOrder: 2 },
      { id: '3', label: 'M', slug: 'm', sortOrder: 3 },
      { id: '4', label: 'L', slug: 'l', sortOrder: 4 },
      { id: '5', label: 'XL', slug: 'xl', sortOrder: 5 },
      { id: '6', label: 'XXL', slug: 'xxl', sortOrder: 6 },
    ],
    colors: [
      { id: '1', label: 'Black', slug: 'black', hexCode: '#000000' },
      { id: '2', label: 'White', slug: 'white', hexCode: '#FFFFFF' },
      { id: '3', label: 'Red', slug: 'red', hexCode: '#FF0000' },
      { id: '4', label: 'Blue', slug: 'blue', hexCode: '#0000FF' },
      { id: '5', label: 'Green', slug: 'green', hexCode: '#008000' },
      { id: '6', label: 'Gray', slug: 'gray', hexCode: '#808080' },
    ],
  };
}

async function getProducts(filters: FilterParams): Promise<ProductWithDetails[]> {
  const mockProducts: ProductWithDetails[] = [
    {
      id: '1',
      name: 'Air Max 270',
      description: 'Comfortable running shoes with Air Max technology',
      category: { name: 'Shoes' },
      gender: { label: 'Men', slug: 'men' },
      brand: { name: 'Nike' },
      image: '/placeholder-shoe-1.jpg',
      minPrice: 150,
      maxPrice: 150,
      colorCount: 3,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'React Infinity Run',
      description: 'Lightweight running shoes for daily training',
      category: { name: 'Shoes' },
      gender: { label: 'Women', slug: 'women' },
      brand: { name: 'Nike' },
      image: '/placeholder-shoe-2.jpg',
      minPrice: 160,
      maxPrice: 160,
      colorCount: 2,
      createdAt: new Date('2024-02-01'),
    },
    {
      id: '3',
      name: 'Dri-FIT Training Shirt',
      description: 'Moisture-wicking training shirt',
      category: { name: 'Apparel' },
      gender: { label: 'Men', slug: 'men' },
      brand: { name: 'Nike' },
      image: '/placeholder-apparel-1.jpg',
      minPrice: 35,
      maxPrice: 35,
      colorCount: 4,
      createdAt: new Date('2024-01-20'),
    },
    {
      id: '4',
      name: 'Pro Training Shorts',
      description: 'Flexible shorts for training and workouts',
      category: { name: 'Apparel' },
      gender: { label: 'Women', slug: 'women' },
      brand: { name: 'Nike' },
      image: '/placeholder-apparel-2.jpg',
      minPrice: 45,
      maxPrice: 45,
      colorCount: 3,
      createdAt: new Date('2024-01-25'),
    },
    {
      id: '5',
      name: 'Air Force 1',
      description: 'Classic basketball shoes with timeless style',
      category: { name: 'Shoes' },
      gender: { label: 'Kids', slug: 'kids' },
      brand: { name: 'Nike' },
      image: '/placeholder-shoe-3.jpg',
      minPrice: 90,
      maxPrice: 90,
      colorCount: 5,
      createdAt: new Date('2024-02-10'),
    },
    {
      id: '6',
      name: 'Zoom Pegasus 40',
      description: 'Responsive running shoes for all distances',
      category: { name: 'Shoes' },
      gender: { label: 'Men', slug: 'men' },
      brand: { name: 'Nike' },
      image: '/placeholder-shoe-4.jpg',
      minPrice: 130,
      maxPrice: 130,
      colorCount: 4,
      createdAt: new Date('2024-02-15'),
    },
  ];

  let filteredProducts = [...mockProducts];

  if (filters.gender?.length) {
    filteredProducts = filteredProducts.filter(product => 
      filters.gender!.includes(product.gender.slug)
    );
  }

  if (filters.priceMin !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.minPrice >= filters.priceMin!
    );
  }

  if (filters.priceMax !== undefined) {
    filteredProducts = filteredProducts.filter(product => 
      product.maxPrice <= filters.priceMax!
    );
  }

  switch (filters.sort) {
    case 'price_asc':
      filteredProducts.sort((a, b) => a.minPrice - b.minPrice);
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => b.minPrice - a.minPrice);
      break;
    case 'newest':
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    default:
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  return filteredProducts;
}

function ActiveFilters({ filters }: { filters: FilterParams }) {
  const activeFilters = [];

  if (filters.gender?.length) {
    activeFilters.push(...filters.gender.map(g => ({ type: 'gender', value: g, label: g })));
  }
  if (filters.size?.length) {
    activeFilters.push(...filters.size.map(s => ({ type: 'size', value: s, label: `Size: ${s}` })));
  }
  if (filters.color?.length) {
    activeFilters.push(...filters.color.map(c => ({ type: 'color', value: c, label: c })));
  }
  if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
    const priceLabel = `$${filters.priceMin || 0} - $${filters.priceMax || '∞'}`;
    activeFilters.push({ type: 'price', value: 'price', label: priceLabel });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {activeFilters.map((filter, index) => (
        <span
          key={`${filter.type}-${filter.value}-${index}`}
          className="inline-flex items-center px-3 py-1 rounded-full bg-dark-900 text-light-100 font-jost text-caption font-medium"
        >
          {filter.label}
        </span>
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => urlSearchParams.append(key, v));
    } else if (value) {
      urlSearchParams.set(key, value);
    }
  });

  const filters = parseSearchParams(urlSearchParams);
  const [filterOptions, productsData] = await Promise.all([
    getFilterOptions(),
    getProducts(filters),
  ]);

  return (
    <div className="min-h-screen bg-light-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80 flex-shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <Filters 
                options={filterOptions}
                currentFilters={filters}
              />
            </Suspense>
          </aside>

          <main className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="font-jost text-heading-2 font-bold text-dark-900 mb-2">
                  Products
                </h1>
                <p className="font-jost text-body text-dark-700">
                  {productsData.length} {productsData.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Suspense fallback={<div>Loading sort...</div>}>
                  <Sort currentSort={filters.sort} />
                </Suspense>
              </div>
            </div>

            <ActiveFilters filters={filters} />

            {productsData.length === 0 ? (
              <div className="text-center py-16">
                <h2 className="font-jost text-heading-3 font-medium text-dark-900 mb-4">
                  No products found
                </h2>
                <p className="font-jost text-body text-dark-700 mb-6">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.map((product) => (
                  <Card
                    key={product.id}
                    title={product.name}
                    category={product.category.name}
                    price={product.minPrice}
                    image={product.image}
                    colors={product.colorCount}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
