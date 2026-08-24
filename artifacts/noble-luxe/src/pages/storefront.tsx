import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ChevronDown, Heart, Minus, Plus, Search, ShoppingBag, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import {
  getHealthCheckQueryKey,
  getListFeaturedProductsQueryKey,
  getListProductsQueryKey,
  useHealthCheck,
  useListFeaturedProducts,
  useListProducts,
} from '@workspace/api-client-react';
import type { Product } from '@workspace/api-client-react';
import { FALLBACK_PRODUCTS, type CartItem, formatCurrency, productImage } from '@/lib/catalog';

type StorefrontProps = {
  cart: CartItem[];
  onAdd: (product: Product, size?: string) => void;
  onUpdate: (id: string, size: string, delta: number) => void;
  onRemove: (id: string, size: string) => void;
};

const categories = ['All pieces', 'Outerwear', 'Essentials', 'Trousers', 'Footwear', 'Accessories'];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={compact ? 'group inline-flex items-center' : 'group inline-flex items-center'} data-testid="link-brand-home">
      <span className="mr-2 inline-block h-2 w-2 rotate-45 bg-primary transition-transform duration-500 group-hover:rotate-90" />
      <span className="font-display text-[1.25rem] font-semibold tracking-[0.16em] text-foreground">{compact ? 'NL' : 'NOBLE LUXE'}</span>
    </Link>
  );
}

function Header({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed left-0 right-0 top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <button className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground md:hidden" onClick={() => setMenuOpen((open) => !open)} data-testid="button-toggle-menu">
          <span className="flex w-5 flex-col gap-1"><i className="h-px w-full bg-current" /><i className="h-px w-3 bg-current" /></span>
          Menu
        </button>
        <BrandMark />
        <nav className={`${menuOpen ? 'absolute left-0 top-[74px] flex' : 'hidden'} w-full flex-col gap-5 border-b border-border bg-background px-5 py-6 md:static md:flex md:w-auto md:flex-row md:border-0 md:bg-transparent md:p-0`} aria-label="Primary navigation">
          <a href="#collection" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-collection">Collection</a>
          <a href="#manifesto" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-manifesto">Manifesto</a>
          <a href="#journal" className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary" data-testid="link-journal">Journal</a>
        </nav>
        <button className="relative flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-primary" onClick={onCart} data-testid="button-open-cart">
          <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.3} />
          <span className="hidden sm:inline">Bag</span>
          <span className="absolute -right-3 -top-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-mono-brand text-[9px] text-primary-foreground" data-testid="text-cart-count">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: (product: Product, size?: string) => void }) {
  const [size, setSize] = useState(product.sizes?.[0] || 'One size');
  const [saved, setSaved] = useState(false);
  return (
    <article className="group animate-reveal-in" data-testid={`card-product-${product.id}`}>
      <div className="relative aspect-[.79] overflow-hidden bg-secondary">
        <img src={productImage(product)} alt={product.name} className="h-full w-full object-cover grayscale-[18%] transition duration-700 group-hover:scale-[1.045] group-hover:grayscale-0" loading="lazy" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-80" />
        {product.featured && <span className="absolute left-4 top-4 border border-primary/60 bg-background/80 px-2 py-1 font-mono-brand text-[9px] uppercase tracking-[0.18em] text-primary">House pick</span>}
        <button onClick={() => setSaved((value) => !value)} className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/25 bg-background/75 text-foreground backdrop-blur-sm transition hover:border-primary hover:text-primary" data-testid={`button-favorite-${product.id}`} aria-label={`Save ${product.name}`}>
          <Heart className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`} strokeWidth={1.4} />
        </button>
<button
onClick={() => onAdd(product, size)}
className="absolute bottom-4 left-4 right-4 bg-primary py-3 text-[10px] font-bold uppercase tracking-[0.19em] text-primary-foreground transition duration-300 hover:bg-accent"
data-testid={`button-add-product-${product.id}`}
>
Add to bag
</button>
      </div>
      <div className="flex items-start justify-between gap-4 pt-4">
        <div>
          <p className="mb-1 font-mono-brand text-[9px] uppercase tracking-[0.15em] text-muted-foreground">{product.category}</p>
          <h3 className="font-display text-[1.1rem] text-foreground">{product.name}</h3>
          <p className="mt-1 max-w-[250px] text-xs leading-relaxed text-muted-foreground">{product.description}</p>
        </div>
        <p className="shrink-0 font-mono-brand text-xs text-primary">{formatCurrency(product.price)}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        {(product.sizes?.length ? product.sizes : ['One size']).map((item) => (
          <button key={item} className={`border px-2.5 py-1 font-mono-brand text-[9px] transition ${size === item ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}`} onClick={() => setSize(item)} data-testid={`button-size-${product.id}-${item}`}>
            {item}
          </button>
        ))}
      </div>
    </article>
  );
}

function CartDrawer({ cart, open, onClose, onUpdate, onRemove }: { cart: CartItem[]; open: boolean; onClose: () => void; onUpdate: (id: string, size: string, delta: number) => void; onRemove: (id: string, size: string) => void }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return (
    <>
      {open && <button className="fixed inset-0 z-40 cursor-default bg-background/65 backdrop-blur-[2px]" onClick={onClose} aria-label="Close shopping bag" data-testid="button-close-cart-overlay" />}
      <aside className={`fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[470px] flex-col border-l border-border bg-card shadow-2xl transition-transform duration-500 ${open ? 'translate-x-0' : 'translate-x-full'}`} aria-label="Shopping bag">
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <div><p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">Private selection</p><h2 className="mt-1 font-display text-2xl">Your bag <span className="font-sans text-sm text-muted-foreground">({cart.length})</span></h2></div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center border border-border transition hover:border-primary hover:text-primary" data-testid="button-close-cart"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center"><ShoppingBag className="mb-5 h-8 w-8 text-primary" strokeWidth={1} /><p className="font-display text-xl">The bag is quiet.</p><p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-foreground">Add a considered piece from the collection to begin.</p></div>
          ) : cart.map((item) => (
            <div className="flex gap-4 border-b border-border py-5" key={`${item.id}-${item.selectedSize}`} data-testid={`row-cart-item-${item.id}`}>
              <img src={productImage(item)} alt="" className="h-24 w-[76px] object-cover" />
              <div className="min-w-0 flex-1"><div className="flex justify-between gap-2"><p className="font-display text-base">{item.name}</p><button onClick={() => onRemove(item.id, item.selectedSize)} className="text-muted-foreground hover:text-primary" data-testid={`button-remove-cart-${item.id}`}><X className="h-3.5 w-3.5" /></button></div><p className="mt-1 font-mono-brand text-[9px] uppercase tracking-wider text-muted-foreground">Size {item.selectedSize}</p><div className="mt-4 flex items-center justify-between"><div className="flex items-center border border-border"><button className="p-1.5 text-muted-foreground hover:text-primary" onClick={() => onUpdate(item.id, item.selectedSize, -1)} data-testid={`button-decrease-cart-${item.id}`}><Minus className="h-3 w-3" /></button><span className="w-7 text-center font-mono-brand text-xs">{item.quantity}</span><button className="p-1.5 text-muted-foreground hover:text-primary" onClick={() => onUpdate(item.id, item.selectedSize, 1)} data-testid={`button-increase-cart-${item.id}`}><Plus className="h-3 w-3" /></button></div><span className="font-mono-brand text-xs text-primary">{formatCurrency(item.price * item.quantity)}</span></div></div>
            </div>
          ))}
        </div>
        {cart.length > 0 && <div className="border-t border-border px-6 py-6"><div className="mb-5 flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono-brand text-primary" data-testid="text-cart-total">{formatCurrency(total)}</span></div><Link href="/checkout" onClick={onClose} className="flex w-full items-center justify-center bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground transition hover:bg-accent" data-testid="link-checkout">Proceed to checkout <ArrowUpRight className="ml-2 h-4 w-4" /></Link><p className="mt-4 text-center text-[10px] text-muted-foreground">Complimentary delivery across Nigeria</p></div>}
      </aside>
    </>
  );
}

export default function Storefront({ cart, onAdd, onUpdate, onRemove }: StorefrontProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All pieces');
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const params = useMemo(() => ({ ...(category !== 'All pieces' ? { category } : {}), ...(search ? { search } : {}) }), [category, search]);
  const productQuery = useListProducts(params, { query: { queryKey: getListProductsQueryKey(params) } });
  const featuredQuery = useListFeaturedProducts({ query: { queryKey: getListFeaturedProductsQueryKey() } });
  const health = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const apiProducts = (productQuery.data as Product[] | undefined) || [];
  const sourceProducts = productQuery.isError ? FALLBACK_PRODUCTS : apiProducts;
  const products = sourceProducts.filter((product) => {
    const matchesCategory = category === 'All pieces' || product.category.toLowerCase() === category.toLowerCase();
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || [product.name, product.category, product.description].some((value) => value.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });
  const featured = ((featuredQuery.data as Product[] | undefined) || []).length ? (featuredQuery.data as Product[]) : FALLBACK_PRODUCTS.filter((product) => product.featured);
  const isLoading = productQuery.isLoading && !productQuery.data;
  const isError = productQuery.isError && !productQuery.data;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="noble-noise min-h-[100dvh] overflow-hidden pt-[74px]">
      <Header cartCount={cartCount} onCart={() => setCartOpen(true)} />
      <main>
        <section className="relative mx-auto grid min-h-[calc(100dvh-74px)] max-w-[1440px] items-end px-5 pb-14 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-20 lg:pt-10">
          <div className="relative z-10 animate-rise-in lg:pb-10">
            <p className="mb-8 flex items-center gap-3 font-mono-brand text-[10px] uppercase tracking-[0.25em] text-primary"><span className="h-px w-10 bg-primary" /> Lagos / House 2025</p>
            <h1 className="max-w-[720px] font-display text-[clamp(4.2rem,10vw,9.8rem)] font-medium leading-[.84] tracking-[-.065em] text-foreground">Dress<br /><em className="text-primary">above</em><br />ordinary.</h1>
            <p className="mt-9 max-w-[370px] text-sm leading-[1.8] text-muted-foreground">A private edit of considered streetwear for people who leave an impression before they speak.</p>
            <a href="#collection" className="mt-10 inline-flex items-center border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.21em] text-primary transition hover:border-accent hover:text-accent" data-testid="link-shop-collection">Enter the collection <ArrowUpRight className="ml-2 h-4 w-4" /></a>
          </div>
          <div className="relative mt-14 h-[58vh] min-h-[450px] animate-reveal-in lg:mt-0 lg:h-[76vh]" style={{ animationDelay: '180ms' }}>
            <div className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 [writing-mode:vertical-rl] font-mono-brand text-[9px] uppercase tracking-[0.32em] text-muted-foreground">Noble Luxe / Form follows presence</div>
            <img src={productImage(featured[0] || FALLBACK_PRODUCTS[0])} alt="Noble Luxe signature outerwear" className="h-full w-full object-cover object-center grayscale-[12%]" />
            <div className="absolute inset-0 border border-primary/25" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between"><span className="font-mono-brand text-[9px] uppercase tracking-[0.2em] text-foreground/80">01 — Signature edit</span><span className="font-display text-2xl text-primary">N/L</span></div>
          </div>
        </section>

        <section id="manifesto" className="border-y border-border bg-card/50">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-20 lg:grid-cols-[.75fr_1.25fr] lg:px-10 lg:py-28">
            <p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">The house note / 001</p>
            <div><p className="max-w-3xl font-display text-[clamp(2rem,4vw,4.5rem)] leading-[1.03] tracking-[-.035em]">Luxury is not a volume. It is the <span className="text-primary">precision</span> of the choice.</p><p className="mt-8 max-w-lg text-sm leading-[1.9] text-muted-foreground">NOBLE LUXE makes fewer, better things. Every cut is intentional. Every finish earns its place. Built in Lagos, worn everywhere.</p></div>
          </div>
        </section>

        <section id="collection" className="mx-auto max-w-[1440px] px-5 py-20 lg:px-10 lg:py-28">
          <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">The current edit</p><h2 className="mt-3 font-display text-5xl tracking-[-.04em] lg:text-7xl">Objects of intent.</h2></div>
            <div className="flex w-full flex-col gap-4 lg:w-auto lg:items-end"><div className="flex items-center border-b border-border pb-2 focus-within:border-primary"><Search className="mr-2 h-4 w-4 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search the house" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70 lg:w-56" data-testid="input-search-products" /></div><button onClick={() => setFilterOpen((open) => !open)} className="flex items-center gap-2 self-start font-mono-brand text-[10px] uppercase tracking-[0.16em] text-muted-foreground hover:text-primary lg:hidden" data-testid="button-toggle-filters"><SlidersHorizontal className="h-3.5 w-3.5" /> Filter edit</button><div className={`${filterOpen ? 'flex' : 'hidden'} flex-wrap gap-2 lg:flex`}>{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap px-3 py-2 font-mono-brand text-[9px] uppercase tracking-[0.12em] transition ${category === item ? 'bg-primary text-primary-foreground' : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'}`} data-testid={`button-filter-${item.toLowerCase().replace(' ', '-')}`}>{item}</button>)}</div></div>
          </div>
          {isLoading ? <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <div key={item}><div className="skeleton aspect-[.79]" /><div className="skeleton mt-4 h-5 w-2/3" /><div className="skeleton mt-3 h-3 w-full" /></div>)}</div> : isError && !products.length ? <div className="border border-destructive/50 px-6 py-16 text-center"><p className="font-display text-2xl">The edit is temporarily private.</p><p className="mt-2 text-sm text-muted-foreground">We couldn't reach the showroom catalog.</p><button onClick={() => productQuery.refetch()} className="mt-6 border border-primary px-5 py-3 text-[10px] uppercase tracking-widest text-primary hover:bg-primary hover:text-primary-foreground" data-testid="button-retry-products">Try again</button></div> : products.length ? <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => (
<ProductCard
key={product.id}
product={product}
onAdd={(item, size) => {
onAdd(item, size);

setAddedItem(
`${item.name}${size ? ` — Size ${size}` : ''}`
);

window.setTimeout(() => {
setAddedItem(null);
}, 2500);
}}
/>
))} </div> : <div className="py-24 text-center"><Sparkles className="mx-auto mb-5 h-6 w-6 text-primary" /><p className="font-display text-2xl">No piece matches that search.</p><button onClick={() => { setSearch(''); setCategory('All pieces'); }} className="mt-5 text-[10px] uppercase tracking-widest text-primary hover:text-accent" data-testid="button-clear-filters">Clear filters</button></div>}
        </section>

        <section id="journal" className="border-y border-border bg-[#161512]">
          <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:items-center lg:px-10 lg:py-28">
            <div><p className="font-mono-brand text-[10px] uppercase tracking-[0.2em] text-primary">From the journal</p><h2 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[.98]">The city is a canvas. <span className="italic text-primary">Wear the mark.</span></h2><p className="mt-7 max-w-md text-sm leading-[1.8] text-muted-foreground">A study in contrast: sun on concrete, gold in shadow, a silhouette that knows where it is going.</p><button className="mt-9 inline-flex items-center border-b border-primary pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary hover:text-accent" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="button-read-journal">Read the field notes <ArrowUpRight className="ml-2 h-4 w-4" /></button></div>
            <div className="relative aspect-[1.15] overflow-hidden"><img src={productImage(featured[1] || FALLBACK_PRODUCTS[1])} alt="Noble Luxe atelier detail" className="h-full w-full object-cover grayscale-[25%] transition duration-700 hover:scale-105 hover:grayscale-0" /><div className="absolute inset-0 border border-primary/30" /><p className="absolute bottom-5 left-5 font-mono-brand text-[9px] uppercase tracking-[0.2em]">Lagos, 06:42 PM</p></div>
          </div>
        </section>
        <footer className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 py-12 text-[10px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><BrandMark compact /><p className="font-mono-brand uppercase tracking-[0.15em]">Private showroom / Est. 2025</p><p className="font-mono-brand uppercase tracking-[0.15em]">{health.data?.status === 'ok' ? 'Showroom online' : 'By appointment only'}</p></footer>
      </main>
      <CartDrawer
cart={cart}
open={cartOpen}
onClose={() => setCartOpen(false)}
onUpdate={onUpdate}
onRemove={onRemove}
/>

{addedItem && (
<div
className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2"
role="status"
>
<div className="flex min-w-[280px] items-center gap-4 border border-primary/40 bg-card/95 px-5 py-4 shadow-2xl backdrop-blur-xl">
<span className="flex h-7 w-7 items-center justify-center bg-primary text-primary-foreground">
✓
</span>

<div>
<p className="font-mono-brand text-[9px] uppercase tracking-[0.18em] text-primary">
Added to bag
</p>

<p className="mt-1 font-display text-sm text-foreground">
{addedItem}
</p>
</div>
</div>
</div>
)}
    </div>
    );
}
