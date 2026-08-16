/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Category landing page — /categories/<slug> par sirf us
 * category ke products, category ke naam ki heading ke sath. Ab
 * search/sort/pagination bhi is page par kaam karte hain (URL params),
 * category khud route se fixed rehta hai (?category= query ignore
 * hoti hai — slug hi asal source hai).
 * REASON: routes.ts mein categoryDetail() pehle se defined tha lekin
 * page exist nahi karta tha (audit H5). SEO ke liye bhi ahem: har
 * category ka apna URL + title Google se free traffic laata hai.
 * KAISE: wohi shared getShopPageData loader + wohi ShopPage component
 * (heading/description/basePath props ke sath) — naya UI code zero.
 * Ghalat slug par notFound() → proper 404. ISR 5 min (shop jaisa).
 * RISK: Zero — kisi purani cheez ko nahi chherta.
 * ═════════════════════════════════════════════════════════════════
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCatalogCategories } from "@/features/catalog/api/catalog-api";
import { getShopPageData } from "@/features/shop/lib/get-shop-data";
import { resolveShopSearchParams } from "@/features/shop/lib/shop-filters";
import ShopPage from "@/features/shop/ShopPage";
import type { ShopSearchParams } from "@/features/shop/types/shop.types";
import { createPageMetadata } from "@/shared/lib/seo";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<ShopSearchParams>;
};

async function findCategory(slug: string) {
  try {
    const categories = await getCatalogCategories();

    return categories.find((entry) => entry.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);

  if (!category) {
    return createPageMetadata({
      title: "Category not found",
      description: "This category does not exist.",
      path: `/categories/${slug}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: category.name,
    description: `Shop ${category.name} at Zemlo — curated products with secure checkout.`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await findCategory(slug);

  if (!category) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  // The route's slug is the ONLY source of truth for which category is
  // shown — a stray ?category=other-slug in the URL must not override it.
  const shopParams = {
    ...resolveShopSearchParams(resolvedSearchParams),
    category: category.slug,
  };

  const shopData = await getShopPageData(shopParams);

  return (
    <ShopPage
      products={shopData.products}
      total={shopData.total}
      pageCount={shopData.pageCount}
      categories={shopData.categories}
      params={shopParams}
      isDemoCatalog={shopData.isDemoCatalog}
      heading={category.name}
      description={`Browse our ${category.name} collection.`}
      basePath={`/categories/${category.slug}`}
    />
  );
}
