'use server';

import { db } from '../db';
import { 
  products, 
  productVariants, 
  productImages, 
  categories, 
  brands, 
  genders, 
  colors, 
  sizes 
} from '../db/schema';
import { ProductQuery } from '../utils/query';
import { eq, and, inArray, gte, lte, desc, asc, count, min, max, sql } from 'drizzle-orm';

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  primaryImage: string | null;
  colorCount: number;
  minPrice: number;
  maxPrice: number;
  createdAt: Date;
  isPublished: boolean;
}

export interface GetAllProductsResult {
  products: ProductWithDetails[];
  totalCount: number;
}

export interface ProductDetails {
  id: string;
  name: string;
  description: string | null;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  images: Array<{ id: string; url: string; isPrimary: boolean }>;
  variants: Array<{
    id: string;
    sku: string;
    price: string;
    salePrice: string | null;
    color: { id: string; name: string; slug: string; hexCode: string };
    size: { id: string; name: string; slug: string; sortOrder: number };
    inStock: number;
  }>;
  createdAt: Date;
  isPublished: boolean;
}

export async function getAllProducts(params: ProductQuery = {}): Promise<GetAllProductsResult> {
  try {
    const { 
      gender: genderFilter, 
      category: categoryFilter, 
      color: colorFilter, 
      size: sizeFilter, 
      priceRange, 
      sort = 'newest', 
      page = 1, 
      limit = 12 
    } = params;

    const offset = (page - 1) * limit;

    const whereConditions = [eq(products.isPublished, true)];

    if (genderFilter && genderFilter.length > 0) {
      const genderIds = await db
        .select({ id: genders.id })
        .from(genders)
        .where(inArray(genders.slug, genderFilter));
      
      if (genderIds.length > 0) {
        whereConditions.push(inArray(products.genderId, genderIds.map(g => g.id)));
      }
    }

    if (categoryFilter && categoryFilter.length > 0) {
      const categoryIds = await db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.slug, categoryFilter));
      
      if (categoryIds.length > 0) {
        whereConditions.push(inArray(products.categoryId, categoryIds.map(c => c.id)));
      }
    }

    if (colorFilter && colorFilter.length > 0) {
      const colorIds = await db
        .select({ id: colors.id })
        .from(colors)
        .where(inArray(colors.slug, colorFilter));
      
      if (colorIds.length > 0) {
        const productIdsWithColors = await db
          .selectDistinct({ productId: productVariants.productId })
          .from(productVariants)
          .where(inArray(productVariants.colorId, colorIds.map(c => c.id)));
        
        if (productIdsWithColors.length > 0) {
          whereConditions.push(inArray(products.id, productIdsWithColors.map(p => p.productId)));
        }
      }
    }

    if (sizeFilter && sizeFilter.length > 0) {
      const sizeIds = await db
        .select({ id: sizes.id })
        .from(sizes)
        .where(inArray(sizes.slug, sizeFilter));
      
      if (sizeIds.length > 0) {
        const productIdsWithSizes = await db
          .selectDistinct({ productId: productVariants.productId })
          .from(productVariants)
          .where(inArray(productVariants.sizeId, sizeIds.map(s => s.id)));
        
        if (productIdsWithSizes.length > 0) {
          whereConditions.push(inArray(products.id, productIdsWithSizes.map(p => p.productId)));
        }
      }
    }

    if (priceRange) {
      let minPrice = 0;
      let maxPrice = Infinity;
      
      switch (priceRange) {
        case 'under-150':
          maxPrice = 149.99;
          break;
        case '150-200':
          minPrice = 150;
          maxPrice = 200;
          break;
        case '200-250':
          minPrice = 200;
          maxPrice = 250;
          break;
        case 'over-250':
          minPrice = 250;
          break;
      }

      const productIdsInPriceRange = await db
        .selectDistinct({ productId: productVariants.productId })
        .from(productVariants)
        .where(
          and(
            gte(sql`COALESCE(CAST(${productVariants.salePrice} AS DECIMAL), CAST(${productVariants.price} AS DECIMAL))`, minPrice),
            maxPrice !== Infinity ? lte(sql`COALESCE(CAST(${productVariants.salePrice} AS DECIMAL), CAST(${productVariants.price} AS DECIMAL))`, maxPrice) : undefined
          )
        );
      
      if (productIdsInPriceRange.length > 0) {
        whereConditions.push(inArray(products.id, productIdsInPriceRange.map(p => p.productId)));
      }
    }

    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        brandId: products.brandId,
        brandName: brands.name,
        brandSlug: brands.slug,
        genderId: products.genderId,
        genderLabel: genders.label,
        genderSlug: genders.slug,
        createdAt: products.createdAt,
        isPublished: products.isPublished,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .where(and(...whereConditions));

    let orderedQuery;
    if (sort === 'price_asc' || sort === 'price_desc') {
      const productsWithPrices = await db
        .select({
          productId: productVariants.productId,
          minPrice: min(sql`COALESCE(CAST(${productVariants.salePrice} AS DECIMAL), CAST(${productVariants.price} AS DECIMAL))`),
        })
        .from(productVariants)
        .groupBy(productVariants.productId);

      const productPriceMap = new Map(productsWithPrices.map(p => [p.productId, p.minPrice]));
      
      const baseResults = await baseQuery;
      const sortedResults = baseResults.sort((a, b) => {
        const priceA = Number(productPriceMap.get(a.id)) || 0;
        const priceB = Number(productPriceMap.get(b.id)) || 0;
        return sort === 'price_asc' ? priceA - priceB : priceB - priceA;
      });
      
      orderedQuery = sortedResults.slice(offset, offset + limit);
    } else {
      const orderBy = sort === 'oldest' ? asc(products.createdAt) : desc(products.createdAt);
      orderedQuery = await baseQuery.orderBy(orderBy).limit(limit).offset(offset);
    }

    const productIds = orderedQuery.map(p => p.id);

    const [primaryImages, colorCounts, priceRanges] = await Promise.all([
      db
        .select({
          productId: productImages.productId,
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds)),

      db
        .select({
          productId: productVariants.productId,
          colorCount: count(sql`DISTINCT ${productVariants.colorId}`),
        })
        .from(productVariants)
        .where(inArray(productVariants.productId, productIds))
        .groupBy(productVariants.productId),

      db
        .select({
          productId: productVariants.productId,
          minPrice: min(sql`COALESCE(CAST(${productVariants.salePrice} AS DECIMAL), CAST(${productVariants.price} AS DECIMAL))`),
          maxPrice: max(sql`COALESCE(CAST(${productVariants.salePrice} AS DECIMAL), CAST(${productVariants.price} AS DECIMAL))`),
        })
        .from(productVariants)
        .where(inArray(productVariants.productId, productIds))
        .groupBy(productVariants.productId),
    ]);

    const primaryImageMap = new Map<string, string>();
    const fallbackImageMap = new Map<string, string>();
    
    primaryImages.forEach(img => {
      if (img.isPrimary) {
        primaryImageMap.set(img.productId, img.url);
      } else if (!fallbackImageMap.has(img.productId)) {
        fallbackImageMap.set(img.productId, img.url);
      }
    });

    const colorCountMap = new Map(colorCounts.map(c => [c.productId, c.colorCount]));
    const priceRangeMap = new Map(priceRanges.map(p => [p.productId, { min: p.minPrice, max: p.maxPrice }]));

    const productsWithDetails: ProductWithDetails[] = orderedQuery.map(product => {
      const priceRange = priceRangeMap.get(product.id) || { min: 0, max: 0 };
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: {
          id: product.categoryId,
          name: product.categoryName || '',
          slug: product.categorySlug || '',
        },
        brand: {
          id: product.brandId,
          name: product.brandName || '',
          slug: product.brandSlug || '',
        },
        gender: {
          id: product.genderId,
          label: product.genderLabel || '',
          slug: product.genderSlug || '',
        },
        primaryImage: primaryImageMap.get(product.id) || fallbackImageMap.get(product.id) || null,
        colorCount: colorCountMap.get(product.id) || 0,
        minPrice: Number(priceRange.min) || 0,
        maxPrice: Number(priceRange.max) || 0,
        createdAt: product.createdAt,
        isPublished: product.isPublished,
      };
    });

    const [totalCountResult] = await db
      .select({ count: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .where(and(...whereConditions));

    return {
      products: productsWithDetails,
      totalCount: totalCountResult.count,
    };
  } catch (error) {
    console.error('Get all products error:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProduct(productId: string): Promise<ProductDetails | null> {
  try {
    const [product] = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        brandId: products.brandId,
        brandName: brands.name,
        brandSlug: brands.slug,
        genderId: products.genderId,
        genderLabel: genders.label,
        genderSlug: genders.slug,
        createdAt: products.createdAt,
        isPublished: products.isPublished,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .where(and(eq(products.id, productId), eq(products.isPublished, true)))
      .limit(1);

    if (!product) {
      return null;
    }

    const [productImagesData, productVariantsData] = await Promise.all([
      db
        .select({
          id: productImages.id,
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(eq(productImages.productId, productId))
        .orderBy(desc(productImages.isPrimary)),

      db
        .select({
          id: productVariants.id,
          sku: productVariants.sku,
          price: productVariants.price,
          salePrice: productVariants.salePrice,
          inStock: productVariants.inStock,
          colorId: productVariants.colorId,
          colorName: colors.name,
          colorSlug: colors.slug,
          colorHexCode: colors.hexCode,
          sizeId: productVariants.sizeId,
          sizeName: sizes.name,
          sizeSlug: sizes.slug,
          sizeSortOrder: sizes.sortOrder,
        })
        .from(productVariants)
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(eq(productVariants.productId, productId))
        .orderBy(asc(sizes.sortOrder)),
    ]);

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: {
        id: product.categoryId,
        name: product.categoryName || '',
        slug: product.categorySlug || '',
      },
      brand: {
        id: product.brandId,
        name: product.brandName || '',
        slug: product.brandSlug || '',
      },
      gender: {
        id: product.genderId,
        label: product.genderLabel || '',
        slug: product.genderSlug || '',
      },
      images: productImagesData.map(img => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
      })),
      variants: productVariantsData.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        price: variant.price,
        salePrice: variant.salePrice,
        color: {
          id: variant.colorId,
          name: variant.colorName || '',
          slug: variant.colorSlug || '',
          hexCode: variant.colorHexCode || '',
        },
        size: {
          id: variant.sizeId,
          name: variant.sizeName || '',
          slug: variant.sizeSlug || '',
          sortOrder: variant.sizeSortOrder || 0,
        },
        inStock: variant.inStock,
      })),
      createdAt: product.createdAt,
      isPublished: product.isPublished,
    };
  } catch (error) {
    console.error('Get product error:', error);
    throw new Error('Failed to fetch product');
  }
}
