import { appConfig } from "@/shared/config/app";
import { routes } from "@/shared/config/routes";
import { getAbsoluteUrl } from "@/shared/lib/seo";

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: appConfig.name,
    url: getAbsoluteUrl(routes.home),
    description: appConfig.description,
  };
}

export function createWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: appConfig.name,
    url: getAbsoluteUrl(routes.home),
    inLanguage: appConfig.defaultLocale,
  };
}

export function createSiteJsonLd() {
  return [createOrganizationJsonLd(), createWebsiteJsonLd()];
}
