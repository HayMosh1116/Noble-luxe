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

/* Existing products */

const LACE_SHIRT_FRONT =
  'https://i.ibb.co/fYtNVKtn/9-VHf-MPa-Kpt.jpg';

const LACE_SHIRT_BACK =
  'https://i.ibb.co/cXS0gMH5/a91ku7-Hd-Xw.jpg';

const ROUND_NECK_2_FRONT =
  'https://i.ibb.co/v4x3TdD7/w-Rw-Ai6upb0.jpg';

const ROUND_NECK_2_BACK =
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

/* New products */

const HOODIE_FRONT =
  'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg';

const HOODIE_BACK =
  'https://i.ibb.co/tTMqjXmG/w-UIs-AX27v-A.jpg';

const JOGGERS_1_FRONT =
  'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg';

const JOGGERS_1_BACK =
  'https://i.ibb.co/bgh0qRbq/IZJsk-Ghb-I4.jpg';

const BASIC_TOP_FRONT =
  'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg';

const BASIC_TOP_BACK =
  'https://i.ibb.co/TxpTRCvf/O92i-O39-IIb.jpg';

const JOGGERS_2_FRONT =
  'https://i.ibb.co/Psvkgbhc/1eub-P95-Jdm.jpg';

const JOGGERS_2_BACK =
  'https://i.ibb.co/bML04kTy/Hw-Kky0-RDu7.jpg';

const SHORT_JOGGERS_FRONT =
  'https://i.ibb.co/TyqNfsr/zbg7-Z1-IOKq.jpg';

const SHORT_JOGGERS_BACK =
  'https://i.ibb.co/6JWg2BSS/j-U68x2fx-Ou.jpg';

const ROUND_NECK_1_MULTI_FRONT =
  'https://i.ibb.co/8LF1cfHT/jo9qk-Syrn9.jpg';

const ROUND_NECK_1_MULTI_BACK =
  'https://i.ibb.co/whBz5DR9/qec-V4or-ZNT.jpg';

const ROUND_NECK_1_BLACK_A_FRONT =
  'https://i.ibb.co/PvF0mSXk/o-Vcv-Xs1-Alh.jpg';

const ROUND_NECK_1_BLACK_A_BACK =
  'https://i.ibb.co/8nsY80TX/LG387-Ras-Jl.jpg';

const ROUND_NECK_1_BLACK_B_FRONT =
  'https://i.ibb.co/DDXxnCtL/ESn-FW5-Ejcj.jpg';

const ROUND_NECK_1_BLACK_B_BACK =
  'https://i.ibb.co/QjfkFR5B/PZo-EBNSFjb.jpg';

/*
 * =========================================================
 * AVAILABLE COLOURS
 * =========================================================
 */

const roundNeck2Colors = [
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

const hoodieColors = [
  'Orange',
  'Cream',
];

const joggers1Colors = [
  'Black',
  'Red',
  'Ash',
  'Navy Blue',
];

const basicTopColors = [
  'Pink',
  'Black',
  'White',
  'Brown',
];

const joggers2Colors = [
  'Red',
  'Black',
  'Navy Blue',
];

const shortJoggersColors = [
  'Blue',
  'Red',
  'Black',
  'Navy Blue',
];

const roundNeck1Colors = [
  'Brown',
  'White',
  'Pink',
  'Black',
];

/*
 * =========================================================
 * CATALOGUE
 * =========================================================
 */

export const FALLBACK_PRODUCTS: CatalogProduct[] = [
  /*
   * -------------------------------------------------------
   * NL-001
   * -------------------------------------------------------
   */

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

  /*
   * -------------------------------------------------------
   * NL-002
   * -------------------------------------------------------
   */

  {
    id: 'nl-002',
    name: 'NL Round-Neck 2',
    category: 'T-Shirts',
    price: 11000,
    imageUrl: ROUND_NECK_2_FRONT,
    description:
      'A clean Noble Luxe round-neck piece available in multiple colours.',
    sizes: ['XL', 'XXL'],
    colors: roundNeck2Colors,
    featured: true,
    colorImages: Object.fromEntries(
      roundNeck2Colors.map((color) => [
        color,
        {
          name: color,
          front: ROUND_NECK_2_FRONT,
          back: ROUND_NECK_2_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-003
   * -------------------------------------------------------
   */

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

  /*
   * -------------------------------------------------------
   * NL-004
   * -------------------------------------------------------
   */

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

  /*
   * -------------------------------------------------------
   * NL-005
   * -------------------------------------------------------
   */

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

  /*
   * -------------------------------------------------------
   * NL-006 — HOODIE
   * -------------------------------------------------------
   */

  {
    id: 'nl-006',
    name: 'NL Hoodie',
    category: 'Hoodies',
    price: 16000,
    imageUrl: HOODIE_FRONT,
    description:
      'A statement Noble Luxe hoodie with a clean front and distinctive back finish.',
    sizes: ['XL', 'XXL'],
    colors: hoodieColors,
    featured: true,
    colorImages: Object.fromEntries(
      hoodieColors.map((color) => [
        color,
        {
          name: color,
          front: HOODIE_FRONT,
          back: HOODIE_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-007 — JOGGERS 1
   * -------------------------------------------------------
   */

  {
    id: 'nl-007',
    name: 'NL Joggers 1',
    category: 'Joggers',
    price: 14000,
    imageUrl: JOGGERS_1_FRONT,
    description:
      'Noble Luxe joggers built for a relaxed streetwear silhouette.',
    sizes: ['XL', 'XXL'],
    colors: joggers1Colors,
    featured: true,
    colorImages: Object.fromEntries(
      joggers1Colors.map((color) => [
        color,
        {
          name: color,
          front: JOGGERS_1_FRONT,
          back: JOGGERS_1_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-008 — BASIC TOP
   * -------------------------------------------------------
   */

  {
    id: 'nl-008',
    name: 'NL Basic Top',
    category: 'Tops',
    price: 8000,
    imageUrl: BASIC_TOP_FRONT,
    description:
      'A clean Noble Luxe basic top available in four versatile colours.',
    sizes: ['XL', 'XXL'],
    colors: basicTopColors,
    featured: false,
    colorImages: Object.fromEntries(
      basicTopColors.map((color) => [
        color,
        {
          name: color,
          front: BASIC_TOP_FRONT,
          back: BASIC_TOP_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-009 — JOGGERS 2
   * -------------------------------------------------------
   */

  {
    id: 'nl-009',
    name: 'NL Joggers 2',
    category: 'Joggers',
    price: 14000,
    imageUrl: JOGGERS_2_FRONT,
    description:
      'A second Noble Luxe joggers silhouette with a refined front and back finish.',
    sizes: ['XL', 'XXL'],
    colors: joggers2Colors,
    featured: false,
    colorImages: Object.fromEntries(
      joggers2Colors.map((color) => [
        color,
        {
          name: color,
          front: JOGGERS_2_FRONT,
          back: JOGGERS_2_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-010 — SHORT JOGGERS
   * -------------------------------------------------------
   */

  {
    id: 'nl-010',
    name: 'NL Short Joggers',
    category: 'Shorts',
    price: 9000,
    imageUrl: SHORT_JOGGERS_FRONT,
    description:
      'Relaxed Noble Luxe short joggers designed for everyday streetwear.',
    sizes: ['XL', 'XXL'],
    colors: shortJoggersColors,
    featured: false,
    colorImages: Object.fromEntries(
      shortJoggersColors.map((color) => [
        color,
        {
          name: color,
          front: SHORT_JOGGERS_FRONT,
          back: SHORT_JOGGERS_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-011 — ROUND NECK 1 MULTI
   * -------------------------------------------------------
   */

  {
    id: 'nl-011',
    name: 'NL Round Neck 1',
    category: 'T-Shirts',
    price: 11000,
    imageUrl: ROUND_NECK_1_MULTI_FRONT,
    description:
      'A Noble Luxe round-neck essential available in brown, white, pink and black.',
    sizes: ['XL', 'XXL'],
    colors: roundNeck1Colors,
    featured: true,
    colorImages: Object.fromEntries(
      roundNeck1Colors.map((color) => [
        color,
        {
          name: color,
          front: ROUND_NECK_1_MULTI_FRONT,
          back: ROUND_NECK_1_MULTI_BACK,
        },
      ]),
    ),
  },

  /*
   * -------------------------------------------------------
   * NL-012 — ROUND NECK 1 BLACK A
   * -------------------------------------------------------
   */

  {
    id: 'nl-012',
    name: 'NL Round Neck 1',
    category: 'T-Shirts',
    price: 11000,
    imageUrl: ROUND_NECK_1_BLACK_A_FRONT,
    description:
      'Noble Luxe round-neck black edition with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: false,
    colorImages: {
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_A_FRONT,
        back: ROUND_NECK_1_BLACK_A_BACK,
      },
    },
  },

  /*
   * -------------------------------------------------------
   * NL-013 — ROUND NECK 1 BLACK B
   * -------------------------------------------------------
   */

  {
    id: 'nl-013',
    name: 'NL Round Neck 1',
    category: 'T-Shirts',
    price: 11000,
    imageUrl: ROUND_NECK_1_BLACK_B_FRONT,
    description:
      'Noble Luxe round-neck black edition with another signature front and back finish.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: false,
    colorImages: {
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_B_FRONT,
        back: ROUND_NECK_1_BLACK_B_BACK,
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
  const catalogProduct =
    product as CatalogProduct;

  if (catalogProduct.colorImages) {
    return Object.values(
      catalogProduct.colorImages,
    );
  }

  return (product.colors || []).map(
    (color) => ({
      name: color,
      front:
        product.imageUrl ||
        FALLBACK_PRODUCTS[0].imageUrl,
    }),
  );
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
  const catalogProduct =
    product as CatalogProduct;

  const colors =
    catalogProduct.colorImages;

  if (
    colors &&
    color &&
    colors[color]
  ) {
    return {
      front: colors[color].front,
      back: colors[color].back,
    };
  }

  if (colors) {
    const firstColor =
      Object.values(colors)[0];

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
    (item) =>
      item.id === product.id,
  )?.imageUrl ||
  FALLBACK_PRODUCTS[0].imageUrl;
