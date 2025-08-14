import queryString from 'query-string';
import { useRouter } from 'next/navigation';

export interface ProductFilters {
  gender?: string[];
  color?: string[];
  size?: string[];
  priceMin?: number;
  priceMax?: number;
}

export interface ProductQuery extends ProductFilters {
  sort?: string;
  page?: number;
}

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
    priceMin: parsed.priceMin ? Number(parsed.priceMin) : undefined,
    priceMax: parsed.priceMax ? Number(parsed.priceMax) : undefined,
    sort: typeof parsed.sort === 'string' ? parsed.sort : undefined,
    page: parsed.page ? Number(parsed.page) : 1,
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

export function useUpdateUrlFilters() {
  const router = useRouter();
  
  return (filters: ProductQuery) => {
    const queryStr = stringifyFilters(filters);
    const newUrl = queryStr ? `/products?${queryStr}` : '/products';
    router.push(newUrl, { scroll: false });
  };
}
