import qs from "query-string";

export type ProductFilters = {
  gender?: string[]; // men,women,kids
  size?: string[];   // XS,S,M,L,XL
  color?: string[];  // black,white,red,blue,green,orange,grey
  price?: string[];  // "min-max" ranges e.g., "50-100"
  page?: number;
};

export type ProductSort = "featured" | "newest" | "price_desc" | "price_asc";

export type ProductQuery = ProductFilters & {
  sort?: ProductSort;
};

export function parseQuery(search: string): ProductQuery {
  const parsed = qs.parse(search, { arrayFormat: "comma" });
  const toArray = (v: unknown) =>
    Array.isArray(v) ? (v as string[]) : v ? [String(v)] : undefined;

  return {
    gender: toArray(parsed.gender),
    size: toArray(parsed.size),
    color: toArray(parsed.color),
    price: toArray(parsed.price),
    sort: (parsed.sort as ProductSort) || undefined,
    page: parsed.page ? Number(parsed.page) || 1 : undefined,
  };
}

export function stringifyQuery(query: ProductQuery): string {
  return qs.stringify(query, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });
}

export function mergeQuery(
  currentSearch: string,
  patch: Partial<ProductQuery>
): string {
  const current = parseQuery(currentSearch);
  const next: ProductQuery = {
    ...current,
    ...patch,
  };
  return stringifyQuery(next);
}

export function toggleMultiValue(
  currentValues: string[] | undefined,
  value: string
): string[] | undefined {
  const set = new Set(currentValues || []);
  if (set.has(value)) {
    set.delete(value);
  } else {
    set.add(value);
  }
  return set.size ? Array.from(set) : undefined;
}

export function removeKey(
  currentSearch: string,
  key: keyof ProductQuery
): string {
  const parsed = qs.parse(currentSearch, { arrayFormat: "comma" });
  delete (parsed as Record<string, unknown>)[key as string];
  return qs.stringify(parsed, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });
}
