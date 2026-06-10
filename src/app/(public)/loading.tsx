export default function PublicLoading() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-3xl space-y-4 text-center">
        <div className="mx-auto h-4 w-28 animate-pulse rounded-full bg-muted" />
        <div className="mx-auto h-10 w-72 animate-pulse rounded-full bg-muted md:h-12 md:w-96" />
        <div className="mx-auto h-5 w-full max-w-xl animate-pulse rounded-full bg-muted" />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-card"
          >
            <div className="aspect-[4/5] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
