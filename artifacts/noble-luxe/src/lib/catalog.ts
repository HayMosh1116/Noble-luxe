import { apiUrl } from '@/lib/api-base';

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

export type CollectionName =
  | 'All Pieces'
  | 'Joggers'
  | 'Basic Tops'
  | 'Round Necks'
  | 'Short Joggers'
  | 'Vintage'
  | 'Lace Shirts'
  | 'Hoodies';

export const NOBLE_COLLECTIONS: CollectionName[] = [
  'All Pieces',
  'Joggers',
  'Basic Tops',
  'Round Necks',
  'Short Joggers',
  'Vintage',
  'Lace Shirts',
  'Hoodies',
];

export type CatalogProduct = Product & {
  collection: Exclude<CollectionName, 'All Pieces'>;
  stock: number;
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

const JOGGERS_1_FRONT =
  'https://i.ibb.co/YFR5bGd2/jboafl7g-GJ.jpg';

const JOGGERS_1_BACK =
  'https://i.ibb.co/bgh0qRbq/IZJsk-Ghb-I4.jpg';

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

const ROUND_NECK_1_WHITE_A_FRONT =
  'https://i.ibb.co/QVZwbDt/Lm-K96y-Ho35.jpg';

const ROUND_NECK_1_WHITE_A_BACK =
  'https://i.ibb.co/ym6SxsTw/2-Wd9nmnl6k.jpg';

const ROUND_NECK_1_WHITE_B_FRONT =
  'https://i.ibb.co/QVZwbDt/Lm-K96y-Ho35.jpg';

const ROUND_NECK_1_WHITE_B_BACK =
  'https://i.ibb.co/v4TZ07Lk/Ira-Dw-XMzg-V.jpg';

const VINTAGETM_FRONT =
  'https://i.ibb.co/LDLTpJrb/cv-QDVa6-U3-L.jpg';

const VINTAGETM_BACK =
  'https://i.ibb.co/nsbPdZCs/t-XGD7t-Lf-Zr.jpg';

const VINTAGEBWY_FRONT =
  'https://i.ibb.co/8DCDG6pF/j8b874mh-B4.jpg';

const VINTAGEBWY_BACK =
  'https://i.ibb.co/QFzXr054/jk-Lg-IEy-M3j.jpg';

const VINTAGEBOOM_FRONT =
  'https://i.ibb.co/Gf8wXNjV/Hgix-I8362-P.jpg';

const VINTAGEBOOM_BACK =
  'https://i.ibb.co/VcJ47dPL/x-Pt-W7-SAbj9.jpg';

const VINTAGEBG_FRONT =
  'https://i.ibb.co/XrxRQ7SC/8-Iy3-Kkrc-Lx.jpg';

const VINTAGEBG_BACK =
  'https://i.ibb.co/gFPCV8B7/0-Hf-HYf-Fe-GV.jpg';

/*
 * =========================================================
 * AVAILABLE COLOURS
 * =========================================================
 */

const roundNeck2Colors = [
  'Black',
  'Purple',
  'Brown',
  'Ash',
  'Sky Blue',
  'Carton Brown',
];

const sweatShirtColors = [
  'Mint Green',
  'Orange',
];

/*
 * =========================================================
 * NOBLE LUXE MASTER PRODUCT CATALOG
 *
 * TO ADD OR CHANGE PRODUCTS IN CODE:
 * Every product contains:
 * - id: unique ID (e.g. 'nl-001')
 * - name: product name
 * - collection: 'Joggers' | 'Basic Tops' | 'Round Necks' | 'Short Joggers' | 'Vintage' | 'Lace Shirts' | 'Hoodies'
 * - price: price in NGN
 * - stock: available inventory count (0 = Out of Stock)
 * - imageUrl: image URL
 * - description: description text
 * - sizes: available sizes ['XL', 'XXL', etc.]
 * - colors: available colors
 * =========================================================
 */

export const DEFAULT_PRODUCTS: CatalogProduct[] = [

  /*
   * -------------------------------------------------------
   * 2. ROUND NECKS
   * -------------------------------------------------------
   */
  {
    id: 'nl-002',
    name: 'NL Round-Neck 2',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 12000,
    stock: 15,
    imageUrl: ROUND_NECK_2_FRONT,
    description: 'A clean Noble Luxe round-neck piece available in multiple colours.',
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
  {
    id: 'nl-011',
    name: 'NL Round Neck 1 (All Man)',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 11000,
    stock: 12,
    imageUrl: ROUND_NECK_1_MULTI_FRONT,
    description: 'Signature graphic round neck piece crafted for luxury streetwear.',
    sizes: ['XL', 'XXL'],
    colors: ['Multi', 'White', 'Black'],
    featured: true,
    colorImages: {
      Multi: {
        name: 'Multi',
        front: ROUND_NECK_1_MULTI_FRONT,
        back: ROUND_NECK_1_MULTI_BACK,
      },
      White: {
        name: 'White',
        front: ROUND_NECK_1_WHITE_A_FRONT,
        back: ROUND_NECK_1_WHITE_A_BACK,
      },
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_A_FRONT,
        back: ROUND_NECK_1_BLACK_A_BACK,
      },
    },
  },
  {
    id: 'nl-012',
    name: 'NL Round Neck 1(Chasing the bag)',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 11000,
    stock: 8,
    imageUrl: ROUND_NECK_1_BLACK_A_FRONT,
    description: 'Distinctive street luxury graphic tee with front and back print.',
    sizes: ['XL', 'XXL'],
    colors: ['Black', 'White'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_A_FRONT,
        back: ROUND_NECK_1_BLACK_A_BACK,
      },
      White: {
        name: 'White',
        front: ROUND_NECK_1_WHITE_A_FRONT,
        back: ROUND_NECK_1_WHITE_A_BACK,
      },
    },
  },
  {
    id: 'nl-013',
    name: 'NL Round Neck 1(Disturbing yankee)',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 11000,
    stock: 9,
    imageUrl: ROUND_NECK_1_BLACK_B_FRONT,
    description: 'Standout design piece from the exclusive Noble Luxe collection.',
    sizes: ['XL', 'XXL'],
    colors: ['Black', 'White'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_B_FRONT,
        back: ROUND_NECK_1_BLACK_B_BACK,
      },
      White: {
        name: 'White',
        front: ROUND_NECK_1_WHITE_B_FRONT,
        back: ROUND_NECK_1_WHITE_B_BACK,
      },
    },
  },
  {
    id: 'nl-014',
    name: 'NL Round Neck 1 (Never Give Up)',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 11000,
    stock: 14,
    imageUrl: ROUND_NECK_1_WHITE_A_FRONT,
    description: 'Inspirational luxury round-neck with detailed craftsmanship.',
    sizes: ['XL', 'XXL'],
    colors: ['White', 'Black'],
    featured: true,
    colorImages: {
      White: {
        name: 'White',
        front: ROUND_NECK_1_WHITE_A_FRONT,
        back: ROUND_NECK_1_WHITE_A_BACK,
      },
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_A_FRONT,
        back: ROUND_NECK_1_BLACK_A_BACK,
      },
    },
  },
  {
    id: 'nl-015',
    name: 'NL Round Neck 1 (Rich Friends)',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 11000,
    stock: 10,
    imageUrl: ROUND_NECK_1_WHITE_B_FRONT,
    description: 'Bold statement piece crafted from heavyweight luxury cotton.',
    sizes: ['XL', 'XXL'],
    colors: ['White', 'Black'],
    featured: true,
    colorImages: {
      White: {
        name: 'White',
        front: ROUND_NECK_1_WHITE_B_FRONT,
        back: ROUND_NECK_1_WHITE_B_BACK,
      },
      Black: {
        name: 'Black',
        front: ROUND_NECK_1_BLACK_B_FRONT,
        back: ROUND_NECK_1_BLACK_B_BACK,
      },
    },
  },

  /*
   * -------------------------------------------------------
   * 3. HOODIES / SWEATSHIRTS
   * -------------------------------------------------------
   */
  {
    id: 'nl-003',
    name: 'NL Sweat Shirt & Hoodie',
    collection: 'Hoodies',
    category: 'Hoodies',
    price: 14000,
    stock: 10,
    imageUrl: SWEAT_SHIRT_FRONT,
    description: 'A comfortable Noble Luxe sweatshirt offered in statement seasonal colours.',
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
   * 4. VINTAGE
   * -------------------------------------------------------
   */
  {
    id: 'nl-004',
    name: 'NL Vintage(BWGO)',
    collection: 'Vintage',
    category: 'Vintage',
    price: 9000,
    stock: 8,
    imageUrl: VINTAGE_FRONT,
    description: 'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
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
    id: 'nl-016',
    name: 'NL Vintage(TM)',
    collection: 'Vintage',
    category: 'Vintage',
    price: 9000,
    stock: 12,
    imageUrl: VINTAGETM_FRONT,
    description: 'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: VINTAGETM_FRONT,
        back: VINTAGETM_BACK,
      },
    },
  },
  {
    id: 'nl-017',
    name: 'NL Vintage(BWY)',
    collection: 'Vintage',
    category: 'Vintage',
    price: 9000,
    stock: 7,
    imageUrl: VINTAGEBWY_FRONT,
    description: 'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: VINTAGEBWY_FRONT,
        back: VINTAGEBWY_BACK,
      },
    },
  },
  {
    id: 'nl-22',
    name: 'NL Vintage(BOOM)',
    collection: 'Vintage',
    category: 'Vintage',
    price: 9000,
    stock: 15,
    imageUrl: VINTAGEBOOM_FRONT,
    description: 'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: VINTAGEBOOM_FRONT,
        back: VINTAGEBOOM_BACK,
      },
    },
  },
  {
    id: 'nl-23',
    name: 'NL Vintage(BG)',
    collection: 'Vintage',
    category: 'Vintage',
    price: 9000,
    stock: 6,
    imageUrl: VINTAGEBG_FRONT,
    description: 'A vintage-inspired Noble Luxe piece with a distinctive front and back design.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: VINTAGEBG_FRONT,
        back: VINTAGEBG_BACK,
      },
    },
  },

  /*
   * -------------------------------------------------------
   * 5. BASIC TOPS
   * -------------------------------------------------------
   */
  {
    id: 'nl-005',
    name: 'NL Armless Basic Top',
    collection: 'Basic Tops',
    category: 'Basic Tops',
    price: 11000,
    stock: 11,
    imageUrl: ARMLESS_FRONT,
    description: 'A clean Noble Luxe armless piece designed for a relaxed streetwear fit.',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
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
   * 6. JOGGERS
   * -------------------------------------------------------
   */
  {
    id: 'nl-007',
    name: 'NL Joggers 1',
    collection: 'Joggers',
    category: 'Joggers',
    price: 15000,
    stock: 10,
    imageUrl: JOGGERS_1_FRONT,
    description: 'Heavyweight premium joggers with customized Noble Luxe tailoring.',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: JOGGERS_1_FRONT,
        back: JOGGERS_1_BACK,
      },
    },
  },
  {
    id: 'nl-009',
    name: 'NL Joggers 2',
    collection: 'Joggers',
    category: 'Joggers',
    price: 15000,
    stock: 8,
    imageUrl: JOGGERS_2_FRONT,
    description: 'Relaxed fit luxury fleece joggers with signature silhouette.',
    sizes: ['L', 'XL', 'XXL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: JOGGERS_2_FRONT,
        back: JOGGERS_2_BACK,
      },
    },
  },

  /*
   * -------------------------------------------------------
   * 7. SHORT JOGGERS
   * -------------------------------------------------------
   */
  {
    id: 'nl-010',
    name: 'NL Short Joggers',
    collection: 'Short Joggers',
    category: 'Short Joggers',
    price: 12000,
    stock: 14,
    imageUrl: SHORT_JOGGERS_FRONT,
    description: 'Comfortable luxury short joggers designed for daily casual wear.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Black'],
    featured: true,
    colorImages: {
      Black: {
        name: 'Black',
        front: SHORT_JOGGERS_FRONT,
        back: SHORT_JOGGERS_BACK,
      },
    },
  },
];

export const FALLBACK_PRODUCTS: CatalogProduct[] = DEFAULT_PRODUCTS;

/*
 * =========================================================
 * DATABASE-BACKED CATALOG ACCESS
 * =========================================================
 * The backend/database is the single source of truth for
 * products, prices, collections and stock. Nothing product
 * related is stored in localStorage anymore.
 */

export const fetchLiveCatalog = async (): Promise<CatalogProduct[]> => {
  const res = await fetch(apiUrl('/api/products'));
  if (!res.ok) throw new Error('Failed to load products');
  const data = (await res.json()) as CatalogProduct[];
  if (!Array.isArray(data) || data.length === 0) {
    return DEFAULT_PRODUCTS;
  }
  return data;
};

export const refreshCatalogEvent = (): void => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('noble_luxe_catalog_updated'));
};

const adminHeaders = (pin: string): HeadersInit => ({
  'Content-Type': 'application/json',
  'x-admin-pin': pin,
});

/*
 * =========================================================
 * ADMIN API (PIN VERIFIED SERVER-SIDE)
 * =========================================================
 */

export const verifyAdminPin = async (
  pin: string,
): Promise<{ valid: boolean; error?: string }> => {
  const res = await fetch(apiUrl('/api/admin/verify-pin'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  });
  if (res.ok) return { valid: true };
  const data = await res.json().catch(() => ({}));
  return { valid: false, error: data.error || 'Incorrect admin PIN.' };
};

export const apiUpdateProductStock = async (
  pin: string,
  productId: string,
  stock: number,
): Promise<CatalogProduct> => {
  const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(productId)}/stock`), {
    method: 'PATCH',
    headers: adminHeaders(pin),
    body: JSON.stringify({ stock }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update stock.');
  return data.product as CatalogProduct;
};

export const apiCreateProduct = async (
  pin: string,
  product: Omit<CatalogProduct, 'id'> & { id?: string },
): Promise<CatalogProduct> => {
  const res = await fetch(apiUrl('/api/products'), {
    method: 'POST',
    headers: adminHeaders(pin),
    body: JSON.stringify(product),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to add product.');
  return data.product as CatalogProduct;
};

export const apiUpdateProduct = async (
  pin: string,
  productId: string,
  changes: Partial<CatalogProduct>,
): Promise<CatalogProduct> => {
  const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(productId)}`), {
    method: 'PATCH',
    headers: adminHeaders(pin),
    body: JSON.stringify(changes),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to update product.');
  return data.product as CatalogProduct;
};


export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  previousStock: number;
  newStock: number;
  changeType: string;
  reason?: string | null;
  createdAt: string;
}

export const apiFetchInventoryLogs = async (pin: string): Promise<InventoryLog[]> => {
  const res = await fetch(apiUrl("/api/admin/inventory/logs"), {
    headers: adminHeaders(pin),
  });
  const data = await res.json().catch(() => []);
  if (!res.ok) {
    throw new Error(data.error || "Failed to load inventory audit logs.");
  }
  return data as InventoryLog[];
};

export const apiDeleteProduct = async (
  pin: string,
  productId: string,
): Promise<void> => {
  const res = await fetch(apiUrl(`/api/products/${encodeURIComponent(productId)}`), {
    method: 'DELETE',
    headers: adminHeaders(pin),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to delete product.');
  }
};

export const apiSaveCart = async (
  isSignedIn: boolean,
  items: CartItem[],
): Promise<void> => {
  if (!isSignedIn) return;
  const res = await fetch(apiUrl('/api/cart'), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  if (!res.ok) throw new Error('Failed to save bag');
};

export const apiLoadCart = async (): Promise<CartItem[]> => {
  const res = await fetch(apiUrl('/api/cart'));
  if (!res.ok) return [];
  return (await res.json()) as CartItem[];
};

export const apiClearCart = async (): Promise<void> => {
  const res = await fetch(apiUrl('/api/cart'), { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to clear bag');
};

/*
 * =========================================================
 * UTILITIES
 * =========================================================
 */

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(value);

export const getProductColors = (
  product: Product,
): CatalogColor[] => {
  const catalogProduct = product as CatalogProduct;

  if (catalogProduct.colorImages) {
    return Object.values(catalogProduct.colorImages);
  }

  return (product.colors || []).map((color) => ({
    name: color,
    front: product.imageUrl || FALLBACK_PRODUCTS[0].imageUrl,
  }));
};

export const getColorImages = (
  product: Product,
  selectedColorName?: string,
): { front: string; back?: string } => {
  const catalogProduct = product as CatalogProduct;

  if (!catalogProduct.colorImages) {
    return {
      front: product.imageUrl || FALLBACK_PRODUCTS[0].imageUrl,
      back: undefined,
    };
  }

  if (selectedColorName && catalogProduct.colorImages[selectedColorName]) {
    const item = catalogProduct.colorImages[selectedColorName];
    return {
      front: item.front,
      back: item.back,
    };
  }

  const first = Object.values(catalogProduct.colorImages)[0];
  if (first) {
    return {
      front: first.front,
      back: first.back,
    };
  }

  return {
    front: product.imageUrl || FALLBACK_PRODUCTS[0].imageUrl,
    back: undefined,
  };
};

export const productImage = (
  product: Product,
  selectedColorName?: string,
): string => {
  return getColorImages(product, selectedColorName).front;
};
