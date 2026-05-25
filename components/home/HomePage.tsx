import BrandShowcaseSection from "./sections/BrandShowcaseSection";
import CategoryRailsSection from "./sections/CategoryRailSection";
import CategoryShortcutSection from "./sections/CategoryShortcutSection";
import FeaturedDealsSection from "./sections/FeaturedDealsSection";
import MarketplaceHeroSection from "./sections/MarketplaceHeroSection";
import PopularProductsSection from "./sections/PopularProductsSection";
import TrustSection from "./sections/TrustSection";

export default function HomePage() {
  return (
    <main className="bg-background text-foreground">
      <MarketplaceHeroSection />
      <TrustSection />
      <CategoryShortcutSection />
      <FeaturedDealsSection />
      <PopularProductsSection />
      <CategoryRailsSection />
      <BrandShowcaseSection />
    </main>
  );
}
// import BrandSlider from "../custom/brandSlider/BrandSlider";
// import HorizontalCarousel from "../custom/HorizontalCarousel/HorizontalCarousel";
// import { CContainer } from "../custom/container/CContainer";
// import { HeroCarousel } from "./HeroCarousel";
// import { heroCarouselData } from "./heroCarouselData";
// const HomePage = () => {
//   return (
//     <>
//       <CContainer>
//         <HeroCarousel slidesData={heroCarouselData} />
//       </CContainer>
//       <BrandSlider />
//       <CContainer className="px-4 my-10">
//         <HorizontalCarousel />
//       </CContainer>
//     </>
//   );
// };
// export default HomePage;
