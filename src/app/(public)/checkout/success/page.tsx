import type { Metadata } from "next";

import CheckoutResultPanel from "@/features/checkout/components/CheckoutResultPanel";
import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Order confirmation",
  description: "Your Zemlo order confirmation.",
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
      <CheckoutResultPanel
        orderId={params.orderId}
        clientSecret={params.payment_intent_client_secret}
      />
    </main>
  );
}
