import type { Metadata } from "next";
import Link from "next/link";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";
import { Button } from "@/shared/ui/button";

export const metadata: Metadata = createPageMetadata({
  title: "Payment successful",
  description: "Your Zemlo payment was completed successfully.",
  path: routes.checkoutSuccess,
  noIndex: true,
});

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
    payment_intent?: string;
    payment_intent_client_secret?: string;
    redirect_status?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
          Payment successful
        </p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
          Thank you for your order.
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          Your payment has been submitted successfully. The backend webhook will
          confirm the final payment and order status.
        </p>

        {params.orderId ? (
          <p className="text-sm text-muted-foreground">
            Order ID:{" "}
            <span className="font-medium text-foreground">
              {params.orderId}
            </span>
          </p>
        ) : null}

        <Button asChild className="rounded-full">
          <Link href={routes.shop}>Continue shopping</Link>
        </Button>
      </div>
    </main>
  );
}
