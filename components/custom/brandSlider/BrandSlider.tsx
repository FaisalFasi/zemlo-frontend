"use client";
import { LogoLoop } from "../../LogoLoop";

// BG color    #000000
const brandImagesUrl = [
  { src: "/images/brands/zara.png" },
  { src: "/images/brands/ck.png" },
  { src: "/images/brands/gucci.png" },
  { src: "/images/brands/prada.png" },
  { src: "/images/brands/versace.png" },
];

const BrandSlider = () => {
  return (
    <div className="relative h-fit overflow-hidden bg-black py-4">
      <LogoLoop
        logos={brandImagesUrl}
        speed={50}
        direction="left"
        logoHeight={40}
        gap={40}
        hoverSpeed={0}
        scaleOnHover
      />
    </div>
  );
};
export default BrandSlider;
