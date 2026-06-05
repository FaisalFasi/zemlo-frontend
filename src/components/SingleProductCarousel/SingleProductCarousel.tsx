"use client";

import Image from "next/image";
import { useState } from "react";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/css/bundle";
import "./style.css";

const productImages = [
  {
    src: "https://swiperjs.com/demos/images/nature-1.jpg",
    alt: "Nature landscape product view 1",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-2.jpg",
    alt: "Nature landscape product view 2",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-3.jpg",
    alt: "Nature landscape product view 3",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-4.jpg",
    alt: "Nature landscape product view 4",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-5.jpg",
    alt: "Nature landscape product view 5",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-6.jpg",
    alt: "Nature landscape product view 6",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-7.jpg",
    alt: "Nature landscape product view 7",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-8.jpg",
    alt: "Nature landscape product view 8",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-9.jpg",
    alt: "Nature landscape product view 9",
  },
  {
    src: "https://swiperjs.com/demos/images/nature-10.jpg",
    alt: "Nature landscape product view 10",
  },
];

export function SingleProductCarousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  return (
    <div className="flex h-fit w-fit flex-col-reverse gap-2 p-2 lg:flex-row">
      <div className="h-full w-full lg:w-fit">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction="horizontal"
          spaceBetween={10}
          slidesPerView="auto"
          watchOverflow
          watchSlidesProgress
          modules={[FreeMode, Navigation, Thumbs]}
          className="max-h-111 max-w-111 lg:m-0! lg:max-w-fit"
          breakpoints={{
            768: {
              direction: "horizontal",
            },
            1024: {
              direction: "vertical",
            },
          }}
        >
          {productImages.slice(0, 6).map((image) => (
            <SwiperSlide
              key={image.src}
              className="max-h-fit h-fit w-28! opacity-50 [&.swiper-slide-thumb-active]:opacity-100"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={112}
                height={112}
                className="rounded-2xl object-cover"
                sizes="112px"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="h-full w-full lg:w-fit">
        <Swiper
          zoom={{
            maxRatio: 5,
            panOnMouseMove: false,
          }}
          spaceBetween={10}
          navigation
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          modules={[FreeMode, Navigation, Thumbs, Zoom]}
          className="max-h-132.5 h-full w-full max-w-111 rounded-2xl"
        >
          {productImages.map((image) => (
            <SwiperSlide key={image.src}>
              <div className="swiper-zoom-container h-full! w-full!">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={444}
                  height={530}
                  className="h-full w-full object-cover"
                  sizes="(min-width: 1024px) 444px, 100vw"
                  priority={image.src.endsWith("nature-1.jpg")}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
