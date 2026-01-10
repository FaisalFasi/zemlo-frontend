"use client";
import React, { useState } from "react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Mousewheel,
} from "swiper/modules";
import "swiper/css/bundle";

import CCard from "../card/CCard";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import { CButton } from "../button/CButton";
import { MoveLeft, MoveRight } from "lucide-react";

const CCraousel = () => {
  const [swiper, setSwiper] = useState<any>(null);
  const slides = Array.from({ length: 10 }).map(
    (el, index) => `Slide ${index + 1}`
  );

  return (
    <div className="w-full">
      <div className="flex justify-end gap-4 pb-4">
        <CButton onClick={() => swiper?.slidePrev()}>
          <MoveLeft />
        </CButton>
        <CButton onClick={() => swiper?.slideNext()}>
          <MoveRight />
        </CButton>
      </div>
      <Swiper
        onSwiper={setSwiper}
        modules={[Navigation, Pagination, Scrollbar, A11y, Mousewheel]}
        spaceBetween={20}
        slidesPerGroup={1}
        slidesPerGroupAuto={true}
        slidesPerView={"auto"}
        mousewheel={{
          forceToAxis: true, // 👈 horizontal only
          releaseOnEdges: true, // page scroll allow at ends
        }}
      >
        {slides.map((slideContent, index) => (
          <SwiperSlide
            className="flex max-w-fit select-non  "
            key={`${index + slideContent}`}
            virtualIndex={index}
          >
            <CCard />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CCraousel;
