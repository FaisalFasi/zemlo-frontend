import type { MetadataRoute } from "next";

import { createSitemap } from "@/shared/seo/sitemap";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return createSitemap();
}
