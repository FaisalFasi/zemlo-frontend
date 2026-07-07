import type { Metadata } from "next";

import HomePage from "@/components/home/HomePage";
import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Premium everyday shopping",
  description:
    "Shop curated products across categories with a clean, modern, Germany-first e-commerce experience.",
  path: routes.home,
});

export default function Home() {
  return <HomePage />;
}
