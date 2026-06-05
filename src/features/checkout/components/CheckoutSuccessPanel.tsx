import Link from "next/link";

import { Button } from "@/shared/ui/button";

import type { CheckoutFromCartResponse } from "../types/checkout.types";

type CheckoutSuccessPanelProps = {
  result: CheckoutFromCartResponse;
};

function getOrderNumber(result: CheckoutFromCartResponse) {
  return result.orderNumber ?? result.order?.orderNumber ?? "Order created";
}

function getAmount(result: CheckoutFromCartResponse) {
  return result.amount ?? result.payment?.amount ?? result.order?.total;
}

function getCurrency(result: CheckoutFromCartResponse) {
  return result.currency ?? result.payment?.currency ?? "USD";
}

export default function CheckoutSuccessPanel({
  result,
}: CheckoutSuccessPanelProps) {
  const amount = getAmount(result);
  const currency = getCurrency(result);

  return (
    <div className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
      <p className="text-eyebrow text-muted-foreground">Checkout created</p>

      <h1 className="mt-3 text-section-title">Order is ready for payment.</h1>

      <div className="mt-6 space-y-3 rounded-2xl bg-muted p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Order</span>
          <span className="font-medium text-foreground">
            {getOrderNumber(result)}
          </span>
        </div>

        {amount !== undefined ? (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium text-foreground">
              {amount} {currency}
            </span>
          </div>
        ) : null}

        {result.paymentIntentId ? (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">PaymentIntent</span>
            <span className="max-w-[12rem] truncate font-medium text-foreground">
              {result.paymentIntentId}
            </span>
          </div>
        ) : null}

        {result.status ? (
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-foreground">{result.status}</span>
          </div>
        ) : null}
      </div>

      {result.clientSecret ? (
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Stripe client secret received. Next step is adding Stripe Elements to
          confirm this payment securely on the frontend.
        </p>
      ) : (
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Checkout was created. Next step depends on the payment method returned
          by backend.
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild className="rounded-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>

        <Button asChild variant="outline" className="rounded-full">
          <Link href="/cart">Back to cart</Link>
        </Button>
      </div>
    </div>
  );
}
