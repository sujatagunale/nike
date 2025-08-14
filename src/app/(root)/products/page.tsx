import Card from "@/components/Card";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import { mockProducts, priceBuckets } from "@/lib/data/products";
import { parseFilters, ProductQuery } from "@/lib/utils/query";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = parseFilters(params);

  const filtered = mockProducts.filter((p) => {
    if (query.gender && !query.gender.includes(p.gender)) return false;
    if (query.size && !query.size.some((s) => p.sizes.includes(s))) return false;
    if (query.color && !query.color.some((c) => p.colors.includes(c))) return false;
    if (query.price) {
      const ok = query.price.some((slug) => {
        const def = priceBuckets.find((b) => b.slug === slug);
        if (!def) return true;
        return p.price >= def.min && p.price < def.max;
      });
      if (!ok) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (query.sort) {
      case "price_desc":
        return b.price - a.price;
      case "price_asc":
        return a.price - b.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  const ActiveBadges = ({ q }: { q: ProductQuery }) => {
    const badges: string[] = [];
    if (q.gender) badges.push(...q.gender.map((g) => g[0].toUpperCase() + g.slice(1)));
    if (q.color) badges.push(...q.color.map((c) => c[0].toUpperCase() + c.slice(1)));
    if (q.size) badges.push(...q.size.map((s) => `Size: ${s}`));
    if (q.price)
      badges.push(
        ...q.price
          .map((slug) => priceBuckets.find((b) => b.slug === slug)?.label)
          .filter(Boolean) as string[]
      );

    return badges.length ? (
      <div className="mb-6 flex flex-wrap gap-2">
        {badges.map((b, i) => (
          <span
            key={`${b}-${i}`}
            className="px-3 py-1 rounded-full bg-light-200 text-dark-900 font-jost text-caption"
          >
            {b}
          </span>
        ))}
      </div>
    ) : null;
  };

  return (
    <section className="px-4 md:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-jost text-heading-3 text-dark-900">
          New ({sorted.length})
        </h1>
        <Sort current={query.sort ?? "featured"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">
        <Filters />
        <div>
          <ActiveBadges q={query} />
          {sorted.length === 0 ? (
            <div className="py-20 text-center font-jost text-dark-700">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sorted.map((p) => (
                <Card
                  key={p.id}
                  title={p.name}
                  category={p.category}
                  price={p.price}
                  image={p.image}
                  colors={p.colors.length}
                  badge={p.badge}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
