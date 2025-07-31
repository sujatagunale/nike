import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  type: z.enum(['billing', 'shipping']),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  postalCode: z.string().min(1),
  isDefault: z.boolean(),
});

export const brandSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logoUrl: z.string().url().optional(),
});

export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().uuid().optional(),
});

export const genderSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1),
  slug: z.string().min(1),
});

export const colorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  hexCode: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const sizeSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sortOrder: z.number().int().positive(),
});

export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.string().uuid(),
  genderId: z.string().uuid(),
  brandId: z.string().uuid(),
  isPublished: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const productImageSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  url: z.string().url(),
  isPrimary: z.boolean(),
});

export const productVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  sku: z.string().min(1),
  price: z.string().regex(/^\d+\.\d{2}$/),
  salePrice: z.string().regex(/^\d+\.\d{2}$/).optional(),
  colorId: z.string().uuid(),
  sizeId: z.string().uuid(),
  inStock: z.number().int().min(0),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  createdAt: z.date(),
});

export const reviewSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  userId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  createdAt: z.date(),
});

export const cartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().optional(),
  guestId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const cartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'cancelled']),
  totalAmount: z.string().regex(/^\d+\.\d{2}$/),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  createdAt: z.date(),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productVariantId: z.string().uuid(),
  quantity: z.number().int().positive(),
  priceAtPurchase: z.string().regex(/^\d+\.\d{2}$/),
});

export const paymentSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  method: z.enum(['stripe', 'paypal', 'cod']),
  status: z.enum(['initiated', 'completed', 'failed']),
  paidAt: z.date().optional(),
  transactionId: z.string().optional(),
});

export const couponSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.string().regex(/^\d+\.\d{2}$/),
  expiresAt: z.date(),
  maxUsage: z.number().int().positive(),
  usedCount: z.number().int().min(0),
});

export const wishlistSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  productId: z.string().uuid(),
  addedAt: z.date(),
});

export const collectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  createdAt: z.date(),
});

export const productCollectionSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  collectionId: z.string().uuid(),
});
