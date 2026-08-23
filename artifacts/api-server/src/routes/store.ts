import { Router, type IRouter } from "express";
import { CreateOrderBody, ListProductsQueryParams, ListProductsResponse, CreateOrderResponse } from "@workspace/api-zod";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";

const router: IRouter = Router();

const products = [
  { id: "nl-001", name: "Signature Sleeveless Tee", category: "Tops", price: 28500, imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85", description: "A sculpted sleeveless essential with the Noble Luxe mark.", sizes: ["S", "M", "L", "XL"], colors: ["Onyx", "Gold"], featured: true },
  { id: "nl-002", name: "Noble Heavyweight Hoodie", category: "Hoodies", price: 52000, imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85", description: "Dense cotton fleece, relaxed fit, signature chest embroidery.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Onyx", "Bone"], featured: true },
  { id: "nl-003", name: "Luxe Track Jogger", category: "Joggers", price: 44000, imageUrl: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=900&q=85", description: "Tapered streetwear tailoring with a gold side insignia.", sizes: ["S", "M", "L", "XL"], colors: ["Onyx", "Ash"], featured: true },
  { id: "nl-004", name: "Monogram Round Neck", category: "T-Shirts", price: 26000, imageUrl: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85", description: "Premium cotton jersey with a tonal Noble Luxe monogram.", sizes: ["S", "M", "L", "XL"], colors: ["Cream", "Onyx"], featured: false },
  { id: "nl-005", name: "Atelier Knit Sweater", category: "Sweaters", price: 59500, imageUrl: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&q=85", description: "Soft, architectural knitwear for quiet statement dressing.", sizes: ["S", "M", "L", "XL"], colors: ["Charcoal", "Camel"], featured: true },
  { id: "nl-006", name: "Noble Varsity Set", category: "Matching Sets", price: 88000, imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=85", description: "The complete two-piece uniform: elevated, effortless, unmistakable.", sizes: ["S", "M", "L", "XL"], colors: ["Onyx", "Oat"], featured: true },
  { id: "nl-007", name: "Crest Box Tee", category: "T-Shirts", price: 30000, imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f37f384b?auto=format&fit=crop&w=900&q=85", description: "Boxy silhouette, heavyweight handfeel, gold crest print.", sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Onyx", "White"], featured: false },
  { id: "nl-008", name: "Cropped Layer Top", category: "Tops", price: 33500, imageUrl: "https://images.unsplash.com/photo-1551488831-019ce9e0c2a4?auto=format&fit=crop&w=900&q=85", description: "A clean cropped layer designed for modern proportions.", sizes: ["S", "M", "L"], colors: ["Onyx", "Gold"], featured: false },
];

router.get("/products", (req, res) => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  const { category, search } = parsed.success ? parsed.data : {};
  const filtered = products.filter((product) => {
    const categoryMatch = !category || category === "All" || product.category.toLowerCase() === category.toLowerCase();
    const searchMatch = !search || `${product.name} ${product.category} ${product.description}`.toLowerCase().includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });
  res.json(ListProductsResponse.parse(filtered));
});

router.get("/products/featured", (_req, res) => {
  res.json(ListProductsResponse.parse(products.filter((product) => product.featured)));
});

router.post("/orders", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Please complete every order field and attach a payment screenshot." });
    return;
  }

  const data = parsed.data;
  const orderId = `NL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  await db.insert(ordersTable).values({
    orderId,
    customerName: data.customerName,
    phone: data.phone,
    email: data.email,
    address: data.address,
    items: data.items,
    total: data.total.toFixed(2),
    paymentMethod: data.paymentMethod,
    paymentScreenshot: data.paymentScreenshot,
  });

  req.log.info({ orderId, paymentMethod: data.paymentMethod, total: data.total }, "Noble Luxe order received");
  req.log.warn({ orderId }, "Gmail notification is pending secure Gmail connection setup");
  res.status(201).json(CreateOrderResponse.parse({
    orderId,
    receivedAt: new Date(),
    total: data.total,
    message: "Your order has been received and is awaiting payment verification.",
  }));
});

export default router;