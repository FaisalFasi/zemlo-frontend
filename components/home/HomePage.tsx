import {
  getCatalogBrands,
  getCatalogCategories,
  getCatalogProducts,
} from "@/features/catalog/api/catalog-api";

import BrandShowcaseSection from "./sections/BrandShowcaseSection";
import CategoryRailsSection from "./sections/CategoryRailsSection";
import CategoryShortcutSection from "./sections/CategoryShortcutSection";
import FeaturedDealsSection from "./sections/FeaturedDealsSection";
import MarketplaceHeroSection from "./sections/MarketplaceHeroSection";
import PopularProductsSection from "./sections/PopularProductsSection";
import TrustSection from "./sections/TrustSection";
import { createHomePageData } from "./lib/home-page-mappers";

function shouldUseDemoCatalog() {
  return process.env.DEMO_CATALOG_ENABLED === "true";
}

async function getSafeHomePageData() {
  const [productsResult, categoriesResult, brandsResult] =
    await Promise.allSettled([
      getCatalogProducts(),
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

export default async function HomePage() {
  const homePageData = await getSafeHomePageData();

  return (
    <main className="bg-background text-foreground">
      <MarketplaceHeroSection />
      <TrustSection />
      <CategoryShortcutSection categories={homePageData.categories} />
      <FeaturedDealsSection products={homePageData.featuredDeals} />
      <PopularProductsSection products={homePageData.popularProducts} />
      <CategoryRailsSection rails={homePageData.categoryRails} />
      <BrandShowcaseSection brands={homePageData.brands} />
    </main>
  );
}
