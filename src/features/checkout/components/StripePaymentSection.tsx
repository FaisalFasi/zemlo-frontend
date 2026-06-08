"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { stripeConfig } from "@/shared/config/stripe";

import { StripePaymentForm } from "./StripePaymentForm";

const stripePromise = stripeConfig.publishableKey
  ? loadStripe(stripeConfig.publishableKey)
  : null;

type StripePaymentSectionProps = {
  clientSecret: string;
  orderId: string;
};

export function StripePaymentSection({
  clientSecret,
  orderId,
}: StripePaymentSectionProps) {
  if (!stripePromise) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Stripe publishable key is missing. Add{" "}
        <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your frontend
        environment.
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          labels: "floating",
        },
      }}
    >
      <StripePaymentForm orderId={orderId} />
    </Elements>
  );
}
