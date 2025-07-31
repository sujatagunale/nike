import { db } from "./index";
import {
  brands,
  categories,
  collections,
  colors,
  genders,
  productCollections,
  productImages,
  products,
  productVariants,
  sizes,
} from "./schema";

export async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    console.log("📦 Seeding brands...");
    const nikeResults = await db
      .insert(brands)
      .values([
        {
          name: "Nike",
          slug: "nike",
          logoUrl:
            "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
        },
      ])
      .returning();
    const nike = (
      nikeResults as Array<{
        id: string;
        name: string;
        slug: string;
        logoUrl?: string;
      }>
    )[0];

    console.log("👥 Seeding genders...");
    const genderResults = await db
      .insert(genders)
      .values([
        { label: "Men", slug: "men" },
        { label: "Women", slug: "women" },
        { label: "Unisex", slug: "unisex" },
      ])
      .returning();
    const menGender = (
      genderResults as Array<{ id: string; label: string; slug: string }>
    )[0];
    const womenGender = (
      genderResults as Array<{ id: string; label: string; slug: string }>
    )[1];
    const unisexGender = (
      genderResults as Array<{ id: string; label: string; slug: string }>
    )[2];

    console.log("📂 Seeding categories...");
    const categoryResults = await db
      .insert(categories)
      .values([
        { name: "Shoes", slug: "shoes" },
        { name: "Clothing", slug: "clothing" },
        { name: "Accessories", slug: "accessories" },
      ])
      .returning();
    const shoesCategory = (
      categoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[0];
    const clothingCategory = (
      categoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[1];
    const accessoriesCategory = (
      categoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[2];

    const subcategoryResults = await db
      .insert(categories)
      .values([
        {
          name: "Running Shoes",
          slug: "running-shoes",
          parentId: shoesCategory.id,
        },
        {
          name: "Basketball Shoes",
          slug: "basketball-shoes",
          parentId: shoesCategory.id,
        },
        {
          name: "Casual Shoes",
          slug: "casual-shoes",
          parentId: shoesCategory.id,
        },
      ])
      .returning();
    const runningShoesCategory = (
      subcategoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[0];
    const basketballShoesCategory = (
      subcategoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[1];
    const casualShoesCategory = (
      subcategoryResults as Array<{
        id: string;
        name: string;
        slug: string;
        parentId?: string;
      }>
    )[2];

    console.log("🎨 Seeding colors...");
    const colorData = await db
      .insert(colors)
      .values([
        { name: "Black", slug: "black", hexCode: "#000000" },
        { name: "White", slug: "white", hexCode: "#FFFFFF" },
        { name: "Red", slug: "red", hexCode: "#FF0000" },
        { name: "Blue", slug: "blue", hexCode: "#0000FF" },
        { name: "Gray", slug: "gray", hexCode: "#808080" },
        { name: "Green", slug: "green", hexCode: "#008000" },
        { name: "Orange", slug: "orange", hexCode: "#FFA500" },
        { name: "Purple", slug: "purple", hexCode: "#800080" },
      ])
      .returning();

    console.log("📏 Seeding sizes...");
    const sizeData = await db
      .insert(sizes)
      .values([
        { name: "6", slug: "6", sortOrder: 1 },
        { name: "6.5", slug: "6-5", sortOrder: 2 },
        { name: "7", slug: "7", sortOrder: 3 },
        { name: "7.5", slug: "7-5", sortOrder: 4 },
        { name: "8", slug: "8", sortOrder: 5 },
        { name: "8.5", slug: "8-5", sortOrder: 6 },
        { name: "9", slug: "9", sortOrder: 7 },
        { name: "9.5", slug: "9-5", sortOrder: 8 },
        { name: "10", slug: "10", sortOrder: 9 },
        { name: "10.5", slug: "10-5", sortOrder: 10 },
        { name: "11", slug: "11", sortOrder: 11 },
        { name: "11.5", slug: "11-5", sortOrder: 12 },
        { name: "12", slug: "12", sortOrder: 13 },
      ])
      .returning();

    console.log("🏷️ Seeding collections...");
    const collectionResults = await db
      .insert(collections)
      .values([
        { name: "Air Max", slug: "air-max" },
        { name: "Jordan", slug: "jordan" },
        { name: "React", slug: "react" },
      ])
      .returning();
    const airMaxCollection = (
      collectionResults as Array<{ id: string; name: string; slug: string }>
    )[0];
    const jordanCollection = (
      collectionResults as Array<{ id: string; name: string; slug: string }>
    )[1];
    const reactCollection = (
      collectionResults as Array<{ id: string; name: string; slug: string }>
    )[2];

    console.log("👟 Seeding products...");
    const productData = [
      {
        name: "Air Max 270",
        description:
          "The Nike Air Max 270 delivers visible Air cushioning from heel to toe.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Jordan 1 Retro High",
        description:
          "The Air Jordan 1 Retro High brings back the classic basketball shoe.",
        categoryId: basketballShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "React Infinity Run",
        description: "Nike React Infinity Run designed to help reduce injury.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Force 1 Low",
        description:
          "The Nike Air Force 1 Low brings a classic basketball look.",
        categoryId: casualShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Dunk Low",
        description: "The Nike Dunk Low brings retro basketball style.",
        categoryId: casualShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Max 90",
        description: "The Nike Air Max 90 stays true to its OG running roots.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Blazer Mid 77",
        description: "The Nike Blazer Mid 77 brings classic basketball style.",
        categoryId: casualShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Jordan 4 Retro",
        description: "The Air Jordan 4 Retro brings back the 1989 original.",
        categoryId: basketballShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Max 97",
        description:
          "The Nike Air Max 97 takes inspiration from Japanese bullet trains.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "React Element 55",
        description:
          "The Nike React Element 55 combines lightweight Nike React foam.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Jordan 11 Retro",
        description: "The Air Jordan 11 Retro brings back the 1995 classic.",
        categoryId: basketballShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Max Plus",
        description:
          "The Nike Air Max Plus delivers a bold look with wavy design lines.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Cortez Classic",
        description: "The Nike Cortez Classic brings back the 1972 original.",
        categoryId: casualShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Jordan 3 Retro",
        description: "The Air Jordan 3 Retro brings back the 1988 classic.",
        categoryId: basketballShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
      {
        name: "Air Max 1",
        description:
          "The Nike Air Max 1 brings the original visible Air cushioning.",
        categoryId: runningShoesCategory.id,
        genderId: unisexGender.id,
        brandId: nike.id,
        isPublished: true,
      },
    ];

    const insertedProducts = await db
      .insert(products)
      .values(productData)
      .returning();

    console.log("🖼️ Seeding product images...");
    const imagePromises = insertedProducts.map((product, index) => {
      return db.insert(productImages).values([
        {
          productId: product.id,
          url: `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/c535aa42-6c9d-43ad-8ab7-d0b825a49dce/NIKE+FIELD+GENERAL.png`,
          isPrimary: true,
        },
        {
          productId: product.id,
          url: `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4ff32539-25a8-4fe8-9760-6d4e999a194f/NIKE+FIELD+GENERAL.png`,
          isPrimary: false,
        },
      ]);
    });
    await Promise.all(imagePromises);

    console.log("🔄 Seeding product variants...");
    const variantPromises = insertedProducts.map((product, productIndex) => {
      const variants: Array<{
        productId: string;
        sku: string;
        price: string;
        salePrice?: string;
        colorId: string;
        sizeId: string;
        inStock: number;
        weight: string;
        dimensions: { length: number; width: number; height: number };
      }> = [];

      const productColors = colorData.slice(0, 3);
      const productSizes = sizeData.slice(2, 8); // sizes 7-10

      productColors.forEach((color, colorIndex) => {
        productSizes.forEach((size) => {
          const basePrice = 120 + productIndex * 10;
          variants.push({
            productId: product.id,
            sku: `NIKE-${product.name
              .replace(/\s+/g, "")
              .toUpperCase()}-${color.slug.toUpperCase()}-${size.slug.toUpperCase()}`,
            price: basePrice.toString(),
            salePrice:
              colorIndex === 0 ? (basePrice * 0.9).toString() : undefined,
            colorId: color.id,
            sizeId: size.id,
            inStock: Math.floor(Math.random() * 50) + 10,
            weight: (0.8 + Math.random() * 0.4).toFixed(2),
            dimensions: {
              length: 30 + Math.random() * 5,
              width: 12 + Math.random() * 3,
              height: 10 + Math.random() * 2,
            },
          });
        });
      });

      return db.insert(productVariants).values(variants);
    });
    await Promise.all(variantPromises);

    console.log("🔗 Seeding product collections...");
    const productCollectionData = [
      { productId: insertedProducts[0].id, collectionId: airMaxCollection.id }, // Air Max 270
      { productId: insertedProducts[5].id, collectionId: airMaxCollection.id }, // Air Max 90
      { productId: insertedProducts[8].id, collectionId: airMaxCollection.id }, // Air Max 97
      { productId: insertedProducts[11].id, collectionId: airMaxCollection.id }, // Air Max Plus
      { productId: insertedProducts[14].id, collectionId: airMaxCollection.id }, // Air Max 1

      { productId: insertedProducts[1].id, collectionId: jordanCollection.id }, // Air Jordan 1
      { productId: insertedProducts[7].id, collectionId: jordanCollection.id }, // Air Jordan 4
      { productId: insertedProducts[10].id, collectionId: jordanCollection.id }, // Air Jordan 11
      { productId: insertedProducts[13].id, collectionId: jordanCollection.id }, // Air Jordan 3

      { productId: insertedProducts[2].id, collectionId: reactCollection.id }, // React Infinity Run
      { productId: insertedProducts[9].id, collectionId: reactCollection.id }, // React Element 55
    ];

    await db.insert(productCollections).values(productCollectionData);

    console.log("✅ Database seeded successfully!");
    console.log(`📊 Seeded:`);
    console.log(`   - 1 brand (Nike)`);
    console.log(`   - 3 genders`);
    console.log(`   - 6 categories (3 main + 3 sub)`);
    console.log(`   - 8 colors`);
    console.log(`   - 13 sizes`);
    console.log(`   - 3 collections`);
    console.log(`   - 15 products`);
    console.log(`   - 30 product images`);
    console.log(`   - ~270 product variants`);
    console.log(`   - 11 product-collection relationships`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log("🎉 Seed completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Seed failed:", error);
      process.exit(1);
    });
}
