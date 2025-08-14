export type Gender = "men" | "women" | "kids";
export type Color = "black" | "white" | "red" | "blue" | "green" | "orange" | "grey";
export type Size = "XS" | "S" | "M" | "L" | "XL";

export interface ProductVariant {
  id: string;
  size: Size;
  color: Color;
  price: number;
  stock: number;
}

export interface MockProduct {
  id: string;
  title: string;
  category: string;
  gender: Gender[];
  basePrice: number;
  image: string;
  colors: Color[];
  variants: ProductVariant[];
  createdAt: string;
  badge?: string;
}

export const filterOptions = {
  genders: [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "kids", label: "Kids" },
  ] as { value: Gender; label: string }[],
  sizes: ["XS", "S", "M", "L", "XL"] as Size[],
  colors: ["black", "white", "red", "blue", "green", "orange", "grey"] as Color[],
  priceRanges: [
    { id: "0-50", min: 0, max: 50, label: "$0 – $50" },
    { id: "50-100", min: 50, max: 100, label: "$50 – $100" },
    { id: "100-150", min: 100, max: 150, label: "$100 – $150" },
    { id: "150-999", min: 150, max: 999, label: "$150+" },
  ],
};

export const mockProducts: MockProduct[] = [
  {
    id: "p1",
    title: "Nike Air Max 270",
    category: "Running",
    gender: ["men", "women"],
    basePrice: 120,
    image: "/shoes/shoe-1.jpg",
    colors: ["black", "white", "red"],
    variants: [
      { id: "p1-v1", size: "S", color: "black", price: 120, stock: 10 },
      { id: "p1-v2", size: "M", color: "white", price: 120, stock: 8 },
      { id: "p1-v3", size: "L", color: "red", price: 130, stock: 5 },
    ],
    createdAt: "2025-07-01T00:00:00.000Z",
    badge: "Best Seller",
  },
  {
    id: "p2",
    title: "Nike Revolution 6",
    category: "Training",
    gender: ["men"],
    basePrice: 75,
    image: "/shoes/shoe-2.webp",
    colors: ["blue", "white"],
    variants: [
      { id: "p2-v1", size: "M", color: "blue", price: 75, stock: 12 },
      { id: "p2-v2", size: "L", color: "white", price: 75, stock: 6 },
    ],
    createdAt: "2025-06-15T00:00:00.000Z",
  },
  {
    id: "p3",
    title: "Nike Pegasus Trail",
    category: "Trail",
    gender: ["women"],
    basePrice: 140,
    image: "/shoes/shoe-3.webp",
    colors: ["green", "grey"],
    variants: [
      { id: "p3-v1", size: "S", color: "green", price: 140, stock: 7 },
      { id: "p3-v2", size: "M", color: "grey", price: 145, stock: 9 },
    ],
    createdAt: "2025-05-20T00:00:00.000Z",
  },
  {
    id: "p4",
    title: "Nike Blazer Mid '77",
    category: "Lifestyle",
    gender: ["men", "women", "kids"],
    basePrice: 100,
    image: "/shoes/shoe-4.webp",
    colors: ["white", "orange", "blue"],
    variants: [
      { id: "p4-v1", size: "XS", color: "white", price: 90, stock: 15 },
      { id: "p4-v2", size: "M", color: "orange", price: 100, stock: 10 },
      { id: "p4-v3", size: "XL", color: "blue", price: 110, stock: 4 },
    ],
    createdAt: "2025-04-10T00:00:00.000Z",
    badge: "New",
  },
  {
    id: "p5",
    title: "Nike Air Zoom Alphafly",
    category: "Racing",
    gender: ["men"],
    basePrice: 275,
    image: "/shoes/shoe-5.avif",
    colors: ["red", "black"],
    variants: [
      { id: "p5-v1", size: "L", color: "red", price: 275, stock: 2 },
      { id: "p5-v2", size: "XL", color: "black", price: 275, stock: 3 },
    ],
    createdAt: "2025-03-05T00:00:00.000Z",
  },
  {
    id: "p6",
    title: "Nike Court Vision",
    category: "Court",
    gender: ["kids"],
    basePrice: 65,
    image: "/shoes/shoe-6.avif",
    colors: ["white", "blue"],
    variants: [
      { id: "p6-v1", size: "XS", color: "white", price: 65, stock: 20 },
      { id: "p6-v2", size: "S", color: "blue", price: 65, stock: 14 },
    ],
    createdAt: "2025-02-15T00:00:00.000Z",
  },
  {
    id: "p7",
    title: "Nike Metcon 9",
    category: "Training",
    gender: ["women"],
    basePrice: 150,
    image: "/shoes/shoe-7.avif",
    colors: ["black", "green"],
    variants: [
      { id: "p7-v1", size: "M", color: "black", price: 150, stock: 6 },
      { id: "p7-v2", size: "L", color: "green", price: 155, stock: 5 },
    ],
    createdAt: "2025-01-20T00:00:00.000Z",
    badge: "Featured",
  },
  {
    id: "p8",
    title: "Nike InfinityRN",
    category: "Running",
    gender: ["men", "women"],
    basePrice: 160,
    image: "/shoes/shoe-8.avif",
    colors: ["grey", "white"],
    variants: [
      { id: "p8-v1", size: "S", color: "grey", price: 160, stock: 11 },
      { id: "p8-v2", size: "M", color: "white", price: 165, stock: 7 },
    ],
    createdAt: "2024-12-10T00:00:00.000Z",
  },
  {
    id: "p9",
    title: "Nike Phantom GX",
    category: "Football",
    gender: ["men", "kids"],
    basePrice: 120,
    image: "/shoes/shoe-9.avif",
    colors: ["blue", "white"],
    variants: [
      { id: "p9-v1", size: "XS", color: "blue", price: 100, stock: 9 },
      { id: "p9-v2", size: "L", color: "white", price: 120, stock: 5 },
    ],
    createdAt: "2024-11-05T00:00:00.000Z",
  },
  {
    id: "p10",
    title: "Nike Air Force 1",
    category: "Lifestyle",
    gender: ["men", "women"],
    basePrice: 110,
    image: "/shoes/shoe-10.avif",
    colors: ["white", "black"],
    variants: [
      { id: "p10-v1", size: "S", color: "white", price: 110, stock: 15 },
      { id: "p10-v2", size: "M", color: "black", price: 115, stock: 12 },
    ],
    createdAt: "2024-10-12T00:00:00.000Z",
  },
  {
    id: "p11",
    title: "Nike Dunk Low",
    category: "Lifestyle",
    gender: ["women"],
    basePrice: 115,
    image: "/shoes/shoe-11.avif",
    colors: ["red", "white"],
    variants: [
      { id: "p11-v1", size: "S", color: "red", price: 115, stock: 10 },
      { id: "p11-v2", size: "L", color: "white", price: 120, stock: 8 },
    ],
    createdAt: "2024-09-15T00:00:00.000Z",
  },
  {
    id: "p12",
    title: "Nike Vaporfly 3",
    category: "Racing",
    gender: ["men", "women"],
    basePrice: 260,
    image: "/shoes/shoe-12.avif",
    colors: ["green", "white"],
    variants: [
      { id: "p12-v1", size: "M", color: "green", price: 260, stock: 3 },
      { id: "p12-v2", size: "L", color: "white", price: 260, stock: 2 },
    ],
    createdAt: "2024-08-10T00:00:00.000Z",
  },
];
