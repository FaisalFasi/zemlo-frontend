/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Root-level 404 — jab koi URL kisi bhi route group
 * ((public), (auth), (admin)) mein match na kare, ye dikhta hai.
 * (public)/not-found.tsx sirf us group ke andar wale 404 sambhalta hai
 * — root ke paas apna nahi tha.
 * REASON: Audit mein pehle se pakra hua gap (docs/AUDIT.md H8).
 * RISK: Zero — sirf fallback UI.
 * ═════════════════════════════════════════════════════════════════
 */
import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { PageHeader } from "@/shared/ui/page-header";

export default function RootNotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center px-4 py-16 text-center">
      <PageHeader
        eyebrow="404"
        title="Page not found."
        description="The page you are looking for does not exist or may have moved."
      />

      <div className="mt-8">
        <Button asChild className="rounded-full">
          <Link href={routes.home}>Back to home</Link>
        </Button>
      </div>
    </main>
  );
}
