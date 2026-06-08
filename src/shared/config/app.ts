export const appConfig = Object.freeze({
  name: "Zemlo",
  description: "A modern multi-category e-commerce marketplace.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  defaultLocale: "en",
  defaultCurrency: "USD",
} as const);

export type AppConfig = typeof appConfig;
