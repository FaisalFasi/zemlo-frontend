import type { Metadata } from "next";

import { routes } from "@/shared/config/routes";
import { createPageMetadata } from "@/shared/lib/seo";

import { getShopPageData } from "@/features/shop/lib/get-shop-data";
import { resolveShopSearchParams } from "@/features/shop/lib/shop-filters";
import ShopPage from "@/features/shop/ShopPage";
import type { ShopSearchParams } from "@/features/shop/types/shop.types";

export const revalidate = 300;

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description:
    "Explore Zemlo products across curated categories, brands, and everyday essentials.",
  path: routes.shop,
});

type ShopRoutePageProps = {
  searchParams: Promise<ShopSearchParams>;
};

export default async function ShopRoutePage({
  searchParams,
}: ShopRoutePageProps) {
  const resolvedSearchParams = await searchParams;
  const params = resolveShopSearchParams(resolvedSearchParams);
  const shopData = await getShopPageData(params);

  return (
    <ShopPage
      products={shopData.products}
      total={shopData.total}
      pageCount={shopData.pageCount}
      categories={shopData.categories}
      brands={shopData.brands}
      params={params}
      isDemoCatalog={shopData.isDemoCatalog}
    />
  );
}
