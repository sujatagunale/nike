import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  type: z.enum(['billing', 'shipping']),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean().default(false),
});

export const brandSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const categorySchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

export const genderSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const colorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const sizeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().min(0),
});

export const productSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const productImageSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  url: z.string().url(),
  isPrimary: z.boolean().default(false),
});

export const productVariantSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  salePrice: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0).default(0),
  weight: z.string().regex(/^\d+(\.\d+)?$/),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  createdAt: z.date().optional(),
});

export const reviewSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  userId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date().optional(),
});

export const cartSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().optional(),
  guestId: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const cartItemSchema = z.object({
  id: z.string().uuid().optional(),
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export const orderSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  createdAt: z.date().optional(),
});

export const orderItemSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().min(1),
  priceAtPurchase: z.string().regex(/^\d+(\.\d{1,2})?$/),
});

export const paymentSchema = z.object({
  id: z.string().uuid().optional(),
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']),
  paidAt: z.date().optional(),
  transactionId: z.string().optional(),
});

export const couponSchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string().regex(/^\d+(\.\d+)?$/),
  expiresAt: z.date(),
  maxUsage: z.number().int().min(1),
  usedCount: z.number().int().min(0).default(0),
});

export const wishlistSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string(),
  productId: z.string().uuid(),
  addedAt: z.date().optional(),
});

export const collectionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date().optional(),
});

export const productCollectionSchema = z.object({
  id: z.string().uuid().optional(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export type Address = z.infer<typeof addressSchema>;
export type Brand = z.infer<typeof brandSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Gender = z.infer<typeof genderSchema>;
export type Color = z.infer<typeof colorSchema>;
export type Size = z.infer<typeof sizeSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type ProductVariant = z.infer<typeof productVariantSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type Coupon = z.infer<typeof couponSchema>;
export type Wishlist = z.infer<typeof wishlistSchema>;
export type Collection = z.infer<typeof collectionSchema>;
export type ProductCollection = z.infer<typeof productCollectionSchema>;
