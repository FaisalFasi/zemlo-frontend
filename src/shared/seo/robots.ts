import type { MetadataRoute } from "next";

import { appConfig } from "@/shared/config/app";

function removeTrailingSlash(value: string) {
  return value.replace(/\/$/, "");
}

export function createRobots(): MetadataRoute.Robots {
  const siteUrl = removeTrailingSlash(appConfig.siteUrl);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/checkout"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
