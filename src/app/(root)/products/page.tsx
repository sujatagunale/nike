import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { parseFilterParams, buildProductQueryObject } from "@/lib/utils/query";
import { getAllProducts } from "@/lib/actions/product";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function Pills({
  params,
}: {
  params: Record<string, string | string[] | undefined>;
}) {
  const flat = (key: string) => {
    const v = params[key];
    if (!v) return [];
    return Array.isArray(v) ? v : String(v).split(",");
  };
  const entries: Array<{ key: string; value: string }> = [];
  ["gender", "size", "color", "price"].forEach((k) => {
    flat(k).forEach((v) => entries.push({ key: k, value: v }));
  });
  if (!entries.length) return null;
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {entries.map(({ key, value }) => (
        <span
          key={`${key}-${value}`}
          className="px-3 py-1 rounded-full bg-light-200 text-dark-700 font-jost text-caption"
        >
          {key}: {value}
        </span>
      ))}
    </div>
  );
}

function buildHref(
  current: Record<string, string | string[] | undefined>,
  page: number
) {
  const sp = new URLSearchParams();
  Object.entries(current).forEach(([k, v]) => {
    if (!v) return;
    if (Array.isArray(v)) sp.set(k, v.join(","));
    else sp.set(k, v);
  });
  sp.set("page", String(page));
  return `?${sp.toString()}`;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (Array.isArray(v)) urlParams.set(k, v.join(","));
    else if (typeof v === "string") urlParams.set(k, v);
  });
  const parsed = parseFilterParams(urlParams);
  const filters = buildProductQueryObject(parsed);
  const { products, totalCount } = await getAllProducts(filters);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const totalPages = Math.max(1, Math.ceil(totalCount / limit));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-jost text-heading-3 text-dark-900">New ({totalCount})</h1>
        <Sort />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[16rem_1fr] gap-6">
        <Filters />
        <section>
          <Pills params={params} />
          {products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-jost text-body text-dark-700">
                No products match your filters. Try resetting or changing your selection.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((p) => (
                  <Link key={p.id} href={`/products/${p.id}`} className="block">
                    <Card
                      title={p.name}
                      category={p.category.name}
                      price={p.minPrice}
                      image={p.imageUrl || "/shoes/shoe-1.jpg"}
                      colors={p.colorCount}
                    />
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-center gap-3 mt-8">
                <a
                  aria-disabled={page <= 1}
                  className="px-4 py-2 rounded bg-light-200"
                  href={buildHref(params, Math.max(1, page - 1))}
                >
                  Previous
                </a>
                <span className="font-jost text-caption">
                  {page} / {totalPages}
                </span>
                <a
                  aria-disabled={page >= totalPages}
                  className="px-4 py-2 rounded bg-light-200"
                  href={buildHref(params, Math.min(totalPages, page + 1))}
                >
                  Next
                </a>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
