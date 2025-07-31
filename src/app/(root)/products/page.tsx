import Card from "@/components/Card";
import Filter from "@/components/Filter";
import Sort from "@/components/Sort";

interface ProductsPageProps {
  searchParams: {
    gender?: string;
    category?: string;
    color?: string;
    size?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
  };
}

interface MockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors: number;
  badge?: string;
  gender: string;
  colorSlug: string;
  sizeAvailable: string[];
  categorySlug: string;
}

const mockProducts: MockProduct[] = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 6,
    badge: "Best Seller",
    gender: "men",
    colorSlug: "white",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 4,
    badge: "Extra 20% off",
    gender: "men",
    colorSlug: "black",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "3",
    name: "Nike Air Force 1 PLT.FORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 1,
    badge: "Sustainable Materials",
    gender: "men",
    colorSlug: "gray",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "4",
    name: "Nike Dunk Low Retro",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 6,
    badge: "Best Seller",
    gender: "men",
    colorSlug: "green",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "5",
    name: "Nike Air Max SYSTM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 4,
    badge: "Extra 20% off",
    gender: "men",
    colorSlug: "red",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "running"
  },
  {
    id: "6",
    name: "Nike Air Force 1 PLT.FORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 1,
    badge: "Best Seller",
    gender: "men",
    colorSlug: "white",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "7",
    name: "Nike Dunk Low Retro SE",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 5,
    badge: "Extra 20% off",
    gender: "men",
    colorSlug: "blue",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "casual"
  },
  {
    id: "8",
    name: "Nike Air Max 90 SE",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 1,
    badge: "Best Seller",
    gender: "men",
    colorSlug: "orange",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "running"
  },
  {
    id: "9",
    name: "Nike Legend Essential 3 Next Nature",
    category: "Men's Training Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 4,
    badge: "Sustainable Materials",
    gender: "men",
    colorSlug: "black",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "training"
  },
  {
    id: "10",
    name: "Nike SB Zoom Janoski OG+",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 6,
    badge: "Best Seller",
    gender: "men",
    colorSlug: "blue",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "skateboarding"
  },
  {
    id: "11",
    name: "Jordan Series ES",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 4,
    badge: "Sustainable Materials",
    gender: "men",
    colorSlug: "green",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "basketball"
  },
  {
    id: "12",
    name: "Nike Blazer Low '77 Jumbo",
    category: "Women's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 1,
    badge: "Extra 20% off",
    gender: "women",
    colorSlug: "white",
    sizeAvailable: ["6", "7", "8", "9", "10"],
    categorySlug: "casual"
  },
  {
    id: "13",
    name: "Nike Air Max 270",
    category: "Women's Shoes",
    price: 120.00,
    image: "/shoe-1.jpg",
    colors: 3,
    badge: "Best Seller",
    gender: "women",
    colorSlug: "purple",
    sizeAvailable: ["6", "7", "8", "9", "10"],
    categorySlug: "running"
  },
  {
    id: "14",
    name: "Nike React Infinity Run",
    category: "Women's Running Shoes",
    price: 140.00,
    image: "/shoe-2.webp",
    colors: 2,
    badge: "Extra 10% off",
    gender: "women",
    colorSlug: "gray",
    sizeAvailable: ["6", "7", "8", "9", "10"],
    categorySlug: "running"
  },
  {
    id: "15",
    name: "Nike Air Jordan 1 Retro High",
    category: "Unisex Shoes",
    price: 170.00,
    image: "/shoe-3.webp",
    colors: 4,
    badge: "Best Seller",
    gender: "unisex",
    colorSlug: "red",
    sizeAvailable: ["6", "7", "8", "9", "10", "11", "12"],
    categorySlug: "basketball"
  },
  {
    id: "16",
    name: "Nike Dunk Low",
    category: "Unisex Shoes",
    price: 110.00,
    image: "/shoe-4.webp",
    colors: 5,
    badge: "Sustainable Materials",
    gender: "unisex",
    colorSlug: "black",
    sizeAvailable: ["6", "7", "8", "9", "10", "11", "12"],
    categorySlug: "casual"
  },
  {
    id: "17",
    name: "Nike Air Max 97",
    category: "Men's Shoes",
    price: 160.00,
    image: "/shoe-1.jpg",
    colors: 3,
    badge: "Extra 15% off",
    gender: "men",
    colorSlug: "white",
    sizeAvailable: ["7", "8", "9", "10", "11"],
    categorySlug: "running"
  },
  {
    id: "18",
    name: "Nike Cortez Classic",
    category: "Women's Shoes",
    price: 85.00,
    image: "/shoe-2.webp",
    colors: 2,
    gender: "women",
    colorSlug: "blue",
    sizeAvailable: ["6", "7", "8", "9", "10"],
    categorySlug: "casual"
  }
];

function filterProducts(products: MockProduct[], searchParams: ProductsPageProps['searchParams']) {
  let filtered = [...products];

  if (searchParams.gender) {
    filtered = filtered.filter(product => product.gender === searchParams.gender);
  }

  if (searchParams.category) {
    filtered = filtered.filter(product => product.categorySlug === searchParams.category);
  }

  if (searchParams.color) {
    filtered = filtered.filter(product => product.colorSlug === searchParams.color);
  }

  if (searchParams.size) {
    filtered = filtered.filter(product => product.sizeAvailable.includes(searchParams.size));
  }

  if (searchParams.priceMin || searchParams.priceMax) {
    const minPrice = searchParams.priceMin ? parseFloat(searchParams.priceMin) : 0;
    const maxPrice = searchParams.priceMax ? parseFloat(searchParams.priceMax) : Infinity;
    filtered = filtered.filter(product => product.price >= minPrice && product.price <= maxPrice);
  }

  return filtered;
}

function sortProducts(products: MockProduct[], sortBy?: string) {
  const sorted = [...products];

  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'newest':
      return sorted.reverse();
    case 'featured':
    default:
      return sorted;
  }
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const filteredProducts = filterProducts(mockProducts, searchParams);
  const sortedProducts = sortProducts(filteredProducts, searchParams.sort);

  const activeFiltersCount = Object.keys(searchParams).filter(key => 
    searchParams[key as keyof typeof searchParams] && key !== 'sort'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Filter currentFilters={searchParams} />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-heading-3 font-jost font-bold text-dark-900">
                New ({sortedProducts.length})
              </h1>
              {activeFiltersCount > 0 && (
                <p className="text-caption font-jost text-dark-700 mt-1">
                  {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied
                </p>
              )}
            </div>
            <Sort currentSort={searchParams.sort} />
          </div>

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

          {sortedProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-body font-jost text-dark-700">
                No products found matching your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
