"use server";

import { mockProducts } from "@/lib/data/products";
// import { db } from "@/lib/db";
// import {
//   brands,
//   categories,
//   colors,
//   genders,
//   productImages,
//   products,
//   productVariants,
//   reviews,
//   sizes,
// } from "@/lib/db/schema";
// import {
//   and,
//   asc,
//   desc,
//   eq,
//   ilike,
//   inArray,
//   or,
//   sql,
//   type SQL,
// } from "drizzle-orm";
// import type { AnyPgColumn } from "drizzle-orm/pg-core";

export type ProductListItem = {
  id: string;
  name: string;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  minPrice: number;
  maxPrice: number;
  colorCount: number;
  imageUrl: string | null;
};

export type ProductWithAggregates = ProductListItem;

export type GetAllProductsResult = {
  products: ProductWithAggregates[];
  totalCount: number;
};

export type ProductFiltersInput = {
  search?: string;
  category?: string;
  brand?: string;
  gender?: string;
  colors?: string[];
  sizes?: string[];
  priceMin?: number;
  priceMax?: number;
  sortBy?: "price_asc" | "price_desc" | "latest" | "oldest";
  page?: number;
  limit?: number;
};

export type PDPImage = { url: string; isPrimary: boolean; sortOrder: number };
export type PDPVariant = {
  id: string;
  sku: string;
  color: { id: string; name: string; slug: string; hexCode?: string | null };
  size: { id: string; name: string; slug: string; sortOrder?: number | null };
  price: number;
  salePrice?: number | null;
  inStock: number;
  images: PDPImage[];
};
export type PDPProduct = {
  id: string;
  name: string;
  description?: string | null;
  priceRange: { min: number; max: number };
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  variants: PDPVariant[];
  images: PDPImage[];
  defaultVariantId?: string | null;
};
export type ReviewDTO = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
};
export type RecommendedProduct = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  category: string;
};

export async function getAllProducts(
  filters: ProductFiltersInput
): Promise<GetAllProductsResult> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, Math.min(60, filters.limit ?? 12));
  
  let filteredProducts = [...mockProducts];

  if (filters.gender) {
    filteredProducts = filteredProducts.filter(p => 
      p.gender.includes(filters.gender as "men" | "women" | "unisex")
    );
  }

  if (filters.colors && filters.colors.length) {
    filteredProducts = filteredProducts.filter(p =>
      p.colors.some(color => filters.colors!.includes(color))
    );
  }

  if (filters.sizes && filters.sizes.length) {
    filteredProducts = filteredProducts.filter(p =>
      p.sizes.some(size => filters.sizes!.includes(size))
    );
  }

  if (filters.priceMin != null || filters.priceMax != null) {
    filteredProducts = filteredProducts.filter(p => {
      if (filters.priceMin != null && p.price < filters.priceMin) return false;
      if (filters.priceMax != null && p.price > filters.priceMax) return false;
      return true;
    });
  }

  if (filters.search && filters.search.trim()) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm)
    );
  }

  if (filters.sortBy === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === "oldest") {
    filteredProducts.reverse();
  }

  const totalCount = filteredProducts.length;
  const offset = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(offset, offset + limit);

  const mapped: ProductWithAggregates[] = paginatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    brand: { id: "nike-id", name: "Nike", slug: "nike" },
    category: { id: "category-id", name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') },
    gender: { 
      id: "gender-id", 
      label: p.gender[0] === "men" ? "Men" : p.gender[0] === "women" ? "Women" : "Unisex", 
      slug: p.gender[0] 
    },
    minPrice: p.price,
    maxPrice: p.price,
    colorCount: p.colors.length,
    imageUrl: p.image,
  }));

  return { products: mapped, totalCount };
}

export async function getProduct(
  productId: string
): Promise<PDPProduct | null> {
  const product = mockProducts.find(p => p.id === productId);
  if (!product) return null;

  const variants: PDPVariant[] = product.colors.flatMap(color => 
    product.sizes.map(size => ({
      id: `${productId}-${color}-${size}`,
      sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-${color}-${size}`,
      color: {
        id: `color-${color}`,
        name: color.charAt(0).toUpperCase() + color.slice(1),
        slug: color,
        hexCode: undefined,
      },
      size: {
        id: `size-${size}`,
        name: size,
        slug: size,
        sortOrder: parseInt(size) || 0,
      },
      price: product.price,
      salePrice: null,
      inStock: Math.floor(Math.random() * 50) + 5,
      images: [{ url: product.image, isPrimary: true, sortOrder: 0 }],
    }))
  );

  return {
    id: product.id,
    name: product.name,
    description: `Premium ${product.name} with exceptional comfort and style.`,
    priceRange: { min: product.price, max: product.price },
    brand: { id: "nike-id", name: "Nike", slug: "nike" },
    category: { id: "category-id", name: product.category, slug: product.category.toLowerCase().replace(/\s+/g, '-') },
    gender: { 
      id: "gender-id", 
      label: product.gender[0] === "men" ? "Men" : product.gender[0] === "women" ? "Women" : "Unisex", 
      slug: product.gender[0] 
    },
    variants,
    images: [{ url: product.image, isPrimary: true, sortOrder: 0 }],
    defaultVariantId: variants[0]?.id,
  };
}

export async function getProductReviews(): Promise<ReviewDTO[]> {
  return [
    {
      id: "dummy-1",
      author: "Anonymous",
      rating: 5,
      title: "Great quality",
      content: "Comfortable fit and looks amazing.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "dummy-2",
      author: "Anonymous",
      rating: 4,
      title: "Good value",
      content: "Solid shoes, sizing runs a bit small.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export async function getRecommendedProducts(
  productId: string
): Promise<RecommendedProduct[]> {
  const currentProduct = mockProducts.find(p => p.id === productId);
  if (!currentProduct) return [];

  const recommended = mockProducts
    .filter(p => 
      p.id !== productId && 
      (p.category === currentProduct.category || 
       p.gender.some(g => currentProduct.gender.includes(g)))
    )
    .slice(0, 6)
    .map(p => ({
      id: p.id,
      title: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
    }));

  return recommended;
}

export async function getLatestProducts(): Promise<ProductWithAggregates[]> {
  return mockProducts
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: { id: "nike-id", name: "Nike", slug: "nike" },
      category: { id: "category-id", name: p.category, slug: p.category.toLowerCase().replace(/\s+/g, '-') },
      gender: { 
        id: "gender-id", 
        label: p.gender[0] === "men" ? "Men" : p.gender[0] === "women" ? "Women" : "Unisex", 
        slug: p.gender[0] 
      },
      minPrice: p.price,
      maxPrice: p.price,
      colorCount: p.colors.length,
      imageUrl: p.image,
    }));
}
