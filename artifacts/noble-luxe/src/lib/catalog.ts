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

/* =========================================================
   PRODUCT IMAGES
   ========================================================= */

const HOODIE_FRONT =
  'https://i.ibb.co/qLYHR0DP/Qcct5d-JUA5.jpg';

const HOODIE_BACK =
  'https://i.ibb.co/tTMqjXmG/w-UIs-AX27v-A.jpg';

const JOGGERS_FRONT =
  'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg';

const JOGGERS_BACK =
  'https://i.ibb.co/bgh0qRbq/IZJsk-Ghb-I4.jpg';

const GIRLS_TOP_FRONT =
  'https://i.ibb.co/HLKZWS68/I5kw-WDymih.jpg';

const GIRLS_TOP_BACK =
  'https://i.ibb.co/TxpTRCvf/O92i-O39-IIb.jpg';

/* =========================================================
   NOBLE LUXE LOCAL CATALOGUE
   ========================================================= */

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

  {
    id: 'nl-002',
    name: 'Atelier 03 Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl: HOODIE_FRONT,
    description:
      'Heavyweight brushed cotton with an offset monogram and a softly structured hood.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    featured: true,

    colorImages: {
      Black: {
        name: 'Black',
        front: HOODIE_FRONT,
        back: HOODIE_BACK,
      },
    },
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

  /* =========================================================
     NEW PRODUCTS
     ========================================================= */

  {
    id: 'nl-007',
    name: 'Noble Luxe Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl: HOODIE_FRONT,
    description:
      'A signature Noble Luxe hoodie with a clean silhouette and heavyweight streetwear finish.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    featured: true,

    colorImages: {
      Black: {
        name: 'Black',
        front: HOODIE_FRONT,
        back: HOODIE_BACK,
      },
    },
  },

  {
    id: 'nl-008',
    name: 'Noble Luxe Joggers',
    category: 'Trousers',
    price: 65000,
    imageUrl: JOGGERS_FRONT,
    description:
      'Relaxed Noble Luxe joggers designed for a clean, comfortable streetwear silhouette.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black'],
    featured: true,

    colorImages: {
      Black: {
        name: 'Black',
        front: JOGGERS_FRONT,
        back: JOGGERS_BACK,
      },
    },
  },

  {
    id: 'nl-009',
    name: "Noble Luxe Girl's Top",
    category: 'Essentials',
    price: 45000,
    imageUrl: GIRLS_TOP_FRONT,
    description:
      'A refined Noble Luxe top with a clean silhouette and statement finish.',
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    featured: true,

    colorImages: {
      Black: {
        name: 'Black',
        front: GIRLS_TOP_FRONT,
        back: GIRLS_TOP_BACK,
      },
    },
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

/* =========================================================
   GET PRODUCT COLOURS
   ========================================================= */

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

/* =========================================================
   GET SELECTED COLOUR IMAGES
   ========================================================= */

export const getColorImages = (
  product: Product,
  color?: string,
): { front: string; back?: string } => {
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

/* =========================================================
   MAIN PRODUCT IMAGE
   ========================================================= */

export const productImage = (
  product: Product,
): string =>
  product.imageUrl ||
  FALLBACK_PRODUCTS.find(
    (item) => item.id === product.id,
  )?.imageUrl ||
  FALLBACK_PRODUCTS[0].imageUrl;