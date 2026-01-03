"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    category: "Classic Exclusive",
    title: "Women's Collection",
    discount: "UPTO 40% OFF",
    bgColor: "from-red-400 to-red-500",
    image:
      "https://images.unsplash.com/photo-1764236027288-01496bf7489a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwd29tYW4lMjBlbGVnYW50JTIwY29hdHxlbnwxfHx8fDE3NjczODg3Mzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    category: "Premium Quality",
    title: "Men's Formal Wear",
    discount: "UPTO 35% OFF",
    bgColor: "from-blue-400 to-blue-500",
    image:
      "https://images.unsplash.com/photo-1695291649448-8b4144361014?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBmb3JtYWwlMjBzdWl0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjczODg3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    category: "Summer Special",
    title: "Fresh Arrivals",
    discount: "UPTO 50% OFF",
    bgColor: "from-yellow-400 to-orange-500",
    image:
      "https://images.unsplash.com/photo-1722443415471-258d79d13759?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHN1bW1lciUyMGRyZXNzJTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjczODg3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 4,
    category: "Trending Now",
    title: "Fashion Accessories",
    discount: "UPTO 30% OFF",
    bgColor: "from-purple-400 to-pink-500",
    image:
      "https://images.unsplash.com/photo-1761522002366-870191e79f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBiYWclMjBzaG9lc3xlbnwxfHx8fDE3NjczODg3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];

export const HeroCarousel = () => {
  const [current, setCurrent] = useState<number>(0);
  const imagesLength = slides.length;
  const slide = slides[current];

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % imagesLength);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + imagesLength) % imagesLength);
  };

  return (
    <div className=" w-full h-full flex flex-col z-10 px-4 ">
      <div>left</div>
      <div>
        <div
          className={`relative w-150 max-w-full h-120 bg-linear-to-l ${slide?.bgColor}  m-4 rounded-xl`}
        >
          <div className="absolute bottom-4 right-4 w-150 max-w-full h-120 flex flex-row  ">
            <Image
              src={slide?.image}
              alt={slide?.title}
              className="object-cover rounded-xl"
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
    </div>
  );
};
