import type { CheckoutFromCartResponse } from "../types/checkout.types";

type CheckoutResponseWithStripeFields = CheckoutFromCartResponse & {
  orderId?: string;
  orderNumber?: string;
  clientSecret?: string;
  amount?: number | string;
  currency?: string;
  order?: CheckoutFromCartResponse["order"] & {
    id?: string;
    orderNumber?: string;
    totalAmount?: number | string;
    total?: number | string;
    currency?: string;
  };
  payment?: CheckoutFromCartResponse["payment"] & {
    clientSecret?: string;
    amount?: number | string;
    currency?: string;
  };
};

export function getCheckoutOrderId(response: CheckoutFromCartResponse) {
  const checkoutResponse = response as CheckoutResponseWithStripeFields;

  return checkoutResponse.orderId ?? checkoutResponse.order?.id ?? "";
}

export function getCheckoutOrderNumber(response: CheckoutFromCartResponse) {
  const checkoutResponse = response as CheckoutResponseWithStripeFields;

  return (
    checkoutResponse.orderNumber ??
    checkoutResponse.order?.orderNumber ??
    "Order created"
  );
}

export function getCheckoutClientSecret(response: CheckoutFromCartResponse) {
  const checkoutResponse = response as CheckoutResponseWithStripeFields;

  return (
    checkoutResponse.clientSecret ??
    checkoutResponse.payment?.clientSecret ??
    ""
  );
}

export function getCheckoutAmount(response: CheckoutFromCartResponse) {
  const checkoutResponse = response as CheckoutResponseWithStripeFields;

  return (
    checkoutResponse.amount ??
    checkoutResponse.payment?.amount ??
    checkoutResponse.order?.totalAmount ??
    checkoutResponse.order?.total ??
    null
  );
}

export function getCheckoutCurrency(response: CheckoutFromCartResponse) {
  const checkoutResponse = response as CheckoutResponseWithStripeFields;

  return (
    checkoutResponse.currency ??
    checkoutResponse.payment?.currency ??
    checkoutResponse.order?.currency ??
    undefined
  );
}
