"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/Card";

interface SearchParams {
  gender?: string;
  color?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  category?: string;
}

const mockProducts = [
  {
    id: "1",
    title: "Nike Air Force 1 '07",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 6,
    gender: "men",
    color: "white",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Best Seller"
  },
  {
    id: "2",
    title: "Nike Court Vision Low Next Nature",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 4,
    gender: "men",
    color: "black",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Extra 20% off"
  },
  {
    id: "3",
    title: "Nike Air Force 1 PLT.FORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 1,
    gender: "men",
    color: "gray",
    size: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: "4",
    title: "Nike Dunk Low Retro",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 6,
    gender: "men",
    color: "green",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Best Seller"
  },
  {
    id: "5",
    title: "Nike Air Max SYSTM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 4,
    gender: "men",
    color: "red",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Extra 20% off"
  },
  {
    id: "6",
    title: "Nike Air Force 1 PLT.FORM",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 1,
    gender: "men",
    color: "pink",
    size: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: "7",
    title: "Nike Dunk Low Retro SE",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 5,
    gender: "men",
    color: "beige",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Extra 20% off"
  },
  {
    id: "8",
    title: "Nike Air Max 90 SE",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 1,
    gender: "men",
    color: "orange",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Best Seller"
  },
  {
    id: "9",
    title: "Nike Legend Essential 3 Next Nature",
    category: "Men's Training Shoes",
    price: 98.30,
    image: "/shoe-1.jpg",
    colors: 4,
    gender: "men",
    color: "navy",
    size: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: "10",
    title: "Nike SB Zoom Janoski OG+",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-2.webp",
    colors: 6,
    gender: "men",
    color: "blue",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Best Seller"
  },
  {
    id: "11",
    title: "Jordan Series ES",
    category: "Men's Shoes",
    price: 98.30,
    image: "/shoe-3.webp",
    colors: 4,
    gender: "men",
    color: "olive",
    size: ["7", "8", "9", "10", "11", "12"],
    badge: "Sustainable Materials"
  },
  {
    id: "12",
    title: "Nike Blazer Low '77 Jumbo",
    category: "Women's Shoes",
    price: 98.30,
    image: "/shoe-4.webp",
    colors: 1,
    gender: "women",
    color: "white",
    size: ["5", "6", "7", "8", "9", "10"],
    badge: "Extra 20% off"
  },
  {
    id: "13",
    title: "Nike Air Max 270",
    category: "Women's Shoes",
    price: 120.00,
    image: "/shoe-1.jpg",
    colors: 3,
    gender: "women",
    color: "pink",
    size: ["5", "6", "7", "8", "9", "10"]
  },
  {
    id: "14",
    title: "Nike Revolution 6",
    category: "Women's Running Shoes",
    price: 65.00,
    image: "/shoe-2.webp",
    colors: 2,
    gender: "women",
    color: "black",
    size: ["5", "6", "7", "8", "9", "10"],
    badge: "Best Seller"
  },
  {
    id: "15",
    title: "Nike Air Force 1 Shadow",
    category: "Women's Shoes",
    price: 110.00,
    image: "/shoe-3.webp",
    colors: 4,
    gender: "women",
    color: "white",
    size: ["5", "6", "7", "8", "9", "10"]
  },
  {
    id: "16",
    title: "Nike Dunk Low",
    category: "Kids' Shoes",
    price: 75.00,
    image: "/shoe-4.webp",
    colors: 2,
    gender: "kids",
    color: "blue",
    size: ["10.5C", "11C", "11.5C", "12C", "12.5C", "13C"],
    badge: "Kids Favorite"
  },
  {
    id: "17",
    title: "Nike Air Max SC",
    category: "Kids' Shoes",
    price: 55.00,
    image: "/shoe-1.jpg",
    colors: 3,
    gender: "kids",
    color: "white",
    size: ["10.5C", "11C", "11.5C", "12C", "12.5C", "13C"]
  },
  {
    id: "18",
    title: "Nike Revolution 6",
    category: "Kids' Running Shoes",
    price: 50.00,
    image: "/shoe-2.webp",
    colors: 2,
    gender: "kids",
    color: "black",
    size: ["10.5C", "11C", "11.5C", "12C", "12.5C", "13C"],
    badge: "Best Seller"
  }
];

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentParams: SearchParams = {
    gender: searchParams.get('gender') || undefined,
    color: searchParams.get('color') || undefined,
    size: searchParams.get('size') || undefined,
    minPrice: searchParams.get('minPrice') || undefined,
    maxPrice: searchParams.get('maxPrice') || undefined,
    category: searchParams.get('category') || undefined,
  };

  const updateURL = (newParams: Partial<SearchParams>) => {
    const url = new URL(window.location.href);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    
    router.push(url.pathname + url.search);
  };
  const filteredProducts = mockProducts.filter(product => {
    if (currentParams.gender && product.gender !== currentParams.gender) {
      return false;
    }
    if (currentParams.color && product.color !== currentParams.color) {
      return false;
    }
    if (currentParams.size && !product.size.includes(currentParams.size)) {
      return false;
    }
    if (currentParams.minPrice && product.price < parseFloat(currentParams.minPrice)) {
      return false;
    }
    if (currentParams.maxPrice && product.price > parseFloat(currentParams.maxPrice)) {
      return false;
    }
    return true;
  });

  const resultCount = filteredProducts.length;
  const totalCount = mockProducts.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-light-100 border border-light-300 rounded-lg p-6">
            <h2 className="font-jost text-heading-3 font-bold text-dark-900 mb-6">
              Filters
            </h2>
            
            {/* Gender Filter */}
            <div className="mb-6">
              <h3 className="font-jost text-body-medium font-medium text-dark-900 mb-3">
                Gender
              </h3>
              <div className="space-y-2">
                {['men', 'women', 'kids'].map((gender) => (
                  <label key={gender} className="flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={currentParams.gender === gender}
                      onChange={() => updateURL({ gender })}
                      className="mr-2"
                    />
                    <span className="font-jost text-body text-dark-700 capitalize">
                      {gender}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h3 className="font-jost text-body-medium font-medium text-dark-900 mb-3">
                Color
              </h3>
              <div className="space-y-2">
                {['white', 'black', 'gray', 'blue', 'red', 'green', 'pink', 'navy', 'beige', 'orange', 'olive'].map((color) => (
                  <label key={color} className="flex items-center">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={currentParams.color === color}
                      onChange={() => updateURL({ color })}
                      className="mr-2"
                    />
                    <span className="font-jost text-body text-dark-700 capitalize">
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h3 className="font-jost text-body-medium font-medium text-dark-900 mb-3">
                Size
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {['7', '8', '9', '10', '11', '12', '5', '6', '10.5C', '11C', '12C', '13C'].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (currentParams.size === size) {
                        updateURL({ size: undefined });
                      } else {
                        updateURL({ size });
                      }
                    }}
                    className={`p-2 border rounded text-center font-jost text-caption ${
                      currentParams.size === size
                        ? 'border-dark-900 bg-dark-900 text-light-100'
                        : 'border-light-400 text-dark-700 hover:border-dark-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-jost text-body-medium font-medium text-dark-900 mb-3">
                Price Range
              </h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value="25-50"
                    checked={currentParams.minPrice === '25' && currentParams.maxPrice === '50'}
                    onChange={() => updateURL({ minPrice: '25', maxPrice: '50' })}
                    className="mr-2"
                  />
                  <span className="font-jost text-body text-dark-700">$25 - $50</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value="50-100"
                    checked={currentParams.minPrice === '50' && currentParams.maxPrice === '100'}
                    onChange={() => updateURL({ minPrice: '50', maxPrice: '100' })}
                    className="mr-2"
                  />
                  <span className="font-jost text-body text-dark-700">$50 - $100</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value="100-150"
                    checked={currentParams.minPrice === '100' && currentParams.maxPrice === '150'}
                    onChange={() => updateURL({ minPrice: '100', maxPrice: '150' })}
                    className="mr-2"
                  />
                  <span className="font-jost text-body text-dark-700">$100 - $150</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="priceRange"
                    value="150+"
                    checked={currentParams.minPrice === '150' && !currentParams.maxPrice}
                    onChange={() => updateURL({ minPrice: '150', maxPrice: undefined })}
                    className="mr-2"
                  />
                  <span className="font-jost text-body text-dark-700">$150+</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => router.push('/products')}
              className="w-full py-2 px-4 border border-dark-900 text-dark-900 font-jost text-body-medium font-medium rounded hover:bg-dark-900 hover:text-light-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-jost text-heading-2 font-bold text-dark-900">
              New ({resultCount})
            </h1>
            <div className="flex items-center gap-4">
              <button className="font-jost text-body text-dark-700 hover:text-dark-900">
                Hide Filters
              </button>
              <button className="font-jost text-body text-dark-700 hover:text-dark-900">
                Sort By
              </button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-jost text-lead text-dark-700">
                No products found matching your filters.
              </p>
              <button
                onClick={() => router.push('/products')}
                className="mt-4 py-2 px-6 bg-dark-900 text-light-100 font-jost text-body-medium font-medium rounded hover:bg-dark-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  title={product.title}
                  category={product.category}
                  price={product.price}
                  image={product.image}
                  colors={product.colors}
                  badge={product.badge}
                />
              ))}
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
