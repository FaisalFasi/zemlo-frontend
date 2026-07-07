import type { CheckoutFromCartResponse } from "../types/checkout.types";

export function getCheckoutOrderId(response: CheckoutFromCartResponse) {
  return response.order.id;
}

export function getCheckoutOrderNumber(response: CheckoutFromCartResponse) {
  return response.order.orderNumber;
}

export function getCheckoutClientSecret(response: CheckoutFromCartResponse) {
  return response.payment.clientSecret ?? "";
}

export function getCheckoutPaymentIntentId(response: CheckoutFromCartResponse) {
  return response.payment.paymentIntentId ?? "";
}

export function getCheckoutAmount(response: CheckoutFromCartResponse) {
  return response.payment.amount;
}

export function getCheckoutCurrency(response: CheckoutFromCartResponse) {
  return response.payment.currency;
}
