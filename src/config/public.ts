export const publicConfig = Object.freeze({
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Zemlo",
  currency: process.env.NEXT_PUBLIC_APP_CURRENCY ?? "USD",
  locale: process.env.NEXT_PUBLIC_APP_LOCALE ?? "en-US",
  description: "Modern multi-category e-commerce marketplace",
});

export type PublicConfig = typeof publicConfig;
