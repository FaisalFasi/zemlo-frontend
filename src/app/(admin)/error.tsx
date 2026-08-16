/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: /admin ke andar kahin bhi (kisi bhi page mein) koi
 * anjaan error aaye to Next.js is file ko dikhata hai — (public) group
 * mein ye pehle se hai, lekin (admin) group ke paas abhi tak BILKUL
 * NAHI THI.
 * REASON: Aaj hi ek asal masla mila — admin "view product" par
 * next/image ka error crash ho kar bilkul kharab default screen
 * dikhata tha. Ye file us jaisi kisi bhi future crash ko "reasonable"
 * screen mein badal degi, chahe wajah kuch bhi ho.
 * RISK: Zero — ye sirf ek fallback UI hai, kisi normal flow ko chhoo
 * nahi rahi.
 * ═════════════════════════════════════════════════════════════════
 */
"use client";

import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

type AdminErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function AdminError({ reset }: AdminErrorProps) {
  return (
    <main className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col justify-center px-4 py-16 text-center">
      <PageHeader
        eyebrow="Something went wrong"
        title="This admin page hit an error."
        description="Try again, or head back to the dashboard. If this keeps happening, check the browser console for details."
      />

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button type="button" className="rounded-full" onClick={reset}>
          Try again
        </Button>

        <Button asChild variant="outline" className="rounded-full">
          <Link href="/admin">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
