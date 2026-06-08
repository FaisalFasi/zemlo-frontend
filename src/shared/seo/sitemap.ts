import type { MetadataRoute } from "next";

import { getCatalogProducts } from "@/features/catalog/api/catalog-api";
import { appConfig } from "@/shared/config/app";
import { routes } from "@/shared/config/routes";

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

function createUrl(path: string) {
  const baseUrl = removeTrailingSlash(appConfig.siteUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${baseUrl}${normalizedPath}`;
}

export async function createSitemap(): Promise<MetadataRoute.Sitemap> {
  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const products = await getCatalogProducts();

    productRoutes = products.map((product) => ({
      url: createUrl(routes.productDetail(product.slug)),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }));
  } catch {
    productRoutes = [];
  }

  return [
    {
      url: createUrl(routes.home),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: createUrl(routes.shop),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productRoutes,
  ];
}
