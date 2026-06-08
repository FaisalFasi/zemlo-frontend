import type { MetadataRoute } from "next";

import { createRobots } from "@/shared/seo/robots";

export default function robots(): MetadataRoute.Robots {
  return createRobots();
}
