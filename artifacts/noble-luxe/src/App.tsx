import { type ReactNode, useEffect, useState } from 'react';
import { ClerkProvider, SignIn, SignUp } from '@clerk/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/error-boundary';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import type { Product } from '@workspace/api-client-react';
import NotFound from '@/pages/not-found';
import Storefront from '@/pages/storefront';
import Checkout from '@/pages/checkout';
import Confirmation from '@/pages/confirmation';
import Contact from '@/pages/contact';
import Account from '@/pages/account';
import AdminOrders from '@/pages/admin-orders';
import type { CartItem } from '@/lib/catalog';

const queryClient = new QueryClient();
const CART_KEY = 'noble-luxe-cart';

function useCart() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || '[]') as CartItem[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

const add = (
  product: Product,
  selectedSize?: string,
  selectedColor?: string,
  selectedColorFront?: string,
  selectedColorBack?: string,
) =>
  setCart((current) => {
    const size =
      selectedSize ||
      product.sizes?.[0] ||
      "One size";

    const color =
      selectedColor ||
      product.colors?.[0] ||
      "Default";

    const existing = current.find(
      (item) =>
        item.id === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color,
    );

    return existing
      ? current.map((item) =>
          item === existing
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item,
        )
      : [
          ...current,
          {
            ...product,
            selectedSize: size,
            selectedColor: color,
            selectedColorFront,
            selectedColorBack,
            quantity: 1,
          },
        ];
  });

  const update = (id: string, size: string, delta: number) =>
    setCart((current) =>
      current.flatMap((item) =>
        item.id === id && item.selectedSize === size
          ? item.quantity + delta > 0
            ? [{ ...item, quantity: item.quantity + delta }]
            : []
          : [item]
      )
    );

  const remove = (id: string, size: string) =>
    setCart((current) =>
      current.filter(
        (item) => !(item.id === id && item.selectedSize === size)
      )
    );

  return { cart, add, update, remove };
}

function Router() {
  const cart = useCart();
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route
          path="/"
          component={() => (
            <Storefront
              cart={cart.cart}
              onAdd={cart.add}
              onUpdate={cart.update}
              onRemove={cart.remove}
            />
          )}
        />

        <Route
          path="/checkout"
          component={() => (
            <Checkout
              cart={cart.cart}
              onUpdate={cart.update}
              onRemove={cart.remove}
            />
          )}
        />

        <Route path="/confirmation/:orderId" component={Confirmation} />
        <Route path="/contact" component={Contact} />
        <Route path="/account" component={Account} />
        <Route path="/admin/orders" component={AdminOrders} />

        <Route
          path="/sign-in/*?"
          component={() => (
            <div className="min-h-screen bg-background p-5 pt-24">
              <SignIn
                routing="path"
                path={`${basePath}/sign-in`}
              />
            </div>
          )}
        />

        <Route
          path="/sign-up/*?"
          component={() => (
            <div className="min-h-screen bg-background p-5 pt-24">
              <SignUp
                routing="path"
                path={`${basePath}/sign-up`}
              />
            </div>
          )}
        />

        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      {children}
    </ErrorBoundary>
  );
}

export default function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={basePath}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
