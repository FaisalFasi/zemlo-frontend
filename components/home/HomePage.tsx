import BrandSlider from "../custom/brandSlider/BrandSlider";
import HorizontalCarousel from "../custom/HorizontalCarousel/HorizontalCarousel";
import { CContainer } from "../custom/container/CContainer";
import { HeroCarousel } from "./HeroCarousel";
import { heroCarouselData } from "./heroCarouselData";
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
