import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { brands } from "./brands";
import { categories } from "./categories";
import { genders } from "./filters/genders";
import { productCollections } from "./product-collections";
import { productImages } from "./product-images";
import { reviews } from "./reviews";
import { productVariants } from "./variants";
import { wishlists } from "./wishlists";

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    genderId: uuid("gender_id")
      .notNull()
      .references(() => genders.id),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id),
    isPublished: boolean("is_published").notNull().default(false),
    defaultVariantId: uuid("default_variant_id"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    brandPublishedIdx: index("idx_products_brand_published").on(t.brandId, t.isPublished),
    categoryPublishedIdx: index("idx_products_category_published").on(t.categoryId, t.isPublished),
  })
);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  gender: one(genders, {
    fields: [products.genderId],
    references: [genders.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  defaultVariant: one(productVariants, {
    fields: [products.defaultVariantId],
    references: [productVariants.id],
    relationName: "defaultVariant",
  }),
  variants: many(productVariants, { relationName: "product" }),
  images: many(productImages),
  reviews: many(reviews),
  wishlists: many(wishlists),
  productCollections: many(productCollections),
}));

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
