// ============================================================
// Core TypeScript Types
// ============================================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  created_at: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSpecGroup {
  group: string;
  items: ProductSpec[];
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  specs: ProductSpecGroup[];
  price: number;
  mrp?: number | null;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface EnquiryItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Enquiry {
  id: string;
  customer_name: string;
  phone: string;
  items: EnquiryItem[];
  total: number;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

export interface OTPRequest {
  id: string;
  phone: string;
  otp_hash: string;
  expires_at: string;
  attempts: number;
  verified: boolean;
  created_at: string;
}
