export const appConfig = Object.freeze({
  name: "Zemlo",
  description: "A modern multi-category e-commerce marketplace.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  defaultLocale: "de-DE",
  defaultCurrency: "EUR",
  defaultCountry: "DE",
  defaultMarket: "de",
} as const);

export type AppConfig = typeof appConfig;
