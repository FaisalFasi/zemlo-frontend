import { proxyCheckoutFromCart } from "@/features/checkout/server/checkout-backend-proxy";

export async function POST(request: Request) {
  return proxyCheckoutFromCart(request);
}
