import HomeProductRail from "../components/HomeProductRail";

import type { HomeProduct } from "../data/home-page-data";

type FeaturedDealsSectionProps = {
  products: HomeProduct[];
};

export default function FeaturedDealsSection({
  products,
}: FeaturedDealsSectionProps) {
  return (
    <HomeProductRail
      surface="muted"
      eyebrow="Limited-time picks"
      title="Deals worth checking."
      description="A product rail powered by discounts, campaigns, or admin-selected featured products."
      products={products}
      action={{
        label: "Shop all deals",
        href: "/shop?sort=deals",
      }}
    />
  );
}
