"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";

import { routes } from "@/shared/config/routes";
import { stripeConfig } from "@/shared/config/stripe";
import { Button } from "@/shared/ui/button";

type CheckoutResultPanelProps = {
  orderId?: string;
  clientSecret?: string;
};

type ResultStatus = "verifying" | "succeeded" | "processing" | "unknown";

// Never trust the redirect URL alone — anyone can type ?redirect_status=succeeded.
// We ask Stripe for the PaymentIntent's real status via its client secret;
// definitive failures are routed to /checkout/failure.
export default function CheckoutResultPanel({
  orderId,
  clientSecret,
}: CheckoutResultPanelProps) {
  const router = useRouter();
  const [status, setStatus] = useState<ResultStatus>(
    clientSecret ? "verifying" : "unknown",
  );

  useEffect(() => {
    if (!clientSecret || !stripeConfig.publishableKey) {
      return;
    }

    let cancelled = false;

    async function verifyPayment() {
      try {
        const stripe = await loadStripe(stripeConfig.publishableKey);

        if (!stripe || cancelled) {
          if (!cancelled) setStatus("unknown");
          return;
        }

        const { paymentIntent } = await stripe.retrievePaymentIntent(
          clientSecret as string,
        );

        if (cancelled) return;

        switch (paymentIntent?.status) {
          case "succeeded":
            setStatus("succeeded");
            break;
          case "processing":
            setStatus("processing");
            break;
          case "requires_payment_method":
          case "requires_confirmation":
          case "requires_action":
          case "canceled":
            router.replace(
              `${routes.checkoutFailure}${orderId ? `?orderId=${encodeURIComponent(orderId)}` : ""}`,
            );
            break;
          default:
            setStatus("unknown");
        }
      } catch {
        if (!cancelled) setStatus("unknown");
      }
    }

    void verifyPayment();

    return () => {
      cancelled = true;
    };
  }, [clientSecret, orderId, router]);

  if (status === "verifying") {
    return (
      <div className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <Loader2 className="mx-auto size-6 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Verifying your payment...
        </p>
      </div>
    );
  }

  if (status === "processing") {
    return (
      <div className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-amber-700">
          Payment processing
        </p>

        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
          Your payment is on its way.
        </h1>

        <p className="text-sm leading-6 text-muted-foreground">
          The payment provider is still confirming this payment. Your order is
          reserved — no further action is needed.
        </p>

        {orderId ? <OrderReference orderId={orderId} /> : null}

        <Button asChild className="rounded-full">
          <Link href={routes.shop}>Continue shopping</Link>
        </Button>
      </div>
    );
  }

  const isVerified = status === "succeeded";

  return (
    <div className="space-y-5 rounded-3xl border border-border bg-card p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-emerald-700">
        {isVerified ? "Payment successful" : "Order received"}
      </p>

      <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">
        Thank you for your order.
      </h1>

      <p className="text-sm leading-6 text-muted-foreground">
        {isVerified
          ? "Your payment is confirmed. You will receive an order confirmation shortly."
          : "Your order has been received. If you completed a payment, its final status will be confirmed shortly."}
      </p>

      {orderId ? <OrderReference orderId={orderId} /> : null}

      <Button asChild className="rounded-full">
        <Link href={routes.shop}>Continue shopping</Link>
      </Button>
    </div>
  );
}

function OrderReference({ orderId }: { orderId: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      Order ID: <span className="font-medium text-foreground">{orderId}</span>
    </p>
  );
}
