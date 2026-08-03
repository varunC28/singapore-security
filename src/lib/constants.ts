import type { Category, Product } from '@/types';

// ============================================================
// Shop Information
// ============================================================
export const SHOP_NAME = 'Singapore Security';
export const SHOP_TAGLINE = 'Modern Security, Modern Trust';
export const SHOP_DESCRIPTION = 'Premium CCTV cameras, DVRs, NVRs, and security equipment in Indore.';

export const SHOP_ADDRESS = 'LG 16A Silver Mall 8, RNT Road, Indore-452001, Madhya Pradesh';
export const SHOP_PHONE = '9424066666';
export const SHOP_WHATSAPP = '9424066666';
export const SHOP_GOOGLE_MAPS = 'https://maps.app.goo.gl/ae4uGFGYZoe9ZMrB8';
export const SHOP_HOURS = 'Mon – Sat: 10:00 AM – 8:00 PM';

// ============================================================
// Currency Formatting
// ============================================================
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// ============================================================
// Mock Categories (Phase 1 — replaced by Supabase in Phase 3)
// ============================================================
export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Cameras', slug: 'cameras', sort_order: 1, created_at: '' },
  { id: 'cat-2', name: 'DVR/NVR', slug: 'dvr-nvr', sort_order: 2, created_at: '' },
  { id: 'cat-3', name: 'Hard Disks', slug: 'hard-disks', sort_order: 3, created_at: '' },
  { id: 'cat-4', name: 'Cables', slug: 'cables', sort_order: 4, created_at: '' },
  { id: 'cat-5', name: 'Accessories', slug: 'accessories', sort_order: 5, created_at: '' },
];

// ============================================================
// Mock Products (Phase 1 — replaced by Supabase in Phase 3)
// ============================================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-1',
    name: 'CP Plus 5MP Dome Camera',
    description: 'Indoor dome camera with night vision and wide-angle lens.',
    specs: [{ group: 'General', items: [
      { label: 'Resolution', value: '5MP' },
      { label: 'Type', value: 'Dome' },
      { label: 'Night Vision', value: '30m IR' },
    ] }],
    price: 2450,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-2',
    category_id: 'cat-1',
    name: 'Hikvision 8MP Bullet Camera',
    description: 'Outdoor bullet camera with 4K resolution and IP67 rating.',
    specs: [{ group: 'General', items: [
      { label: 'Resolution', value: '8MP (4K)' },
      { label: 'Type', value: 'Bullet' },
      { label: 'IP Rating', value: 'IP67' },
    ] }],
    price: 4850,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: 'Dahua 2MP PTZ Camera',
    description: 'Pan-tilt-zoom camera with 25x optical zoom.',
    specs: [{ group: 'General', items: [
      { label: 'Resolution', value: '2MP' },
      { label: 'Type', value: 'PTZ' },
      { label: 'Zoom', value: '25x Optical' },
    ] }],
    price: 12500,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-4',
    category_id: 'cat-2',
    name: 'CP Plus 8 Channel DVR',
    description: '8-channel digital video recorder with H.265+ compression.',
    specs: [{ group: 'General', items: [
      { label: 'Channels', value: '8' },
      { label: 'Compression', value: 'H.265+' },
      { label: 'Resolution', value: 'Up to 5MP' },
    ] }],
    price: 5200,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-5',
    category_id: 'cat-2',
    name: 'Hikvision 16 Channel NVR',
    description: '16-channel network video recorder with 4K output.',
    specs: [{ group: 'General', items: [
      { label: 'Channels', value: '16' },
      { label: 'Output', value: '4K HDMI' },
      { label: 'PoE', value: '16-port Built-in' },
    ] }],
    price: 18500,
    image_url: null,
    in_stock: false,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-6',
    category_id: 'cat-3',
    name: 'Seagate SkyHawk 1TB',
    description: 'Surveillance-optimized hard disk for 24/7 recording.',
    specs: [{ group: 'General', items: [
      { label: 'Capacity', value: '1TB' },
      { label: 'Type', value: 'Surveillance HDD' },
      { label: 'Workload', value: '180TB/year' },
    ] }],
    price: 3400,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-7',
    category_id: 'cat-4',
    name: 'RG59 Coaxial Cable (90m)',
    description: 'High-quality coaxial cable for analog CCTV installations.',
    specs: [{ group: 'General', items: [
      { label: 'Length', value: '90 meters' },
      { label: 'Type', value: 'RG59 + Power' },
      { label: 'Shielding', value: '95% Copper Braid' },
    ] }],
    price: 2800,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
  {
    id: 'prod-8',
    category_id: 'cat-5',
    name: 'SMPS Power Supply 12V 10A',
    description: 'Centralized power supply for up to 8 cameras.',
    specs: [{ group: 'General', items: [
      { label: 'Output', value: '12V DC, 10A' },
      { label: 'Channels', value: '8 Output' },
      { label: 'Protection', value: 'Short Circuit' },
    ] }],
    price: 850,
    image_url: null,
    in_stock: true,
    sort_order: 0,
    created_at: '',
    updated_at: '',
  },
];
