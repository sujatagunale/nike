import queryString from 'query-string';
import { db } from '@/lib/db';
import { 
  products, 
  productVariants, 
  categories, 
  genders, 
  colors, 
  sizes 
} from '@/lib/db/schema';
import { eq, and, gte, lte, exists, inArray, sql } from 'drizzle-orm';

export interface ProductFilters {
  gender?: string[];
  color?: string[];
  size?: string[];
  priceRange?: string;
  category?: string[];
}

export interface ProductSort {
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc';
}

export interface ProductPagination {
  page?: number;
  limit?: number;
}

export type ProductQuery = ProductFilters & ProductSort & ProductPagination;

export function parseFilters(searchParams: URLSearchParams): ProductQuery {
  const parsed = queryString.parse(searchParams.toString(), { arrayFormat: 'comma' });
  
  const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : undefined;
  };
  
  return {
    gender: parseStringArray(parsed.gender),
    color: parseStringArray(parsed.color),
    size: parseStringArray(parsed.size),
    priceRange: typeof parsed.priceRange === 'string' ? parsed.priceRange : undefined,
    category: parseStringArray(parsed.category),
    sort: typeof parsed.sort === 'string' ? parsed.sort as ProductQuery['sort'] : 'featured',
  };
}

export function stringifyFilters(filters: ProductQuery): string {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    )
  );
  
  return queryString.stringify(cleanFilters, { arrayFormat: 'comma' });
}

export function updateUrlFilters(filters: Partial<ProductQuery>, router: { push: (url: string, options?: { scroll: boolean }) => void }, pathname: string) {
  const queryStr = stringifyFilters(filters as ProductQuery);
  const url = queryStr ? `${pathname}?${queryStr}` : pathname;
  router.push(url, { scroll: false });
}

export function removeFilter(filterKey: keyof ProductFilters, value: string, currentFilters: ProductQuery, router: { push: (url: string, options?: { scroll: boolean }) => void }, pathname: string) {
  const newFilters = { ...currentFilters };
  
  if (filterKey === 'gender' || filterKey === 'color' || filterKey === 'size' || filterKey === 'category') {
    const currentArray = newFilters[filterKey] as string[] | undefined;
    if (currentArray) {
      const filtered = currentArray.filter(v => v !== value);
      if (filtered.length === 0) {
        delete newFilters[filterKey];
      } else {
        newFilters[filterKey] = filtered;
      }
    }
  } else {
    delete newFilters[filterKey];
  }
  
  updateUrlFilters(newFilters, router, pathname);
}

export function buildProductFilter(query: ProductQuery) {
  const conditions = [];

  if (query.gender?.length) {
    conditions.push(
      exists(
        db.select().from(genders)
          .where(and(
            eq(genders.id, products.genderId),
            inArray(genders.slug, query.gender)
          ))
      )
    );
  }

  if (query.category?.length) {
    conditions.push(
      exists(
        db.select().from(categories)
          .where(and(
            eq(categories.id, products.categoryId),
            inArray(categories.slug, query.category)
          ))
      )
    );
  }

  if (query.color?.length) {
    conditions.push(
      exists(
        db.select().from(productVariants)
          .innerJoin(colors, eq(productVariants.colorId, colors.id))
          .where(and(
            eq(productVariants.productId, products.id),
            inArray(colors.slug, query.color)
          ))
      )
    );
  }

  if (query.size?.length) {
    conditions.push(
      exists(
        db.select().from(productVariants)
          .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
          .where(and(
            eq(productVariants.productId, products.id),
            inArray(sizes.slug, query.size)
          ))
      )
    );
  }

  if (query.priceRange) {
    const priceRanges = {
      'under-150': { min: 0, max: 149 },
      '150-200': { min: 150, max: 200 },
      '200-250': { min: 200, max: 250 },
      'over-250': { min: 250, max: Infinity },
    };
    
    const range = priceRanges[query.priceRange as keyof typeof priceRanges];
    if (range) {
      conditions.push(
        exists(
          db.select().from(productVariants)
            .where(and(
              eq(productVariants.productId, products.id),
              range.max === Infinity 
                ? gte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.min)
                : and(
                    gte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.min),
                    lte(sql`COALESCE(${productVariants.salePrice}, ${productVariants.price})`, range.max)
                  )
            ))
        )
      );
    }
  }

  return conditions;
}
