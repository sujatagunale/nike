import queryString from 'query-string';

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

export type ProductQuery = ProductFilters & ProductSort;

export function parseFilters(searchParams: URLSearchParams): ProductQuery & { page?: number; limit?: number } {
  const parsed = queryString.parse(searchParams.toString(), { arrayFormat: 'comma' });
  
  const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : undefined;
  };
  
  const parseNumber = (value: unknown): number | undefined => {
    const num = typeof value === 'string' ? parseInt(value, 10) : undefined;
    return num && num > 0 ? num : undefined;
  };
  
  return {
    gender: parseStringArray(parsed.gender),
    color: parseStringArray(parsed.color),
    size: parseStringArray(parsed.size),
    priceRange: typeof parsed.priceRange === 'string' ? parsed.priceRange : undefined,
    category: parseStringArray(parsed.category),
    sort: typeof parsed.sort === 'string' ? parsed.sort as ProductQuery['sort'] : 'featured',
    page: parseNumber(parsed.page) || 1,
    limit: parseNumber(parsed.limit) || 12,
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
