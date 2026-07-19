import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = createPageMetadata({
  title: "Payment failed",
  description: "Your Zemlo payment could not be completed.",
  path: routes.checkoutFailure,
  noIndex: true,
});

type CheckoutFailurePageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

export default async function CheckoutFailurePage({
  searchParams,
}: CheckoutFailurePageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-red-700">
          Payment failed
        </p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
          We could not complete your payment.
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Please return to checkout and try again. If the issue continues,
          contact support before placing another order.
        </p>

        {params.orderId ? (
          <p className="text-sm text-muted-foreground">
            Reference:{" "}
            <span className="font-medium text-foreground">
              {params.orderId}
            </span>
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Button asChild className="rounded-full">
            <Link href={routes.checkout}>Back to checkout</Link>
          </Button>

          <Button asChild variant="outline" className="rounded-full">
            <Link href={routes.shop}>Continue shopping</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
