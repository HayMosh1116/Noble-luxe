import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';

import {
  ArrowUpRight,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';

import {
  useHealthCheck,
  useListFeaturedProducts,
  useListProducts,
} from '@workspace/api-client-react';

import type { Product } from '@workspace/api-client-react';

import {
  FALLBACK_PRODUCTS,
  formatCurrency,
  getColorImages,
  getProductColors,
  productImage,
  type CartItem,
  type CatalogColor,
  type CatalogProduct,
} from '@/lib/catalog';

function WhatsAppSticky() {
  const phone = '2347026987674';
  const message = encodeURIComponent(
    'Hello NOBLE LUXE, I would like to make an enquiry about your collection.'
  );
  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Noble Luxe on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full border border-primary/30 bg-primary px-4 py-3 text-primary-foreground shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-accent sm:bottom-7 sm:right-7"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/15">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-current"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.55 0 .24 5.31.24 11.84c0 2.09.55 4.13 1.6 5.93L.14 24l6.38-1.67a11.82 11.82 0 0 0 5.56 1.39h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.17-1.23-6.14-3.41-8.4ZM12.09 21.7h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.79.99 1.01-3.7-.23-.38a9.82 9.82 0 0 1-1.5-5.19C2.19 6.4 6.62 1.97 12.09 1.97c2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.91 7.02c0 5.47-4.45 9.81-9.92 9.81Zm5.4-7.37c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.51-1.78-1.69-2.08-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.71.23 1.35.2 1.86.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </span>
      <span className="hidden font-mono-brand text-[10px] font-bold uppercase tracking-[0.16em] sm:inline">
        WhatsApp
      </span>
    </a>
  );
}

type StorefrontProps = {
  cart: CartItem[];

  onAdd: (
    product: Product,
    size?: string,
    color?: string,
    colorFront?: string,
    colorBack?: string,
  ) => void;

  onUpdate: (
    id: string,
    size: string,
    delta: number,
  ) => void;

  onRemove: (
    id: string,
    size: string,
  ) => void;
};

const categories = [
  'All pieces',
  'Essentials',
];

function BrandMark({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group inline-flex items-center"
      data-testid="link-brand-home"
    >
      <span className="mr-2 inline-block h-2 w-2 rotate-45 bg-primary transition-transform duration-500 group-hover:rotate-90" />

      <span className="font-display text-[1.25rem] font-semibold tracking-[0.16em] text-foreground">
        {compact ? 'NL' : 'NOBLE LUXE'}
      </span>
    </Link>
  );
}

function Header({
  cartCount,
  onCart,
}: {
  cartCount: number;
  onCart: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">

        <button
          className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground md:hidden"
          onClick={() =>
            setMenuOpen((open) => !open)
          }
          data-testid="button-toggle-menu"
        >
          <span className="flex w-5 flex-col gap-1">
            <i className="h-px w-full bg-current" />
            <i className="h-px w-3 bg-current" />
          </span>

          Menu
        </button>

        <BrandMark />

        <nav
          className={`${
            menuOpen
              ? 'absolute left-0 top-[74px] flex'
              : 'hidden'
          } w-full flex-col gap-5 border-b border-border bg-background px-5 py-6 md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`}
        >
          <a
            href="#collection"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Collection
          </a>

          <a
            href="#manifesto"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Manifesto
          </a>

          <a
            href="#journal"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Journal
          </a>

          <Link
            href="/contact"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Contact
          </Link>

          <Link
            href="/account"
            className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            Account
          </Link>
        </nav>

        <button
          className="relative flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] hover:text-primary"
          onClick={onCart}
          data-testid="button-open-cart"
        >
          <ShoppingBag
            className="h-[18px] w-[18px]"
            strokeWidth={1.3}
          />

          <span className="hidden sm:inline">
            Bag
          </span>

          <span
            className="absolute -right-3 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono-brand text-[9px] text-primary-foreground"
            data-testid="text-cart-count"
          >
            {cartCount}
          </span>
        </button>
      </div>
    </header>
  );
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;

  onAdd: (
    product: Product,
    size?: string,
    color?: string,
    colorFront?: string,
    colorBack?: string,
  ) => void;
}) {
  const catalogProduct =
    product as CatalogProduct;

  const availableColors =
    getProductColors(product);

  const [size, setSize] = useState(
    product.sizes?.[0] || 'XL',
  );

  const [selectedColor, setSelectedColor] =
    useState(
      availableColors[0]?.name ||
        product.colors?.[0] ||
        'Default',
    );

  const [showBack, setShowBack] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [showTapHint, setShowTapHint] =
    useState(true);

  const selectedImages =
    getColorImages(
      product,
      selectedColor,
    );

  useEffect(() => {
    setShowBack(false);
    setShowTapHint(true);

    const timer =
      window.setTimeout(() => {
        setShowTapHint(false);
      }, 6000);

    return () =>
      window.clearTimeout(timer);
  }, [selectedColor]);

  const handleProductTap = () => {
    if (!selectedImages.back) return;

    setShowBack((current) => !current);
    setShowTapHint(false);
  };

  const handleColorChange = (
    color: CatalogColor,
  ) => {
    setSelectedColor(color.name);
    setShowBack(false);
    setShowTapHint(true);
  };

  return (
    <article
      className="group animate-reveal-in"
      data-testid={`card-product-${product.id}`}
    >
      <div
        className="relative aspect-[.79] cursor-pointer overflow-hidden bg-secondary"
        onClick={handleProductTap}
        role={
          selectedImages.back
            ? 'button'
            : undefined
        }
        tabIndex={
          selectedImages.back
            ? 0
            : undefined
        }
        onKeyDown={(event) => {
          if (
            selectedImages.back &&
            (event.key === 'Enter' ||
              event.key === ' ')
          ) {
            event.preventDefault();
            handleProductTap();
          }
        }}
      >
        <img
          src={
            showBack &&
            selectedImages.back
              ? selectedImages.back
              : selectedImages.front
          }
          alt={`${product.name} ${
            showBack ? 'back' : 'front'
          }`}
          className="h-full w-full object-cover grayscale-[18%] transition duration-500 group-hover:scale-[1.025] group-hover:grayscale-0"
          loading="lazy"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

        {product.featured && (
          <span className="absolute left-4 top-4 border border-primary/60 bg-background/85 px-2 py-1 font-mono-brand text-[9px] uppercase tracking-[0.18em] text-primary">
            House pick
          </span>
        )}

        <button
          onClick={(event) => {
            event.stopPropagation();
            setSaved((value) => !value);
          }}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/25 bg-background/75 text-foreground backdrop-blur-sm transition hover:border-primary hover:text-primary"
          data-testid={`button-favorite-${product.id}`}
        >
          <Heart
            className={`h-4 w-4 ${
              saved
                ? 'fill-primary text-primary'
                : ''
            }`}
            strokeWidth={1.4}
          />
        </button>

        {selectedImages.back && (
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 z-10 w-[calc(100%-40px)] -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 ${
              showTapHint
                ? 'scale-100 opacity-100'
                : 'scale-95 opacity-0'
            }`}
          >
            <div className="mx-auto max-w-[260px] border-2 border-primary bg-background/95 px-5 py-4 shadow-[0_0_35px_rgba(255,255,255,0.12)] backdrop-blur-md">
              <p className="animate-pulse font-mono-brand text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                ↕ Tap to see the back
              </p>

              <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-foreground">
                Front / Back view available
              </p>
            </div>
          </div>
        )}

        <div
          className="absolute bottom-4 left-4 right-4"
          onClick={(event) =>
            event.stopPropagation()
          }
        >
          <button
            onClick={() =>
              onAdd(
                product,
                size,
                selectedColor,
                selectedImages.front,
                selectedImages.back,
              )
            }
            className="w-full bg-primary py-3 text-[10px] font-bold uppercase tracking-[0.19em] text-primary-foreground transition duration-300 hover:bg-accent"
            data-testid={`button-add-product-${product.id}`}
          >
            Add to bag
          </button>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="mb-1 font-mono-brand text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
            {product.category}
          </p>

          <h3 className="font-display text-[1.1rem] text-foreground">
            {product.name}
          </h3>

          <p className="mt-1 max-w-[250px] text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        </div>

        <p className="shrink-0 font-mono-brand text-xs text-primary">
          {formatCurrency(product.price)}
        </p>
      </div>

      {availableColors.length > 0 && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-mono-brand text-[9px] font-bold uppercase tracking-[0.15em] text-primary">
              Choose colour
            </p>

            <p className="font-mono-brand text-[9px] uppercase tracking-wider text-muted-foreground">
              {selectedColor}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableColors.map(
              (color) => (
                <button
                  key={color.name}
                  type="button"
                  onClick={() =>
                    handleColorChange(color)
                  }
                  className={`rounded-sm border px-3 py-1.5 font-mono-brand text-[9px] uppercase transition ${
                    selectedColor ===
                    color.name
                      ? 'border-primary bg-primary text-primary-foreground shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                      : 'border-border bg-background text-muted-foreground hover:border-primary hover:text-primary'
                  }`}
                  data-testid={`button-color-${product.id}-${color.name}`}
                >
                  {color.name}
                </button>
              ),
            )}
          </div>
        </div>
      )}

      <div className="mt-3">
        <p className="mb-2 font-mono-brand text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
          Size
        </p>

        <div className="flex items-center gap-2">
          {(product.sizes?.length
            ? product.sizes
            : ['XL', 'XXL']
          ).map((item) => (
            <button
              key={item}
              type="button"
              className={`border px-3 py-1.5 font-mono-brand text-[9px] transition ${
                size === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
              }`}
              onClick={() =>
                setSize(item)
              }
              data-testid={`button-size-${product.id}-${item}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {selectedImages.back && (
        <button
          type="button"
          onClick={handleProductTap}
          className="mt-3 font-mono-brand text-[8px] uppercase tracking-[0.12em] text-primary hover:text-accent"
        >
          {showBack
            ? '← Tap to return to front'
            : 'Tap to see back →'}
        </button>
      )}
    </article>
  );
}

function CartDrawer({
  cart,
  open,
  onClose,
  onUpdate,
  onRemove,
}: {
  cart: CartItem[];
  open: boolean;
  onClose: () => void;

  onUpdate: (
    id: string,
    size: string,
    delta: number,
  ) => void;

  onRemove: (
    id: string,
    size: string,
  ) => void;
}) {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0,
  );

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 z-40 cursor-default bg-background/65 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label="Close shopping bag"
        />
      )}

      <aside
        className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[470px] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-500 ${
          open
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <div>
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">
              Private selection
            </p>

            <h2 className="mt-1 font-display text-2xl">
              Your bag{' '}
              <span className="font-sans text-sm text-muted-foreground">
                ({cart.length})
              </span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center border border-border hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <ShoppingBag
                className="mb-5 h-8 w-8 text-primary"
                strokeWidth={1}
              />

              <p className="font-display text-xl">
                The bag is quiet.
              </p>

              <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                Add a considered piece from the collection to begin.
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                className="flex gap-4 border-b border-border py-5"
                key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              >
                <img
                  src={
                    item.selectedColorFront ||
                    productImage(item)
                  }
                  alt={item.name}
                  className="h-24 w-[76px] object-cover"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <p className="font-display text-base">
                      {item.name}
                    </p>

                    <button
                      onClick={() =>
                        onRemove(
                          item.id,
                          item.selectedSize,
                        )
                      }
                      className="text-muted-foreground hover:text-primary"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="mt-1 font-mono-brand text-[9px] uppercase tracking-wider text-muted-foreground">
                    Size {item.selectedSize}
                  </p>

                  {item.selectedColor && (
                    <p className="mt-1 font-mono-brand text-[9px] uppercase tracking-wider text-primary">
                      Colour {item.selectedColor}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <button
                        className="p-1.5 text-muted-foreground hover:text-primary"
                        onClick={() =>
                          onUpdate(
                            item.id,
                            item.selectedSize,
                            -1,
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </button>

                      <span className="w-7 text-center font-mono-brand text-xs">
                        {item.quantity}
                      </span>

                      <button
                        className="p-1.5 text-muted-foreground hover:text-primary"
                        onClick={() =>
                          onUpdate(
                            item.id,
                            item.selectedSize,
                            1,
                          )
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-mono-brand text-xs text-primary">
                      {formatCurrency(
                        item.price *
                          item.quantity,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-border px-6 py-6">
            <div className="mb-5 flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span className="font-mono-brand text-primary">
                {formatCurrency(total)}
              </span>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-accent"
            >
              Proceed to checkout

              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>

            <p className="mt-4 text-center text-[10px] text-muted-foreground">
              Complimentary delivery across Nigeria
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

export default function Storefront({
  cart,
  onAdd,
  onUpdate,
  onRemove,
}: StorefrontProps) {
  const [search, setSearch] =
    useState('');

  const [category, setCategory] =
    useState('All pieces');

  const [cartOpen, setCartOpen] =
    useState(false);

  const [addedMessage, setAddedMessage] =
    useState('');

  const [filterOpen, setFilterOpen] =
    useState(false);

  const { toast } = useToast();

  const params = useMemo(
    () => ({
      ...(category !== 'All pieces'
        ? { category }
        : {}),
      ...(search
        ? { search }
        : {}),
    }),
    [category, search],
  );

  const productQuery =
    useListProducts(params);

  const featuredQuery =
    useListFeaturedProducts();

  const health =
    useHealthCheck();

  /*
   * IMPORTANT:
   *
   * The local catalogue is now the source of truth.
   * This prevents old API products from replacing
   * the five products you supplied.
   */

  const localProducts =
    FALLBACK_PRODUCTS.filter(
      (product) => {
        const matchesCategory =
          category === 'All pieces' ||
          product.category ===
            category;

        const searchText =
          search.trim().toLowerCase();

        const matchesSearch =
          !searchText ||
          product.name
            .toLowerCase()
            .includes(searchText) ||
          product.description
            .toLowerCase()
            .includes(searchText);

        return (
          matchesCategory &&
          matchesSearch
        );
      },
    );

  const products =
    localProducts;

  const featured =
    FALLBACK_PRODUCTS.filter(
      (product) =>
        product.featured,
    );

  const isLoading =
    productQuery.isLoading &&
    !productQuery.data;

  const cartCount =
    cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0,
    );

  const handleAdd = (
    product: Product,
    size?: string,
    color?: string,
    colorFront?: string,
    colorBack?: string,
  ) => {
    onAdd(
      product,
      size,
      color,
      colorFront,
      colorBack,
    );

    toast({
      title: 'Added to bag',
      description: `${product.name}${
        color
          ? ` — ${color}`
          : ''
      }${
        size
          ? ` — Size ${size}`
          : ''
      }`,
    });

    setAddedMessage(
      `${product.name}${
        color
          ? ` · ${color}`
          : ''
      } added to your bag`,
    );

    window.setTimeout(
      () =>
        setAddedMessage(''),
      2500,
    );
  };

  return (
    <div className="noble-noise min-h-[100dvh] pt-[74px]">
      {addedMessage && (
        <div className="fixed right-5 top-24 z-50 border border-primary bg-card px-5 py-4 font-mono-brand text-[10px] uppercase tracking-[.14em] text-primary shadow-2xl">
          {addedMessage}
        </div>
      )}

      <Header
        cartCount={cartCount}
        onCart={() =>
          setCartOpen(true)
        }
      />

      <main>
        <section className="relative mx-auto grid min-h-[calc(100dvh-74px)] max-w-[1440px] items-end px-5 pb-14 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-20 lg:pt-10">
          <div className="relative z-10 animate-rise-in lg:pb-10">
            <p className="mb-8 flex items-center gap-3 font-mono-brand text-[10px] uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-10 bg-primary" />
              Lagos / House 2026
            </p>

            <h1 className="max-w-[720px] font-display text-[clamp(4.2rem,10vw,9.8rem)] font-medium leading-[.84] tracking-[-.065em] text-foreground">
              Dress
              <br />
              <em className="text-primary">
                above
              </em>
              <br />
              ordinary.
            </h1>

            <p className="mt-9 max-w-[370px] text-sm leading-[1.8] text-muted-foreground">
              A private edit of considered
              streetwear for people who
              leave an impression before
              they speak.
            </p>

            <a
              href="#collection"
              className="mt-10 inline-flex items-center border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.21em] text-primary hover:text-accent"
            >
              Enter the collection

              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          </div>

          <div
            className="relative mt-14 h-[58vh] min-h-[450px] animate-reveal-in lg:mt-0 lg:h-[76vh]"
            style={{
              animationDelay:
                '180ms',
            }}
          >
            <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 [writing-mode:vertical-rl] font-mono-brand text-[9px] uppercase tracking-[0.32em] text-muted-foreground">
              Noble Luxe / Form follows presence
            </div>

            <img
              src={productImage(
                featured[0],
              )}
              alt="Noble Luxe signature piece"
              className="h-full w-full object-cover object-center grayscale-[12%]"
            />

            <div className="absolute inset-0 border border-primary/25" />

            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <span className="font-mono-brand text-[9px] uppercase tracking-[0.2em] text-foreground/80">
                01 — Signature edit
              </span>

              <span className="font-display text-2xl text-primary">
                N/L
              </span>
            </div>
          </div>
        </section>

        <section
          id="manifesto"
          className="border-y border-border bg-card/50"
        >
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-[.75fr_1.25fr] lg:px-10 lg:py-28">
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">
              The house note / 001
            </p>

            <div>
              <p className="max-w-3xl font-display text-[clamp(2rem,4vw,4.5rem)] leading-[1.03] tracking-[-.035em]">
                Luxury is not a volume.
                It is the{' '}
                <span className="text-primary">
                  precision
                </span>{' '}
                of the choice.
              </p>

              <p className="mt-8 max-w-lg text-sm leading-[1.9] text-muted-foreground">
                NOBLE LUXE makes fewer,
                better things. Every cut
                is intentional. Every finish
                earns its place. Built in
                Lagos, worn everywhere.
              </p>
            </div>
          </div>
        </section>

        <section
          id="collection"
          className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28"
        >
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">
                The current edit
              </p>

              <h2 className="mt-3 font-display text-5xl tracking-[-.04em] lg:text-7xl">
                Objects of intent.
              </h2>
            </div>

            <div className="flex w-full flex-col gap-4 lg:w-auto lg:items-end">
              <div className="flex items-center border-b border-border pb-2 focus-within:border-primary">
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value,
                    )
                  }
                  placeholder="Search the house"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 lg:w-56"
                />
              </div>

              <button
                onClick={() =>
                  setFilterOpen(
                    (open) => !open,
                  )
                }
                className="flex items-center gap-2 self-start font-mono-brand text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter edit
              </button>

              <div
                className={`${
                  filterOpen
                    ? 'flex'
                    : 'hidden'
                } flex-wrap gap-2 lg:flex`}
              >
                {categories.map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() =>
                        setCategory(
                          item,
                        )
                      }
                      className={`whitespace-nowrap px-3 py-2 font-mono-brand text-[9px] uppercase tracking-[0.12em] transition ${
                        category ===
                        item
                          ? 'bg-primary text-primary-foreground'
                          : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                      }`}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5].map(
                (item) => (
                  <div key={item}>
                    <div className="skeleton aspect-[.79]" />
                    <div className="skeleton mt-4 h-5 w-2/3" />
                    <div className="skeleton mt-3 h-3 w-full" />
                  </div>
                ),
              )}
            </div>
          ) : products.length ? (
            <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAdd={handleAdd}
                  />
                ),
              )}
            </div>
          ) : (
            <div className="py-24 text-center">
              <Sparkles className="mx-auto mb-5 h-6 w-6 text-primary" />

              <p className="font-display text-2xl">
                No piece matches that search.
              </p>

              <button
                onClick={() => {
                  setSearch('');
                  setCategory(
                    'All pieces',
                  );
                }}
                className="mt-5 text-[10px] uppercase tracking-widest text-primary hover:text-accent"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section
          id="journal"
          className="border-y border-border bg-[#161512]"
        >
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-10 lg:py-28">
            <div>
              <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">
                From the journal
              </p>

              <h2 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.98]">
                The city is a
                canvas.{' '}
                <span className="italic text-primary">
                  Wear the mark.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-[1.8] text-muted-foreground">
                A study in contrast:
                sun on concrete, gold
                in shadow, a silhouette
                that knows where it is
                going.
              </p>

              <button
                className="mt-9 inline-flex items-center border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent"
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              >
                Read the field notes

                <ArrowUpRight className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="relative aspect-[1.15] overflow-hidden">
              <img
                src={productImage(
                  featured[1] ||
                    featured[0],
                )}
                alt="Noble Luxe collection detail"
                className="h-full w-full object-cover grayscale-[25%] transition duration-700 hover:scale-105 hover:grayscale-0"
              />

              <div className="absolute inset-0 border border-primary/30" />

              <p className="absolute bottom-5 left-5 font-mono-brand text-[9px] uppercase tracking-[0.2em]">
                Lagos / Noble Luxe
              </p>
            </div>
          </div>
        </section>

        <footer className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-12 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <BrandMark compact />

          <p className="font-mono-brand uppercase tracking-[0.15em]">
            Private showroom / Est. 2026
          </p>

          <p className="font-mono-brand uppercase tracking-[0.15em]">
            {health.data?.status ===
            'ok'
              ? 'Showroom online'
              : 'By appointment only'}
          </p>
        </footer>
      </main>
      <WhatsAppSticky  />
    
      <CartDrawer
        cart={cart}
        open={cartOpen}
        onClose={() =>
          setCartOpen(false)
        }
        onUpdate={onUpdate}
        onRemove={onRemove}
      />
    </div>
  );
}
