"use client";

import { useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { routes } from "@/shared/config/routes";
import { Button } from "@/shared/ui/button";
import { getAbsoluteUrl } from "@/shared/lib/seo";

type StripePaymentFormProps = {
  orderId: string;
};

export function StripePaymentForm({ orderId }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState("");
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setPaymentError("");
    setIsConfirmingPayment(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: getAbsoluteUrl(
          `${routes.checkoutSuccess}?orderId=${orderId}`,
        ),
      },
    });

    if (result.error) {
      setPaymentError(
        result.error.message ?? "Payment could not be confirmed.",
      );
      setIsConfirmingPayment(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <PaymentElement />

      {paymentError ? (
        <p className="text-sm text-red-600">{paymentError}</p>
      ) : null}

      <Button
        type="submit"
        className="h-12 w-full rounded-full text-sm font-semibold"
        disabled={!stripe || !elements || isConfirmingPayment}
      >
        {isConfirmingPayment ? "Confirming payment..." : "Pay securely"}
      </Button>
    </form>
  );
}
