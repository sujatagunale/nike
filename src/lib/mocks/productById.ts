import { notFound } from "next/navigation";

export type Variant = { id: string; name: string; colorHex: string; images: string[] };
export type Product = {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  images: string[];
  variants: Variant[];
  sizes: string[];
  badges?: string[];
  rating?: number;
  alsoLike: Array<{ id: string; title: string; price: number; image: string }>;
};

const valid = (src: string) => {
  if (!src) return false;
  const lowered = src.toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp", ".avif"].some((ext) => lowered.endsWith(ext));
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

function sanitizeImages(arr: string[]) {
  return uniq(arr.filter(valid));
}

const db: Record<string, Product> = {
  "air-max-90-se": {
    id: "air-max-90-se",
    title: "Nike Air Max 90 SE",
    subtitle: "Women's Shoes",
    price: 140,
    compareAtPrice: 160,
    description:
      "The Air Max 90 stays true to its running roots with the iconic Waffle sole. Textured accents create the '90s look you love. With romantic tints, its visible Air cushioning adds comfort to your journey.",
    images: sanitizeImages([
      "/shoes/shoe-1.jpg",
      "/shoes/shoe-4.webp",
      "/shoes/shoe-3.webp",
      "/shoes/shoe-2.webp",
    ]),
    variants: [
      {
        id: "rose",
        name: "Dark Team Red",
        colorHex: "#7b2a3b",
        images: sanitizeImages(["/shoes/shoe-1.jpg", "/shoes/shoe-3.webp", "/shoes/shoe-4.webp"]),
      },
      {
        id: "platinum",
        name: "Pure Platinum",
        colorHex: "#cfd2d6",
        images: sanitizeImages(["/shoes/shoe-6.avif", "/shoes/shoe-8.avif", "/shoes/shoe-7.avif"]),
      },
      {
        id: "black-cyan",
        name: "Black/Cyan",
        colorHex: "#06b6d4",
        images: sanitizeImages(["/shoes/shoe-10.avif", "/shoes/shoe-12.avif"]),
      },
      {
        id: "green-yellow",
        name: "Green/Yellow",
        colorHex: "#84cc16",
        images: sanitizeImages(["/shoes/shoe-14.avif", "/shoes/shoe-13.avif"]),
      },
    ],
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11"],
    badges: ["Highly Rated"],
    rating: 4.7,
    alsoLike: [
      { id: "af1-mid-07", title: "Nike Air Force 1 Mid '07", price: 98.3, image: "/shoes/shoe-1.jpg" },
      { id: "court-vision-low", title: "Nike Court Vision Low Next Nature", price: 98.3, image: "/shoes/shoe-6.avif" },
      { id: "dunk-low-retro", title: "Nike Dunk Low Retro", price: 98.3, image: "/shoes/shoe-14.avif" },
    ],
  },
  "af1-mid-07": {
    id: "af1-mid-07",
    title: "Nike Air Force 1 Mid '07",
    subtitle: "Men's Shoes",
    price: 110,
    description:
      "The radiance lives on with the Nike Air Force 1, the b-ball original that puts a fresh spin on what you know best.",
    images: sanitizeImages(["/shoes/shoe-1.jpg"]),
    variants: [],
    sizes: ["7", "8", "9", "10", "11", "12"],
    rating: 4.5,
    alsoLike: [],
  },
  "court-vision-low": {
    id: "court-vision-low",
    title: "Nike Court Vision Low Next Nature",
    subtitle: "Men's Shoes",
    price: 90,
    description: "A classic hoops-inspired design made in part with recycled materials.",
    images: sanitizeImages(["/shoes/shoe-6.avif", "/shoes/shoe-7.avif"]),
    variants: [],
    sizes: ["7", "8", "9", "10", "11", "12"],
    rating: 4.3,
    alsoLike: [],
  },
  "dunk-low-retro": {
    id: "dunk-low-retro",
    title: "Nike Dunk Low Retro",
    subtitle: "Men's Shoes",
    price: 100,
    description: "An icon reborn. The Dunk Low delivers timeless style and easy comfort.",
    images: sanitizeImages(["/shoes/shoe-14.avif", "/shoes/shoe-13.avif"]),
    variants: [],
    sizes: ["7", "8", "9", "10", "11", "12"],
    rating: 4.8,
    alsoLike: [],
  },
};

export function getProductById(id: string): Product | null {
  const p = db[id];
  if (!p) return null;
  const images = sanitizeImages(p.images);
  const variants = p.variants
    .map((v) => ({ ...v, images: sanitizeImages(v.images) }))
    .filter((v) => v.images.length > 0);
  return { ...p, images, variants };
}

export function assertProductOrNotFound(id: string): Product {
  const p = getProductById(id);
  if (!p) notFound();
  return p!;
}
