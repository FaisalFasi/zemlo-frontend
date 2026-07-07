import { checkoutControllerCheckoutFromCart } from "@/shared/api/generated/checkout/checkout";

import type {
  CheckoutFromCartInput,
  CheckoutFromCartResponse,
} from "../types/checkout.types";

export async function checkoutFromCart(
  input: CheckoutFromCartInput,
): Promise<CheckoutFromCartResponse> {
  return checkoutControllerCheckoutFromCart(
    input,
  ) as Promise<CheckoutFromCartResponse>;
}
