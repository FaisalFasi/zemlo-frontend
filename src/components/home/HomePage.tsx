import { Suspense } from "react";

import {
  getAllCatalogProducts,
  getCatalogBrands,
  getCatalogCategories,
} from "@/features/catalog/api/catalog-api";

import BrandShowcaseSection from "./sections/BrandShowcaseSection";
import CategoryRailsSection from "./sections/CategoryRailsSection";
import CategoryShortcutSection from "./sections/CategoryShortcutSection";
import FeaturedDealsSection from "./sections/FeaturedDealsSection";
import HomeDataSkeleton from "./sections/HomeDataSkeleton";
import MarketplaceHeroSection from "./sections/MarketplaceHeroSection";
import PopularProductsSection from "./sections/PopularProductsSection";
import TrustSection from "./sections/TrustSection";
import { createHomePageData } from "./lib/home-page-mappers";
import { serverConfig } from "@/shared/config/server";

function shouldUseDemoCatalog() {
  return serverConfig.demoCatalogEnabled;
}

async function getSafeHomePageData() {
  const [productsResult, categoriesResult, brandsResult] =
    await Promise.allSettled([
      getAllCatalogProducts(),
      getCatalogCategories(),
      getCatalogBrands(),
    ]);

  return createHomePageData({
    products: productsResult.status === "fulfilled" ? productsResult.value : [],
    categories:
      categoriesResult.status === "fulfilled" ? categoriesResult.value : [],
    brands: brandsResult.status === "fulfilled" ? brandsResult.value : [],
    useDemoCatalog: shouldUseDemoCatalog(),
  });
}

// Catalog-dependent sections are split into their own async component and
// wrapped in a page-level <Suspense> — NOT a route-level `loading.tsx`
// (which would cascade to /products/[slug] and /categories/[slug] and
// reintroduce the notFound() status-code bug documented in
// IMPLEMENTATION.md). Hero/trust sections need no data, so they render
// immediately either way.
async function HomeDataSections() {
  const homePageData = await getSafeHomePageData();

  return (
    <>
      <CategoryShortcutSection categories={homePageData.categories} />
      <FeaturedDealsSection products={homePageData.featuredDeals} />
      <PopularProductsSection products={homePageData.popularProducts} />
      <CategoryRailsSection rails={homePageData.categoryRails} />
      <BrandShowcaseSection brands={homePageData.brands} />
    </>
  );
}

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <MarketplaceHeroSection />
      <TrustSection />

      <Suspense fallback={<HomeDataSkeleton />}>
        <HomeDataSections />
      </Suspense>
    </main>
  );
}
