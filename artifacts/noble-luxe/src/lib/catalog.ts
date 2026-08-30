import type { Product } from '@workspace/api-client-react';
export type CartItem = Product & {
  selectedSize: string;
  quantity: number;
  selectedColor?: string;
  selectedColorFront?: string;
  selectedColorBack?: string;
};
export type CatalogColor = {
  name: string;
  front: string;
  back?: string;
};
export type CatalogProduct = Product & {
  colorImages?: Record<string, CatalogColor>;
};
/*
|--------------------------------------------------------------------------
| NOBLE LUXE PRODUCT IMAGES
|--------------------------------------------------------------------------
|
| To add/change colours later:
|
| {
|   name: 'Blue',
|   front: 'FRONT IMAGE URL',
|   back: 'BACK IMAGE URL'
| }
|
| If a colour has no back image, simply remove "back".
|
*/
export const FALLBACK_PRODUCTS: CatalogProduct[] = [
  {
    id: 'nl-001',
    name: 'Obsidian Varsity Jacket',
    category: 'Outerwear',
    price: 185000,
    imageUrl:
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'A weighty wool-blend varsity jacket cut with architectural shoulders and a satin-lined interior.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian', 'Antique Gold'],
    featured: true,
  },
  /*
  |--------------------------------------------------------------------------
  | HOODIE
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-002',
    name: 'Atelier 03 Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl:
      'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg',
    description:
      'Heavyweight streetwear hoodie with a structured silhouette and signature Noble Luxe finish.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Blue'],
    colorImages: {
      Black: {
        name: 'Black',
        front:
          'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg',
        back:
          'https://i.ibb.co/tTMqjXmG/w-UIs-AX27v-A.jpg',
      },
      /*
       * ADD THE BLUE FRONT/BACK URLs HERE LATER.
       *
       * Example:
       *
       * Blue: {
       *   name: 'Blue',
       *   front: 'YOUR BLUE FRONT URL',
       *   back: 'YOUR BLUE BACK URL',
       * }
       */
    },
    featured: true,
  },
  /*
  |--------------------------------------------------------------------------
  | JOGGERS
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-003',
    name: 'Monument Joggers',
    category: 'Trousers',
    price: 92500,
    imageUrl:
      'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg',
    description:
      'Relaxed utility joggers designed for movement, comfort and a clean modern silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    colorImages: {
      Black: {
        name: 'Black',
        front:
          'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg',
        back:
          'https://i.ibb.co/bgh0qRbq/IZJsk-Ghb-I4.jpg',
      },
    },
    featured: false,
  },
  /*
  |--------------------------------------------------------------------------
  | GIRL'S TOP
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-004',
    name: "Noble Girl's Top",
    category: 'Essentials',
    price: 55000,
    imageUrl:
      'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg',
    description:
      'A refined everyday top with a clean silhouette and effortless Noble Luxe character.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Black'],
    colorImages: {
      Black: {
        name: 'Black',
        front:
          'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg',
        back:
          'https://i.ibb.co/TxpTRCvf/O92i-O39-IIb.jpg',
      },
    },
    featured: true,
  },
  /*
  |--------------------------------------------------------------------------
  | SIGNET LEATHER RUNNER
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-005',
    name: 'Signet Leather Runner',
    category: 'Footwear',
    price: 112000,
    imageUrl:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Low-profile leather runners finished with a brushed-metal signet at the heel.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Ink', 'Ivory'],
    featured: true,
  },
  /*
  |--------------------------------------------------------------------------
  | NOCTURNE RIB TEE
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-006',
    name: 'Nocturne Rib Tee',
    category: 'Essentials',
    price: 42000,
    imageUrl:
      'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'A close, clean rib knit designed to sit beneath tailoring or hold its own after dark.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx', 'Ash'],
    featured: false,
  },
  /*
  |--------------------------------------------------------------------------
  | SUNGLASSES
  |--------------------------------------------------------------------------
  */
  {
    id: 'nl-007',
    name: 'Noble Frame Sunglasses',
    category: 'Accessories',
    price: 55000,
    imageUrl:
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Hand-finished acetate frames with smoked lenses and a subtle gold temple mark.',
    sizes: ['One size'],
    colors: ['Black / Gold'],
    featured: false,
  },
];
/*
|--------------------------------------------------------------------------
| CURRENCY
|--------------------------------------------------------------------------
*/
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
/*
|--------------------------------------------------------------------------
| PRODUCT IMAGE
|--------------------------------------------------------------------------
*/
export const productImage = (product: Product) =>
  product.imageUrl ||
  FALLBACK_PRODUCTS.find(
    (item) => item.id === product.id,
  )?.imageUrl ||
  FALLBACK_PRODUCTS[0].imageUrl;
/*
|--------------------------------------------------------------------------
| GET AVAILABLE COLOURS
|--------------------------------------------------------------------------
|
| This allows the storefront to understand colours from
| colorImages first, then fall back to product.colors.
|
*/
export const getProductColors = (
  product: Product,
): CatalogColor[] => {
  const catalogProduct = product as CatalogProduct;
  if (
    catalogProduct.colorImages &&
    Object.keys(catalogProduct.colorImages).length > 0
  ) {
    return Object.values(catalogProduct.colorImages);
  }
  return (product.colors || []).map((color) => ({
    name: color,
    front: product.imageUrl || '',
  }));
};
/*
|--------------------------------------------------------------------------
| GET FRONT + BACK IMAGES FOR SELECTED COLOUR
|--------------------------------------------------------------------------
*/
export const getColorImages = (
  product: Product,
  color?: string,
): { front: string; back?: string } => {
  const catalogProduct = product as CatalogProduct;
  /*
   * First check our custom colour configuration.
   */
  if (
    color &&
    catalogProduct.colorImages?.[color]
  ) {
    return {
      front:
        catalogProduct.colorImages[color].front ||
        productImage(product),
      back:
        catalogProduct.colorImages[color].back,
    };
  }
  /*
   * If there is no custom colour configuration,
   * use the normal product image.
   */
  return {
    front: productImage(product),
  };
};