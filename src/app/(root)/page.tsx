import Link from "next/link";
import Card from "@/components/Card";
import { getCurrentUser } from "@/lib/auth/actions";

export default async function Home() {
  const user = await getCurrentUser();

  console.log("USER", user);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-heading-3 font-jost font-bold text-dark-900">
        Latest Shoes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        <Link href="/products/1" className="block">
          <Card
            title="Nike Air Max 270"
            category="Running"
            price={100}
            image="/shoes/shoe-1.jpg"
          />
        </Link>
        <Link href="/products/2" className="block">
          <Card
            title="Nike Air Max 270"
            category="Running"
            price={100}
            image="/shoes/shoe-2.webp"
          />
        </Link>
        <Link href="/products/3" className="block">
          <Card
            title="Nike Air Max 270"
            category="Running"
            price={100}
            image="/shoes/shoe-3.webp"
          />
        </Link>
        <Link href="/products/1" className="block">
          <Card
            title="Nike Air Max 270"
            category="Running"
            price={100}
            image="/shoes/shoe-4.webp"
            badge="Best Seller"
          />
        </Link>
      </div>
    </section>
  );
}
