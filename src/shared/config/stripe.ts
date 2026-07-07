export const stripeConfig = Object.freeze({
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
} as const);

export function hasStripePublishableKey() {
  return stripeConfig.publishableKey.length > 0;
}
