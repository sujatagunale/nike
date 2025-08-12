'use server';

import { db } from '@/lib/db';
import { products, productVariants, productImages, categories, brands, genders, colors, sizes } from '@/lib/db/schema';
import { eq, and, gte, lte, desc, asc, count, min, max, sql, inArray } from 'drizzle-orm';
import { ProductQuery } from '@/lib/utils/query';

export interface ProductWithDetails {
  id: string;
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
  gender: {
    id: string;
    label: string;
  };
  minPrice: number;
  maxPrice: number;
  primaryImage: string;
  colorCount: number;
  badge?: string;
  createdAt: Date;
}

export interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
  gender: {
    id: string;
    label: string;
  };
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    inStock: number;
    color: {
      id: string;
      name: string;
      slug: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
  createdAt: Date;
}

export async function getAllProducts(params: ProductQuery & { page?: number; limit?: number }) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 12;
    const offset = (page - 1) * limit;

    const whereConditions = [eq(products.isPublished, true)];

    if (params.gender?.length) {
      const genderSlugs = params.gender;
      const genderSubquery = db
        .select({ id: genders.id })
        .from(genders)
        .where(inArray(genders.slug, genderSlugs));
      
      whereConditions.push(
        inArray(products.genderId, genderSubquery)
      );
    }

    if (params.category?.length) {
      const categorySubquery = db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.slug, params.category));
      
      whereConditions.push(
        inArray(products.categoryId, categorySubquery)
      );
    }

    if (params.color?.length) {
      const colorSubquery = db
        .select({ productId: productVariants.productId })
        .from(productVariants)
        .innerJoin(colors, eq(productVariants.colorId, colors.id))
        .where(inArray(colors.slug, params.color));
      
      whereConditions.push(
        inArray(products.id, colorSubquery)
      );
    }

    if (params.size?.length) {
      const sizeSubquery = db
        .select({ productId: productVariants.productId })
        .from(productVariants)
        .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(inArray(sizes.slug, params.size));
      
      whereConditions.push(
        inArray(products.id, sizeSubquery)
      );
    }

    if (params.priceRange) {
      const priceRanges = {
        'under-150': { min: 0, max: 149 },
        '150-200': { min: 150, max: 200 },
        '200-250': { min: 200, max: 250 },
        'over-250': { min: 250, max: Infinity }
      };
      
      const range = priceRanges[params.priceRange as keyof typeof priceRanges];
      if (range) {
        const priceSubquery = db
          .select({ productId: productVariants.productId })
          .from(productVariants)
          .where(
            and(
              gte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.min),
              range.max === Infinity 
                ? gte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.min)
                : lte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.max)
            )
          );
        
        whereConditions.push(
          inArray(products.id, priceSubquery)
        );
      }
    }

    const baseQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        brandId: products.brandId,
        brandName: brands.name,
        genderId: products.genderId,
        genderLabel: genders.label,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .where(and(...whereConditions));

    let orderedQuery;
    switch (params.sort) {
      case 'price_asc':
        orderedQuery = baseQuery.orderBy(asc(products.createdAt));
        break;
      case 'price_desc':
        orderedQuery = baseQuery.orderBy(desc(products.createdAt));
        break;
      case 'newest':
        orderedQuery = baseQuery.orderBy(desc(products.createdAt));
        break;
      default:
        orderedQuery = baseQuery.orderBy(desc(products.createdAt));
        break;
    }

    const paginatedProducts = await orderedQuery.limit(limit).offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .where(and(...whereConditions));

    const totalCount = totalCountResult[0]?.count || 0;

    const productIds = paginatedProducts.map(p => p.id);

    const priceData = await db
      .select({
        productId: productVariants.productId,
        minPrice: min(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`),
        maxPrice: max(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`),
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds))
      .groupBy(productVariants.productId);

    const imageData = await db
      .select({
        productId: productImages.productId,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(inArray(productImages.productId, productIds))
      .orderBy(desc(productImages.isPrimary));

    const colorCountData = await db
      .select({
        productId: productVariants.productId,
        colorCount: count(sql`DISTINCT ${productVariants.colorId}`),
      })
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds))
      .groupBy(productVariants.productId);

    const productsWithDetails: ProductWithDetails[] = paginatedProducts.map(product => {
      const priceInfo = priceData.find(p => p.productId === product.id);
      const primaryImage = imageData.find(img => img.productId === product.id && img.isPrimary);
      const fallbackImage = imageData.find(img => img.productId === product.id);
      const colorInfo = colorCountData.find(c => c.productId === product.id);

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        category: {
          id: product.categoryId,
          name: product.categoryName,
        },
        brand: {
          id: product.brandId,
          name: product.brandName,
        },
        gender: {
          id: product.genderId,
          label: product.genderLabel,
        },
        minPrice: Number(priceInfo?.minPrice) || 0,
        maxPrice: Number(priceInfo?.maxPrice) || 0,
        primaryImage: primaryImage?.url || fallbackImage?.url || '/shoes/shoe-1.jpg',
        colorCount: Number(colorInfo?.colorCount) || 1,
        createdAt: product.createdAt,
      };
    });

    return {
      products: productsWithDetails,
      totalCount,
    };
  } catch (error) {
    console.error('Get all products error:', error);
    return {
      products: [],
      totalCount: 0,
    };
  }
}

export async function getProduct(productId: string): Promise<ProductDetail | null> {
  try {
    const productResult = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        categoryId: products.categoryId,
        categoryName: categories.name,
        brandId: products.brandId,
        brandName: brands.name,
        genderId: products.genderId,
        genderLabel: genders.label,
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .innerJoin(brands, eq(products.brandId, brands.id))
      .innerJoin(genders, eq(products.genderId, genders.id))
      .where(and(eq(products.id, productId), eq(products.isPublished, true)))
      .limit(1);

    if (productResult.length === 0) {
      return null;
    }

    const product = productResult[0];

    const variantsResult = await db
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        inStock: productVariants.inStock,
        colorId: colors.id,
        colorName: colors.name,
        colorSlug: colors.slug,
        colorHexCode: colors.hexCode,
        sizeId: sizes.id,
        sizeName: sizes.name,
        sizeSlug: sizes.slug,
      })
      .from(productVariants)
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(eq(productVariants.productId, productId));

    const imagesResult = await db
      .select({
        id: productImages.id,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isPrimary));

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      category: {
        id: product.categoryId,
        name: product.categoryName,
      },
      brand: {
        id: product.brandId,
        name: product.brandName,
      },
      gender: {
        id: product.genderId,
        label: product.genderLabel,
      },
      variants: variantsResult.map(variant => ({
        id: variant.id,
        sku: variant.sku,
        price: Number(variant.price),
        salePrice: variant.salePrice ? Number(variant.salePrice) : null,
        inStock: variant.inStock,
        color: {
          id: variant.colorId,
          name: variant.colorName,
          slug: variant.colorSlug,
          hexCode: variant.colorHexCode,
        },
        size: {
          id: variant.sizeId,
          name: variant.sizeName,
          slug: variant.sizeSlug,
        },
      })),
      images: imagesResult,
      createdAt: product.createdAt,
    };
  } catch (error) {
    console.error('Get product error:', error);
    return null;
  }
}
