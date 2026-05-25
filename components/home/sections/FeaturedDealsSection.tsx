import HomeProductRail from "../components/HomeProductRail";
import { featuredDeals } from "../data/home-page-data";

export default function FeaturedDealsSection() {
  return (
    <HomeProductRail
      surface="muted"
      eyebrow="Limited-time picks"
      title="Deals worth checking."
      description="A product rail that can later be powered by discounts, campaigns, or admin-selected featured products."
      products={featuredDeals}
      action={{
        label: "Shop all deals",
        href: "/shop?sort=deals",
      }}
    />
  );
}
