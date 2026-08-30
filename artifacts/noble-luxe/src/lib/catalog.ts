import type { Product } from '@workspace/api-client-react';

export type CartItem = Product & {
  selectedSize: string;
  selectedColor?: string;
  selectedColorFront?: string;
  selectedColorBack?: string;
  quantity: number;
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
 * =========================================================
 * NOBLE LUXE IMAGE CATALOG
 * =========================================================
 */

const LACE_SHIRT_FRONT =
  'https://i.ibb.co/fYtNVKtn/9-VHf-MPa-Kpt.jpg';

const LACE_SHIRT_BACK =
  'https://i.ibb.co/cXS0gMH5/a91ku7-Hd-Xw.jpg';

const ROUND_NECK_FRONT =
  'https://i.ibb.co/v4x3TdD7/w-Rw-Ai6upb0.jpg';

const ROUND_NECK_BACK =
  'https://i.ibb.co/MxVZPtF3/k3f-K3-Iq6-JK.jpg';

const SWEAT_SHIRT_FRONT =
  'https://i.ibb.co/pjcvhvxM/0-Np-YFBt-Un9.jpg';

const SWEAT_SHIRT_BACK =
  'https://i.ibb.co/XxBmfwwK/xs-HBVXd-OKU.jpg';

const VINTAGE_FRONT =
  'https://i.ibb.co/hRfWwNvK/9-Xjth-WBYX4.jpg';

const VINTAGE_BACK =
  'https://i.ibb.co/0RggLFq8/v-Su-Io-V73-DJ.jpg';

const ARMLESS_FRONT =
  'https://i.ibb.co/yBs58tVF/ZUj-Onk-Zz1-M.jpg';

const ARMLESS_BACK =
  'https://i.ibb.co/MxZL0xcG/kv-Xv3i-NFLd.jpg';

/*
 * =========================================================
 * AVAILABLE COLOURS
 *
 * These colours are selectable even when separate image
 * URLs have not been supplied.
 *
 * The product image remains visible while the chosen
 * colour is saved with the customer's order.
 * =========================================================
 */

const roundNeckColors = [
  'Black',
  'White',
  'Purple',
  'Brown',
  'Ash',
  'Sky Blue',
  'Carton Brown',
];

const sweatShirtColors = [
  'Army Green',
  'Mint Green',
  'Orange',
];

const armlessColors = [
  'Black',
];

/*
 * =========================================================
 * CATALOGUE
 * =========================================================
 */

export const FALLBACK_PRODUCTS: CatalogProduct[] = [
  {
    id: 'nl-001',
    name: 'Lace Shirt',
    category: 'Tops',
    price: 10000,
    imageUrl: LACE_SHIRT_FRONT,
    description:
      'A refined Noble Luxe lace shirt with a distinctive front and back finish.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: LACE_SHIRT_FRONT,
        back: LACE_SHIRT_BACK,
      },
    },
  },

  {
    id: 'nl-002',
    name: 'NL Round-Neck 2',
    category: 'T-Shirts',
    price: 11000,
    imageUrl: ROUND_NECK_FRONT,
    description:
      'A clean Noble Luxe round-neck piece available in multiple colours.',
    sizes: ['XL', 'XXL'],
    colors: roundNeckColors,
    featured: true,
    colorImages: Object.fromEntries(
      roundNeckColors.map((color) => [
        color,
        {
          name: color,
          front: ROUND_NECK_FRONT,
          back: ROUND_NECK_BACK,
        },
      ]),
    ),
  },

  {
    id: 'nl-003',
    name: 'NL Sweat Shirt',
    category: 'Sweatshirts',
    price: 13000,
    imageUrl: SWEAT_SHIRT_FRONT,
    description:
      'A comfortable Noble Luxe sweatshirt offered in statement seasonal colours.',
    sizes: ['XL', 'XXL'],
    colors: sweatShirtColors,
    featured: true,
    colorImages: Object.fromEntries(
      sweatShirtColors.map((color) => [
        color,
        {
          name: color,
          front: SWEAT_SHIRT_FRONT,
          back: SWEAT_SHIRT_BACK,
        },
      ]),
    ),
  },

  {
    id: 'nl-004',
    name: 'NL Vintage',
    category: 'T-Shirts',
    price: 8000,
    imageUrl: VINTAGE_FRONT,
    description:
      'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: VINTAGE_FRONT,
        back: VINTAGE_BACK,
      },
    },
  },

  {
    id: 'nl-005',
    name: 'NL Armless',
    category: 'Tops',
    price: 11000,
    imageUrl: ARMLESS_FRONT,
    description:
      'A clean Noble Luxe armless piece designed for a relaxed streetwear fit.',
    sizes: ['XL', 'XXL'],
    colors: armlessColors,
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: ARMLESS_FRONT,
        back: ARMLESS_BACK,
      },
    },
  },
];

/*
 * =========================================================
 * CURRENCY
 * =========================================================
 */

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

/*
 * =========================================================
 * PRODUCT COLOURS
 * =========================================================
 */

export const getProductColors = (
  product: Product,
): CatalogColor[] => {
  const catalogProduct = product as CatalogProduct;

  if (catalogProduct.colorImages) {
    return Object.values(catalogProduct.colorImages);
  }

  return (product.colors || []).map((color) => ({
    name: color,
    front:
      product.imageUrl ||
      FALLBACK_PRODUCTS[0].imageUrl,
  }));
};

/*
 * =========================================================
 * FRONT / BACK IMAGE
 * =========================================================
 */

export const getColorImages = (
  product: Product,
  color?: string,
): {
  front: string;
  back?: string;
} => {
  const catalogProduct = product as CatalogProduct;
  const colors = catalogProduct.colorImages;

  if (colors && color && colors[color]) {
    return {
      front: colors[color].front,
      back: colors[color].back,
    };
  }

  if (colors) {
    const firstColor = Object.values(colors)[0];

    if (firstColor) {
      return {
        front: firstColor.front,
        back: firstColor.back,
      };
    }
  }

  return {
    front:
      product.imageUrl ||
      FALLBACK_PRODUCTS[0].imageUrl,
  };
};

/*
 * =========================================================
 * MAIN PRODUCT IMAGE
 * =========================================================
 */

export const productImage = (
  product: Product,
): string =>
  product.imageUrl ||
  FALLBACK_PRODUCTS.find(
    (item) => item.id === product.id,
  )?.imageUrl ||
  FALLBACK_PRODUCTS[0].imageUrl;