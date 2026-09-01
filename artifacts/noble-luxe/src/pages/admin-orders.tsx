import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/react";
import { Link } from "wouter";

type Order = {
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address?: string;

  items: {
  productId: string;
  productName: string;
  size: string;
  color?: string;
  quantity: number;
  price: number;
}[];
  
  total: string;
  paymentMethod?: string;
  status: string;
  statusMessage?: string | null;
  createdAt: string;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const statusLabels: Record<string, string> = {
  pending: "Payment pending",
  confirmed: "Payment confirmed",
  processing: "Processing",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AdminOrders() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const email =
    user?.primaryEmailAddress?.emailAddress || "";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    if (!email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      const response = await fetch(
        `/api/orders/admin?adminEmail=${encodeURIComponent(
          email,
        )}`,
        {
          credentials: "include",
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        },
      );

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "This account is not authorized to access the order desk.",
          );
        }

        throw new Error(
          "Unable to load orders.",
        );
      }

      const data = (await response.json()) as Order[];

      setOrders(data);
    } catch (err) {
      console.error(err);

      setOrders([]);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load orders.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [email]);

  const update = async (
    orderId: string,
    status: string,
  ) => {
    try {
      setUpdating(orderId);
      setMessage("");
      setError("");

      const token = await getToken();

      const statusMessage =
        status === "confirmed"
          ? "Payment confirmed. Your order is now being prepared."
          : status === "processing"
            ? "Your order is now being prepared by our team."
            : status === "out_for_delivery"
              ? "Your order is out for delivery."
              : status === "delivered"
                ? "Your order has been delivered. Thank you for choosing Noble Luxe."
                : status === "cancelled"
                  ? "Your order has been cancelled. Please contact Noble Luxe if you need assistance."
                  : "Payment is awaiting review.";

      const response = await fetch(
        `/api/orders/${encodeURIComponent(
          orderId,
        )}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            status,
            adminEmail: email,
            statusMessage,
          }),
        },
      );

      if (!response.ok) {
        const body = await response
          .json()
          .catch(() => null);

        throw new Error(
          body?.error ||
            "Unable to update the order.",
        );
      }

      setMessage(
        `Order ${orderId} updated successfully.`,
      );

      await load();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the order.",
      );
    } finally {
      setUpdating("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
          <Link
            href="/"
            className="font-display text-lg tracking-[.15em]"
          >
            NOBLE LUXE
          </Link>

          <span className="font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">
            Order desk
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 pb-24 pt-36 lg:px-10">
        <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">
          Private operations
        </p>

        <h1 className="mt-3 font-display text-6xl">
          Order desk.
        </h1>

        {message && (
          <p className="mt-5 border border-primary/30 bg-primary/5 p-4 text-sm text-primary">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-12 border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
            Loading orders…
          </div>
        ) : (
          <div className="mt-12 space-y-4">
            {orders.length ? (
              orders.map((order) => (
                <article
                  key={order.orderId}
                  className="border border-border bg-card p-6 lg:p-8"
                >
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div>
                      <p className="font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">
                        {order.orderId}
                      </p>

                      <h2 className="mt-2 font-display text-2xl">
                        {order.customerName}
                      </h2>

                      <p className="mt-2 text-sm text-muted-foreground">
                        {order.email} · {order.phone}
                      </p>

                      {order.address && (
                        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                          {order.address}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="font-mono-brand text-lg text-primary">
                        ₦
                        {Number(
                          order.total,
                        ).toLocaleString()}
                      </p>

                      {order.paymentMethod && (
                        <p className="mt-1 font-mono-brand text-[9px] uppercase tracking-widest text-muted-foreground">
                          {order.paymentMethod}
                        </p>
                      )}
                    </div>
                  </div>
<div className="mt-6 border-t border-border pt-5">
  <p className="font-mono-brand text-[9px] uppercase tracking-[.18em] text-primary">
    Items
  </p>

  <div className="mt-3 space-y-2">
    {order.items.map((item, index) => (
      <div
        key={`${item.productId}-${item.size}-${item.color}-${index}`}
        className="flex flex-wrap items-center justify-between gap-3 text-sm"
      >
        <span>
          {item.productName}
          {" — "}
          Size {item.size}
          {item.color ? ` — Color ${item.color}` : ""}
          {" — Qty "}
          {item.quantity}
        </span>

        <span className="font-mono-brand text-primary">
          ₦{item.price.toLocaleString()}
        </span>
      </div>
    ))}
  </div>
</div>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <select
                      value={order.status}
                      disabled={
                        updating === order.orderId
                      }
                      onChange={(event) =>
                        void update(
                          order.orderId,
                          event.target.value,
                        )
                      }
                      className="border border-border bg-background px-4 py-3 font-mono-brand text-[10px] uppercase tracking-[.12em] text-foreground disabled:opacity-50"
                    >
                      {statuses.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {statusLabels[status] ||
                            status.replaceAll(
                              "_",
                              " ",
                            )}
                        </option>
                      ))}
                    </select>

                    <span className="text-sm text-muted-foreground">
                      {order.statusMessage ||
                        "Awaiting review"}
                    </span>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                No orders found, or this account is not
                the configured admin.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
