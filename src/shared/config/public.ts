import { appConfig } from "./app";

export const publicConfig = Object.freeze({
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? appConfig.name,
  currency: process.env.NEXT_PUBLIC_APP_CURRENCY ?? appConfig.defaultCurrency,
  locale: process.env.NEXT_PUBLIC_APP_LOCALE ?? appConfig.defaultLocale,
  description: appConfig.description,
  siteUrl: appConfig.siteUrl,
} as const);

export type PublicConfig = typeof publicConfig;
