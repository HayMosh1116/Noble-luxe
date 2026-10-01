import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Package,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
} from 'lucide-react';
import {
  NOBLE_COLLECTIONS,
  getLiveCatalog,
  saveLiveCatalog,
  updateProductStock,
  deleteProduct,
  resetCatalogToDefault,
  formatCurrency,
  type CatalogProduct,
  type CollectionName,
} from '@/lib/catalog';
import { useToast } from '@/hooks/use-toast';


const MASTER_PIN_KEY = 'noble_luxe_admin_pin';
const MASTER_SESSION_KEY = 'noble_luxe_admin_unlocked';
const DEFAULT_MASTER_PIN = '1116';

export default function AdminInventory() {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(MASTER_SESSION_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [changePinError, setChangePinError] = useState('');

  const getActivePin = () => {
    try {
      return localStorage.getItem(MASTER_PIN_KEY) || DEFAULT_MASTER_PIN;
    } catch {
      return DEFAULT_MASTER_PIN;
    }
  };

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const activePin = getActivePin();
    if (pinInput.trim() === activePin) {
      sessionStorage.setItem(MASTER_SESSION_KEY, 'true');
      setIsUnlocked(true);
      setPinError('');
      setPinInput('');
      toast({
        title: 'Access Granted',
        description: 'Noble Luxe Stock Desk unlocked.',
      });
    } else {
      setPinError('Incorrect master passcode. Access denied.');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem(MASTER_SESSION_KEY);
    setIsUnlocked(false);
    toast({
      title: 'Desk Locked',
      description: 'Stock manager has been locked.',
    });
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setChangePinError('');
    const activePin = getActivePin();
    if (currentPinInput.trim() !== activePin) {
      setChangePinError('Current passcode is incorrect.');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setChangePinError('New passcode must be at least 4 digits/characters.');
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setChangePinError('New passcodes do not match.');
      return;
    }
    localStorage.setItem(MASTER_PIN_KEY, newPinInput.trim());
    setShowChangePinModal(false);
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    toast({
      title: 'Passcode Updated',
      description: 'Your master passcode has been changed successfully.',
    });
  };

  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('All Pieces');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
  const [draftStocks, setDraftStocks] = useState<Record<string, number>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const { toast } = useToast();

  const loadProducts = () => {
    setProducts(getLiveCatalog());
  };

  useEffect(() => {
    loadProducts();
    const handleUpdate = () => loadProducts();
    window.addEventListener('noble_luxe_catalog_updated', handleUpdate);
    return () => window.removeEventListener('noble_luxe_catalog_updated', handleUpdate);
  }, []);

  const handleCommitStock = (id: string) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;
    const targetStock = draftStocks[id] !== undefined ? draftStocks[id] : (p.stock ?? 0);
    const finalStock = Math.max(0, targetStock);
    updateProductStock(id, finalStock);
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: finalStock } : item))
    );
    toast({
      title: 'Stock Updated',
      description: `${p.name} stock set to ${finalStock}.`,
    });
  };

  const handleStockChange = (id: string, delta: number) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;
    const newStock = Math.max(0, (p.stock ?? 0) + delta);
    updateProductStock(id, newStock);
    setDraftStocks((prev) => ({ ...prev, [id]: newStock }));
    setProducts((prev) => prev.map((item) => (item.id === id ? { ...item, stock: newStock } : item)));
    toast({
      title: 'Stock Updated',
      description: `${p.name} stock set to ${newStock}`,
    });
  };

  const handleSetStockDirect = (id: string, val: string) => {
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0) return;
    updateProductStock(id, num);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteProduct(id);
      toast({
        title: 'Product Deleted',
        description: `${name} has been removed.`,
      });
    }
  };

  const handleReset = () => {
    if (confirm('Reset all stock and products back to the original default catalogue?')) {
      resetCatalogToDefault();
      toast({
        title: 'Catalogue Reset',
        description: 'All products and stock levels restored to defaults.',
      });
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const primaryColor = editingProduct.colors?.[0] || 'Black';
    const updatedProduct: CatalogProduct = {
      ...editingProduct,
      colorImages: {
        ...(editingProduct.colorImages || {}),
        [primaryColor]: {
          name: primaryColor,
          front: editingProduct.imageUrl,
          back: editingBackImageUrl.trim() ? editingBackImageUrl.trim() : undefined,
        },
      },
    };
    const current = getLiveCatalog();
    const updated = current.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
    saveLiveCatalog(updated);
    setProducts(updated);
    setEditingProduct(null);
    toast({
      title: 'Product Saved',
      description: `${updatedProduct.name} changes have been saved.`,
    });
  };

  const [newProduct, setNewProduct] = useState<Partial<CatalogProduct> & { backImageUrl?: string }>({
    id: `nl-${Date.now().toString().slice(-4)}`,
    name: '',
    collection: 'Round Necks',
    category: 'Round Necks',
    price: 10000,
    stock: 10,
    imageUrl: '',
    backImageUrl: '',
    description: '',
    sizes: ['XL', 'XXL'],
    colors: ['Black'],
    featured: true,
  });
  const [editingBackImageUrl, setEditingBackImageUrl] = useState<string>('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.imageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please provide at least a name and an image URL.',
        variant: 'destructive',
      });
      return;
    }
    const primaryColor = newProduct.colors?.[0] || 'Black';
    const fullProduct: CatalogProduct = {
      id: newProduct.id || `nl-${Date.now().toString().slice(-4)}`,
      name: newProduct.name,
      collection: (newProduct.collection as any) || 'Round Necks',
      category: (newProduct.collection as any) || 'Round Necks',
      price: Number(newProduct.price) || 10000,
      stock: Number(newProduct.stock) || 10,
      imageUrl: newProduct.imageUrl,
      description: newProduct.description || '',
      sizes: newProduct.sizes || ['XL', 'XXL'],
      colors: newProduct.colors || ['Black'],
      featured: true,
      colorImages: {
        [primaryColor]: {
          name: primaryColor,
          front: newProduct.imageUrl!,
          back: newProduct.backImageUrl?.trim() ? newProduct.backImageUrl.trim() : undefined,
        },
      },
    };
    const current = getLiveCatalog();
    const updatedList = [fullProduct, ...current];
    saveLiveCatalog(updatedList);
    setProducts(updatedList);
    setShowAddModal(false);
    setNewProduct({
      id: `nl-${Date.now().toString().slice(-4)}`,
      name: '',
      collection: 'Round Necks',
      category: 'Round Necks',
      price: 10000,
      stock: 10,
      imageUrl: '',
      description: '',
      sizes: ['XL', 'XXL'],
      colors: ['Black'],
      featured: true,
    });
    toast({
      title: 'Product Created',
      description: `${fullProduct.name} has been added to ${fullProduct.collection}.`,
    });
  };

  // Filter products
  const filtered = products.filter((p) => {
    const matchesCol =
      selectedCollection === 'All Pieces' || p.collection === selectedCollection;
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase());
    return matchesCol && matchesSearch;
  });

  const totalStock = products.reduce((acc, p) => acc + (p.stock ?? 0), 0);
  const outOfStockCount = products.filter((p) => (p.stock ?? 0) === 0).length;
  const lowStockCount = products.filter((p) => (p.stock ?? 0) > 0 && (p.stock ?? 0) < 3).length;

  return (
    <div className="noble-noise min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono-brand uppercase tracking-wider text-muted-foreground hover:text-primary transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Showroom
            </Link>
            <div className="h-4 w-[1px] bg-border" />
            <h1 className="font-display text-lg tracking-wider text-primary">
              NOBLE LUXE <span className="text-muted-foreground font-sans text-sm font-normal">| Inventory & Stock Manager</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin-orders"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-border text-xs font-mono-brand uppercase tracking-wider hover:border-primary hover:text-primary transition"
            >
              Customer Orders
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-accent transition"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="border border-border bg-card p-4">
            <p className="text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground">Total Products</p>
            <p className="mt-2 text-2xl font-display text-foreground">{products.length}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground">Total Units in Stock</p>
            <p className="mt-2 text-2xl font-display text-primary">{totalStock}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground">Low Stock (&lt; 3)</p>
            <p className="mt-2 text-2xl font-display text-amber-500">{lowStockCount}</p>
          </div>
          <div className="border border-border bg-card p-4">
            <p className="text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground">Out of Stock</p>
            <p className="mt-2 text-2xl font-display text-destructive">{outOfStockCount}</p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div className="flex flex-wrap gap-1.5">
            {NOBLE_COLLECTIONS.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedCollection(col)}
                className={`px-3 py-1.5 text-[10px] font-mono-brand uppercase tracking-wider transition ${
                  selectedCollection === col
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-secondary/50 border border-border text-xs focus:border-primary outline-none"
              />
            </div>

            <button
              onClick={handleReset}
              title="Reset to factory catalog"
              className="px-3 py-1.5 border border-border text-xs text-muted-foreground hover:text-destructive hover:border-destructive transition flex items-center gap-1 shrink-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-secondary/30 font-mono-brand text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Item</th>
                <th className="py-3 px-4">Collection</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Available Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((product) => {
                const stock = product.stock ?? 0;
                const isOutOfStock = stock === 0;
                const isLow = stock > 0 && stock < 3;

                return (
                  <tr key={product.id} className="hover:bg-secondary/20 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-10 object-cover bg-secondary border border-border shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-foreground">{product.name}</p>
                          <p className="font-mono-brand text-[10px] text-muted-foreground uppercase">{product.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono-brand text-[11px] text-muted-foreground">
                      <span className="px-2 py-0.5 border border-border/80 bg-secondary/40">
                        {product.collection || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono-brand font-semibold text-primary">
                      {formatCurrency(product.price)}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleStockChange(product.id, -1)}
                          className="h-7 w-7 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition text-xs"
                          title="Decrease by 1"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={draftStocks[product.id] !== undefined ? draftStocks[product.id] : stock}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setDraftStocks((prev) => ({ ...prev, [product.id]: isNaN(val) ? 0 : Math.max(0, val) }));
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCommitStock(product.id);
                            }
                          }}
                          className="w-14 text-center py-1 bg-secondary border border-border text-xs font-mono-brand text-foreground"
                        />
                        <button
                          type="button"
                          onClick={() => handleStockChange(product.id, 1)}
                          className="h-7 w-7 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition text-xs"
                          title="Increase by 1"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCommitStock(product.id)}
                          className="px-2.5 py-1 bg-primary text-[10px] font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90 transition rounded-none"
                          title="Save this stock level"
                        >
                          Update
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {isOutOfStock ? (
                        <span className="inline-block px-2 py-0.5 bg-destructive/10 text-destructive border border-destructive/30 font-mono-brand text-[9px] uppercase tracking-wider font-semibold">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="inline-block px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/30 font-mono-brand text-[9px] uppercase tracking-wider font-semibold">
                          Only {stock} Left
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono-brand text-[9px] uppercase tracking-wider font-semibold">
                          In Stock ({stock})
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingProduct({ ...product })}
                          className="p-1.5 border border-border hover:border-primary hover:text-primary transition"
                          title="Edit Product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-1.5 border border-border hover:border-destructive hover:text-destructive transition"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-display text-lg tracking-wider text-primary mb-4">Edit Product: {editingProduct.name}</h2>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Product Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-secondary border border-border p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Collection</label>
                  <select
                    value={editingProduct.collection}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        collection: e.target.value as any,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-secondary border border-border p-2 text-xs"
                  >
                    {NOBLE_COLLECTIONS.filter((c) => c !== 'All Pieces').map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Front Picture URL *</label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Back Picture URL (Optional)</label>
                  <input
                    type="text"
                    value={editingBackImageUrl}
                    onChange={(e) => setEditingBackImageUrl(e.target.value)}
                    placeholder="https://... (enables Tap to see back)"
                    className="w-full bg-secondary border border-border p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-secondary border border-border p-2 text-xs h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-border text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold hover:bg-accent"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-display text-lg tracking-wider text-primary mb-4">Add New Product to Store</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. NL Premium Hoodie"
                  className="w-full bg-secondary border border-border p-2 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Collection</label>
                  <select
                    value={newProduct.collection}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        collection: e.target.value as any,
                        category: e.target.value,
                      })
                    }
                    className="w-full bg-secondary border border-border p-2 text-xs"
                  >
                    {NOBLE_COLLECTIONS.filter((c) => c !== 'All Pieces').map((col) => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Price (NGN)</label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Front Picture URL *</label>
                  <input
                    type="text"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Back Picture URL (Optional)</label>
                  <input
                    type="text"
                    value={newProduct.backImageUrl || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, backImageUrl: e.target.value })}
                    placeholder="https://... (enables Tap to see back on store)"
                    className="w-full bg-secondary border border-border p-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product description..."
                  className="w-full bg-secondary border border-border p-2 text-xs h-20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-border text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground text-xs uppercase tracking-wider font-semibold hover:bg-accent"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change PIN Modal */}
      {showChangePinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <h2 className="font-display text-xl font-light flex items-center gap-2">
                <Key className="w-5 h-5 text-primary" /> Change Master Passcode
              </h2>
              <button
                onClick={() => setShowChangePinModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleChangePin} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">
                  Current Passcode
                </label>
                <input
                  type="password"
                  value={currentPinInput}
                  onChange={(e) => setCurrentPinInput(e.target.value)}
                  placeholder="Enter current PIN"
                  required
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">
                  New Passcode (min 4 characters)
                </label>
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Enter new PIN"
                  required
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">
                  Confirm New Passcode
                </label>
                <input
                  type="password"
                  value={confirmPinInput}
                  onChange={(e) => setConfirmPinInput(e.target.value)}
                  placeholder="Confirm new PIN"
                  required
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              {changePinError && (
                <div className="border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive text-center">
                  {changePinError}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="flex-1 border border-border py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:opacity-90"
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
