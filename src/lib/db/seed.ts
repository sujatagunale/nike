import { db } from './index';
import {
  brands,
  categories,
  genders,
  colors,
  sizes,
  products,
  productVariants,
  productImages,
  collections,
  productCollections,
} from './schema';
import { eq } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

const STATIC_UPLOADS_DIR = path.join(process.cwd(), 'static', 'uploads');

function ensureStaticUploadsDir() {
  if (!fs.existsSync(STATIC_UPLOADS_DIR)) {
    fs.mkdirSync(STATIC_UPLOADS_DIR, { recursive: true });
    console.log('✅ Created static/uploads directory');
  }
}

function copyImageToStatic(sourceImagePath: string, fileName: string): string {
  const sourcePath = path.join(process.cwd(), 'public', 'shoes', sourceImagePath);
  const destPath = path.join(STATIC_UPLOADS_DIR, fileName);
  
  try {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${sourceImagePath} to static/uploads/${fileName}`);
    return `/static/uploads/${fileName}`;
  } catch (error) {
    console.error(`❌ Failed to copy ${sourceImagePath}:`, error);
    return `/shoes/${sourceImagePath}`;
  }
}

export async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    if (!db) {
      console.warn('Database not available, skipping seed operation');
      return;
    }

    ensureStaticUploadsDir();

    console.log('📦 Seeding brands...');
    const brandResults = await db.insert(brands).values([
      {
        name: 'Nike',
        slug: 'nike',
        logoUrl: '/logo.svg',
      },
    ]).returning();
    const nikeBrand = brandResults[0];

    console.log('👥 Seeding genders...');
    const genderResults = await db.insert(genders).values([
      { label: 'Men', slug: 'men' },
      { label: 'Women', slug: 'women' },
      { label: 'Unisex', slug: 'unisex' },
    ]).returning();
    const menGender = genderResults[0];
    const womenGender = genderResults[1];
    const unisexGender = genderResults[2];

    console.log('🎨 Seeding colors...');
    const colorResults = await db.insert(colors).values([
      { name: 'Black', slug: 'black', hexCode: '#000000' },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF' },
      { name: 'Red', slug: 'red', hexCode: '#FF0000' },
      { name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
      { name: 'Gray', slug: 'gray', hexCode: '#808080' },
      { name: 'Green', slug: 'green', hexCode: '#008000' },
      { name: 'Orange', slug: 'orange', hexCode: '#FFA500' },
      { name: 'Pink', slug: 'pink', hexCode: '#FFC0CB' },
      { name: 'Purple', slug: 'purple', hexCode: '#800080' },
      { name: 'Yellow', slug: 'yellow', hexCode: '#FFFF00' },
    ]).returning();
    const colorData = colorResults;

    console.log('📏 Seeding sizes...');
    const sizeResults = await db.insert(sizes).values([
      { name: '6', slug: '6', sortOrder: 1 },
      { name: '6.5', slug: '6-5', sortOrder: 2 },
      { name: '7', slug: '7', sortOrder: 3 },
      { name: '7.5', slug: '7-5', sortOrder: 4 },
      { name: '8', slug: '8', sortOrder: 5 },
      { name: '8.5', slug: '8-5', sortOrder: 6 },
      { name: '9', slug: '9', sortOrder: 7 },
      { name: '9.5', slug: '9-5', sortOrder: 8 },
      { name: '10', slug: '10', sortOrder: 9 },
      { name: '10.5', slug: '10-5', sortOrder: 10 },
      { name: '11', slug: '11', sortOrder: 11 },
      { name: '11.5', slug: '11-5', sortOrder: 12 },
      { name: '12', slug: '12', sortOrder: 13 },
    ]).returning();
    const sizeData = sizeResults;

    console.log('📂 Seeding categories...');
    const categoryResults = await db.insert(categories).values([
      { name: 'Running', slug: 'running' },
      { name: 'Basketball', slug: 'basketball' },
      { name: 'Lifestyle', slug: 'lifestyle' },
      { name: 'Training', slug: 'training' },
      { name: 'Soccer', slug: 'soccer' },
    ]).returning();
    const categoryData = categoryResults;
    const categoryArray = Array.isArray(categoryData) ? categoryData : [];

    console.log('🏷️ Seeding collections...');
    const collectionResults = await db.insert(collections).values([
      { name: 'Air Max Collection', slug: 'air-max-collection' },
      { name: 'Jordan Collection', slug: 'jordan-collection' },
      { name: 'React Collection', slug: 'react-collection' },
    ]).returning();
    const collectionData = collectionResults;

    console.log('👟 Seeding products...');
    const productData = [
      {
        name: 'Air Max 270',
        description: 'The Nike Air Max 270 delivers visible Air cushioning from heel to toe.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-1.jpg'],
      },
      {
        name: 'Air Force 1',
        description: 'The radiance lives on in the Nike Air Force 1, the basketball original.',
        categoryId: categoryArray[1]!.id, // Basketball
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-2.webp'],
      },
      {
        name: 'React Infinity Run',
        description: 'Nike React Infinity Run Flyknit is designed to help reduce injury.',
        categoryId: categoryArray[0]!.id, // Running
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-3.webp'],
      },
      {
        name: 'Air Zoom Pegasus',
        description: 'The Nike Air Zoom Pegasus delivers the responsive cushioning you love.',
        categoryId: categoryArray[0]!.id, // Running
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-4.webp'],
      },
      {
        name: 'Metcon 7',
        description: 'The Nike Metcon 7 is the gold standard for weight training.',
        categoryId: categoryArray[3]!.id, // Training
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-5.avif'],
      },
      {
        name: 'Air Max 90',
        description: 'Nothing as fly, nothing as comfortable, nothing as proven.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-6.avif'],
      },
      {
        name: 'Blazer Mid',
        description: 'The Nike Blazer Mid brings a timeless design back to the streets.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-7.avif'],
      },
      {
        name: 'Air Max 97',
        description: 'The Nike Air Max 97 takes inspiration from Japanese bullet trains.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-8.avif'],
      },
      {
        name: 'Dunk Low',
        description: 'Created for the hardwood but taken to the streets.',
        categoryId: categoryArray[1]!.id, // Basketball
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-9.avif'],
      },
      {
        name: 'Air Max Plus',
        description: 'The Nike Air Max Plus delivers a bold look with incredible comfort.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-10.avif'],
      },
      {
        name: 'React Element 55',
        description: 'The Nike React Element 55 is inspired by the Nike internationalist.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-11.avif'],
      },
      {
        name: 'Air Zoom Structure',
        description: 'The Nike Air Zoom Structure provides stability and support.',
        categoryId: categoryArray[0]!.id, // Running
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-12.avif'],
      },
      {
        name: 'Free RN 5.0',
        description: 'The Nike Free RN 5.0 delivers the barefoot-like feel you love.',
        categoryId: categoryArray[0]!.id, // Running
        genderId: womenGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-13.avif'],
      },
      {
        name: 'Air Max 2090',
        description: 'The Nike Air Max 2090 takes the DNA of the Air Max 90.',
        categoryId: categoryArray[2]!.id, // Lifestyle
        genderId: unisexGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-14.avif'],
      },
      {
        name: 'Zoom Freak 3',
        description: 'Giannis needs a shoe that can keep up with his freakish athleticism.',
        categoryId: categoryArray[1]!.id, // Basketball
        genderId: menGender.id,
        brandId: nikeBrand.id,
        isPublished: true,
        images: ['shoe-15.avif'],
      },
    ];

    const insertedProducts: Array<{ id: string; name: string; images: string[] }> = [];
    for (const productInfo of productData) {
      const { images, ...productDataToInsert } = productInfo;
      const insertedProductArray = await db.insert(products).values(productDataToInsert).returning();
      const product = Array.isArray(insertedProductArray) ? insertedProductArray[0] : null;
      if (!product) continue;
      insertedProducts.push({ ...product, images });
      console.log(`✅ Created product: ${product.name}`);
    }

    console.log('🎨 Creating product variants...');
    const allVariants = [];
    
    for (const product of insertedProducts) {
      const numVariants = Math.floor(Math.random() * 4) + 2; // 2-5 variants per product
      const usedColorSizeCombos = new Set();
      
      for (let i = 0; i < numVariants; i++) {
        const randomColor = colorData[Math.floor(Math.random() * colorData.length)];
        const randomSize = sizeData[Math.floor(Math.random() * sizeData.length)];
        const comboKey = `${randomColor.id}-${randomSize.id}`;
        
        if (usedColorSizeCombos.has(comboKey)) continue;
        usedColorSizeCombos.add(comboKey);
        
        const basePrice = Math.floor(Math.random() * 100) + 80; // $80-$180
        const hasSale = Math.random() < 0.3; // 30% chance of sale
        const salePrice = hasSale ? Math.floor(basePrice * 0.8) : null;
        
        const variant = {
          productId: product.id,
          sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-${randomColor.slug}-${randomSize.slug}`,
          price: basePrice.toString(),
          salePrice: salePrice?.toString() || null,
          colorId: randomColor.id,
          sizeId: randomSize.id,
          inStock: Math.floor(Math.random() * 50) + 5, // 5-55 in stock
          weight: Math.random() * 2 + 0.5, // 0.5-2.5 lbs
          dimensions: {
            length: Math.random() * 5 + 10, // 10-15 inches
            width: Math.random() * 3 + 4, // 4-7 inches
            height: Math.random() * 2 + 3, // 3-5 inches
          },
        };
        
        const insertedVariantArray = await db.insert(productVariants).values(variant).returning();
        const insertedVariant = Array.isArray(insertedVariantArray) ? insertedVariantArray[0] : null;
        if (!insertedVariant) continue;
        allVariants.push(insertedVariant);
        console.log(`  ✅ Created variant: ${variant.sku}`);
      }
    }

    console.log('🖼️ Creating product images...');
    for (const product of insertedProducts) {
      for (let i = 0; i < product.images.length; i++) {
        const imageFileName = product.images[i];
        const staticImageUrl = copyImageToStatic(imageFileName, `${product.id}-${i}-${imageFileName}`);
        
        await db.insert(productImages).values({
          productId: product.id,
          variantId: null, // General product image
          url: staticImageUrl,
          sortOrder: i,
          isPrimary: i === 0,
        });
        console.log(`  ✅ Created image for ${product.name}: ${staticImageUrl}`);
      }
    }

    console.log('🏷️ Creating product-collection relationships...');
    for (const product of insertedProducts) {
      if (product.name.includes('Air Max')) {
        await db.insert(productCollections).values({
          productId: product.id,
          collectionId: collectionData[0]!.id, // Air Max Collection
        });
      } else if (product.name.includes('React')) {
        await db.insert(productCollections).values({
          productId: product.id,
          collectionId: collectionData[2]!.id, // React Collection
        });
      }
    }

    console.log('🔄 Setting default variants...');
    for (const product of insertedProducts) {
      const productVariantsForProduct = allVariants.filter(v => v.productId === product.id);
      if (productVariantsForProduct.length > 0) {
        await db.update(products)
          .set({ defaultVariantId: productVariantsForProduct[0].id })
          .where(eq(products.id, product.id));
      }
    }

    console.log('✅ Database seed completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`  - 1 brand (Nike)`);
    console.log(`  - 3 genders`);
    console.log(`  - ${colorData.length} colors`);
    console.log(`  - ${sizeData.length} sizes`);
    console.log(`  - ${categoryArray.length} categories`);
    console.log(`  - ${collectionData.length} collections`);
    console.log(`  - ${insertedProducts.length} products`);
    console.log(`  - ${allVariants.length} product variants`);
    console.log(`  - ${insertedProducts.length} product images`);

  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seed script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seed script failed:', error);
      process.exit(1);
    });
}
