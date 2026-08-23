import type { Product } from '@workspace/api-client-react';

export type CartItem = Product & { selectedSize: string; quantity: number };

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'nl-001',
    name: 'Obsidian Varsity Jacket',
    category: 'Outerwear',
    price: 185000,
    imageUrl: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'A weighty wool-blend varsity jacket cut with architectural shoulders and a satin-lined interior.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian', 'Antique Gold'],
    featured: true,
  },
  {
    id: 'nl-002',
    name: 'Atelier 03 Hoodie',
    category: 'Essentials',
    price: 78000,
    imageUrl: 'https://images.pexels.com/photos/9558699/pexels-photo-9558699.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Heavyweight brushed cotton with an offset monogram and a softly structured hood.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Carbon', 'Bone'],
    featured: true,
  },
  {
    id: 'nl-003',
    name: 'Monument Cargo Trouser',
    category: 'Trousers',
    price: 92500,
    imageUrl: 'https://images.pexels.com/photos/6765164/pexels-photo-6765164.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Relaxed utility trousers with articulated knees, hidden hardware and a clean tapered break.',
    sizes: ['28', '30', '32', '34', '36'],
    colors: ['Coal'],
    featured: false,
  },
  {
    id: 'nl-004',
    name: 'Signet Leather Runner',
    category: 'Footwear',
    price: 112000,
    imageUrl: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Low-profile leather runners finished with a brushed-metal signet at the heel.',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: ['Ink', 'Ivory'],
    featured: true,
  },
  {
    id: 'nl-005',
    name: 'Nocturne Rib Tee',
    category: 'Essentials',
    price: 42000,
    imageUrl: 'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'A close, clean rib knit designed to sit beneath tailoring or hold its own after dark.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Onyx', 'Ash'],
    featured: false,
  },
  {
    id: 'nl-006',
    name: 'Noble Frame Sunglasses',
    category: 'Accessories',
    price: 55000,
    imageUrl: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Hand-finished acetate frames with smoked lenses and a subtle gold temple mark.',
    sizes: ['One size'],
    colors: ['Black / Gold'],
    featured: false,
  },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(value);

export const productImage = (product: Product) =>
  product.imageUrl || FALLBACK_PRODUCTS.find((item) => item.id === product.id)?.imageUrl || FALLBACK_PRODUCTS[0].imageUrl;