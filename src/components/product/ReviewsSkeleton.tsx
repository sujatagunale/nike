export default function ReviewsSkeleton() {
  return (
    <section aria-labelledby="reviews" className="mt-16 animate-pulse">
      <div className="h-7 w-40 bg-dark-100 rounded mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-dark-100 rounded-lg p-4">
            <div className="h-5 w-1/3 bg-dark-100 rounded" />
            <div className="mt-2 h-4 w-1/5 bg-dark-100 rounded" />
            <div className="mt-3 h-16 w-full bg-dark-100 rounded" />
          </div>
        ))}
      </div>
    </section>
  );
}
