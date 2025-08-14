import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { mockProducts } from "@/lib/data/products";
import { parseQuery, ProductQuery, ProductSort } from "@/lib/utils/query";

function filterProducts(query: ProductQuery) {
  const byGender = (p: typeof mockProducts[number]) =>
    !query.gender?.length || p.gender.some((g) => query.gender?.includes(g));
  const byColor = (p: typeof mockProducts[number]) =>
    !query.color?.length || p.colors.some((c) => query.color?.includes(c));
  const bySize = (p: typeof mockProducts[number]) =>
    !query.size?.length || p.variants.some((v) => query.size?.includes(v.size));
  const byPrice = (p: typeof mockProducts[number]) => {
    if (!query.price?.length) return true;
    const variantPrices = p.variants.map((v) => v.price);
    const minPrice = Math.min(...variantPrices, p.basePrice);
    const maxPrice = Math.max(...variantPrices, p.basePrice);
    return query.price.some((r) => {
      const [minStr, maxStr] = r.split("-");
      const min = Number(minStr);
      const max = Number(maxStr);
      return max ? (minPrice <= max && maxPrice >= min) : maxPrice >= min;
    });
  };
  return mockProducts.filter((p) => byGender(p) && byColor(p) && bySize(p) && byPrice(p));
}

function sortProducts(products: typeof mockProducts, sort?: ProductSort) {
  const list = [...products];
  if (sort === "newest") {
    return list.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  if (sort === "price_desc") {
    return list.sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((v) => v.price), a.basePrice);
      const bPrice = Math.min(...b.variants.map((v) => v.price), b.basePrice);
      return bPrice - aPrice;
    });
  }
  if (sort === "price_asc") {
    return list.sort((a, b) => {
      const aPrice = Math.min(...a.variants.map((v) => v.price), a.basePrice);
      const bPrice = Math.min(...b.variants.map((v) => v.price), b.basePrice);
      return aPrice - bPrice;
    });
  }
  return list;
}

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = parseQuery(new URLSearchParams(searchParams as any).toString());
  const filtered = filterProducts(query);
  const sorted = sortProducts(filtered, query.sort);

  const badges: string[] = [
    ...(query.gender || []).map((g) => g[0].toUpperCase() + g.slice(1)),
    ...(query.size || []),
    ...(query.color || []).map((c) => c[0].toUpperCase() + c.slice(1)),
    ...(query.price || []),
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-heading-3 font-jost font-bold text-dark-900">Products</h1>
        <div className="flex items-center gap-4">
          <Sort />
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="bg-light-200 text-dark-900 px-3 py-1 rounded-full font-jost text-caption"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-[18rem_1fr] gap-8">
        <Filters />
        <div>
          {sorted.length === 0 ? (
            <div className="p-8 border border-light-300 rounded-lg text-center">
              <p className="font-jost text-body text-dark-700">
                No products match your filters. Try adjusting or clearing filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((p) => {
                const minColors = p.colors.length || 1;
                const price =
                  Math.min(...p.variants.map((v) => v.price), p.basePrice) || p.basePrice;
                return (
                  <Card
                    key={p.id}
                    title={p.title}
                    category={p.category}
                    price={price}
                    image={p.image}
                    colors={minColors}
                    badge={p.badge}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
