import {
  Router,
  type IRouter,
  type Response,
} from "express";
import {
  CreateOrderBody,
  ListProductsQueryParams,
  ListProductsResponse,
  CreateOrderResponse,
} from "@workspace/api-zod";
import { db, ordersTable, productsTable, cartsTable, type InsertProductRow } from "@workspace/db";
import { getAuth } from "@clerk/express";
import { clerkClient } from "@clerk/express";
import { eq, desc, sql } from "drizzle-orm";
import {
  sendAdminNewOrderEmail,
  sendCustomerOrderConfirmationEmail,
  sendCustomerStatusEmail,
} from "../lib/mailer";

const router: IRouter = Router();
const PICKUP_LOCATION =
  "5 Alhaji Adegoke str, Baruwa, Ipaja, Lagos State";

const DEFAULT_ADMIN_PIN = "1116";

function getAdminConfiguredPin(): string {
  return (process.env.ADMIN_INVENTORY_PIN || DEFAULT_ADMIN_PIN).trim();
}

function getRequestAuth(req: Parameters<typeof getAuth>[0]) {
  if (!process.env.CLERK_SECRET_KEY) {
    return { userId: null, sessionClaims: null };
  }
  return getAuth(req);
}

async function isConfiguredAdmin(
  req: Parameters<typeof getAuth>[0],
): Promise<boolean> {
  // 1. Check x-admin-pin header against server secret
  const pinHeader = (req.headers["x-admin-pin"] as string | undefined)?.trim();
  const validPin = getAdminConfiguredPin();
  if (pinHeader && pinHeader === validPin) {
    return true;
  }

  // 2. Check Clerk authenticated user email
  const { userId } = getRequestAuth(req);
  if (!userId) {
    return false;
  }

  const configuredEmail = (
    process.env.ORDER_ADMIN_EMAIL || "ibrahimfridaous11@gmail.com"
  ).trim().toLowerCase();

  try {
    const user = await clerkClient.users.getUser(userId);
    const userEmails = user.emailAddresses.map((emailAddress) =>
      emailAddress.emailAddress.trim().toLowerCase(),
    );
    return userEmails.includes(configuredEmail);
  } catch (error) {
    req.log.error({ err: error, userId }, "Unable to verify configured admin");
    return false;
  }
}

/*
 * =========================================================
 * SEED CATALOG IN DATABASE IF EMPTY
 * =========================================================
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

const SEED_PRODUCTS = [
  /*
   * -------------------------------------------------------
   * 1. LACE SHIRTS
   * -------------------------------------------------------
   */
  {
    id: 'nl-001',
    name: 'NL Lace Shirt',
    collection: 'Lace Shirts',
    category: 'Lace Shirts',
    price: 10000,
    stock: 0,
    imageUrl: LACE_SHIRT_FRONT,
    description: 'A refined Noble Luxe lace shirt with a distinctive front and back finish.',
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
];;

let hasCheckedSeed = false;

async function ensureProductsSeeded() {
  if (hasCheckedSeed) return;
  try {
    const existing = await db.select({ id: productsTable.id }).from(productsTable).limit(1);
    if (existing.length === 0) {
      console.log("[DB] Seeding default products to noble_luxe_products...");
      for (const p of SEED_PRODUCTS) {
        await db.insert(productsTable).values({
          id: p.id,
          name: p.name,
          collection: p.collection || "Round Necks",
          category: p.category || "T-Shirts",
          price: p.price.toString(),
          stock: typeof p.stock === "number" ? p.stock : 10,
          imageUrl: p.imageUrl,
          description: p.description || "",
          sizes: p.sizes || ["XL", "XXL"],
          colors: p.colors || ["Black"],
          colorImages: p.colorImages || null,
          featured: p.featured ?? true,
        }).onConflictDoNothing();
      }
      console.log("[DB] Default products seeded successfully.");
    }
    hasCheckedSeed = true;
  } catch (err) {
    console.error("[DB] Note: Could not auto-seed products table (it may need migration to run first):", err);
  }
}

/*
 * =========================================================
 * ADMIN PIN VERIFICATION (SERVER-SIDE)
 * =========================================================
 */
router.post("/admin/verify-pin", (req, res) => {
  const { pin } = req.body || {};
  const serverPin = getAdminConfiguredPin();

  if (!pin || typeof pin !== "string") {
    res.status(400).json({ valid: false, error: "PIN is required." });
    return;
  }

  if (pin.trim() === serverPin) {
    res.json({
      valid: true,
      token: serverPin,
      message: "Admin authorization verified.",
    });
  } else {
    res.status(401).json({
      valid: false,
      error: "Incorrect admin PIN.",
    });
  }
});

/*
 * =========================================================
 * PRODUCTS (DATABASE SOURCE OF TRUTH)
 * =========================================================
 */
router.get("/products", async (req, res) => {
  await ensureProductsSeeded();

  try {
    const rows = await db
      .select()
      .from(productsTable)
      .orderBy(desc(productsTable.createdAt));

    if (rows.length > 0) {
      const parsed: any[] = rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        collection: r.collection,
        category: r.category,
        price: Number(r.price),
        stock: r.stock,
        imageUrl: r.imageUrl,
        description: r.description,
        sizes: r.sizes,
        colors: r.colors,
        colorImages: r.colorImages,
        featured: r.featured,
      }));

      const queryParams = ListProductsQueryParams.safeParse(req.query);
      const qData = (queryParams.success ? queryParams.data : {}) as { category?: string; search?: string };
      const { category, search } = qData;

      const filtered = (parsed as any[]).filter((product: any) => {
        const categoryMatch =
          !category ||
          category === "All" ||
          product.category?.toLowerCase() === category.toLowerCase() ||
          product.collection?.toLowerCase() === category.toLowerCase();
        const searchMatch =
          !search ||
          `${product.name} ${product.category} ${product.collection} ${product.description}`
            .toLowerCase()
            .includes(search.toLowerCase());
        return categoryMatch && searchMatch;
      });

      res.json(filtered);
      return;
    }
  } catch (err) {
    console.error("[PRODUCTS] DB query failed, falling back to seed catalog:", err);
  }

  // Fallback if DB table not yet created
  res.json(SEED_PRODUCTS);
});

router.get("/products/featured", async (_req, res) => {
  await ensureProductsSeeded();

  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.featured, true));

    if (rows.length > 0) {
      res.json(
        rows.map((r) => ({
          id: r.id,
          name: r.name,
          collection: r.collection,
          category: r.category,
          price: Number(r.price),
          stock: r.stock,
          imageUrl: r.imageUrl,
          description: r.description,
          sizes: r.sizes,
          colors: r.colors,
          colorImages: r.colorImages,
          featured: r.featured,
        }))
      );
      return;
    }
  } catch (err) {
    console.error("[PRODUCTS] Featured DB query failed:", err);
  }

  res.json(SEED_PRODUCTS.filter((p) => p.featured));
});

/*
 * =========================================================
 * ADMIN PRODUCT & STOCK MANAGEMENT (PROTECTED BY ADMIN AUTH)
 * =========================================================
 */

// Update product stock
router.patch("/products/:id/stock", async (req, res): Promise<void> => {
  if (!(await isConfiguredAdmin(req))) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const { id } = req.params;
  const newStock = Number(req.body?.stock);

  if (isNaN(newStock) || newStock < 0) {
    res.status(400).json({ error: "Stock must be a valid non-negative number." });
    return;
  }

  try {
    const [updated] = await db
      .update(productsTable)
      .set({
        stock: newStock,
        updatedAt: new Date(),
      })
      .where(eq(productsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Product not found in database." });
      return;
    }

    res.json({
      success: true,
      product: {
        ...updated,
        price: Number(updated.price),
      },
    });
  } catch (error) {
    req.log.error({ err: error, id }, "Failed to update product stock in DB");
    res.status(500).json({ error: "Database error while updating stock." });
  }
});

// Create product (Admin only)
router.post("/products", async (req, res): Promise<void> => {
  if (!(await isConfiguredAdmin(req))) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const {
    id,
    name,
    collection,
    category,
    price,
    stock,
    imageUrl,
    description,
    sizes,
    colors,
    colorImages,
    featured,
  } = req.body || {};

  if (!name || !price || !imageUrl) {
    res.status(400).json({ error: "Name, price, and imageUrl are required." });
    return;
  }

  const productId = id || `nl-${Date.now().toString(36)}`;

  try {
    const [created] = await db
      .insert(productsTable)
      .values({
        id: productId,
        name,
        collection: collection || "Round Necks",
        category: category || collection || "T-Shirts",
        price: price.toString(),
        stock: Number(stock) || 0,
        imageUrl,
        description: description || "",
        sizes: Array.isArray(sizes) ? sizes : ["XL", "XXL"],
        colors: Array.isArray(colors) ? colors : ["Black"],
        colorImages: colorImages || null,
        featured: featured ?? true,
      })
      .returning();

    res.status(201).json({
      success: true,
      product: {
        ...created,
        price: Number(created.price),
      },
    });
  } catch (error) {
    req.log.error({ err: error }, "Failed to create product in DB");
    res.status(500).json({ error: "Database error creating product." });
  }
});

// Update product (Admin only)
router.patch("/products/:id", async (req, res): Promise<void> => {
  if (!(await isConfiguredAdmin(req))) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const { id } = req.params;
  const data = req.body || {};

  try {
    const updateData: Partial<InsertProductRow> = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.collection !== undefined) updateData.collection = data.collection;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.price !== undefined) updateData.price = data.price.toString();
    if (data.stock !== undefined) updateData.stock = Number(data.stock);
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.sizes !== undefined) updateData.sizes = data.sizes;
    if (data.colors !== undefined) updateData.colors = data.colors;
    if (data.colorImages !== undefined) updateData.colorImages = data.colorImages;
    if (data.featured !== undefined) updateData.featured = data.featured;

    const [updated] = await db
      .update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Product not found." });
      return;
    }

    res.json({
      success: true,
      product: {
        ...updated,
        price: Number(updated.price),
      },
    });
  } catch (error) {
    req.log.error({ err: error, id }, "Failed to update product in DB");
    res.status(500).json({ error: "Database error updating product." });
  }
});

// Delete product (Admin only)
router.delete("/products/:id", async (req, res): Promise<void> => {
  if (!(await isConfiguredAdmin(req))) {
    res.status(403).json({ error: "Admin access required." });
    return;
  }

  const { id } = req.params;

  try {
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted from database." });
  } catch (error) {
    req.log.error({ err: error, id }, "Failed to delete product from DB");
    res.status(500).json({ error: "Database error deleting product." });
  }
});

/*
 * =========================================================
 * ACCOUNT-BASED CART (ASSOCIATED WITH AUTHENTICATED USER ID)
 * =========================================================
 */
router.get("/cart", async (req, res): Promise<void> => {
  const { userId } = getRequestAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Please sign in to access your bag." });
    return;
  }

  try {
    const [cartRow] = await db
      .select()
      .from(cartsTable)
      .where(eq(cartsTable.userId, userId));

    res.json(cartRow ? cartRow.items : []);
  } catch (error) {
    req.log.error({ err: error, userId }, "Failed to load user cart from DB");
    res.json([]);
  }
});

router.put("/cart", async (req, res): Promise<void> => {
  const { userId } = getRequestAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Please sign in to save your bag." });
    return;
  }

  const items = Array.isArray(req.body?.items) ? req.body.items : [];

  try {
    await db
      .insert(cartsTable)
      .values({
        userId,
        items,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: cartsTable.userId,
        set: {
          items,
          updatedAt: new Date(),
        },
      });

    res.json({ success: true, count: items.length });
  } catch (error) {
    req.log.error({ err: error, userId }, "Failed to save user cart to DB");
    res.status(500).json({ error: "Database error saving bag." });
  }
});

router.delete("/cart", async (req, res): Promise<void> => {
  const { userId } = getRequestAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Please sign in." });
    return;
  }

  try {
    await db.delete(cartsTable).where(eq(cartsTable.userId, userId));
    res.json({ success: true });
  } catch (error) {
    req.log.error({ err: error, userId }, "Failed to clear user cart from DB");
    res.status(500).json({ error: "Database error clearing bag." });
  }
});

/*
 * =========================================================
 * CUSTOMER ORDERS
 * =========================================================
 */
async function listCustomerOrders(
  req: Parameters<typeof getAuth>[0],
  res: Response,
): Promise<void> {
  const { userId } = getRequestAuth(req);
  if (!userId) {
    res.status(401).json({
      error: "Please sign in to view your orders.",
    });
    return;
  }
  const orders = await db
    .select({
      orderId: ordersTable.orderId,
      total: ordersTable.total,
      paymentMethod: ordersTable.paymentMethod,
      status: ordersTable.status,
      statusMessage: ordersTable.statusMessage,
      items: ordersTable.items,
      createdAt: ordersTable.createdAt,
      updatedAt: ordersTable.updatedAt,
      fulfilmentMethod: ordersTable.fulfilmentMethod,
      address: ordersTable.address,
      pickupCode: ordersTable.pickupCode,
    })
    .from(ordersTable)
    .where(eq(ordersTable.userId, userId))
    .orderBy(desc(ordersTable.createdAt));
  res.json(orders);
}

router.get("/orders", listCustomerOrders);
router.get("/orders/me", listCustomerOrders);

/*
 * =========================================================
 * ADMIN ORDERS
 * =========================================================
 */
router.get(
  "/orders/admin",
  async (req, res): Promise<void> => {
    if (!(await isConfiguredAdmin(req))) {
      res.status(403).json({
        error: "Admin access required.",
      });
      return;
    }

    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(desc(ordersTable.createdAt));
    res.json(orders);
  },
);

/*
 * =========================================================
 * UPDATE ORDER STATUS
 * =========================================================
 */
router.patch(
  "/orders/:orderId/status",
  async (req, res): Promise<void> => {
    if (!(await isConfiguredAdmin(req))) {
      res.status(403).json({
        error: "Admin access required.",
      });
      return;
    }

    const allowed = [
      "pending",
      "confirmed",
      "processing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!allowed.includes(req.body?.status)) {
      res.status(400).json({
        error: "Invalid order status.",
      });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({
        status: req.body.status,
        statusMessage: req.body.statusMessage || null,
        pickupCode: req.body.pickupCode || null,
        updatedAt: new Date(),
      })
      .where(eq(ordersTable.orderId, req.params.orderId))
      .returning();
    if (!updated) {
      res.status(404).json({
        error: "Order not found.",
      });
      return;
    }
    try {
      await notifyCustomer(
        updated.email,
        updated.orderId,
        updated.status,
        updated.statusMessage,
        updated.pickupCode,
      );
    } catch (error) {
      req.log.error(
        {
          err: error,
          orderId: updated.orderId,
        },
        "Customer status email failed",
      );
    }
    res.json({
      orderId: updated.orderId,
      status: updated.status,
      statusMessage: updated.statusMessage,
    });
  },
);

/*
 * =========================================================
 * CREATE ORDER (WITH ATOMIC INVENTORY DECREMENT IN DATABASE)
 * =========================================================
 */
function emailOrderPayload(
  data: any,
) {
  const pickupLocation =
    data.fulfilmentMethod === "Pickup"
      ? data.pickupLocation
      : null;
  return {
    customerName: data.customerName,
    phone: data.phone,
    email: data.email,
    address: (pickupLocation || data.address || "") as string,
    fulfilmentMethod: (data.fulfilmentMethod || "Delivery") as string,
    pickupLocation: pickupLocation as string | null,
    paymentMethod: data.paymentMethod,
    total: data.total,
    items: data.items,
    paymentScreenshot: data.paymentScreenshot,
  };
}

async function notifyAdminNewOrder(
  data: typeof CreateOrderBody._output,
  orderId: string,
) {
  await sendAdminNewOrderEmail(emailOrderPayload(data), orderId);
}

async function notifyCustomerNewOrder(
  data: typeof CreateOrderBody._output,
  orderId: string,
) {
  await sendCustomerOrderConfirmationEmail(emailOrderPayload(data), orderId);
}

async function notifyCustomer(
  email: string,
  orderId: string,
  status: string,
  statusMessage?: string | null,
  pickupCode?: string | null,
) {
  await sendCustomerStatusEmail(
    email,
    orderId,
    status,
    statusMessage,
    pickupCode,
  );
}

router.post("/orders", async (req, res): Promise<void> => {
  const { userId } = getRequestAuth(req);
  if (!userId) {
    res.status(401).json({
      error: "Please sign in before placing an order.",
    });
    return;
  }
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Please complete every order field and attach a payment screenshot.",
    });
    return;
  }
  const data: any = parsed.data;
  if (
    data.paymentScreenshot.startsWith("data:") &&
    Buffer.byteLength(data.paymentScreenshot, "utf8") > 4_000_000
  ) {
    res.status(400).json({ error: "Please upload a payment screenshot under 3MB." });
    return;
  }
  if (
    data.fulfilmentMethod === "Pickup" &&
    data.pickupLocation !== PICKUP_LOCATION
  ) {
    res.status(400).json({
      error: "Please use the configured Noble Luxe pickup location.",
    });
    return;
  }

  // ATOMIC STOCK VERIFICATION & DECREMENT IN DATABASE
  try {
    for (const item of data.items) {
      const pId = (item as any).productId || (item as any).id;
      const qty = item.quantity || 1;
      if (!pId) continue;

      const [updatedProduct] = await db
        .update(productsTable)
        .set({
          stock: sql`${productsTable.stock} - ${qty}`,
          updatedAt: new Date(),
        })
        .where(
          sql`${productsTable.id} = ${pId} AND ${productsTable.stock} >= ${qty}`
        )
        .returning();

      if (!updatedProduct) {
        // Stock was insufficient or item not found
        res.status(400).json({
          error: `Sorry, "${item.productName || pId}" is out of stock or does not have ${qty} units remaining.`,
        });
        return;
      }
    }
  } catch (err) {
    console.error("[ORDERS] Stock decrement check encountered issue:", err);
  }

  const orderId = `NL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  const orderData: any = data;
  await (db.insert(ordersTable) as any).values({
    orderId,
    userId,
    customerName: orderData.customerName,
    phone: orderData.phone,
    email: orderData.email,
    address:
      orderData.fulfilmentMethod === "Pickup"
        ? (orderData.pickupLocation || "")
        : (orderData.address || ""),
    fulfilmentMethod: orderData.fulfilmentMethod || "Delivery",
    items: orderData.items,
    total: orderData.total.toFixed(2),
    paymentMethod: orderData.paymentMethod,
    paymentScreenshot: orderData.paymentScreenshot,
    status: "pending",
    statusMessage: "Payment received. Our team is reviewing your transfer.",
  });

  // Clear user cart from DB
  try {
    await db.delete(cartsTable).where(eq(cartsTable.userId, userId));
  } catch (cartErr) {
    req.log.error({ err: cartErr, userId }, "Failed to clear cart after order");
  }

  req.log.info(
    { orderId, paymentMethod: data.paymentMethod, total: data.total },
    "Noble Luxe order received",
  );

  try {
    await notifyAdminNewOrder(data, orderId);
    req.log.info({ orderId }, "New order email sent to admin");
  } catch (error) {
    req.log.error({ err: error, orderId }, "Order recorded but admin email failed");
  }

  try {
    await notifyCustomerNewOrder(data, orderId);
    req.log.info({ orderId }, "Order confirmation email sent to customer");
  } catch (error) {
    req.log.error({ err: error, orderId }, "Order recorded but customer confirmation email failed");
  }

  res.status(201).json(
    CreateOrderResponse.parse({
      orderId,
      receivedAt: new Date(),
      total: data.total,
      fulfilmentMethod: data.fulfilmentMethod,
      pickupLocation:
        data.fulfilmentMethod === "Pickup"
          ? data.pickupLocation
          : undefined,
      message:
        data.fulfilmentMethod === "Pickup"
          ? "Your pickup order has been received and is awaiting payment verification."
          : "Your delivery order has been received and is awaiting payment verification.",
    }),
  );
});

export default router;
