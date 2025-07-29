import Card from "@/components/Card";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-heading-3 font-jost font-bold text-dark-900">
        Latest Shoes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        <Card
          title="Nike Air Max 270"
          category="Running"
          price={100}
          image="/shoe-1.jpg"
        />
        <Card
          title="Nike Air Max 270"
          category="Running"
          price={100}
          image="/shoe-2.webp"
        />
        <Card
          title="Nike Air Max 270"
          category="Running"
          price={100}
          image="/shoe-3.webp"
        />
        <Card
          title="Nike Air Max 270"
          category="Running"
          price={100}
          image="/shoe-4.webp"
          badge="Best Seller"
        />
      </div>
    </section>
  );
}
