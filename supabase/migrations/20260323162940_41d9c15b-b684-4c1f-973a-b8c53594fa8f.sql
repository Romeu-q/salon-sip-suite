
-- =============================================
-- 001: MULTITENANT SCHEMA MIGRATION
-- =============================================

-- Enums
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'in_salon', 'delayed', 'finished', 'cancelled');
CREATE TYPE public.order_status AS ENUM ('open', 'closed', 'cancelled');
CREATE TYPE public.financial_type AS ENUM ('income', 'expense');

-- 1. Tenants
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Profiles (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'staff',
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Alter existing tables to add tenant_id
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS work_schedule JSONB DEFAULT '{}';
ALTER TABLE public.professionals ALTER COLUMN commission SET DATA TYPE DECIMAL(5,2);

ALTER TABLE public.services ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.services RENAME COLUMN duration TO duration_minutes;

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products RENAME COLUMN cost_price TO cost_price_old;
ALTER TABLE public.products RENAME COLUMN sale_price TO sell_price_old;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sell_price DECIMAL(10,2) DEFAULT 0;
UPDATE public.products SET cost_price = cost_price_old, sell_price = sell_price_old;
ALTER TABLE public.products DROP COLUMN cost_price_old;
ALTER TABLE public.products DROP COLUMN sell_price_old;
ALTER TABLE public.products RENAME COLUMN stock TO stock_qty;
ALTER TABLE public.products RENAME COLUMN min_stock TO min_stock_old;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS min_stock INT DEFAULT 0;
UPDATE public.products SET min_stock = min_stock_old;
ALTER TABLE public.products DROP COLUMN min_stock_old;

-- 4. Service Categories
CREATE TABLE public.service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Add category_id FK to services
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.service_categories(id);

-- 6. Service Combos
CREATE TABLE public.service_combos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.service_combo_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  combo_id UUID NOT NULL REFERENCES public.service_combos(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  sort_order INT DEFAULT 0
);

-- 7. Product Categories
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.product_categories(id);

-- 8. Clients
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Alter appointments for multitenant + new fields
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS client_id UUID REFERENCES public.clients(id);
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES public.services(id);
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS combo_id UUID REFERENCES public.service_combos(id);
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT;

-- 10. Orders (Comandas)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.clients(id),
  status public.order_status NOT NULL DEFAULT 'open',
  payment_method TEXT,
  discount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) DEFAULT 0,
  professional_commission DECIMAL(10,2) DEFAULT 0,
  closed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_service_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  service_id UUID REFERENCES public.services(id),
  professional_id UUID REFERENCES public.professionals(id),
  price DECIMAL(10,2) NOT NULL DEFAULT 0
);

CREATE TABLE public.order_product_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- 11. Financial Entries
CREATE TABLE public.financial_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  type public.financial_type NOT NULL,
  category TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  order_id UUID REFERENCES public.orders(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Fiscal Settings (placeholder)
CREATE TABLE public.fiscal_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nfce_provider TEXT,
  api_key_encrypted TEXT,
  certificate_path TEXT,
  environment TEXT DEFAULT 'homologacao',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX idx_profiles_tenant ON public.profiles(tenant_id);
CREATE INDEX idx_professionals_tenant ON public.professionals(tenant_id);
CREATE INDEX idx_services_tenant ON public.services(tenant_id);
CREATE INDEX idx_products_tenant ON public.products(tenant_id);
CREATE INDEX idx_clients_tenant ON public.clients(tenant_id);
CREATE INDEX idx_appointments_tenant_date ON public.appointments(tenant_id, appointment_date);
CREATE INDEX idx_orders_tenant ON public.orders(tenant_id);
CREATE INDEX idx_financial_tenant_date ON public.financial_entries(tenant_id, date);

-- =============================================
-- RLS POLICIES
-- =============================================

-- Helper function to get current user's tenant_id
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Enable RLS on all new tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_combo_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_service_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_product_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fiscal_settings ENABLE ROW LEVEL SECURITY;

-- Drop old public policies on existing tables
DROP POLICY IF EXISTS "Allow public read on professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow public insert on professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow public update on professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow public delete on professionals" ON public.professionals;
DROP POLICY IF EXISTS "Allow public read on services" ON public.services;
DROP POLICY IF EXISTS "Allow public insert on services" ON public.services;
DROP POLICY IF EXISTS "Allow public update on services" ON public.services;
DROP POLICY IF EXISTS "Allow public delete on services" ON public.services;
DROP POLICY IF EXISTS "Allow public read on products" ON public.products;
DROP POLICY IF EXISTS "Allow public insert on products" ON public.products;
DROP POLICY IF EXISTS "Allow public update on products" ON public.products;
DROP POLICY IF EXISTS "Allow public delete on products" ON public.products;
DROP POLICY IF EXISTS "Allow public read on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public insert on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public update on appointments" ON public.appointments;
DROP POLICY IF EXISTS "Allow public delete on appointments" ON public.appointments;

-- Tenant-based RLS policies for all tables
-- Tenants: users can only see their own tenant
CREATE POLICY "tenant_select" ON public.tenants FOR SELECT TO authenticated USING (id = public.get_user_tenant_id());
CREATE POLICY "tenant_update" ON public.tenants FOR UPDATE TO authenticated USING (id = public.get_user_tenant_id());

-- Profiles
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Professionals
CREATE POLICY "professionals_select" ON public.professionals FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "professionals_insert" ON public.professionals FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "professionals_update" ON public.professionals FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "professionals_delete" ON public.professionals FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Services
CREATE POLICY "services_select" ON public.services FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "services_insert" ON public.services FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "services_update" ON public.services FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "services_delete" ON public.services FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Service Categories
CREATE POLICY "service_categories_select" ON public.service_categories FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_categories_insert" ON public.service_categories FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_categories_update" ON public.service_categories FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_categories_delete" ON public.service_categories FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Service Combos
CREATE POLICY "service_combos_select" ON public.service_combos FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_combos_insert" ON public.service_combos FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_combos_update" ON public.service_combos FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "service_combos_delete" ON public.service_combos FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Service Combo Items (via combo's tenant)
CREATE POLICY "combo_items_select" ON public.service_combo_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.service_combos sc WHERE sc.id = combo_id AND sc.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "combo_items_insert" ON public.service_combo_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.service_combos sc WHERE sc.id = combo_id AND sc.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "combo_items_delete" ON public.service_combo_items FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.service_combos sc WHERE sc.id = combo_id AND sc.tenant_id = public.get_user_tenant_id()));

-- Products
CREATE POLICY "products_select" ON public.products FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "products_insert" ON public.products FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "products_update" ON public.products FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "products_delete" ON public.products FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Product Categories
CREATE POLICY "product_categories_select" ON public.product_categories FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "product_categories_insert" ON public.product_categories FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "product_categories_update" ON public.product_categories FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "product_categories_delete" ON public.product_categories FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Clients
CREATE POLICY "clients_select" ON public.clients FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "clients_insert" ON public.clients FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "clients_update" ON public.clients FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "clients_delete" ON public.clients FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Appointments
CREATE POLICY "appointments_select" ON public.appointments FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "appointments_insert" ON public.appointments FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "appointments_update" ON public.appointments FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "appointments_delete" ON public.appointments FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Orders
CREATE POLICY "orders_select" ON public.orders FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "orders_insert" ON public.orders FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "orders_update" ON public.orders FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "orders_delete" ON public.orders FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Order Service Items (via order's tenant)
CREATE POLICY "order_service_items_select" ON public.order_service_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "order_service_items_insert" ON public.order_service_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "order_service_items_delete" ON public.order_service_items FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));

-- Order Product Items (via order's tenant)
CREATE POLICY "order_product_items_select" ON public.order_product_items FOR SELECT TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "order_product_items_insert" ON public.order_product_items FOR INSERT TO authenticated 
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));
CREATE POLICY "order_product_items_delete" ON public.order_product_items FOR DELETE TO authenticated 
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.tenant_id = public.get_user_tenant_id()));

-- Financial Entries
CREATE POLICY "financial_select" ON public.financial_entries FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "financial_insert" ON public.financial_entries FOR INSERT TO authenticated WITH CHECK (tenant_id = public.get_user_tenant_id());
CREATE POLICY "financial_update" ON public.financial_entries FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "financial_delete" ON public.financial_entries FOR DELETE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- Fiscal Settings
CREATE POLICY "fiscal_select" ON public.fiscal_settings FOR SELECT TO authenticated USING (tenant_id = public.get_user_tenant_id());
CREATE POLICY "fiscal_update" ON public.fiscal_settings FOR UPDATE TO authenticated USING (tenant_id = public.get_user_tenant_id());

-- =============================================
-- TRIGGERS
-- =============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id UUID;
  _role public.app_role;
  _tenant_name TEXT;
BEGIN
  _tenant_name := COALESCE(NEW.raw_user_meta_data->>'tenant_name', 'Meu Salão');
  
  -- Create a new tenant for each signup
  INSERT INTO public.tenants (name, slug)
  VALUES (_tenant_name, NEW.id::text)
  RETURNING id INTO _tenant_id;
  
  _role := 'owner';

  INSERT INTO public.profiles (id, tenant_id, role, full_name)
  VALUES (NEW.id, _tenant_id, _role, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update stock when order product item is inserted
CREATE OR REPLACE FUNCTION public.update_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock_qty = stock_qty - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_order_product_inserted
  AFTER INSERT ON public.order_product_items
  FOR EACH ROW EXECUTE FUNCTION public.update_stock_on_order();

-- Updated_at triggers for new tables
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for appointments and orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
