import { Router, type IRouter } from "express";
import {
  CreateOrderBody,
  ListProductsQueryParams,
  ListProductsResponse,
  CreateOrderResponse,
} from "@workspace/api-zod";
import { db, ordersTable } from "@workspace/db";
import { ReplitConnectors } from "@replit/connectors-sdk";
import { getAuth } from "@clerk/express";
import { eq, desc } from "drizzle-orm";
const router: IRouter = Router();
const connectors = new ReplitConnectors();
/*
 * =========================================================
 * GMAIL — NEW ORDER NOTIFICATION
 * =========================================================
 */
async function notifyGmail(
  data: typeof CreateOrderBody._output,
  orderId: string,
) {
  const profileResponse = await connectors.proxy(
    "google-mail",
    "/gmail/v1/users/me/profile",
    { method: "GET" },
  );
  if (!profileResponse.ok) {
    throw new Error(
      `Gmail profile request failed with ${profileResponse.status}`,
    );
  }
  const profile =
    (await profileResponse.json()) as {
      emailAddress?: string;
    };
  const recipient =
    process.env.ORDER_NOTIFICATION_EMAIL ||
    profile.emailAddress;
  if (!recipient) {
    throw new Error(
      "No order notification email is configured",
    );
  }
  const screenshotMatch =
    data.paymentScreenshot.match(
      /^data:([^;]+);base64,(.+)$/,
    );
  const contentType =
    screenshotMatch?.[1] || "image/png";
  const screenshot =
    screenshotMatch?.[2] ||
    data.paymentScreenshot;
  const boundary =
    `noble-luxe-${orderId.toLowerCase()}`;
  const lines = [
    `From: ${recipient}`,
    `To: ${recipient}`,
    `Subject: NOBLE LUXE — NEW ORDER ${orderId}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    "NOBLE LUXE — NEW ORDER",
    "",
    `Order ID: ${orderId}`,
    `Customer: ${data.customerName}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Address: ${data.address}`,
    "",
    "Items:",
    ...data.items.map(
      (item) =>
        `${item.productName} — Size ${item.size}${
          item.color
            ? ` — Color ${item.color}`
            : ""
        } — Qty ${item.quantity} — ₦${item.price.toLocaleString()}`,
    ),
    "",
    `Payment: ${data.paymentMethod}`,
    `Total: ₦${data.total.toLocaleString()}`,
    "",
    "Payment screenshot is attached.",
    "",
    `--${boundary}`,
    `Content-Type: ${contentType}; name="payment-screenshot"`,
    "Content-Transfer-Encoding: base64",
    'Content-Disposition: attachment; filename="payment-screenshot"',
    "",
    screenshot,
    `--${boundary}--`,
    "",
  ].join("\r\n");
  const raw = Buffer.from(
    lines,
    "utf8",
  ).toString("base64url");
  const sendResponse = await connectors.proxy(
    "google-mail",
    "/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    },
  );
  if (!sendResponse.ok) {
    throw new Error(
      `Gmail send failed with ${sendResponse.status}`,
    );
  }
}
/*
 * =========================================================
 * CUSTOMER STATUS EMAIL
 * =========================================================
 */
async function notifyCustomer(
  email: string,
  orderId: string,
  status: string,
  statusMessage?: string | null,
) {
  const subject =
    `NOBLE LUXE — ${orderId} update`;
  const body = [
    "NOBLE LUXE",
    "",
    `Your order ${orderId} is now ${status.replaceAll(
      "_",
      " ",
    )}.`,
    statusMessage ||
      "We will keep you updated as your order moves through the atelier.",
    "",
    "Thank you for choosing Noble Luxe.",
  ].join("\n");
  const raw = Buffer.from(
    `To: ${email}\r\nSubject: ${subject}\r\nContent-Type: text/plain; charset=UTF-8\r\n\r\n${body}`,
    "utf8",
  ).toString("base64url");
  const response = await connectors.proxy(
    "google-mail",
    "/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    },
  );
  if (!response.ok) {
    throw new Error(
      `Customer notification failed with ${response.status}`,
    );
  }
}
/*
 * =========================================================
 * NOBLE LUXE PRODUCT CATALOG
 * =========================================================
 *
 * ONLY THESE FIVE PRODUCTS ARE USED.
 * =========================================================
 */
const products = [
  {
    id: "nl-001",
    name: "Lace Shirt",
    category: "Tops",
    price: 10000,
    imageUrl:
      "https://i.ibb.co/fYtNVKtn/9-VHf-MPa-Kpt.jpg",
    description:
      "A refined Noble Luxe lace shirt with a distinctive front and back finish.",
    sizes: ["XL", "XXL"],
    colors: ["Black"],
    featured: true,
  },
  {
    id: "nl-002",
    name: "NL Round-Neck 2",
    category: "T-Shirts",
    price: 11000,
    imageUrl:
      "https://i.ibb.co/v4x3TdD7/w-Rw-Ai6upb0.jpg",
    description:
      "A clean Noble Luxe round-neck piece available in multiple colours.",
    sizes: ["XL", "XXL"],
    colors: [
      "Black",
      "White",
      "Purple",
      "Brown",
      "Ash",
      "Sky Blue",
      "Carton Brown",
    ],
    featured: true,
  },
  {
    id: "nl-003",
    name: "NL Sweat Shirt",
    category: "Sweatshirts",
    price: 13000,
    imageUrl:
      "https://i.ibb.co/pjcvhvxM/0-Np-YFBt-Un9.jpg",
    description:
      "A comfortable Noble Luxe sweatshirt offered in statement seasonal colours.",
    sizes: ["XL", "XXL"],
    colors: [
      "Army Green",
      "Mint Green",
      "Orange",
    ],
    featured: true,
  },
  {
    id: "nl-004",
    name: "NL Vintage",
    category: "T-Shirts",
    price: 8000,
    imageUrl:
      "https://i.ibb.co/hRfWwNvK/9-Xjth-WBYX4.jpg",
    description:
      "A vintage-inspired Noble Luxe piece with a distinctive front and back design.",
    sizes: ["XL", "XXL"],
    colors: ["Black"],
    featured: true,
  },
  {
    id: "nl-005",
    name: "NL Armless",
    category: "Tops",
    price: 11000,
    imageUrl:
      "https://i.ibb.co/yBs58tVF/ZUj-Onk-Zz1-M.jpg",
    description:
      "A clean Noble Luxe armless piece designed for a relaxed streetwear fit.",
    sizes: ["XL", "XXL"],
    colors: ["Black"],
    featured: true,
  },
];
/*
 * =========================================================
 * PRODUCTS
 * =========================================================
 */
router.get("/products", (req, res) => {
  const parsed =
    ListProductsQueryParams.safeParse(req.query);
  const { category, search } =
    parsed.success ? parsed.data : {};
  const filtered = products.filter((product) => {
    const categoryMatch =
      !category ||
      category === "All" ||
      product.category.toLowerCase() ===
        category.toLowerCase();
    const searchMatch =
      !search ||
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase());
    return categoryMatch && searchMatch;
  });
  res.json(
    ListProductsResponse.parse(filtered),
  );
});
router.get("/products/featured", (_req, res) => {
  res.json(
    ListProductsResponse.parse(
      products.filter(
        (product) => product.featured,
      ),
    ),
  );
});
/*
 * =========================================================
 * CUSTOMER ORDERS
 * =========================================================
 */
router.get(
  "/orders/me",
  async (req, res): Promise<void> => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        error:
          "Please sign in to view your orders.",
      });
      return;
    }
    const orders = await db
      .select({
        orderId: ordersTable.orderId,
        total: ordersTable.total,
        paymentMethod:
          ordersTable.paymentMethod,
        status: ordersTable.status,
        statusMessage:
          ordersTable.statusMessage,
        createdAt: ordersTable.createdAt,
        updatedAt: ordersTable.updatedAt,
      })
      .from(ordersTable)
      .where(
        eq(ordersTable.userId, userId),
      )
      .orderBy(
        desc(ordersTable.createdAt),
      );
    res.json(orders);
  },
);
/*
 * =========================================================
 * ADMIN ORDERS
 * =========================================================
 */
router.get(
  "/orders/admin",
  async (req, res): Promise<void> => {
    const { userId } = getAuth(req);
    if (
      !userId ||
      !process.env.ORDER_ADMIN_EMAIL ||
      req.query.adminEmail !==
        process.env.ORDER_ADMIN_EMAIL
    ) {
      res.status(403).json({
        error: "Admin access required.",
      });
      return;
    }
    const orders = await db
      .select()
      .from(ordersTable)
      .orderBy(
        desc(ordersTable.createdAt),
      );
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
    const { userId } = getAuth(req);
    const adminEmail =
      process.env.ORDER_ADMIN_EMAIL;
    if (
      !userId ||
      !adminEmail ||
      req.body?.adminEmail !== adminEmail
    ) {
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
    if (
      !allowed.includes(req.body?.status)
    ) {
      res.status(400).json({
        error: "Invalid order status.",
      });
      return;
    }
    const [updated] = await db
      .update(ordersTable)
      .set({
        status: req.body.status,
        statusMessage:
          req.body.statusMessage || null,
        updatedAt: new Date(),
      })
      .where(
        eq(
          ordersTable.orderId,
          req.params.orderId,
        ),
      )
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
      statusMessage:
        updated.statusMessage,
    });
  },
);
/*
 * =========================================================
 * CREATE ORDER
 * =========================================================
 */
router.post(
  "/orders",
  async (req, res): Promise<void> => {
    const { userId } = getAuth(req);
    if (!userId) {
      res.status(401).json({
        error:
          "Please sign in before placing an order.",
      });
      return;
    }
    const parsed =
      CreateOrderBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error:
          "Please complete every order field and attach a payment screenshot.",
      });
      return;
    }
    const data = parsed.data;
    const orderId =
      `NL-${Date.now()
        .toString(36)
        .toUpperCase()
        .slice(-6)}`;
    await db
      .insert(ordersTable)
      .values({
        orderId,
        userId,
        customerName:
          data.customerName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        items: data.items,
        total: data.total.toFixed(2),
        paymentMethod:
          data.paymentMethod,
        paymentScreenshot:
          data.paymentScreenshot,
        status: "pending",
        statusMessage:
          "Payment received. Our team is reviewing your transfer.",
      });
    req.log.info(
      {
        orderId,
        paymentMethod:
          data.paymentMethod,
        total: data.total,
      },
      "Noble Luxe order received",
    );
    try {
      await notifyGmail(
        data,
        orderId,
      );
      req.log.info(
        { orderId },
        "Order notification sent to Gmail",
      );
    } catch (error) {
      req.log.error(
        {
          err: error,
          orderId,
        },
        "Order recorded but Gmail notification failed",
      );
    }
    res
      .status(201)
      .json(
        CreateOrderResponse.parse({
          orderId,
          receivedAt: new Date(),
          total: data.total,
          message:
            "Your order has been received and is awaiting payment verification.",
        }),
      );
  },
);
export default router;