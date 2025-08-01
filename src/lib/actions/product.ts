import { db } from '@/lib/db';
import { 
  products, 
  productVariants, 
  productImages, 
  brands, 
  categories, 
  genders, 
  colors, 
  sizes 
} from '@/lib/db/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { ProductQuery, buildProductFilter } from '@/lib/utils/query';

export interface ProductListItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  gender: string;
  brand: string;
  image: string | null;
  minPrice: number;
  maxPrice: number;
  salePrice: number | null;
  inStock: boolean;
  colorCount: number;
  sizeCount: number;
  createdAt: Date;
}

export interface ProductDetail {
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
    logoUrl: string | null;
  };
  images: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
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
      sortOrder: number;
    };
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsResult {
  products: ProductListItem[];
  totalCount: number;
}

export async function getAllProducts(query: ProductQuery): Promise<ProductsResult> {
  const { page = 1, limit = 12, sort = 'featured' } = query;
  const offset = (page - 1) * limit;
  
  const filterConditions = buildProductFilter(query);
  
  const baseQuery = db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      categoryName: categories.name,
      genderLabel: genders.label,
      brandName: brands.name,
      primaryImage: sql<string | null>`(
        SELECT pi.url 
        FROM product_images pi 
        WHERE pi.product_id = ${products.id} AND pi.is_primary = true 
        LIMIT 1
      )`,
      fallbackImage: sql<string | null>`(
        SELECT pi.url 
        FROM product_images pi 
        WHERE pi.product_id = ${products.id} 
        LIMIT 1
      )`,
      minPrice: sql<number>`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      maxPrice: sql<number>`MAX(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`,
      salePrice: sql<number | null>`MIN(${productVariants.salePrice})`,
      inStock: sql<boolean>`SUM(${productVariants.inStock}) > 0`,
      colorCount: sql<number>`COUNT(DISTINCT ${productVariants.colorId})`,
      sizeCount: sql<number>`COUNT(DISTINCT ${productVariants.sizeId})`,
      createdAt: products.createdAt,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(genders, eq(products.genderId, genders.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(productVariants, eq(products.id, productVariants.productId))
    .where(and(eq(products.isPublished, true), ...filterConditions))
    .groupBy(
      products.id,
      products.name,
      products.description,
      categories.name,
      genders.label,
      brands.name,
      products.createdAt
    );

  let orderedQuery;
  switch (sort) {
    case 'price_asc':
      orderedQuery = baseQuery.orderBy(asc(sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`));
      break;
    case 'price_desc':
      orderedQuery = baseQuery.orderBy(desc(sql`MIN(COALESCE(${productVariants.salePrice}, ${productVariants.price}))`));
      break;
    case 'newest':
      orderedQuery = baseQuery.orderBy(desc(products.createdAt));
      break;
    default:
      orderedQuery = baseQuery.orderBy(desc(products.createdAt));
      break;
  }

  const [productsResult, totalCountResult] = await Promise.all([
    orderedQuery.limit(limit).offset(offset),
    getTotalProductCount(query)
  ]);

  const formattedProducts: ProductListItem[] = productsResult.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.categoryName,
    gender: row.genderLabel,
    brand: row.brandName,
    image: row.primaryImage || row.fallbackImage,
    minPrice: row.minPrice,
    maxPrice: row.maxPrice,
    salePrice: row.salePrice,
    inStock: row.inStock,
    colorCount: row.colorCount,
    sizeCount: row.sizeCount,
    createdAt: row.createdAt,
  }));

  return {
    products: formattedProducts,
    totalCount: totalCountResult,
  };
}

export async function getTotalProductCount(query: ProductQuery): Promise<number> {
  const filterConditions = buildProductFilter(query);
  
  const result = await db
    .select({
      count: sql<number>`COUNT(DISTINCT ${products.id})`,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(genders, eq(products.genderId, genders.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .innerJoin(productVariants, eq(products.id, productVariants.productId))
    .where(and(eq(products.isPublished, true), ...filterConditions));

  return result[0]?.count || 0;
}

export async function getProduct(productId: string): Promise<ProductDetail | null> {
  const productResult = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
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
        logoUrl: brands.logoUrl,
      },
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .innerJoin(genders, eq(products.genderId, genders.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(and(eq(products.id, productId), eq(products.isPublished, true)))
    .limit(1);

  if (!productResult.length) {
    return null;
  }

  const product = productResult[0];

  const [imagesResult, variantsResult] = await Promise.all([
    db
      .select({
        id: productImages.id,
        url: productImages.url,
        isPrimary: productImages.isPrimary,
      })
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isPrimary), productImages.id),
    
    db
      .select({
        id: productVariants.id,
        sku: productVariants.sku,
        price: sql<number>`${productVariants.price}::numeric`,
        salePrice: sql<number | null>`${productVariants.salePrice}::numeric`,
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
          sortOrder: sizes.sortOrder,
        },
      })
      .from(productVariants)
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(eq(productVariants.productId, productId))
      .orderBy(colors.name, sizes.sortOrder)
  ]);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    gender: product.gender,
    brand: product.brand,
    images: imagesResult,
    variants: variantsResult,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}
