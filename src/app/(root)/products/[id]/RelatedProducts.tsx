import Card from "@/components/Card";
import { getRelatedProducts } from "@/lib/actions/product";
import Link from "next/link";

export default async function RelatedProducts({ productId }: { productId: string }) {
  const related = await getRelatedProducts(productId, 3);
  if (!related.length) return null;
  return (
    <section>
      <h2 className="font-jost text-heading-3 text-dark-900 mb-6">You Might Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((p) => (
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
    </section>
  );
}
