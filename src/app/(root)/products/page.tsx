import Card from "@/components/Card";
import Filters from "@/components/Filters";

interface SearchParams {
  gender?: string;
  size?: string;
  color?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
  sort?: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  image: string;
  colors: number;
  badge?: string;
  gender: string;
  sizes: string[];
  colorOptions: string[];
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Nike Air Force 1 Mid '07",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 6,
    badge: "Best Seller",
    gender: "men",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["white", "black", "red"]
  },
  {
    id: "2",
    name: "Nike Court Vision Low Next Nature",
    category: "Men's Shoes",
    price: 98.30,
    salePrice: 78.64,
    image: "/shoe-2.webp",
    colors: 4,
    badge: "Extra 20% off",
    gender: "men",
    sizes: ["7", "8", "9", "10", "11"],
    colorOptions: ["black", "blue"]
  },
  {
    id: "3",
    name: "Nike Air Force 1 PLTAFORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 1,
    badge: "Sustainable Materials",
    gender: "men",
    sizes: ["8", "9", "10", "11", "12"],
    colorOptions: ["green"]
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
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["yellow", "green"]
  },
  {
    id: "5",
    name: "Nike Air Max SYSTM",
    category: "Men's Shoes",
    price: 98.30,
    salePrice: 78.64,
    image: "/shoe-1.jpg",
    colors: 4,
    badge: "Extra 20% off",
    gender: "men",
    sizes: ["7", "8", "9", "10", "11"],
    colorOptions: ["red", "white"]
  },
  {
    id: "6",
    name: "Nike Air Force 1 PLTAFORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 1,
    gender: "men",
    sizes: ["8", "9", "10", "11", "12"],
    colorOptions: ["white"]
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
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["beige", "brown"]
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
    sizes: ["7", "8", "9", "10", "11"],
    colorOptions: ["orange"]
  },
  {
    id: "9",
    name: "Nike Legend Essential 3 Next Nature",
    category: "Men's Training Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 4,
    gender: "men",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["navy", "red"]
  },
  {
    id: "10",
    name: "Nike SB Zoom Janoski OG+",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 5,
    badge: "Best Seller",
    gender: "men",
    sizes: ["7", "8", "9", "10", "11"],
    colorOptions: ["blue", "tan"]
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
    sizes: ["8", "9", "10", "11", "12"],
    colorOptions: ["olive", "green"]
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
    sizes: ["5", "6", "7", "8", "9", "10"],
    colorOptions: ["white", "blue"]
  },
  {
    id: "13",
    name: "Nike Air Max 270 React",
    category: "Women's Shoes",
    price: 120.00,
    image: "/shoe-1.jpg",
    colors: 3,
    gender: "women",
    sizes: ["5", "6", "7", "8", "9"],
    colorOptions: ["pink", "purple"]
  },
  {
    id: "14",
    name: "Nike Revolution 6",
    category: "Kids' Shoes",
    price: 65.00,
    image: "/shoe-2.webp",
    colors: 2,
    badge: "Best Seller",
    gender: "kids",
    sizes: ["10C", "11C", "12C", "1Y", "2Y", "3Y"],
    colorOptions: ["blue", "red"]
  },
  {
    id: "15",
    name: "Nike Court Borough Low 2",
    category: "Kids' Shoes",
    price: 55.00,
    image: "/shoe-3.webp",
    colors: 4,
    gender: "kids",
    sizes: ["10C", "11C", "12C", "1Y", "2Y"],
    colorOptions: ["white", "black"]
  },
  {
    id: "16",
    name: "Nike Air Force 1 LE",
    category: "Kids' Shoes",
    price: 75.00,
    image: "/shoe-4.webp",
    colors: 2,
    badge: "Extra 10% off",
    gender: "kids",
    sizes: ["11C", "12C", "1Y", "2Y", "3Y"],
    colorOptions: ["white"]
  },
  {
    id: "17",
    name: "Nike Pegasus 40",
    category: "Women's Running Shoes",
    price: 130.00,
    salePrice: 104.00,
    image: "/shoe-1.jpg",
    colors: 5,
    badge: "Extra 20% off",
    gender: "women",
    sizes: ["5", "6", "7", "8", "9", "10"],
    colorOptions: ["black", "white", "pink"]
  },
  {
    id: "18",
    name: "Nike Metcon 8",
    category: "Men's Training Shoes",
    price: 150.00,
    image: "/shoe-2.webp",
    colors: 3,
    gender: "men",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["black", "red"]
  },
  {
    id: "19",
    name: "Nike Zoom Freak 4",
    category: "Basketball Shoes",
    price: 110.00,
    image: "/shoe-3.webp",
    colors: 2,
    badge: "Best Seller",
    gender: "unisex",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colorOptions: ["green", "orange"]
  },
  {
    id: "20",
    name: "Nike Air Zoom Alphafly",
    category: "Running Shoes",
    price: 275.00,
    image: "/shoe-4.webp",
    colors: 1,
    badge: "Sustainable Materials",
    gender: "unisex",
    sizes: ["7", "8", "9", "10", "11"],
    colorOptions: ["neon"]
  }
];

function filterProducts(products: Product[], searchParams: SearchParams): Product[] {
  return products.filter(product => {
    if (searchParams.gender && product.gender !== searchParams.gender && product.gender !== 'unisex') {
      return false;
    }

    if (searchParams.size && !product.sizes.includes(searchParams.size)) {
      return false;
    }

    if (searchParams.color && !product.colorOptions.includes(searchParams.color)) {
      return false;
    }

    const price = product.salePrice || product.price;
    if (searchParams.minPrice && price < parseFloat(searchParams.minPrice)) {
      return false;
    }
    if (searchParams.maxPrice && price > parseFloat(searchParams.maxPrice)) {
      return false;
    }

    return true;
  });
}

function sortProducts(products: Product[], sortBy?: string): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
    case 'price-high':
      return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filteredProducts = filterProducts(mockProducts, searchParams);
  const sortedProducts = sortProducts(filteredProducts, searchParams.sort);

  const activeFiltersCount = Object.keys(searchParams).filter(key => 
    searchParams[key as keyof SearchParams] && key !== 'sort'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <Filters />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="font-jost text-heading-3 font-bold text-dark-900">
                New ({sortedProducts.length})
              </h1>
              {activeFiltersCount > 0 && (
                <p className="font-jost text-caption text-dark-700 mt-1">
                  Showing filtered results
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <button className="font-jost text-caption text-dark-700 hover:text-dark-900 flex items-center gap-2">
                Hide Filters
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="flex items-center gap-2">
                <span className="font-jost text-caption text-dark-700">Sort By</span>
                <select className="font-jost text-caption text-dark-900 bg-transparent border-none focus:outline-none">
                  <option value="">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
                <svg className="w-4 h-4 text-dark-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {sortedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <Card
                  key={product.id}
                  title={product.name}
                  category={product.category}
                  price={product.salePrice || product.price}
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
        </main>
      </div>
    </div>
  );
}
