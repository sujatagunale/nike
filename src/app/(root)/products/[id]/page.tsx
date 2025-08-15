import DetailsClient from "./DetailsClient";
import { mockProducts } from "@/lib/data/products";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailsPage({ params }: PageProps) {
  const awaited = await params;
  const product =
    mockProducts.find((p) => p.id === awaited.id) ?? mockProducts[0];

  const extras = mockProducts
    .map((p) => p.image)
    .filter((src) => src !== product.image);
  const gallery = [product.image, ...extras].slice(0, 6);
  const galleryFinal = gallery.length ? gallery : ["/shoes/shoe-1.jpg"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
      <DetailsClient product={product} gallerySrcs={galleryFinal} />
    </div>
  );
}
