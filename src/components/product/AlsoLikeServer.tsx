"use server";

import AlsoLike from "@/components/product/AlsoLike";
import { getRecommendedProducts } from "@/lib/actions/product";

export default async function AlsoLikeServer({ productId }: { productId: string }) {
  const recs = await getRecommendedProducts(productId, 6);
  const items = recs
    .filter((r) => !!r.image)
    .map((r) => ({
      id: r.id,
      title: r.title,
      category: "",
      price: r.price,
      image: r.image as string,
    }));
  if (!items.length) return null;
  return <AlsoLike items={items} />;
}
