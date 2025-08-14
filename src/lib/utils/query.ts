import qs from "query-string";

export type Gender = "men" | "women" | "unisex";
export type SortKey = "featured" | "newest" | "price_desc" | "price_asc";

export interface ProductFilters {
  gender?: Gender[];
  size?: string[];
  color?: string[];
  price?: string[];
}

export interface ProductQuery extends ProductFilters {
  sort?: SortKey;
  page?: number;
}

const toArray = (v: unknown) => {
  if (Array.isArray(v)) return v.map(String);
  if (v == null || v === "") return undefined;
  return [String(v)];
};

export const parseFilters = (
  source: string | Record<string, string | string[] | undefined>
): ProductQuery => {
  const parsed =
    typeof source === "string"
      ? qs.parse(source, { arrayFormat: "comma" })
      : source;

  return {
    sort: (parsed.sort as SortKey) || "featured",
    page: parsed.page ? Number(parsed.page) : 1,
    gender: toArray(parsed.gender) as Gender[] | undefined,
    size: toArray(parsed.size),
    color: toArray(parsed.color),
    price: toArray(parsed.price),
  };
};

export const stringifyFilters = (query: ProductQuery): string =>
  qs.stringify(query, {
    arrayFormat: "comma",
    skipNull: true,
    skipEmptyString: true,
  });

export const toggleMulti = <K extends keyof ProductFilters>(
  query: ProductQuery,
  key: K,
  value: string
): ProductQuery => {
  const set = new Set(query[key] ?? []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  const next = { ...query, [key]: Array.from(set), page: 1 };
  return next;
};

export const setParam = (
  query: ProductQuery,
  key: string,
  value?: string
): ProductQuery => {
  const record = { ...query } as Record<string, unknown>;
  if (value == null || value === "") {
    delete record[key];
  } else {
    record[key] = value;
  }
  const next = record as ProductQuery;
  if (key !== "page") next.page = 1;
  return next;
};

export const clearFilters = (query: ProductQuery): ProductQuery => ({
  sort: query.sort,
  page: 1,
});
