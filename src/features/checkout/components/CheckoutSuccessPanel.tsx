import type { CheckoutFromCartResponse } from "../types/checkout.types";
import {
  getCheckoutAmount,
  getCheckoutCurrency,
  getCheckoutOrderNumber,
} from "../lib/checkout-response";
import { formatMoney } from "@/shared/lib/formatters";

type CheckoutSuccessPanelProps = {
  result: CheckoutFromCartResponse;
};

export function CheckoutSuccessPanel({ result }: CheckoutSuccessPanelProps) {
  const orderNumber = getCheckoutOrderNumber(result);
  const amount = getCheckoutAmount(result);
  const currency = getCheckoutCurrency(result);

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">
          Order created successfully.
        </p>

        <h2 className="text-xl font-semibold text-foreground">{orderNumber}</h2>

        {amount !== null ? (
          <p className="text-sm text-muted-foreground">
            Amount:{" "}
            <span className="font-medium text-foreground">
              {formatMoney({
                amount,
                currency,
              })}
            </span>
          </p>
        ) : null}

        <p className="text-sm leading-6 text-muted-foreground">
          Your order has been created. Complete the Stripe payment to confirm
          it.
        </p>
      </div>
    </section>
  );
}

export default CheckoutSuccessPanel;
