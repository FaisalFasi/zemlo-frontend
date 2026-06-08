export const appConfig = Object.freeze({
  name: "Zemlo",
  description: "A modern multi-category e-commerce marketplace.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en",
} as const);

export type AppConfig = typeof appConfig;

// export const appConfig = Object.freeze({
//   name: "Zemlo",
//   description: "Modern multi-category e-commerce marketplace",
//   defaultCurrency: "USD",
//   defaultLocale: "en-US",
// } as const);
