import { useEffect, useState } from "react";
import {
  SignInButton,
  useAuth,
  useUser,
} from "@clerk/react";
import { Link } from "wouter";

type Order = {
  orderId: string;
  total: string;
  paymentMethod: string;
  status: string;
  statusMessage?: string | null;
  createdAt: string;
  updatedAt?: string;
};

const labels: Record<string, string> = {
  pending: "Payment pending review",
  confirmed: "Payment confirmed",
  processing: "Preparing your order",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function Orders() {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const token = await getToken();

        const response = await fetch(
          "/api/orders/me",
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
          throw new Error(
            "Unable to load your orders.",
          );
        }

        const data = (await response.json()) as Order[];

        if (!cancelled) {
          setOrders(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "We couldn't load your orders. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user?.id, getToken]);

  return (
    <main className="mx-auto max-w-[1100px] px-5 pb-24 pt-36 lg:px-10">
      <p className="font-mono-brand text-[10px] uppercase tracking-[.2em] text-primary">
        Your private account
      </p>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-5">
        <h1 className="font-display text-6xl leading-none">
          Your orders.
        </h1>

        <span className="text-sm text-muted-foreground">
          {user?.firstName ||
            user?.primaryEmailAddress?.emailAddress}
        </span>
      </div>

      {loading && (
        <div className="mt-14 border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Loading your private order history…
        </div>
      )}

      {error && !loading && (
        <div className="mt-14 border border-destructive/50 bg-destructive/5 p-6 text-sm text-destructive">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-14 space-y-4">
          {orders.length ? (
            orders.map((order) => (
              <article
                key={order.orderId}
                className="border border-border bg-card p-6 lg:p-8"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-mono-brand text-[10px] uppercase tracking-[.18em] text-primary">
                      {order.orderId}
                    </p>

                    <h2 className="mt-2 font-display text-2xl">
                      {labels[order.status] ||
                        order.status.replaceAll(
                          "_",
                          " ",
                        )}
                    </h2>
                  </div>

                  <p className="font-mono-brand text-lg text-primary">
                    ₦
                    {Number(
                      order.total,
                    ).toLocaleString()}
                  </p>
                </div>

                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  {order.statusMessage ||
                    "We will keep you updated as your order moves through the atelier."}
                </p>

                <div className="mt-5 flex flex-wrap gap-3 font-mono-brand text-[9px] uppercase tracking-[.15em] text-muted-foreground">
                  <span>
                    {new Date(
                      order.createdAt,
                    ).toLocaleDateString()}
                  </span>

                  <span>·</span>

                  <span>
                    {order.paymentMethod}
                  </span>
                </div>
              </article>
            )
          ) : (
            <div className="border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              Your order history will appear here
              after checkout.
            </div>
          )}
        </div>
      )}
    </main>
  );
}

export default function Account() {
  const { isSignedIn, isLoaded } = useAuth();

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

          <Link
            href="/"
            className="text-[10px] uppercase tracking-[.18em] text-muted-foreground hover:text-primary"
          >
            Return to showroom
          </Link>
        </div>
      </header>

      {!isLoaded ? (
        <main className="mx-auto max-w-lg px-5 pb-24 pt-44 text-center">
          <p className="text-sm text-muted-foreground">
            Loading your account…
          </p>
        </main>
      ) : isSignedIn ? (
        <Orders />
      ) : (
        <main className="mx-auto max-w-lg px-5 pb-24 pt-44 text-center">
          <h1 className="font-display text-5xl">
            Enter the house.
          </h1>

          <p className="mt-5 text-sm leading-7 text-muted-foreground">
            Sign in to see your order history and live
            delivery updates.
          </p>

          <SignInButton mode="modal">
            <button className="mt-9 bg-primary px-7 py-4 text-[10px] font-bold uppercase tracking-[.2em] text-primary-foreground">
              Sign in / Sign up
            </button>
          </SignInButton>
        </main>
      )}
    </div>
  );
}
