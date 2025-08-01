import queryString from 'query-string';

export interface FilterState {
  gender?: string[];
  color?: string[];
  size?: string[];
  priceRange?: string[];
  category?: string[];
}

export interface SortOption {
  value: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export function parseFiltersFromUrl(searchParams: URLSearchParams): FilterState {
  return {
    gender: searchParams.get('gender')?.split(',').filter(Boolean) || [],
    color: searchParams.get('color')?.split(',').filter(Boolean) || [],
    size: searchParams.get('size')?.split(',').filter(Boolean) || [],
    priceRange: searchParams.get('priceRange')?.split(',').filter(Boolean) || [],
    category: searchParams.get('category')?.split(',').filter(Boolean) || [],
  };
}

export function buildQueryString(filters: FilterState, sort?: string): string {
  const params: Record<string, string> = {};
  
  Object.entries(filters).forEach(([key, values]) => {
    if (values && values.length > 0) {
      params[key] = values.join(',');
    }
  });
  
  if (sort && sort !== 'featured') {
    params.sort = sort;
  }
  
  return queryString.stringify(params);
}

export function updateUrlWithFilters(filters: FilterState, sort?: string) {
  const queryStr = buildQueryString(filters, sort);
  const newUrl = queryStr ? `?${queryStr}` : '/products';
  window.history.pushState({}, '', newUrl);
}
