/*
 * =========================================================
 * NOBLE LUXE — EMAIL (Resend)
 * =========================================================
 * Env vars required:
 *   RESEND_API_KEY            re_...
 *   MAIL_FROM                 Noble Luxe <orders@mail.nobleluxe18.com.ng>
 *   ORDER_NOTIFICATION_EMAIL  nobleluxe18@gmail.com
 * =========================================================
 */

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type Attachment = {
  filename: string;
  content: string;
};

type SendArgs = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  attachments?: Attachment[];
};

function fromAddress(): string {
  const from = process.env.MAIL_FROM?.trim();
  if (from) return from;
  const domain = process.env.MAIL_DOMAIN?.trim();
  if (domain) return `Noble Luxe <orders@${domain}>`;
  throw new Error(
    "No sender configured. Set MAIL_FROM, e.g. \"Noble Luxe <orders@mail.nobleluxe18.com.ng>\".",
  );
}

export function adminRecipient(): string {
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL?.trim();
  if (!recipient) {
    throw new Error("No admin recipient configured. Set ORDER_NOTIFICATION_EMAIL.");
  }
  return recipient;
}

async function send({ to, subject, html, replyTo, attachments }: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromAddress(),
      to: [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
      ...(attachments && attachments.length ? { attachments } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend send failed [${response.status}]: ${detail}`);
  }
}

/* ---------------------------------------------------------
 * Shared presentation
 * ------------------------------------------------------- */

const naira = (value: number | string): string => {
  const amount = typeof value === "string" ? Number(value) : value;
  return `₦${(Number.isFinite(amount) ? amount : 0).toLocaleString("en-NG")}`;
};

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const prettyStatus = (status: string): string =>
  status.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

function shell(title: string, inner: string): string {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f4f2;font-family:Helvetica,Arial,sans-serif;color:#141414;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e4df;">
    <div style="padding:22px 28px;border-bottom:1px solid #e7e4df;">
      <div style="font-size:13px;letter-spacing:.32em;text-transform:uppercase;color:#141414;">Noble Luxe</div>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 18px;font-size:20px;font-weight:600;">${escapeHtml(title)}</h1>
      ${inner}
    </div>
    <div style="padding:18px 28px;border-top:1px solid #e7e4df;font-size:12px;color:#7a746c;">
      Noble Luxe · 5 Alhaji Adegoke str, Baruwa, Ipaja, Lagos State
    </div>
  </div>
</body></html>`;
}

type OrderItem = {
  productName: string;
  size: string;
  color?: string | null;
  quantity: number;
  price: number;
};

function itemsTable(items: OrderItem[]): string {
  const rows = items
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0ede9;font-size:14px;">
          ${escapeHtml(item.productName)}<br>
          <span style="font-size:12px;color:#7a746c;">Size ${escapeHtml(item.size)}${
            item.color ? ` · ${escapeHtml(item.color)}` : ""
          } · Qty ${escapeHtml(item.quantity)}</span>
        </td>
        <td style="padding:8px 0;border-bottom:1px solid #f0ede9;font-size:14px;text-align:right;white-space:nowrap;">
          ${naira(item.price * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;margin:8px 0 18px;">${rows}</table>`;
}

function detail(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px 6px 0;font-size:13px;color:#7a746c;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;font-size:14px;">${escapeHtml(value)}</td>
  </tr>`;
}

/* ---------------------------------------------------------
 * 1. Admin — new order
 * ------------------------------------------------------- */

export type NewOrderEmailData = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  fulfilmentMethod: string;
  pickupLocation?: string | null;
  paymentMethod: string;
  total: number;
  items: OrderItem[];
  paymentScreenshot: string;
};

export async function sendAdminNewOrderEmail(
  data: NewOrderEmailData,
  orderId: string,
): Promise<void> {
  const destination =
    data.fulfilmentMethod === "Pickup"
      ? `Pickup — ${data.pickupLocation || data.address}`
      : data.address;

  const html = shell(
    `New order ${orderId}`,
    `<table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
      ${detail("Customer", data.customerName)}
      ${detail("Phone", data.phone)}
      ${detail("Email", data.email)}
      ${detail("Fulfilment", data.fulfilmentMethod)}
      ${detail("Destination", destination)}
      ${detail("Payment", data.paymentMethod)}
    </table>
    ${itemsTable(data.items)}
    <p style="margin:0;font-size:16px;font-weight:600;">Total ${naira(data.total)}</p>
    <p style="margin:18px 0 0;font-size:13px;color:#7a746c;">The payment screenshot is attached.</p>`,
  );

  const match = data.paymentScreenshot.match(/^data:([^;]+);base64,(.+)$/);
  const content = match?.[2] || data.paymentScreenshot;
  const extension = (match?.[1] || "image/png").split("/")[1]?.split("+")[0] || "png";

  await send({
    to: adminRecipient(),
    subject: `NOBLE LUXE — NEW ORDER ${orderId}`,
    html,
    replyTo: data.email,
    attachments: [
      {
        filename: `payment-screenshot-${orderId}.${extension}`,
        content,
      },
    ],
  });
}

/* ---------------------------------------------------------
 * 2. Customer — order confirmation
 * ------------------------------------------------------- */

export async function sendCustomerOrderConfirmationEmail(
  data: NewOrderEmailData,
  orderId: string,
): Promise<void> {
  const fulfilmentLine =
    data.fulfilmentMethod === "Pickup"
      ? `Pickup at ${escapeHtml(data.pickupLocation || data.address)}. We will send your pickup code once payment is verified.`
      : `Delivery to ${escapeHtml(data.address)}.`;

  const html = shell(
    `Thank you, ${data.customerName.split(" ")[0] || data.customerName}`,
    `<p style="margin:0 0 18px;font-size:14px;line-height:22px;">
      We have received your order <strong>${escapeHtml(orderId)}</strong> and our team is verifying your payment.
      You will get an email at every stage from here.
    </p>
    ${itemsTable(data.items)}
    <p style="margin:0 0 6px;font-size:16px;font-weight:600;">Total ${naira(data.total)}</p>
    <p style="margin:0 0 18px;font-size:13px;color:#7a746c;">Paid via ${escapeHtml(data.paymentMethod)}</p>
    <p style="margin:0;font-size:14px;line-height:22px;">${fulfilmentLine}</p>`,
  );

  await send({
    to: data.email,
    subject: `Noble Luxe — order ${orderId} received`,
    html,
  });
}

/* ---------------------------------------------------------
 * 3. Customer — status update
 * ------------------------------------------------------- */

export async function sendCustomerStatusEmail(
  email: string,
  orderId: string,
  status: string,
  statusMessage?: string | null,
  pickupCode?: string | null,
): Promise<void> {
  const html = shell(
    `Order ${orderId} — ${prettyStatus(status)}`,
    `<p style="margin:0 0 16px;font-size:14px;line-height:22px;">
      Your order <strong>${escapeHtml(orderId)}</strong> is now
      <strong>${escapeHtml(prettyStatus(status))}</strong>.
    </p>
    <p style="margin:0 0 16px;font-size:14px;line-height:22px;">
      ${escapeHtml(
        statusMessage || "We will keep you updated as your order moves through the atelier.",
      )}
    </p>
    ${
      pickupCode
        ? `<p style="margin:0 0 16px;padding:14px 16px;background:#f5f4f2;font-size:14px;">
             Pickup code: <strong style="letter-spacing:.18em;">${escapeHtml(pickupCode)}</strong>
           </p>`
        : ""
    }
    <p style="margin:0;font-size:13px;color:#7a746c;">Thank you for choosing Noble Luxe.</p>`,
  );

  await send({
    to: email,
    subject: `Noble Luxe — order ${orderId} is ${prettyStatus(status).toLowerCase()}`,
    html,
  });
}
