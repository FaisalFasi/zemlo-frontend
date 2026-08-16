/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Home page ke data-dependent sections (category shortcuts,
 * featured deals, popular products, category rails, brand showcase) ke
 * liye loading skeleton — ek <Suspense fallback> ke through, route-level
 * `loading.tsx` se NAHI.
 * REASON: Ek route-level `loading.tsx` `(public)` group root par hota to
 * `/products/[slug]` aur `/categories/[slug]` ka notFound() status-code
 * bug WAPAS aa jata (see IMPLEMENTATION.md "Fixed: notFound() returning
 * HTTP 200"). In-page Suspense boundary sirf ISI page tak scoped hai,
 * doosre routes ko cascade nahi karti.
 * RISK: Zero — sirf loading UI.
 * ═════════════════════════════════════════════════════════════════
 */
export default function HomeDataSkeleton() {
  return (
    <div className="container-page space-y-16 py-12">
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="h-10 w-28 shrink-0 animate-pulse rounded-full bg-muted"
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
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
    </div>
  );
}
