export default function AlsoLikeSkeleton() {
  return (
    <section aria-labelledby="also-like" className="mt-16 animate-pulse">
      <div className="h-7 w-60 bg-dark-100 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-72 w-full bg-dark-100 rounded" />
        ))}
      </div>
    </section>
  );
}
