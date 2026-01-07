"use client";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { CButton } from "../custom/button/CButton";
import { SlidesItemProps } from "./heroCarouselData";

type HeroCarouselProps = { slidesData: SlidesItemProps[] };

export const HeroCarousel = ({ slidesData }: HeroCarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const imagesLength = slidesData?.length;
  let slide = slidesData[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % imagesLength);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  useEffect(() => {
    if (!imagesLength) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagesLength);
    }, 2000);
    console.log(interval);

    return () => clearInterval(interval);
  }, [imagesLength]);

  return (
    <div className=" w-full h-full flex flex-col lg:flex-row lg:justify-between lg:align-middle z-10 px-4">
      <div className="min-h-full flex flex-col justify-center">
        <p className="text-black text-lg">{slide?.category}</p>
        <h1 className="font-bold">{slide?.title}</h1>
        <p className="text-black text-md">{slide?.discount}</p>
        <CButton className="w-fit h-fit my-6">Shop Now</CButton>
      </div>

      <div
        className={`overflow-hidden relative max-w-full w-full lg:w-110 xl:w-150 h-80 md:h-100 lg:h-125 xl:h-150 bg-linear-to-l ${slide?.bgColor}  m-4 rounded-xl`}
      >
        <div className=" absolute bottom-4 right-4  flex flex-row max-w-full w-full lg:w-110 xl:w-150 h-80 md:h-100 lg:h-125 xl:h-150 transition-transform ease-in-out duration-500">
          <Image
            src={slide?.image}
            alt={slide?.title}
            className="object-cover rounded-xl "
            sizes=""
            fill
          />
          <div className="absolute flex w-full justify-between top-[calc(50%-36px)] px-4 ">
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
