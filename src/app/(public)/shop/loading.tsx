/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Shop grid ka loading skeleton — SIRF /shop route par
 * (pehle poore (public) group par tha, `(public)/loading.tsx`).
 * REASON: Ek confirmed Next.js bug (vercel/next.js#75543, #77235,
 * #82041) — jab kisi route ka `loading.tsx` ho (chahe group-level se
 * inherit ho raha ho), Next.js response STREAM karna shuru kar deta
 * hai isse pehle ke `notFound()` decide ho — is se HTTP status hamesha
 * 200 reh jata hai, chahe "Page not found" UI sahi dikhe. Verified:
 * `/products/[slug]` aur `/categories/[slug]` (dono notFound() call
 * karte hain) is bug se pehle affected thay jab tak loading.tsx
 * poore group par tha. Fix: loading.tsx sirf un routes par jo
 * notFound() NAHI call karte (yahan: shop) — baaki routes (product/
 * category detail) is boundary ke baghair render hote hain, is liye
 * unka status code sahi (404) set hota hai.
 * RISK: Home page (`/`) ne bhi ye skeleton khoya (pehle group-level
 * se milta tha) — chhota UX trade-off, 404-status correctness zyada
 * zaroori thi. Home ko apna Suspense-based loading state chahiye ho
 * to alag se banana hoga (route-level loading.tsx use nahi kar sakte
 * bina isi bug ko dobara la kar, kyunke home (public) group root par
 * hai jahan se products/categories ke niche cascade hota).
 * ═════════════════════════════════════════════════════════════════
 */
export default function ShopLoading() {
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
