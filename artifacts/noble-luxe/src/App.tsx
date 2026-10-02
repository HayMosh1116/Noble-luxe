import { type ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, useAuth, useUser } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setAuthTokenGetter, setBaseUrl } from '@workspace/api-client-react';
import { getApiBaseUrl } from '@/lib/api-base';
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
import AdminInventory from '@/pages/admin-inventory';
import { type CartItem, apiLoadCart, apiSaveCart } from '@/lib/catalog';

const queryClient = new QueryClient();

function ClerkApiAuthBridge() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(getToken);
    return () => {
      setAuthTokenGetter(null);
    };
  }, [getToken]);

  return null;
}

function useAccountCart() {
  const { user, isLoaded, isSignedIn } = useUser();
  const userId = user?.id || null;
  const prevUserIdRef = useRef<string | null>(null);

  const getStorageKey = (uid: string | null) =>
    uid ? `noble-luxe-cart-user-${uid}` : 'noble-luxe-cart-guest';

  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const key = getStorageKey(userId);
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  });

  // When user switches or logs out, immediately switch to that account's cart!
  useEffect(() => {
    if (!isLoaded) return;

    if (prevUserIdRef.current !== userId) {
      prevUserIdRef.current = userId;

      const key = getStorageKey(userId);
      let initial: CartItem[] = [];
      try {
        initial = JSON.parse(localStorage.getItem(key) || '[]');
      } catch {
        initial = [];
      }
      setCart(initial);

      // If signed in, fetch persisted cart from backend database
      if (isSignedIn && userId) {
        apiLoadCart()
          .then((serverCart) => {
            if (Array.isArray(serverCart)) {
              setCart(serverCart);
              localStorage.setItem(key, JSON.stringify(serverCart));
            }
          })
          .catch((err) => console.error('Failed to load server bag:', err));
      }
    }
  }, [userId, isLoaded, isSignedIn]);

  // Sync cart changes to local user-scoped storage & backend DB
  const persistCart = useCallback(
    (newCart: CartItem[]) => {
      const key = getStorageKey(userId);
      try {
        localStorage.setItem(key, JSON.stringify(newCart));
      } catch (e) {
        console.error('Error saving local cart:', e);
      }
      if (isSignedIn) {
        apiSaveCart(true, newCart).catch((err) =>
          console.error('Failed to sync bag to DB:', err),
        );
      }
    },
    [userId, isSignedIn],
  );

  const add = (
    product: Product,
    selectedSize?: string,
    selectedColor?: string,
    selectedColorFront?: string,
    selectedColorBack?: string,
  ): { success: boolean; remaining: number; maxStock: number } => {
    let result = { success: true, remaining: 0, maxStock: 0 };
    setCart((current) => {
      const stock = typeof (product as any).stock === 'number' ? (product as any).stock : 999;
      const currentCount = current
        .filter((item) => item.id === product.id)
        .reduce((sum, item) => sum + item.quantity, 0);

      if (currentCount >= stock) {
        result = { success: false, remaining: 0, maxStock: stock };
        return current;
      }

      const size = selectedSize || product.sizes?.[0] || 'One size';
      const color = selectedColor || product.colors?.[0] || 'Default';

      const existing = current.find(
        (item) =>
          item.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color,
      );

      const next = existing
        ? current.map((item) =>
            item === existing
              ? { ...item, quantity: item.quantity + 1, stock }
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
              stock,
            },
          ];
      result = { success: true, remaining: Math.max(0, stock - (currentCount + 1)), maxStock: stock };
      persistCart(next);
      return next;
    });
    return result;
  };

  const update = (id: string, size: string, delta: number) => {
    setCart((current) => {
      if (delta > 0) {
        const item = current.find((i) => i.id === id && i.selectedSize === size);
        const stock = typeof (item as any)?.stock === 'number' ? (item as any).stock : 999;
        const currentCount = current
          .filter((i) => i.id === id)
          .reduce((sum, i) => sum + i.quantity, 0);
        if (currentCount >= stock) {
          return current;
        }
      }
      const next = current.flatMap((item) =>
        item.id === id && item.selectedSize === size
          ? item.quantity + delta > 0
            ? [{ ...item, quantity: item.quantity + delta }]
            : []
          : [item],
      );
      persistCart(next);
      return next;
    });
  };

  const remove = (id: string, size: string) => {
    setCart((current) => {
      const next = current.filter(
        (item) => !(item.id === id && item.selectedSize === size),
      );
      persistCart(next);
      return next;
    });
  };

  const clear = () => {
    setCart([]);
    persistCart([]);
  };

  return { cart, add, update, remove, clear };
}

function Router() {
  const cart = useAccountCart();
  const { theme, toggleTheme } = useTheme();
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
              theme={theme}
              onToggleTheme={toggleTheme}
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
              onClear={cart.clear}
            />
          )}
        />

        <Route path="/confirmation/:orderId" component={Confirmation} />
        <Route path="/contact" component={Contact} />
        <Route path="/account" component={Account} />
        <Route path="/admin-orders" component={AdminOrders} />
        <Route path="/admin-inventory" component={AdminInventory} />
        <Route path="/admin/inventory" component={AdminInventory} />

        <Route
          path="/sign-in/*?"
          component={() => (
            <div className="min-h-screen bg-background p-5 pt-24">
              <SignIn
                routing="path"
                path={`${basePath}/sign-in`}
                signUpUrl={`${basePath}/sign-up`}
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
                signInUrl={`${basePath}/sign-in`}
              />
            </div>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();

  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('noble-luxe-theme');

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('noble-luxe-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}

export default function App() {
  setBaseUrl(getApiBaseUrl());
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const hostname = window.location.hostname;
  const clerkHost =
    hostname === 'www.nobleluxe18.com.ng' ? 'nobleluxe18.com.ng' : hostname;
  const clerkPubKey = publishableKeyFromHost(
    clerkHost,
    import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  );

  if (!clerkPubKey) {
    throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY');
  }

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      signInForceRedirectUrl={`${basePath}/account`}
      signUpForceRedirectUrl={`${basePath}/account`}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkApiAuthBridge />
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
