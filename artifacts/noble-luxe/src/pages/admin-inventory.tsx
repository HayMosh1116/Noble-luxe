import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  ArrowLeft,
  Package,
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

export default function AdminInventory() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('All Pieces');
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<CatalogProduct | null>(null);
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

  const handleStockChange = (id: string, delta: number) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;
    const newStock = Math.max(0, (p.stock ?? 0) + delta);
    updateProductStock(id, newStock);
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
    const current = getLiveCatalog();
    const updated = current.map((p) => (p.id === editingProduct.id ? editingProduct : p));
    saveLiveCatalog(updated);
    setEditingProduct(null);
    toast({
      title: 'Product Saved',
      description: `${editingProduct.name} changes have been saved.`,
    });
  };

  const [newProduct, setNewProduct] = useState<Partial<CatalogProduct>>({
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
    };
    const current = getLiveCatalog();
    saveLiveCatalog([fullProduct, ...current]);
    setShowAddModal(false);
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStockChange(product.id, -1)}
                          className="h-6 w-6 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={stock}
                          onChange={(e) => handleSetStockDirect(product.id, e.target.value)}
                          className="w-14 text-center py-1 bg-secondary border border-border text-xs font-mono-brand"
                        />
                        <button
                          onClick={() => handleStockChange(product.id, 1)}
                          className="h-6 w-6 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleStockChange(product.id, 5)}
                          className="px-2 py-0.5 border border-border text-[10px] font-mono-brand hover:border-primary hover:text-primary transition"
                        >
                          +5
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
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Image URL</label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
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
                  <label className="block text-[10px] font-mono-brand uppercase tracking-wider text-muted-foreground mb-1">Image URL</label>
                  <input
                    type="text"
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-secondary border border-border p-2 text-xs"
                    required
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
    </div>
  );
}
