import { formatMoney } from "@/shared/lib/formatters";

import {
  getCheckoutAmount,
  getCheckoutCurrency,
  getCheckoutOrderNumber,
} from "../lib/checkout-response";
import type { CheckoutFromCartResponse } from "../types/checkout.types";

type CheckoutSuccessPanelProps = {
  result: CheckoutFromCartResponse;
};

export function CheckoutSuccessPanel({ result }: CheckoutSuccessPanelProps) {
  const orderNumber = getCheckoutOrderNumber(result);
  const amount = getCheckoutAmount(result);
  const currency = getCheckoutCurrency(result);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-emerald-700">
        Order created successfully.
      </p>

      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
        Complete your payment
      </h1>

      <p className="text-sm text-muted-foreground">
        Order <span className="font-medium text-foreground">{orderNumber}</span>
      </p>

      <p className="text-sm text-muted-foreground">
        Amount:{" "}
        <span className="font-medium text-foreground">
          {formatMoney({
            amount,
            currency,
          })}
        </span>
      </p>

      <p className="text-sm leading-6 text-muted-foreground">
        Your inventory is temporarily reserved. Complete the Stripe payment to
        confirm your order.
      </p>
    </div>
  );
}

export default CheckoutSuccessPanel;
