import queryString from 'query-string';
import { ReadonlyURLSearchParams } from 'next/navigation';

export interface FilterParams {
  gender?: string[];
  size?: string[];
  color?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
}

export function parseSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams): FilterParams {
  const parsed = queryString.parse(searchParams.toString(), {
    arrayFormat: 'comma',
    parseNumbers: true,
  });

  const parseStringArray = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
      return value.filter((v): v is string => typeof v === 'string');
    }
    return typeof value === 'string' ? [value] : undefined;
  };

  return {
    gender: parseStringArray(parsed.gender),
    size: parseStringArray(parsed.size),
    color: parseStringArray(parsed.color),
    priceMin: typeof parsed.priceMin === 'number' ? parsed.priceMin : undefined,
    priceMax: typeof parsed.priceMax === 'number' ? parsed.priceMax : undefined,
    sort: typeof parsed.sort === 'string' ? parsed.sort : undefined,
    page: typeof parsed.page === 'number' ? parsed.page : 1,
  };
}

export function buildQueryString(params: FilterParams): string {
  const cleanParams: Record<string, string | string[] | number> = {};

  if (params.gender?.length) cleanParams.gender = params.gender;
  if (params.size?.length) cleanParams.size = params.size;
  if (params.color?.length) cleanParams.color = params.color;
  if (params.priceMin !== undefined) cleanParams.priceMin = params.priceMin;
  if (params.priceMax !== undefined) cleanParams.priceMax = params.priceMax;
  if (params.sort) cleanParams.sort = params.sort;
  if (params.page && params.page > 1) cleanParams.page = params.page;

  return queryString.stringify(cleanParams, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
  });
}

export function updateQueryParam(
  currentParams: FilterParams,
  key: keyof FilterParams,
  value: string | string[] | number | undefined
): FilterParams {
  return {
    ...currentParams,
    [key]: value,
    page: key !== 'page' ? 1 : (typeof value === 'number' ? value : 1), // Reset page when filters change
  };
}

export function toggleArrayParam(
  currentParams: FilterParams,
  key: 'gender' | 'size' | 'color',
  value: string
): FilterParams {
  const currentArray = currentParams[key] || [];
  const newArray = currentArray.includes(value)
    ? currentArray.filter(item => item !== value)
    : [...currentArray, value];

  return updateQueryParam(currentParams, key, newArray.length > 0 ? newArray : undefined);
}

export function clearAllFilters(): FilterParams {
  return {
    page: 1,
  };
}
