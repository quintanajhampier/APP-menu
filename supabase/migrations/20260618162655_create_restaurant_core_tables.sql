
-- Products table (for admin menu management)
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL,
  category_id TEXT NOT NULL,
  image_url TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders table (for kitchen Kanban)
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','preparing','ready','delivered','cancelled')),
  items JSONB NOT NULL DEFAULT '[]',
  subtotal DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service requests table (for waiter alerts)
CREATE TABLE service_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_number INTEGER NOT NULL,
  type TEXT NOT NULL
    CHECK (type IN ('water','condiment','waiter','bill','other')),
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','acknowledged','resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE products        ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders          ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

-- Products: public read, anon/auth write for demo
CREATE POLICY "select_products"  ON products FOR SELECT USING (true);
CREATE POLICY "insert_products"  ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "update_products"  ON products FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "delete_products"  ON products FOR DELETE USING (true);

-- Orders: guests insert, all read, staff update
CREATE POLICY "select_orders"  ON orders FOR SELECT USING (true);
CREATE POLICY "insert_orders"  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "update_orders"  ON orders FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "delete_orders"  ON orders FOR DELETE USING (true);

-- Service requests: guests insert, all read, staff update
CREATE POLICY "select_svc"  ON service_requests FOR SELECT USING (true);
CREATE POLICY "insert_svc"  ON service_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "update_svc"  ON service_requests FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "delete_svc"  ON service_requests FOR DELETE USING (true);

-- Updated_at trigger helper
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Seed demo orders for kitchen
INSERT INTO orders (table_number, status, items, subtotal, total) VALUES
  (3, 'pending',   '[{"name":"Chaufa Imperial Dragon","qty":2,"price":52},{"name":"Wantán Frito","qty":1,"price":18}]', 122, 134.2),
  (7, 'preparing', '[{"name":"Tallarin Saltado con Res","qty":1,"price":38},{"name":"Sopa Wantán Imperial","qty":2,"price":28}]', 94, 103.4),
  (11,'pending',   '[{"name":"Aeropuerto Dragon Gold","qty":1,"price":45},{"name":"Chicha Morada Premium","qty":2,"price":12}]', 69, 75.9),
  (5, 'ready',     '[{"name":"Chaufa de Pollo Especial","qty":3,"price":32}]', 96, 105.6);

-- Seed demo service requests for waiter
INSERT INTO service_requests (table_number, type, message, status) VALUES
  (3,  'bill',      'Mesa 3 solicita la cuenta',          'open'),
  (7,  'water',     'Mesa 7 necesita agua',               'open'),
  (11, 'waiter',    'Mesa 11 llama al mozo',              'open'),
  (2,  'condiment', 'Mesa 2 pide más ají de gallina',     'open');
