import type { Product } from '@workspace/api-client-react';
export type CartItem = Product & {
  selectedSize: string;
  quantity: number;
};
/**
 * Product image variants
 *
 * EDIT THIS SECTION WHEN YOU WANT TO:
 * - Add a new color
 * - Remove a color
 * - Change a front image
 * - Change a back image
 *
 * Example:
 *
 * colors: {
 *   Blue: {
 *     front: 'FRONT IMAGE URL',
 *     back: 'BACK IMAGE URL',
 *   },
 *   Black: {
 *     front: 'BLACK FRONT URL',
 *     back: 'BLACK BACK URL',
 *   },
 * }
 */
export type ProductColorVariant = {
  front: string;
  back?: string;
};
export type ProductVisualVariants = {
  colors: Record<string, ProductColorVariant>;
};
export const PRODUCT_VARIANTS: Record<string, ProductVisualVariants> = {
  'nl-007': {
    colors: {
      Blue: {
        front: 'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg',
        back: 'https://i.ibb.co/tTMqjXmG/w-UIs-AX27v-A.jpg',
      },
    },
  },
  'nl-008': {
    colors: {
      Black: {
        front: 'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg',
        back: 'https://i.ibb.co/bgh0qRbq/IZJsk-Ghb-I4.jpg',
      },
    },
  },
  'nl-009': {
    colors: {
      White: {
        front: 'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg',
        back: 'https://i.ibb.co/TxpTRCvf/O92i-O39-IIb.jpg',
      },
    },
  },
};
/**
 * Get the front image for a product.
 */
export const getProductFrontImage = (
  product: Product,
  color?: string,
): string => {
  const variants = PRODUCT_VARIANTS[product.id];
  if (variants) {
    const availableColors = Object.keys(variants.colors);
    const selectedColor =
      color && variants.colors[color]
        ? color
        : availableColors[0];
    if (selectedColor) {
      return variants.colors[selectedColor].front;
    }
  }
  return (
    product.imageUrl ||
    FALLBACK_PRODUCTS.find((item) => item.id === product.id)?.imageUrl ||
    FALLBACK_PRODUCTS[0].imageUrl
  );
};
/**
 * Get the back image for a product.
 */
export const getProductBackImage = (
  product: Product,
  color?: string,
): string | undefined => {
  const variants = PRODUCT_VARIANTS[product.id];
  if (!variants) return undefined;
  const availableColors = Object.keys(variants.colors);
  const selectedColor =
    color && variants.colors[color]
      ? color
      : availableColors[0];
  if (!selectedColor) return undefined;
  return variants.colors[selectedColor].back;
};
/**
 * Get available colors for a product.
 *
 * The local PRODUCT_VARIANTS configuration takes priority.
 * Otherwise we use the colors coming from the API product.
 */
export const getProductColors = (product: Product): string[] => {
  const variants = PRODUCT_VARIANTS[product.id];
  if (variants) {
    return Object.keys(variants.colors);
  }
  return product.colors?.length ? product.colors : [];
};
/**
 * Existing product image helper.
 */
export const productImage = (product: Product): string =>
  getProductFrontImage(product);
/**
 * Existing fallback catalogue.
 */
export const FALLBACK_PRODUCTS: Product[] = [
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
  {
    id: 'nl-002',
    name: 'Atelier 03 Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl:
      'https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Heavyweight brushed cotton with an offset monogram and a softly structured hood.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Carbon', 'Bone'],
    featured: true,
  },
  {
    id: 'nl-003',
    name: 'Monument Cargo Trouser',
    category: 'Trousers',
    price: 92500,
    imageUrl:
      'https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description:
      'Relaxed utility trousers with articulated knees, hidden hardware and a clean tapered break.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Coal'],
    featured: false,
  },
  {
    id: 'nl-004',
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
  {
    id: 'nl-005',
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
  {
    id: 'nl-006',
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
  /**
   * NEW PRODUCTS
   */
  {
    id: 'nl-007',
    name: 'Noble Signature Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl:
      'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg',
    description:
      'A heavyweight signature hoodie with a relaxed silhouette designed for everyday presence.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue'],
    featured: true,
  },
  {
    id: 'nl-008',
    name: 'Noble Relaxed Joggers',
    category: 'Trousers',
    price: 65000,
    imageUrl:
      'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg',
    description:
      'Relaxed-fit joggers designed with a clean silhouette and effortless everyday comfort.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    featured: false,
  },
  {
    id: 'nl-009',
    name: "Noble Women's Top",
    category: 'Essentials',
    price: 55000,
    imageUrl:
      'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg',
    description:
      'A refined everyday top with a clean silhouette and considered detailing.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['White'],
    featured: false,
  },
];
export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);
