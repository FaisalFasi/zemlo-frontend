import BrandSlider from "../custom/brandSlider/BrandSlider";
import CCraousel from "../custom/SimpleCarousel/SimpleCarousel";
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
        <CCraousel />
      </CContainer>
      {/* <CCard /> */}
    </>
  );
};
export default HomePage;
