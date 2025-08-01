'use server';

import { db } from '../db';
import { products, productImages } from '../db/schema/products';
import { productVariants } from '../db/schema/variants';
import { categories } from '../db/schema/categories';
import { brands } from '../db/schema/brands';
import { genders } from '../db/schema/filters/genders';
import { colors } from '../db/schema/filters/colors';
import { sizes } from '../db/schema/filters/sizes';
import { eq, and, gte, lte, desc, asc, sql, inArray, SQL } from 'drizzle-orm';
import type { ProductQuery } from '../utils/query';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  gender: {
    id: string;
    label: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    isPrimary: boolean;
  }[];
  variants: {
    id: string;
    sku: string;
    price: string;
    salePrice: string | null;
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
  }[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductListResult {
  products: Product[];
  totalCount: number;
}

export async function getAllProducts(params: ProductQuery = {}): Promise<ProductListResult> {
  try {
    const {
      gender: genderFilter,
      color: colorFilter,
      size: sizeFilter,
      category: categoryFilter,
      priceRange,
      sort = 'featured',
      page = 1,
      limit = 12
    } = params;

    const offset = (page - 1) * limit;

    const whereConditions: SQL[] = [eq(products.isPublished, true)];

    if (genderFilter?.length) {
      whereConditions.push(inArray(genders.slug, genderFilter));
    }

    if (categoryFilter?.length) {
      whereConditions.push(inArray(categories.slug, categoryFilter));
    }

    if (colorFilter?.length) {
      whereConditions.push(inArray(colors.slug, colorFilter));
    }

    if (sizeFilter?.length) {
      whereConditions.push(inArray(sizes.slug, sizeFilter));
    }

    if (priceRange) {
      const priceRanges = {
        'under-150': { min: 0, max: 149 },
        '150-200': { min: 150, max: 200 },
        '200-250': { min: 200, max: 250 },
        'over-250': { min: 250, max: 999999 }
      };
      
      const range = priceRanges[priceRange as keyof typeof priceRanges];
      if (range) {
        whereConditions.push(
          and(
            gte(sql`CAST(${productVariants.price} AS DECIMAL)`, range.min),
            lte(sql`CAST(${productVariants.price} AS DECIMAL)`, range.max)
          )!
        );
      }
    }

    let orderBy;
    switch (sort) {
      case 'price_asc':
        orderBy = asc(sql`CAST(${productVariants.price} AS DECIMAL)`);
        break;
      case 'price_desc':
        orderBy = desc(sql`CAST(${productVariants.price} AS DECIMAL)`);
        break;
      case 'newest':
        orderBy = desc(products.createdAt);
        break;
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const productsQuery = db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        isPublished: products.isPublished,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
        gender: {
          id: genders.id,
          label: genders.label,
          slug: genders.slug,
        },
        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(colors, eq(productVariants.colorId, colors.id))
      .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(and(...whereConditions))
      .groupBy(products.id, categories.id, genders.id, brands.id)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const productResults = await productsQuery;

    const productIds = productResults.map(p => p.id);

    const [imagesResults, variantsResults] = await Promise.all([
      productIds.length > 0 ? db
        .select({
          productId: productImages.productId,
          id: productImages.id,
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(inArray(productImages.productId, productIds)) : [],
      
      productIds.length > 0 ? db
        .select({
          productId: productVariants.productId,
          id: productVariants.id,
          sku: productVariants.sku,
          price: productVariants.price,
          salePrice: productVariants.salePrice,
          inStock: productVariants.inStock,
          color: {
            id: colors.id,
            name: colors.name,
            slug: colors.slug,
            hexCode: colors.hexCode,
          },
          size: {
            id: sizes.id,
            name: sizes.name,
            slug: sizes.slug,
          },
        })
        .from(productVariants)
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(inArray(productVariants.productId, productIds)) : []
    ]);

    const imagesMap = new Map<string, Array<{
      productId: string;
      id: string;
      url: string;
      isPrimary: boolean;
    }>>();
    imagesResults.forEach(image => {
      if (!imagesMap.has(image.productId)) {
        imagesMap.set(image.productId, []);
      }
      imagesMap.get(image.productId)!.push(image);
    });

    const variantsMap = new Map<string, Array<{
      productId: string;
      id: string;
      sku: string;
      price: string;
      salePrice: string | null;
      inStock: number;
      color: {
        id: string;
        name: string;
        slug: string;
        hexCode: string;
      } | null;
      size: {
        id: string;
        name: string;
        slug: string;
      } | null;
    }>>();
    variantsResults.forEach(variant => {
      if (!variantsMap.has(variant.productId)) {
        variantsMap.set(variant.productId, []);
      }
      variantsMap.get(variant.productId)!.push(variant);
    });

    const enrichedProducts = productResults.map(product => ({
      ...product,
      images: imagesMap.get(product.id) || [],
      variants: variantsMap.get(product.id) || [],
    }));

    const countQuery = db
      .select({ count: sql<number>`count(distinct ${products.id})` })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(colors, eq(productVariants.colorId, colors.id))
      .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(and(...whereConditions));

    const [{ count: totalCount }] = await countQuery;

    return {
      products: enrichedProducts as Product[],
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

export async function getProduct(productId: string): Promise<Product | null> {
  try {
    const productResult = await db
      .select({
        id: products.id,
        name: products.name,
        description: products.description,
        isPublished: products.isPublished,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
        },
        gender: {
          id: genders.id,
          label: genders.label,
          slug: genders.slug,
        },
        brand: {
          id: brands.id,
          name: brands.name,
          slug: brands.slug,
        },
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(genders, eq(products.genderId, genders.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(and(eq(products.id, productId), eq(products.isPublished, true)))
      .limit(1);

    if (productResult.length === 0) {
      return null;
    }

    const product = productResult[0];

    const [imagesResults, variantsResults] = await Promise.all([
      db
        .select({
          id: productImages.id,
          url: productImages.url,
          isPrimary: productImages.isPrimary,
        })
        .from(productImages)
        .where(eq(productImages.productId, productId)),
      
      db
        .select({
          id: productVariants.id,
          sku: productVariants.sku,
          price: productVariants.price,
          salePrice: productVariants.salePrice,
          inStock: productVariants.inStock,
          color: {
            id: colors.id,
            name: colors.name,
            slug: colors.slug,
            hexCode: colors.hexCode,
          },
          size: {
            id: sizes.id,
            name: sizes.name,
            slug: sizes.slug,
          },
        })
        .from(productVariants)
        .leftJoin(colors, eq(productVariants.colorId, colors.id))
        .leftJoin(sizes, eq(productVariants.sizeId, sizes.id))
        .where(eq(productVariants.productId, productId))
    ]);

    return {
      ...product,
      images: imagesResults,
      variants: variantsResults.filter(v => v.color && v.size) as Array<{
        id: string;
        sku: string;
        price: string;
        salePrice: string | null;
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
      }>,
    } as Product;
  } catch (error) {
    console.error('Get product error:', error);
    return null;
  }
}
