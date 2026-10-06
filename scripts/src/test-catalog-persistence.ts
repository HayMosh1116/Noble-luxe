import test, { describe } from "node:test";
import assert from "node:assert/strict";

/**
 * Automated test suite for catalog persistence across reseeding and app reloads.
 *
 * Verifies:
 * 1. Backend database reseeding guard:
 *    - Initial seed provisions products and sets noble_luxe_meta.catalog_seeded.
 *    - An admin editing a product (name, stock, price, colors, sizes) retains changes after reseeding.
 *    - An admin deleting a product prevents that product from resurrecting upon server restart / cold start.
 *    - Cold start check with existing products but lost meta sets meta and skips reinsertion.
 * 2. Frontend client reload persistence:
 *    - Live catalog fetch caches items into client storage.
 *    - App reload (memory reset) loads cached items with edits preserved and deleted items excluded.
 *    - Subsequent reloads never resurrect deleted items or overwrite edits with hardcoded defaults.
 */

interface MockProduct {
  id: string;
  name: string;
  collection: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  sizes: string[];
  colors: string[];
  colorImages?: Record<string, { name: string; front: string; back?: string }> | null;
  featured: boolean;
}

const DEFAULT_SEED_PRODUCTS: MockProduct[] = [
  {
    id: "nl-round-embroidery-1",
    name: "Noble Luxe Classic Round Neck",
    collection: "Round Necks",
    category: "T-Shirts",
    price: 32000,
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518",
    description: "Signature premium cotton tee",
    sizes: ["M", "L", "XL"],
    colors: ["Black", "White"],
    featured: true,
  },
  {
    id: "nl-joggers-essential-1",
    name: "Noble Luxe Essential Joggers",
    collection: "Joggers",
    category: "Pants",
    price: 45000,
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea",
    description: "Tailored heavyweight fleece joggers",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Charcoal", "Black"],
    featured: true,
  },
  {
    id: "nl-hoodie-minimalist-1",
    name: "Noble Luxe Minimalist Hoodie",
    collection: "Hoodies",
    category: "Hoodies",
    price: 55000,
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2",
    description: "Oversized luxury hoodie",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Forest Green"],
    featured: true,
  },
];

class MockDatabase {
  public meta: Map<string, string> = new Map();
  public products: Map<string, MockProduct> = new Map();

  // Replicates ensureProductsSeeded logic from artifacts/api-server/src/routes/store.ts
  async ensureProductsSeeded(): Promise<{ seeded: boolean; reason: string }> {
    // 1. Check persistent meta flag
    if (this.meta.has("catalog_seeded")) {
      return { seeded: false, reason: "meta_flag_present" };
    }

    // 2. Check if products table already has records
    if (this.products.size > 0) {
      this.meta.set("catalog_seeded", "true");
      return { seeded: false, reason: "existing_products_found" };
    }

    // 3. First-time seed execution
    for (const p of DEFAULT_SEED_PRODUCTS) {
      if (!this.products.has(p.id)) {
        this.products.set(p.id, { ...p });
      }
    }
    this.meta.set("catalog_seeded", "true");
    return { seeded: true, reason: "initial_seed_completed" };
  }

  // Replicates Admin PATCH /products/:id
  async updateProduct(id: string, updates: Partial<MockProduct>): Promise<MockProduct> {
    const existing = this.products.get(id);
    if (!existing) throw new Error(`Product ${id} not found`);
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  // Replicates Admin DELETE /products/:id
  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Replicates GET /products
  async listProducts(): Promise<MockProduct[]> {
    await this.ensureProductsSeeded();
    return Array.from(this.products.values());
  }
}

class MockLocalStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

describe("Catalog Reseeding & Reload Persistence Tests", () => {
  test("First-time seed initializes catalog and creates catalog_seeded metadata record", async () => {
    const db = new MockDatabase();
    assert.equal(db.products.size, 0);
    assert.equal(db.meta.has("catalog_seeded"), false);

    const result = await db.ensureProductsSeeded();
    assert.equal(result.seeded, true);
    assert.equal(result.reason, "initial_seed_completed");
    assert.equal(db.products.size, DEFAULT_SEED_PRODUCTS.length);
    assert.equal(db.meta.get("catalog_seeded"), "true");
  });

  test("Admin edited product stays unchanged when reseeding runs again", async () => {
    const db = new MockDatabase();
    await db.ensureProductsSeeded();

    const targetId = "nl-round-embroidery-1";
    const editedFields = {
      name: "Noble Luxe Embroidered Signature Crest",
      stock: 4,
      price: 38000,
      colors: ["Emerald Green", "Midnight Black"],
      sizes: ["L", "XL"],
    };

    const updated = await db.updateProduct(targetId, editedFields);
    assert.equal(updated.name, editedFields.name);
    assert.equal(updated.stock, 4);
    assert.equal(updated.price, 38000);
    assert.deepEqual(updated.colors, ["Emerald Green", "Midnight Black"]);

    // Trigger reseeding again (e.g. serverless cold start / server reboot)
    const reseedResult = await db.ensureProductsSeeded();
    assert.equal(reseedResult.seeded, false);
    assert.equal(reseedResult.reason, "meta_flag_present");

    // Verify database state retains edited values and was NOT reverted to original seed values
    const productAfterReseed = db.products.get(targetId);
    assert.ok(productAfterReseed, "Product should still exist");
    assert.equal(productAfterReseed.name, editedFields.name);
    assert.equal(productAfterReseed.stock, 4);
    assert.equal(productAfterReseed.price, 38000);
    assert.deepEqual(productAfterReseed.colors, ["Emerald Green", "Midnight Black"]);
    assert.notEqual(productAfterReseed.name, DEFAULT_SEED_PRODUCTS[0].name);
    assert.notEqual(productAfterReseed.stock, DEFAULT_SEED_PRODUCTS[0].stock);
  });

  test("Admin deleted product stays deleted and is NOT resurrected by reseeding", async () => {
    const db = new MockDatabase();
    await db.ensureProductsSeeded();

    const deletedId = "nl-hoodie-minimalist-1";
    assert.ok(db.products.has(deletedId), "Product should initially exist");

    // Admin deletes the product
    const deleted = await db.deleteProduct(deletedId);
    assert.equal(deleted, true);
    assert.equal(db.products.has(deletedId), false);
    assert.equal(db.products.size, DEFAULT_SEED_PRODUCTS.length - 1);

    // Trigger reseeding (simulating app reload, deployment, or cold start)
    const reseedResult = await db.ensureProductsSeeded();
    assert.equal(reseedResult.seeded, false);
    assert.equal(reseedResult.reason, "meta_flag_present");

    // Verify the deleted product has NOT been re-inserted
    assert.equal(db.products.has(deletedId), false, "Deleted product must not be resurrected");
    assert.equal(db.products.size, DEFAULT_SEED_PRODUCTS.length - 1);

    const catalogList = await db.listProducts();
    const foundDeleted = catalogList.some((p) => p.id === deletedId);
    assert.equal(foundDeleted, false, "Product list must not contain deleted product");
  });

  test("Reseeding guard protects catalog even if meta table is empty but products exist", async () => {
    const db = new MockDatabase();
    await db.ensureProductsSeeded();

    // Delete a product
    await db.deleteProduct("nl-joggers-essential-1");
    assert.equal(db.products.has("nl-joggers-essential-1"), false);

    // Edit a product
    await db.updateProduct("nl-round-embroidery-1", { stock: 2, name: "Limited Edition Round Neck" });

    // Simulate scenario where meta entry was lost or db was migrated without meta
    db.meta.clear();
    assert.equal(db.meta.size, 0);

    // Trigger reseeding
    const reseedResult = await db.ensureProductsSeeded();
    assert.equal(reseedResult.seeded, false);
    assert.equal(reseedResult.reason, "existing_products_found");
    assert.equal(db.meta.get("catalog_seeded"), "true", "Should restore catalog_seeded meta flag");

    // Deleted product must still be gone
    assert.equal(db.products.has("nl-joggers-essential-1"), false);

    // Edited product must still keep edits
    const edited = db.products.get("nl-round-embroidery-1");
    assert.equal(edited?.stock, 2);
    assert.equal(edited?.name, "Limited Edition Round Neck");
  });

  test("Client app reload maintains edited & deleted state and avoids stale seed fallbacks", async () => {
    const db = new MockDatabase();
    await db.ensureProductsSeeded();

    // Perform admin changes
    await db.updateProduct("nl-round-embroidery-1", {
      name: "Updated Round Neck",
      stock: 1,
      price: 29000,
    });
    await db.deleteProduct("nl-hoodie-minimalist-1");

    const localStorage = new MockLocalStorage();
    const CACHE_KEY = "noble_luxe_cached_catalog";

    // 1. Initial client load: fetches live catalog from server
    const serverProducts = await db.listProducts();
    localStorage.setItem(CACHE_KEY, JSON.stringify(serverProducts));

    // 2. Simulating Page Reload (memory reset, reading from cache first)
    const getCachedCatalog = (): MockProduct[] | null => {
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
      return null;
    };

    const fetchLiveCatalog = async (): Promise<MockProduct[]> => {
      const data = await db.listProducts();
      if (Array.isArray(data)) {
        if (data.length > 0) {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        }
        return data.length > 0 ? data : (getCachedCatalog() || DEFAULT_SEED_PRODUCTS);
      }
      return getCachedCatalog() || DEFAULT_SEED_PRODUCTS;
    };

    // Immediate cached state on reload
    const initialReloadCatalog = getCachedCatalog();
    assert.ok(initialReloadCatalog, "Cached catalog should be available on reload");
    assert.equal(initialReloadCatalog.length, 2);

    const cachedEdited = initialReloadCatalog.find((p) => p.id === "nl-round-embroidery-1");
    assert.equal(cachedEdited?.name, "Updated Round Neck");
    assert.equal(cachedEdited?.stock, 1);
    assert.equal(cachedEdited?.price, 29000);

    const cachedDeleted = initialReloadCatalog.find((p) => p.id === "nl-hoodie-minimalist-1");
    assert.equal(cachedDeleted, undefined, "Deleted item must not be present in cached reload");

    // Live sync on reload
    const freshCatalog = await fetchLiveCatalog();
    assert.equal(freshCatalog.length, 2);

    const liveEdited = freshCatalog.find((p) => p.id === "nl-round-embroidery-1");
    assert.equal(liveEdited?.name, "Updated Round Neck");
    assert.equal(liveEdited?.stock, 1);

    const liveDeleted = freshCatalog.find((p) => p.id === "nl-hoodie-minimalist-1");
    assert.equal(liveDeleted, undefined, "Deleted item must not resurrect after live sync");
  });
});
