/**
 * ═══════════════ EXPLANATION (is change ki wajah) ═══════════════
 * YE KYA HAI: Category landing page — /categories/<slug> par sirf us
 * category ke products, category ke naam ki heading ke sath.
 * REASON: routes.ts mein categoryDetail() pehle se defined tha lekin
 * page exist nahi karta tha (audit H5). SEO ke liye bhi ahem: har
 * category ka apna URL + title Google se free traffic laata hai.
 * KAISE: wohi shared getSafeShopData loader + wohi ShopPage component
 * (heading/description props ke sath) — naya UI code zero. Ghalat slug
 * par notFound() → proper 404. ISR 5 min (shop jaisa).
 * RISK: Zero — naya page; kisi purani cheez ko nahi chherta.
 * ═════════════════════════════════════════════════════════════════
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getSafeShopData } from "@/features/shop/lib/get-shop-data";
import ShopPage from "@/features/shop/ShopPage";
import { createPageMetadata } from "@/shared/lib/seo";

export const revalidate = 300;

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function findCategory(slug: string) {
  const shopData = await getSafeShopData();
  const category = shopData.categories.find((entry) => entry.slug === slug);

  return { shopData, category };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await findCategory(slug);

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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const { shopData, category } = await findCategory(slug);

  if (!category) {
    notFound();
  }

  return (
    <ShopPage
      products={shopData.products}
      categories={shopData.categories}
      params={{ q: "", category: category.slug, sort: "featured" }}
      isDemoCatalog={shopData.isDemoCatalog}
      heading={category.name}
      description={`Browse our ${category.name} collection.`}
    />
  );
}
