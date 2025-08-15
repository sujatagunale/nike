"use server";

import { db } from "@/lib/db";
import {
  products,
  productVariants,
  productImages,
  categories,
  brands,
  genders,
  colors,
  sizes,
  reviews as reviewsTable,
  user as userTable,
} from "@/lib/db/schema";
import {
  and,
  or,
  ilike,
  eq,
  inArray,
  sql,
  asc,
  desc,
  ne,
  type SQL,
} from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";

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

export async function getAllProducts(filters: ProductFiltersInput): Promise<GetAllProductsResult> {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.max(1, Math.min(60, filters.limit ?? 12));
  const offset = (page - 1) * limit;

  const whereAnd: SQL<unknown>[] = [eq(products.isPublished, true)];

  if (filters.search && filters.search.trim()) {
    const term = `%${filters.search.trim()}%`;
    const searchCond = or(
      ilike(products.name, term),
      ilike(products.description, term),
      ilike(brands.name, term)
    );
    whereAnd.push(searchCond as SQL<unknown>);
  }

  const isUuid = (v?: string) =>
    !!v && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  const matchIdOrSlug = (
    idCol: AnyPgColumn,
    slugCol: AnyPgColumn,
    value?: string
  ): SQL<unknown> | undefined => {
    if (!value) return undefined;
    if (isUuid(value)) return eq(idCol, value) as unknown as SQL<unknown>;
    return eq(slugCol, value) as unknown as SQL<unknown>;
  };

  if (filters.category) {
    whereAnd.push(matchIdOrSlug(products.categoryId, categories.slug, filters.category)!);
  }
  if (filters.brand) {
    whereAnd.push(matchIdOrSlug(products.brandId, brands.slug, filters.brand)!);
  }
  if (filters.gender) {
    whereAnd.push(matchIdOrSlug(products.genderId, genders.slug, filters.gender)!);
  }

  const priceExpr = sql<number>`coalesce(${productVariants.salePrice}, ${productVariants.price})`;

  if (filters.priceMin != null) {
    whereAnd.push(sql`${priceExpr} >= ${filters.priceMin}`);
  }
  if (filters.priceMax != null) {
    whereAnd.push(sql`${priceExpr} <= ${filters.priceMax}`);
  }

  if (filters.colors && filters.colors.length) {
    const uuids = filters.colors.filter(isUuid);
    const slugs = filters.colors.filter((v) => !isUuid(v));
    const parts: SQL<unknown>[] = [];
    if (uuids.length) parts.push(inArray(productVariants.colorId, uuids));
    if (slugs.length) parts.push(inArray(colors.slug, slugs));
    if (parts.length) whereAnd.push(or(...(parts as SQL<unknown>[])) as SQL<unknown>);
  }

  if (filters.sizes && filters.sizes.length) {
    const uuids = filters.sizes.filter(isUuid);
    const slugs = filters.sizes.filter((v) => !isUuid(v));
    const parts: SQL<unknown>[] = [];
    if (uuids.length) parts.push(inArray(productVariants.sizeId, uuids));
    if (slugs.length) parts.push(inArray(sizes.slug, slugs));
    if (parts.length) whereAnd.push(or(...(parts as SQL<unknown>[])) as SQL<unknown>);
  }

  const orderByExpr =
    filters.sortBy === "price_asc"
      ? asc(sql`min(${priceExpr})`)
      : filters.sortBy === "price_desc"
      ? desc(sql`min(${priceExpr})`)
      : filters.sortBy === "oldest"
      ? asc(products.createdAt)
      : desc(products.createdAt);

  const imageExprWhenColor = sql<string | null>`
    coalesce(
      nullif(
        max(case when ${productImages.variantId} is not null then ${productImages.url} end),
        ''
      ),
      max(case when ${productImages.isPrimary} = true then ${productImages.url} end),
      max(${productImages.url})
    )
  `;
  const imageExprDefault = sql<string | null>`
    coalesce(
      max(case when ${productImages.isPrimary} = true then ${productImages.url} end),
      max(${productImages.url})
    )
  `;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      brandId: brands.id,
      brandName: brands.name,
      brandSlug: brands.slug,
      categoryId: categories.id,
      categoryName: categories.name,
      categorySlug: categories.slug,
      genderId: genders.id,
      genderLabel: genders.label,
      genderSlug: genders.slug,
      minPrice: sql<number>`min(${priceExpr})`,
      maxPrice: sql<number>`max(${priceExpr})`,
      colorCount: sql<number>`count(distinct ${productVariants.colorId})`,
      imageUrl: (filters.colors && filters.colors.length ? imageExprWhenColor : imageExprDefault),
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .leftJoin(
      productImages,
      or(
        eq(productImages.productId, products.id),
        eq(productImages.variantId, productVariants.id)
      )
    )
    .where(and(...whereAnd))
    .groupBy(
      products.id,
      products.name,
      brands.id,
      brands.name,
      brands.slug,
      categories.id,
      categories.name,
      categories.slug,
      genders.id,
      genders.label,
      genders.slug
    )
    .orderBy(orderByExpr)
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({
      count: sql<number>`count(distinct ${products.id})`,
    })
    .from(products)
    .leftJoin(brands, eq(products.brandId, brands.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(genders, eq(products.genderId, genders.id))
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(colors, eq(colors.id, productVariants.colorId))
    .leftJoin(sizes, eq(sizes.id, productVariants.sizeId))
    .where(and(...whereAnd));

  const mapped: ProductWithAggregates[] = rows.map((r) => ({
    id: r.id,
    name: r.name,
    brand: { id: r.brandId!, name: r.brandName!, slug: r.brandSlug! },
    category: { id: r.categoryId!, name: r.categoryName!, slug: r.categorySlug! },
    gender: { id: r.genderId!, label: r.genderLabel!, slug: r.genderSlug! },
    minPrice: Number(r.minPrice ?? 0),
    maxPrice: Number(r.maxPrice ?? 0),
    colorCount: Number(r.colorCount ?? 0),
    imageUrl: r.imageUrl ?? null,
  }));

  return { products: mapped, totalCount: Number(count) };
}

export type ProductDetail = {
  id: string;
  name: string;
  description: string | null;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  images: { id: string; url: string; isPrimary: boolean; sortOrder: number }[];
  variants: Array<{
    id: string;
    sku: string;
    price: number;
    salePrice: number | null;
    inStock: number;
    color: { id: string; name: string; slug: string; hexCode: string };
    size: { id: string; name: string; slug: string; sortOrder: number };
  }>;
};

export async function getProduct(productId: string): Promise<ProductDetail | null> {
  const row = await db.query.products.findFirst({
    where: eq(products.id, productId),
    with: {
      brand: true,
      category: true,
      gender: true,
      images: {
        orderBy: (img, { desc, asc }) => [desc(img.isPrimary), asc(img.sortOrder)],
      },
      variants: {
        with: {
          color: true,
          size: true,
        },
      },
    },
  });
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? null,
    brand: { id: row.brand.id, name: row.brand.name, slug: row.brand.slug },
    category: { id: row.category.id, name: row.category.name, slug: row.category.slug },
    gender: { id: row.gender.id, label: row.gender.label, slug: row.gender.slug },
    images: row.images.map((i) => ({
      id: i.id,
      url: i.url,
      isPrimary: i.isPrimary,
      sortOrder: i.sortOrder,
    })),
    variants: row.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      salePrice: v.salePrice != null ? Number(v.salePrice) : null,
      inStock: v.inStock,
      color: {
        id: v.color.id,
        name: v.color.name,
        slug: v.color.slug,
        hexCode: v.color.hexCode,
      },
      size: {
        id: v.size.id,
        name: v.size.name,
        slug: v.size.slug,
        sortOrder: v.size.sortOrder,
      },
    })),
  };
}

export type ReviewItem = {
  id: string;
  author: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
};

export async function getProductReviews(productId: string): Promise<ReviewItem[]> {
  const rows = await db
    .select({
      id: reviewsTable.id,
      rating: reviewsTable.rating,
      comment: reviewsTable.comment,
      createdAt: reviewsTable.createdAt,
      userName: userTable.name,
      userEmail: userTable.email,
    })
    .from(reviewsTable)
    .innerJoin(userTable, eq(reviewsTable.userId, userTable.id))
    .where(eq(reviewsTable.productId, productId))
    .orderBy(desc(reviewsTable.createdAt));

  return rows.map((r) => ({
    id: r.id,
    author: r.userName ?? r.userEmail ?? "Anonymous",
    rating: r.rating,
    title: undefined,
    content: r.comment ?? "",
    createdAt: r.createdAt?.toISOString?.() ?? new Date(r.createdAt as unknown as string).toISOString(),
  }));
}

export type RecommendedProduct = {
  id: string;
  title: string;
  price: number;
  image: string | null;
};

export async function getRecommendedProducts(productId: string, limit = 6): Promise<RecommendedProduct[]> {
  const base = await db
    .select({
      id: products.id,
      categoryId: products.categoryId,
      brandId: products.brandId,
      genderId: products.genderId,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!base.length) return [];

  const { categoryId, brandId, genderId } = base[0]!;

  const priceExpr = sql<number>`coalesce(${productVariants.salePrice}, ${productVariants.price})`;
  const imageExpr = sql<string | null>`
    coalesce(
      max(case when ${productImages.isPrimary} = true then ${productImages.url} end),
      max(${productImages.url})
    )
  `;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      price: sql<number>`min(${priceExpr})`,
      image: imageExpr,
    })
    .from(products)
    .leftJoin(productVariants, eq(productVariants.productId, products.id))
    .leftJoin(productImages, eq(productImages.productId, products.id))
    .where(
      and(
        eq(products.isPublished, true),
        ne(products.id, productId),
        or(
          eq(products.categoryId, categoryId),
          and(eq(products.brandId, brandId), eq(products.genderId, genderId))
        )
      )
    )
    .groupBy(products.id, products.name)
    .orderBy(asc(products.createdAt))
    .limit(Math.max(4, Math.min(6, limit)));

  return rows.map((r) => ({
    id: r.id,
    title: r.name,
    price: Number(r.price ?? 0),
    image: r.image ?? null,
  }));
}
