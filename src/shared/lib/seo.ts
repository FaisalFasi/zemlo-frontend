import type { Metadata } from "next";

import { appConfig } from "@/shared/config/app";

type PageOpenGraphType = "website" | "article";

type CreatePageMetadataInput = {
  title: string;
  description?: string | null;
  path: string;
  images?: string[];
  type?: PageOpenGraphType;
  noIndex?: boolean;
};

const META_DESCRIPTION_MAX_LENGTH = 160;

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function getAbsoluteUrl(path: string) {
  const baseUrl = removeTrailingSlash(appConfig.siteUrl);

  return `${baseUrl}${normalizePath(path)}`;
}

export function createPageTitle(title: string) {
  return title === appConfig.name
    ? appConfig.name
    : `${title} | ${appConfig.name}`;
}

export function createMetaDescription(
  description?: string | null,
  fallback = appConfig.description,
) {
  const cleanDescription = (description || fallback)
    .replace(/\s+/g, " ")
    .trim();

  if (cleanDescription.length <= META_DESCRIPTION_MAX_LENGTH) {
    return cleanDescription;
  }

  return `${cleanDescription.slice(0, META_DESCRIPTION_MAX_LENGTH - 1).trim()}…`;
}

export function createPageMetadata({
  title,
  description,
  path,
  images = [],
  type = "website",
  noIndex = false,
}: CreatePageMetadataInput): Metadata {
  const pageTitle = createPageTitle(title);
  const pageDescription = createMetaDescription(description);
  const url = getAbsoluteUrl(path);

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: appConfig.name,
      locale: appConfig.defaultLocale,
      type,
      images: images.map((image) => ({
        url: image,
        alt: title,
      })),
    },
    twitter: {
      card: images.length > 0 ? "summary_large_image" : "summary",
      title: pageTitle,
      description: pageDescription,
      images,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}

export function safeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
