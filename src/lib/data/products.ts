import { FilterState } from '@/lib/utils/query';

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  category: { id: string; name: string; slug: string };
  gender: { id: string; label: string; slug: string };
  brand: { id: string; name: string; slug: string };
  isPublished: boolean;
  images: { url: string; isPrimary: boolean }[];
  variants: {
    id: string;
    price: number;
    salePrice?: number;
    color: { id: string; name: string; slug: string; hexCode: string };
    size: { id: string; name: string; slug: string };
    inStock: number;
  }[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: '1',
    name: 'Air Max 270',
    description: 'The Nike Air Max 270 delivers visible Air cushioning from heel to toe.',
    category: { id: 'cat1', name: 'Running Shoes', slug: 'running-shoes' },
    gender: { id: 'gen1', label: 'Men', slug: 'men' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-1.jpg', isPrimary: true },
      { url: '/shoe-2.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var1',
        price: 130,
        salePrice: 117,
        color: { id: 'col1', name: 'Black', slug: 'black', hexCode: '#000000' },
        size: { id: 'size1', name: '9', slug: '9' },
        inStock: 15
      },
      {
        id: 'var2',
        price: 130,
        color: { id: 'col2', name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        size: { id: 'size2', name: '10', slug: '10' },
        inStock: 8
      },
      {
        id: 'var3',
        price: 130,
        color: { id: 'col3', name: 'Red', slug: 'red', hexCode: '#FF0000' },
        size: { id: 'size3', name: '8', slug: '8' },
        inStock: 12
      }
    ]
  },
  {
    id: '2',
    name: 'Air Jordan 1 Retro High',
    description: 'The Air Jordan 1 Retro High brings back the classic basketball shoe.',
    category: { id: 'cat2', name: 'Basketball Shoes', slug: 'basketball-shoes' },
    gender: { id: 'gen2', label: 'Women', slug: 'women' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-3.webp', isPrimary: true },
      { url: '/shoe-4.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var4',
        price: 170,
        color: { id: 'col1', name: 'Black', slug: 'black', hexCode: '#000000' },
        size: { id: 'size4', name: '7', slug: '7' },
        inStock: 20
      },
      {
        id: 'var5',
        price: 170,
        color: { id: 'col4', name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
        size: { id: 'size5', name: '8', slug: '8' },
        inStock: 5
      }
    ]
  },
  {
    id: '3',
    name: 'React Infinity Run',
    description: 'Nike React Infinity Run designed to help reduce injury.',
    category: { id: 'cat1', name: 'Running Shoes', slug: 'running-shoes' },
    gender: { id: 'gen3', label: 'Unisex', slug: 'unisex' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-2.webp', isPrimary: true },
      { url: '/shoe-1.jpg', isPrimary: false }
    ],
    variants: [
      {
        id: 'var6',
        price: 160,
        salePrice: 144,
        color: { id: 'col5', name: 'Gray', slug: 'gray', hexCode: '#808080' },
        size: { id: 'size6', name: '9', slug: '9' },
        inStock: 25
      },
      {
        id: 'var7',
        price: 160,
        color: { id: 'col6', name: 'Green', slug: 'green', hexCode: '#008000' },
        size: { id: 'size7', name: '10', slug: '10' },
        inStock: 18
      }
    ]
  },
  {
    id: '4',
    name: 'Air Force 1 Low',
    description: 'The Nike Air Force 1 Low brings a classic basketball look.',
    category: { id: 'cat3', name: 'Casual Shoes', slug: 'casual-shoes' },
    gender: { id: 'gen1', label: 'Men', slug: 'men' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-4.webp', isPrimary: true },
      { url: '/shoe-3.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var8',
        price: 90,
        color: { id: 'col2', name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        size: { id: 'size8', name: '11', slug: '11' },
        inStock: 30
      },
      {
        id: 'var9',
        price: 90,
        color: { id: 'col1', name: 'Black', slug: 'black', hexCode: '#000000' },
        size: { id: 'size9', name: '12', slug: '12' },
        inStock: 22
      }
    ]
  },
  {
    id: '5',
    name: 'Dunk Low',
    description: 'The Nike Dunk Low brings retro basketball style.',
    category: { id: 'cat3', name: 'Casual Shoes', slug: 'casual-shoes' },
    gender: { id: 'gen2', label: 'Women', slug: 'women' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-1.jpg', isPrimary: true },
      { url: '/shoe-2.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var10',
        price: 100,
        salePrice: 85,
        color: { id: 'col3', name: 'Red', slug: 'red', hexCode: '#FF0000' },
        size: { id: 'size10', name: '6', slug: '6' },
        inStock: 14
      },
      {
        id: 'var11',
        price: 100,
        color: { id: 'col4', name: 'Blue', slug: 'blue', hexCode: '#0000FF' },
        size: { id: 'size11', name: '7', slug: '7' },
        inStock: 9
      }
    ]
  },
  {
    id: '6',
    name: 'Air Max 90',
    description: 'The Nike Air Max 90 stays true to its OG running roots.',
    category: { id: 'cat1', name: 'Running Shoes', slug: 'running-shoes' },
    gender: { id: 'gen3', label: 'Unisex', slug: 'unisex' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-3.webp', isPrimary: true },
      { url: '/shoe-4.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var12',
        price: 120,
        color: { id: 'col5', name: 'Gray', slug: 'gray', hexCode: '#808080' },
        size: { id: 'size12', name: '8', slug: '8' },
        inStock: 16
      },
      {
        id: 'var13',
        price: 120,
        color: { id: 'col2', name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        size: { id: 'size13', name: '9', slug: '9' },
        inStock: 11
      }
    ]
  },
  {
    id: '7',
    name: 'Blazer Mid 77',
    description: 'The Nike Blazer Mid 77 brings classic basketball style.',
    category: { id: 'cat3', name: 'Casual Shoes', slug: 'casual-shoes' },
    gender: { id: 'gen1', label: 'Men', slug: 'men' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-2.webp', isPrimary: true },
      { url: '/shoe-1.jpg', isPrimary: false }
    ],
    variants: [
      {
        id: 'var14',
        price: 100,
        color: { id: 'col6', name: 'Green', slug: 'green', hexCode: '#008000' },
        size: { id: 'size14', name: '10', slug: '10' },
        inStock: 7
      },
      {
        id: 'var15',
        price: 100,
        color: { id: 'col1', name: 'Black', slug: 'black', hexCode: '#000000' },
        size: { id: 'size15', name: '11', slug: '11' },
        inStock: 13
      }
    ]
  },
  {
    id: '8',
    name: 'Air Jordan 4 Retro',
    description: 'The Air Jordan 4 Retro brings back the 1989 original.',
    category: { id: 'cat2', name: 'Basketball Shoes', slug: 'basketball-shoes' },
    gender: { id: 'gen2', label: 'Women', slug: 'women' },
    brand: { id: 'brand1', name: 'Nike', slug: 'nike' },
    isPublished: true,
    images: [
      { url: '/shoe-4.webp', isPrimary: true },
      { url: '/shoe-3.webp', isPrimary: false }
    ],
    variants: [
      {
        id: 'var16',
        price: 200,
        salePrice: 180,
        color: { id: 'col2', name: 'White', slug: 'white', hexCode: '#FFFFFF' },
        size: { id: 'size16', name: '6', slug: '6' },
        inStock: 6
      },
      {
        id: 'var17',
        price: 200,
        color: { id: 'col3', name: 'Red', slug: 'red', hexCode: '#FF0000' },
        size: { id: 'size17', name: '7', slug: '7' },
        inStock: 4
      }
    ]
  }
];

export function getFilteredProducts(
  products: MockProduct[],
  filters: FilterState,
  sort: string = 'featured'
): MockProduct[] {
  const filtered = products.filter(product => {
    if (filters.gender?.length && !filters.gender.includes(product.gender.slug)) {
      return false;
    }
    if (filters.category?.length && !filters.category.includes(product.category.slug)) {
      return false;
    }
    if (filters.color?.length) {
      const hasColor = product.variants.some(variant => 
        filters.color!.includes(variant.color.slug)
      );
      if (!hasColor) return false;
    }
    if (filters.size?.length) {
      const hasSize = product.variants.some(variant => 
        filters.size!.includes(variant.size.slug)
      );
      if (!hasSize) return false;
    }
    if (filters.priceRange?.length) {
      const minPrice = Math.min(...product.variants.map(v => v.salePrice || v.price));
      const hasValidPrice = filters.priceRange!.some(range => {
        switch (range) {
          case '0-50':
            return minPrice <= 50;
          case '50-100':
            return minPrice > 50 && minPrice <= 100;
          case '100-150':
            return minPrice > 100 && minPrice <= 150;
          case '150+':
            return minPrice > 150;
          default:
            return false;
        }
      });
      if (!hasValidPrice) return false;
    }
    return true;
  });

  switch (sort) {
    case 'price_asc':
      filtered.sort((a, b) => Math.min(...a.variants.map(v => v.salePrice || v.price)) - Math.min(...b.variants.map(v => v.salePrice || v.price)));
      break;
    case 'price_desc':
      filtered.sort((a, b) => Math.max(...b.variants.map(v => v.salePrice || v.price)) - Math.max(...a.variants.map(v => v.salePrice || v.price)));
      break;
    case 'newest':
      filtered.reverse();
      break;
    default:
      break;
  }

  return filtered;
}
