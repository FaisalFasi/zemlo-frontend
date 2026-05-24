import BrandSlider from "../custom/brandSlider/BrandSlider";
import HorizontalCarousel from "../custom/HorizontalCarousel/HorizontalCarousel";
import { CContainer } from "../custom/container/CContainer";
import { HeroCarousel } from "./hero/HeroCarousel";
import { heroCarouselData } from "./hero/heroCarouselData";
const HomePage = () => {
  return (
    <>
      <CContainer>
        <HeroCarousel slidesData={heroCarouselData} />
      </CContainer>
      <BrandSlider />
      <CContainer className="px-4 my-10">
        <HorizontalCarousel />
      </CContainer>
    </>
  );
};
export default HomePage;
