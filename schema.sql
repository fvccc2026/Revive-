-- Activa la extensión para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS public.products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sku TEXT,
    category TEXT,
    cost NUMERIC NOT NULL DEFAULT 0,
    price NUMERIC NOT NULL DEFAULT 0,
    margin NUMERIC NOT NULL DEFAULT 0,
    image TEXT,
    "costBreakdown" JSONB DEFAULT '[]'::jsonb,
    "initialStock" INTEGER DEFAULT 0
);

-- Tabla de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    buyer JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    "deliveryFee" NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pendiente',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    comments TEXT,
    "paymentMethod" TEXT,
    "paymentDate" TEXT,
    "transactionReference" TEXT
);

-- Tabla de Materias Primas
CREATE TABLE IF NOT EXISTS public.raw_materials (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    cost NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    "initialStock" NUMERIC NOT NULL DEFAULT 0
);

-- Tabla de Movimientos de Inventario
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id TEXT PRIMARY KEY DEFAULT uuid_generate_v4()::text,
    "itemId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL CHECK ("itemType" IN ('product', 'raw_material')),
    type TEXT NOT NULL CHECK (type IN ('in', 'out')),
    quantity NUMERIC NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    reason TEXT NOT NULL,
    "referenceId" TEXT
);

-- Habilitar Políticas de Seguridad (Row Level Security)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- Crear políticas para permitir acceso anónimo temporalmente (Para desarrollo)
CREATE POLICY "Permitir lectura y escritura anónima products" ON public.products FOR ALL USING (true);
CREATE POLICY "Permitir lectura y escritura anónima orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Permitir lectura y escritura anónima raw_materials" ON public.raw_materials FOR ALL USING (true);
CREATE POLICY "Permitir lectura y escritura anónima inventory_movements" ON public.inventory_movements FOR ALL USING (true);
