import { CContainer } from "../custom/container/CContainer";
import { HeroCarousel } from "./HeroCarousel";

const HomePage = () => {
  return (
    <CContainer>
      <div className="flex">
        <HeroCarousel />
      </div>
    </CContainer>
  );
};
export default HomePage;
