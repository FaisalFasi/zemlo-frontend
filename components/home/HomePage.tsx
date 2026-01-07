import { CContainer } from "../custom/container/CContainer";
import { HeroCarousel } from "./HeroCarousel";
import { heroCarouselData } from "./heroCarouselData";
const HomePage = () => {
  return (
    <CContainer>
      <div className="flex">
        <HeroCarousel slidesData={heroCarouselData} />
      </div>
    </CContainer>
  );
};
export default HomePage;
