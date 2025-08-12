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

export function parseFilterParams(searchParams: URLSearchParams): ProductQuery {
  return parseFilters(searchParams);
}

export function buildProductQueryObject(filters: ProductQuery) {
  const queryConditions: Array<{ field: string; values?: string[]; value?: string }> = [];
  
  if (filters.gender?.length) {
    queryConditions.push({ field: 'gender', values: filters.gender });
  }
  
  if (filters.color?.length) {
    queryConditions.push({ field: 'color', values: filters.color });
  }
  
  if (filters.size?.length) {
    queryConditions.push({ field: 'size', values: filters.size });
  }
  
  if (filters.category?.length) {
    queryConditions.push({ field: 'category', values: filters.category });
  }
  
  if (filters.priceRange) {
    queryConditions.push({ field: 'priceRange', value: filters.priceRange });
  }
  
  return {
    conditions: queryConditions,
    sort: filters.sort || 'featured',
  };
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
