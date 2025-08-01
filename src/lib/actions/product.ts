'use server';

import { db } from '../db';
import { products, productImages, productVariants, categories, brands, genders, colors, sizes } from '../db/schema';
import { eq, and, gte, lte, desc, asc, inArray, sql } from 'drizzle-orm';
import type { ProductQuery } from '../utils/query';

export interface ProductResult {
  id: string;
  name: string;
  description: string | null;
  category: string;
  gender: string;
  brand: string;
  image: string;
  colors: number;
  price: number;
  salePrice?: number;
  badge?: string;
  inStock: boolean;
}

export interface ProductsResponse {
  products: ProductResult[];
  totalCount: number;
}

export async function getAllProducts(params: ProductQuery & { page?: number; limit?: number }): Promise<ProductsResponse> {
  try {
    const { gender, color, size, priceRange, category, sort = 'featured', page = 1, limit = 12 } = params;
    const offset = (page - 1) * limit;

    const conditions = [eq(products.isPublished, true)];

    if (gender?.length) {
      const genderConditions = await db
        .select({ id: genders.id })
        .from(genders)
        .where(inArray(genders.slug, gender));
      
      if (genderConditions.length > 0) {
        conditions.push(inArray(products.genderId, genderConditions.map(g => g.id)));
      }
    }

    if (category?.length) {
      const categoryConditions = await db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.slug, category));
      
      if (categoryConditions.length > 0) {
        conditions.push(inArray(products.categoryId, categoryConditions.map(c => c.id)));
      }
    }

    let query = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryName: categories.name,
        genderLabel: genders.label,
        brandName: brands.name,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(and(...conditions));

    switch (sort) {
      case 'price_asc':
        query = query.orderBy(asc(sql`(
          SELECT MIN(COALESCE(pv.sale_price, pv.price))
          FROM product_variants pv
          WHERE pv.product_id = ${products.id}
        )`));
        break;
      case 'price_desc':
        query = query.orderBy(desc(sql`(
          SELECT MIN(COALESCE(pv.sale_price, pv.price))
          FROM product_variants pv
          WHERE pv.product_id = ${products.id}
        )`));
        break;
      case 'newest':
        query = query.orderBy(desc(products.createdAt));
        break;
      default:
        query = query.orderBy(desc(products.createdAt));
    }

    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(and(...conditions));

    const [productsData, totalCountData] = await Promise.all([
      query.limit(limit).offset(offset),
      totalCountQuery
    ]);

    const totalCount = totalCountData[0]?.count || 0;

    const productIds = productsData.map(p => p.id);
    
    const [variantsData, imagesData] = await Promise.all([
      db
        .select({
          productId: productVariants.productId,
          price: productVariants.price,
          salePrice: productVariants.salePrice,
          inStock: productVariants.inStock,
          colorName: colors.name,
        })
        .from(productVariants)
        .innerJoin(colors, eq(productVariants.colorId, colors.id))
        .where(inArray(productVariants.productId, productIds)),
      
      db
        .select({
          productId: productImages.productId,
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds))
    ]);

    let filteredVariants = variantsData;
    
    if (color?.length) {
      const colorConditions = await db
        .select({ name: colors.name })
        .from(colors)
        .where(inArray(colors.slug, color));
      
      const colorNames = colorConditions.map(c => c.name);
      filteredVariants = filteredVariants.filter(v => 
        colorNames.some(colorName => v.colorName.toLowerCase() === colorName.toLowerCase())
      );
    }

    if (size?.length) {
      const sizeConditions = await db
        .select({ id: sizes.id })
        .from(sizes)
        .where(inArray(sizes.slug, size));
      
      if (sizeConditions.length > 0) {
        const sizeVariants = await db
          .select({ productId: productVariants.productId })
          .from(productVariants)
          .where(inArray(productVariants.sizeId, sizeConditions.map(s => s.id)));
        
        const validProductIds = new Set(sizeVariants.map(sv => sv.productId));
        filteredVariants = filteredVariants.filter(v => validProductIds.has(v.productId));
      }
    }

    if (priceRange) {
      const priceRanges = {
        'under-150': { min: 0, max: 149 },
        '150-200': { min: 150, max: 200 },
        '200-250': { min: 200, max: 250 },
        'over-250': { min: 250, max: Infinity },
      };
      
      const range = priceRanges[priceRange as keyof typeof priceRanges];
      if (range) {
        filteredVariants = filteredVariants.filter(v => {
          const price = Number(v.salePrice || v.price);
          return price >= range.min && price <= range.max;
        });
      }
    }

    const variantsByProduct = new Map<string, typeof filteredVariants>();
    filteredVariants.forEach(variant => {
      if (!variantsByProduct.has(variant.productId)) {
        variantsByProduct.set(variant.productId, []);
      }
      variantsByProduct.get(variant.productId)!.push(variant);
    });

    const validProductIds = new Set(variantsByProduct.keys());
    const finalProducts = productsData.filter(p => validProductIds.has(p.id));

    const results: ProductResult[] = finalProducts.map(product => {
      const productVariants = variantsByProduct.get(product.id) || [];
      const productImages = imagesData.filter(img => img.productId === product.id);
      
      const primaryImage = productImages.find(img => img.isPrimary) || productImages[0];
      const uniqueColors = new Set(productVariants.map(v => v.colorName)).size;
      
      const prices = productVariants.map(v => Number(v.salePrice || v.price));
      const minPrice = Math.min(...prices);
      const hasDiscount = productVariants.some(v => v.salePrice);
      
      const totalStock = productVariants.reduce((sum, v) => sum + Number(v.inStock), 0);
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: product.categoryName,
        gender: product.genderLabel,
        brand: product.brandName,
        image: primaryImage?.url || '/placeholder.jpg',
        colors: uniqueColors,
        price: minPrice,
        salePrice: hasDiscount ? minPrice : undefined,
        badge: hasDiscount ? 'Sale' : undefined,
        inStock: totalStock > 0,
      };
    });

    return {
      products: results,
      totalCount: results.length,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { products: [], totalCount: 0 };
  }
}

export async function getProduct(productId: string): Promise<ProductResult | null> {
  try {
    const productData = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryName: categories.name,
        genderLabel: genders.label,
        brandName: brands.name,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.id, productId), eq(products.isPublished, true)))
      .limit(1);

    if (productData.length === 0) {
      return null;
    }

    const product = productData[0];

    const [variantsData, imagesData] = await Promise.all([
      db
        .select({
          price: productVariants.price,
          salePrice: productVariants.salePrice,
          inStock: productVariants.inStock,
          colorName: colors.name,
        })
        .from(productVariants)
        .innerJoin(colors, eq(productVariants.colorId, colors.id))
        .where(eq(productVariants.productId, productId)),
      
      db
        .select({
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(eq(productImages.productId, productId))
    ]);

    const primaryImage = imagesData.find(img => img.isPrimary) || imagesData[0];
    const uniqueColors = new Set(variantsData.map(v => v.colorName)).size;
    
    const prices = variantsData.map(v => Number(v.salePrice || v.price));
    const minPrice = Math.min(...prices);
    const hasDiscount = variantsData.some(v => v.salePrice);
    
    const totalStock = variantsData.reduce((sum, v) => sum + Number(v.inStock), 0);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: product.categoryName,
      gender: product.genderLabel,
      brand: product.brandName,
      image: primaryImage?.url || '/placeholder.jpg',
      colors: uniqueColors,
      price: minPrice,
      salePrice: hasDiscount ? minPrice : undefined,
      badge: hasDiscount ? 'Sale' : undefined,
      inStock: totalStock > 0,
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
