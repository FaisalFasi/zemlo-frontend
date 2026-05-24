"use client";
import { useState } from "react";
// Import Swiper React components
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Zoom, Pagination, Mousewheel } from "swiper/modules";
// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css/bundle";
import "./style.css";

export function SingleProductCarousel() {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass>();

  return (
    <div className="flex flex-col-reverse lg:flex-row h-fit w-fit p-2 gap-2">
      <div className="w-full h-full lg:w-fit">
        <Swiper
          onSwiper={setThumbsSwiper}
          direction={`horizontal`}
          spaceBetween={10}
          slidesPerView="auto"
          watchOverflow={true}
          watchSlidesProgress={true}
          modules={[Navigation, Thumbs]}
          className="max-w-111 lg:max-w-fit max-h-111 lg:m-0!"
          breakpoints={{
            768: {
              direction: "horizontal", // md and up
            },
            1024: {
              direction: "vertical", // lg and up (optional)
            },
          }}
        >
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>{" "}
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>{" "}
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>{" "}
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>{" "}
          <SwiperSlide className="max-h-fit w-28! h-fit opacity-50 [&.swiper-slide-thumb-active]:opacity-100 ">
            <img
              src="https://swiperjs.com/demos/images/nature-1.jpg"
              className="rounded-2xl"
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="w-full h-full lg:w-fit">
        <Swiper
          zoom={{
            maxRatio: 5,
            panOnMouseMove: false,
          }}
          // mousewheel={{ forceToAxis: true }}
          spaceBetween={10}
          // freeMode={true}
          navigation={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, Zoom, Mousewheel]}
          className="w-full h-full max-w-111 max-h-132.5 rounded-2xl"
        >
          <SwiperSlide>
            <div className="swiper-zoom-container w-full! h-full! ">
              <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-zoom-container">
              <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
          </SwiperSlide>
          <SwiperSlide>
            <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}
