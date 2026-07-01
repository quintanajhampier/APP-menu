import { createClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const supabase = createClient(url, key);

// ── Types ────────────────────────────────────────────────────
export interface OrderItem {
  name:  string;
  qty:   number;
  price: number;
}

export interface Order {
  id:           string;
  table_number: number;
  status:       'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items:        OrderItem[];
  subtotal:     number;
  total:        number;
  notes:        string;
  created_at:   string;
  updated_at:   string;
}

export interface ServiceRequest {
  id:           string;
  table_number: number;
  type:         'water' | 'condiment' | 'waiter' | 'bill' | 'other';
  message:      string;
  status:       'open' | 'acknowledged' | 'resolved';
  created_at:   string;
  resolved_at:  string | null;
}

export interface Product {
  id:          string;
  name:        string;
  description: string;
  price:       number;
  category_id: string;
  image_url:   string;
  tags:        string[];
  available:   boolean;
  created_at:  string;
  updated_at:  string;
}
