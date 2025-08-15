export type ProductVariant = {
  id: string;
  label: string;
  swatchClass: string;
  images: string[];
};

export type ProductMock = {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  compareAt?: number;
  description: string;
  specs: string[];
  rating?: number;
  variants: ProductVariant[];
};

const products: Record<string, ProductMock> = {
  "1": {
    id: "1",
    title: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    compareAt: 160,
    description:
      "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Stitched overlays and textured accents create the '90s look you love.",
    specs: [
      "Padded collar",
      "Foam midsole",
      "Shown: Dark Team Red/Platinum Tint/Pure Platinum/White",
      "Style: HM9451-600",
    ],
    rating: 4.7,
    variants: [
      {
        id: "v1",
        label: "Dark Team Red",
        swatchClass: "bg-[#7b2a2a]",
        images: ["/shoes/shoe-1.jpg", "/shoes/shoe-2.webp", "/shoes/shoe-3.webp", "/shoes/shoe-4.webp"],
      },
      {
        id: "v2",
        label: "Platinum Tint",
        swatchClass: "bg-[#d1d1d1]",
        images: ["/shoes/shoe-2.webp", "/shoes/shoe-1.jpg"],
      },
      {
        id: "v3",
        label: "Pure Platinum",
        swatchClass: "bg-[#ececec]",
        images: ["/shoes/shoe-3.webp"],
      },
    ],
  },
  "2": {
    id: "2",
    title: "Nike Court Vision Low Next Nature",
    subtitle: "Men's Shoes",
    price: 98.3,
    description:
      "A classic hoops-inspired design made with at least 20% recycled content by weight.",
    specs: ["Low-cut collar", "Rubber outsole", "Perforations on the toe"],
    variants: [
      { id: "v1", label: "Black/Blue", swatchClass: "bg-[#0ea5e9]", images: ["/shoes/shoe-3.webp"] },
    ],
  },
  "3": {
    id: "3",
    title: "Nike Dunk Low Retro",
    subtitle: "Men's Shoes",
    price: 98.3,
    description: "Bring '80s style back with the Dunk Low Retro.",
    specs: ["Foam midsole", "Rubber outsole", "Padded collar"],
    variants: [
      { id: "v1", label: "Green/Yellow", swatchClass: "bg-[#22c55e]", images: ["/shoes/shoe-4.webp"] },
    ],
  },
};

export function productById(id: string): ProductMock | null {
  return products[id] ?? products["1"] ?? null;
}

export function alsoLike(): Array<{
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge?: string;
  colors?: number;
}> {
  return [
    {
      id: "4",
      title: "Nike Air Force 1 Mid '07",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-1.jpg",
      badge: "Best Seller",
      colors: 6,
    },
    {
      id: "2",
      title: "Nike Court Vision Low Next Nature",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-3.webp",
      colors: 4,
    },
    {
      id: "3",
      title: "Nike Dunk Low Retro",
      category: "Men's Shoes",
      price: 98.3,
      image: "/shoes/shoe-4.webp",
      colors: 6,
    },
  ];
}
