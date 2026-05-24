export type SlidesItemProps = {
  id: number;
  category: string;
  title: string;
  discount: string;
  bgColor: string;
  image: string;
};

export const heroCarouselData: SlidesItemProps[] = [
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
