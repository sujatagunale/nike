import { db } from './index';
import { 
  brands, 
  genders, 
  categories, 
  colors, 
  sizes, 
  products, 
  productVariants, 
  productImages,
  collections,
  productCollections
} from './schema';

export async function seed() {
  console.log('Starting database seed...');

  const nikeId = crypto.randomUUID();
  await db.insert(brands).values({
    id: nikeId,
    name: 'Nike',
    slug: 'nike',
    logoUrl: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
  });

  const menId = crypto.randomUUID();
  const womenId = crypto.randomUUID();
  const unisexId = crypto.randomUUID();
  
  await db.insert(genders).values([
    { id: menId, label: 'Men', slug: 'men' },
    { id: womenId, label: 'Women', slug: 'women' },
    { id: unisexId, label: 'Unisex', slug: 'unisex' },
  ]);

  const shoesId = crypto.randomUUID();
  const clothingId = crypto.randomUUID();
  const accessoriesId = crypto.randomUUID();
  const runningId = crypto.randomUUID();
  const basketballId = crypto.randomUUID();
  const lifestyleId = crypto.randomUUID();
  
  await db.insert(categories).values([
    { id: shoesId, name: 'Shoes', slug: 'shoes' },
    { id: clothingId, name: 'Clothing', slug: 'clothing' },
    { id: accessoriesId, name: 'Accessories', slug: 'accessories' },
    { id: runningId, name: 'Running', slug: 'running', parentId: shoesId },
    { id: basketballId, name: 'Basketball', slug: 'basketball', parentId: shoesId },
    { id: lifestyleId, name: 'Lifestyle', slug: 'lifestyle', parentId: shoesId },
  ]);

  const blackId = crypto.randomUUID();
  const whiteId = crypto.randomUUID();
  const redId = crypto.randomUUID();
  const blueId = crypto.randomUUID();
  const greyId = crypto.randomUUID();
  
  await db.insert(colors).values([
    { id: blackId, name: 'Black', slug: 'black', hexCode: '#000000' },
    { id: whiteId, name: 'White', slug: 'white', hexCode: '#FFFFFF' },
    { id: redId, name: 'Red', slug: 'red', hexCode: '#FF0000' },
    { id: blueId, name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
    { id: greyId, name: 'Grey', slug: 'grey', hexCode: '#808080' },
  ]);

  const size7Id = crypto.randomUUID();
  const size8Id = crypto.randomUUID();
  const size9Id = crypto.randomUUID();
  const size10Id = crypto.randomUUID();
  const size11Id = crypto.randomUUID();
  const size12Id = crypto.randomUUID();
  
  await db.insert(sizes).values([
    { id: size7Id, name: '7', slug: '7', sortOrder: 7 },
    { id: size8Id, name: '8', slug: '8', sortOrder: 8 },
    { id: size9Id, name: '9', slug: '9', sortOrder: 9 },
    { id: size10Id, name: '10', slug: '10', sortOrder: 10 },
    { id: size11Id, name: '11', slug: '11', sortOrder: 11 },
    { id: size12Id, name: '12', slug: '12', sortOrder: 12 },
  ]);

  const nikeProducts = [
    {
      id: crypto.randomUUID(),
      name: 'Air Max 90',
      description: 'The Nike Air Max 90 stays true to its OG running roots with the iconic Waffle sole, stitched overlays and classic TPU details.',
      categoryId: runningId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Air Force 1',
      description: 'The radiance lives on in the Nike Air Force 1, the basketball original that puts a fresh spin on what you know best.',
      categoryId: basketballId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'React Infinity Run',
      description: 'A lightweight, responsive running shoe designed to help reduce injury and keep you on the run.',
      categoryId: runningId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Dunk Low',
      description: 'Created for the hardwood but taken to the streets, the Nike Dunk Low returns with crisp overlays and original team colors.',
      categoryId: basketballId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Blazer Mid',
      description: 'The Nike Blazer Mid brings a timeless design back to the streets while delivering the comfort you need.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Air Jordan 1',
      description: 'The Air Jordan 1 retains its appeal with soft, comfortable leather and Air cushioning.',
      categoryId: basketballId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Pegasus 40',
      description: 'The Nike Air Zoom Pegasus 40 is a responsive, everyday running shoe with a comfortable, secure fit.',
      categoryId: runningId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Cortez',
      description: 'The Nike Cortez is a classic running shoe that helped establish Nike as a premier athletic brand.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Air Max 270',
      description: 'The Nike Air Max 270 delivers visible Air cushioning from heel to toe for all-day comfort.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Revolution 6',
      description: 'The Nike Revolution 6 provides soft cushioning and support for your everyday running routine.',
      categoryId: runningId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Air Max 97',
      description: 'The Nike Air Max 97 takes inspiration from Japanese bullet trains and water droplets.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Zoom Freak 4',
      description: 'Giannis needs a shoe that can keep up with his freakish athleticism. The Zoom Freak 4 delivers.',
      categoryId: basketballId,
      genderId: menId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Air Max Plus',
      description: 'The Nike Air Max Plus delivers a bold look with wavy design lines and visible Air cushioning.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'Metcon 8',
      description: 'The Nike Metcon 8 is built for versatility, stability and durability for all your training needs.',
      categoryId: runningId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
    {
      id: crypto.randomUUID(),
      name: 'SB Dunk Low',
      description: 'The Nike SB Dunk Low brings skateboarding heritage with enhanced board feel and durability.',
      categoryId: lifestyleId,
      genderId: unisexId,
      brandId: nikeId,
      isPublished: true,
    },
  ];

  await db.insert(products).values(nikeProducts);

  const variants: Array<typeof productVariants.$inferInsert> = [];
  const images: Array<typeof productImages.$inferInsert> = [];
  
  for (const product of nikeProducts) {
    const colorIds = [blackId, whiteId, redId, blueId, greyId];
    const sizeIds = [size7Id, size8Id, size9Id, size10Id, size11Id, size12Id];
    
    for (let i = 0; i < 2; i++) {
      const colorId = colorIds[i % colorIds.length];
      for (let j = 0; j < 3; j++) {
        const sizeId = sizeIds[j];
        const variantId = crypto.randomUUID();
        
        variants.push({
          id: variantId,
          productId: product.id,
          sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-${colorIds.indexOf(colorId)}-${j}`,
          price: (Math.random() * 100 + 50).toFixed(2),
          salePrice: Math.random() > 0.7 ? (Math.random() * 80 + 40).toFixed(2) : undefined,
          colorId,
          sizeId,
          inStock: Math.floor(Math.random() * 50) + 10,
          weight: Math.random() * 2 + 0.5,
          dimensions: {
            length: Math.random() * 5 + 10,
            width: Math.random() * 3 + 8,
            height: Math.random() * 2 + 3,
          },
        });
      }
    }

    images.push({
      id: crypto.randomUUID(),
      productId: product.id,
      url: `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${product.name.replace(/\s+/g, '-').toLowerCase()}-1.jpg`,
      isPrimary: true,
    });
    
    images.push({
      id: crypto.randomUUID(),
      productId: product.id,
      url: `https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/${product.name.replace(/\s+/g, '-').toLowerCase()}-2.jpg`,
      isPrimary: false,
    });
  }

  await db.insert(productVariants).values(variants);
  await db.insert(productImages).values(images);

  const summerCollectionId = crypto.randomUUID();
  const newArrivalsId = crypto.randomUUID();
  
  await db.insert(collections).values([
    {
      id: summerCollectionId,
      name: 'Summer 2025',
      slug: 'summer-2025',
    },
    {
      id: newArrivalsId,
      name: 'New Arrivals',
      slug: 'new-arrivals',
    },
  ]);

  const productCollectionData: Array<typeof productCollections.$inferInsert> = [];
  for (let i = 0; i < 8; i++) {
    productCollectionData.push({
      id: crypto.randomUUID(),
      productId: nikeProducts[i].id,
      collectionId: i < 4 ? summerCollectionId : newArrivalsId,
    });
  }
  
  await db.insert(productCollections).values(productCollectionData);

  console.log('Database seed completed successfully!');
  console.log(`- Created ${nikeProducts.length} Nike products`);
  console.log(`- Created ${variants.length} product variants`);
  console.log(`- Created ${images.length} product images`);
  console.log('- Created 2 collections with product associations');
}

if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
