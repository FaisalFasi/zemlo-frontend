"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { CButton } from "../custom/button/CButton";
import { SlidesItemProps } from "./heroCarouselData";

type HeroCarouselProps = { slidesData: SlidesItemProps[] };

const HeroCarouselComponent = ({ slidesData }: HeroCarouselProps) => {
  const [current, setCurrent] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const imagesLength = slidesData?.length;
  const slide = slidesData[current];

  const nextSlide = () => {
    stopAutoPlay();
    setCurrent((prev) => (prev + 1) % imagesLength);
  };

  const prevSlide = () => {
    stopAutoPlay();
    setCurrent((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % imagesLength);
    }, 3000);
  }, [imagesLength]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!imagesLength || isHovered) {
      stopAutoPlay();
      return;
    }
    startAutoPlay();
    return () => stopAutoPlay(); // 🔥 cleanup
  }, [imagesLength, isHovered, startAutoPlay, stopAutoPlay]);

  return (
    <div className=" w-full h-full lg:h-full flex flex-col gap-4 lg:gap-20 lg:flex-row lg:justify-between lg:items-center lg:align-middle z-10 ">
      <div className="w-full h-full min-h-full flex flex-col justify-center p-4">
        <p className="text-black text-lg">{slide?.category}</p>
        <h1 className="text-2xl md:text-4xl font-bold">{slide?.title}</h1>
        <p className="text-black text-md">{slide?.discount}</p>
        <CButton className="w-fit h-fit mt-6">Shop Now</CButton>
      </div>

      <div
        className={`ml-8 my-4 md:pl-0 relative min-w-fit lg:w-full  h-60 md:h-60 lg:h-100 xl:h-120 bg-linear-to-l ${slide?.bgColor} rounded-lg  `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseUp={() => setIsHovered(false)}
      >
        <div className="absolute flex flex-row min-w-full min-h-full bottom-4 right-4 overflow-hidden rounded-lg ">
          {slidesData?.map((img, idx) => {
            return (
              <div
                key={img.id}
                className={` relative min-w-full lg:w-full  h-60 md:h-60 lg:h-100 xl:h-120 transition-transform ease-in-out duration-500`}
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                <Image
                  src={img.image}
                  alt={img.title}
                  className="object-cover"
                  fill={true}
                  priority={current === idx}
                  sizes="w-auto h-auto"
                  // loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            );
          })}
          <div className="absolute flex w-full justify-between top-[calc(50%)] px-4">
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

HeroCarouselComponent.displayName = "HeroCarousel";

export const HeroCarousel = React.memo(HeroCarouselComponent);
