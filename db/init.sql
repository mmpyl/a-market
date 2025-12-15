-- A-Market Database Initialization Script
-- This script creates all necessary tables and inserts initial data for the minimarket system

-- Enable UUID extension if needed (though we're using SERIAL for simplicity)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== Core Tables ====================

-- Users table
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255),
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('administrador', 'vendedor', 'almacenero', 'auditor')),
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    telefono VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers table
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    ruc VARCHAR(20),
    contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo_barras VARCHAR(100) UNIQUE,
    precio_venta DECIMAL(10,2) NOT NULL,
    precio_costo DECIMAL(10,2) NOT NULL,
    stock_minimo INTEGER DEFAULT 0,
    tiene_variantes BOOLEAN DEFAULT false,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product variants table
CREATE TABLE IF NOT EXISTS producto_variantes (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    nombre_variante VARCHAR(255) NOT NULL,
    valor_variante VARCHAR(255) NOT NULL,
    codigo_barras VARCHAR(100) UNIQUE,
    precio_adicional DECIMAL(10,2) DEFAULT 0,
    stock_actual INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment methods table
CREATE TABLE IF NOT EXISTS metodos_pago (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('efectivo', 'tarjeta', 'yape', 'plin', 'transferencia')),
    requiere_referencia BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales table
CREATE TABLE IF NOT EXISTS ventas (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES usuarios(id),
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    tipo_comprobante VARCHAR(20) DEFAULT 'boleta' CHECK (tipo_comprobante IN ('boleta', 'factura', 'ticket')),
    serie_comprobante VARCHAR(10),
    numero_comprobante VARCHAR(20),
    cliente_nombre VARCHAR(255),
    cliente_documento VARCHAR(20),
    cliente_email VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    impuesto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'completada', 'anulada')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale details table
CREATE TABLE IF NOT EXISTS venta_detalles (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    variante_id INTEGER REFERENCES producto_variantes(id),
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale payments table
CREATE TABLE IF NOT EXISTS venta_pagos (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    metodo_pago_id INTEGER NOT NULL REFERENCES metodos_pago(id),
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'completado' CHECK (estado IN ('pendiente', 'completado', 'rechazado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory table
CREATE TABLE IF NOT EXISTS inventario (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    variante_id INTEGER REFERENCES producto_variantes(id),
    stock_actual INTEGER DEFAULT 0,
    stock_reservado INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory movements table
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id),
    producto_id INTEGER NOT NULL REFERENCES productos(id),
    variante_id INTEGER REFERENCES producto_variantes(id),
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'transferencia', 'venta', 'devolucion')),
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    motivo TEXT,
    referencia VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Electronic receipts table
CREATE TABLE IF NOT EXISTS comprobantes_electronicos (
    id SERIAL PRIMARY KEY,
    venta_id INTEGER NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    tipo_comprobante VARCHAR(10) NOT NULL CHECK (tipo_comprobante IN ('boleta', 'factura')),
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    ruc_emisor VARCHAR(20),
    razon_social_emisor VARCHAR(255),
    documento_cliente VARCHAR(20),
    nombre_cliente VARCHAR(255),
    fecha_emision DATE NOT NULL,
    moneda VARCHAR(3) DEFAULT 'PEN',
    total DECIMAL(10,2) NOT NULL,
    xml_content TEXT,
    pdf_url VARCHAR(500),
    cdr_content TEXT,
    hash_cpe VARCHAR(255),
    estado_sunat VARCHAR(20) DEFAULT 'pendiente' CHECK (estado_sunat IN ('pendiente', 'aceptado', 'rechazado', 'anulado')),
    mensaje_sunat TEXT,
    fecha_envio_sunat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit table
CREATE TABLE IF NOT EXISTS auditoria (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES usuarios(id),
    tabla VARCHAR(50) NOT NULL,
    registro_id INTEGER,
    accion VARCHAR(20) NOT NULL CHECK (accion IN ('crear', 'actualizar', 'eliminar', 'venta', 'pago', 'inventario', 'login', 'logout')),
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    ip_address INET,
    user_agent TEXT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==================== Indexes for Performance ====================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_usuarios_estado ON usuarios(estado);

-- Products indexes
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);

-- Sales indexes
CREATE INDEX IF NOT EXISTS idx_ventas_user_id ON ventas(user_id);
CREATE INDEX IF NOT EXISTS idx_ventas_numero_venta ON ventas(numero_venta);
CREATE INDEX IF NOT EXISTS idx_ventas_estado ON ventas(estado);
CREATE INDEX IF NOT EXISTS idx_ventas_created_at ON ventas(created_at);

-- Inventory indexes
CREATE INDEX IF NOT EXISTS idx_inventario_producto ON inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_inventario_variante ON inventario(variante_id);

-- Audit indexes
CREATE INDEX IF NOT EXISTS idx_auditoria_user_id ON auditoria(user_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_tabla ON auditoria(tabla);
CREATE INDEX IF NOT EXISTS idx_auditoria_created_at ON auditoria(created_at);

-- ==================== Initial Data ====================

-- Insert development users (passwords are hashed versions of the plain text in dev-users.ts)
-- Note: In production, use proper password hashing
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, estado) VALUES
('admin@adminmarket.com', '$2b$10$hashedpassword1', 'Admin', 'Usuario', 'administrador', 'activo'),
('vendedor@adminmarket.com', '$2b$10$hashedpassword2', 'Vendedor', 'Usuario', 'vendedor', 'activo'),
('almacen@adminmarket.com', '$2b$10$hashedpassword3', 'Almacén', 'Usuario', 'almacenero', 'activo'),
('auditor@adminmarket.com', '$2b$10$hashedpassword4', 'Auditor', 'Usuario', 'auditor', 'activo')
ON CONFLICT (email) DO NOTHING;

-- Insert basic categories
INSERT INTO categorias (nombre, descripcion, color, icono) VALUES
('Alimentos', 'Productos alimenticios y comestibles', '#10B981', '🍎'),
('Bebidas', 'Bebidas y refrescos', '#3B82F6', '🥤'),
('Limpieza', 'Productos de limpieza y hogar', '#F59E0B', '🧹'),
('Higiene', 'Productos de higiene personal', '#EC4899', '🧴'),
('Electrónicos', 'Dispositivos electrónicos', '#6366F1', '📱'),
('Otros', 'Productos varios', '#6B7280', '📦')
ON CONFLICT DO NOTHING;

-- Insert payment methods
INSERT INTO metodos_pago (nombre, tipo, requiere_referencia) VALUES
('Efectivo', 'efectivo', false),
('Tarjeta de Crédito/Débito', 'tarjeta', false),
('Yape', 'yape', true),
('Plin', 'plin', true),
('Transferencia Bancaria', 'transferencia', true)
ON CONFLICT DO NOTHING;

-- Insert sample suppliers
INSERT INTO proveedores (nombre, contacto, telefono, email) VALUES
('Proveedor General S.A.', 'Juan Pérez', '+51 999 888 777', 'contacto@proveedorgeneral.com'),
('Distribuidora ABC', 'María García', '+51 999 777 666', 'ventas@distribuidoraabc.com')
ON CONFLICT DO NOTHING;

-- Insert sample products
INSERT INTO productos (categoria_id, proveedor_id, nombre, descripcion, precio_venta, precio_costo, stock_minimo) VALUES
(1, 1, 'Arroz Premium 1kg', 'Arroz de alta calidad', 4.50, 3.20, 10),
(1, 1, 'Fideos Spaghetti 500g', 'Pasta italiana', 2.80, 2.00, 15),
(2, 2, 'Coca Cola 500ml', 'Bebida gaseosa', 3.00, 2.20, 20),
(2, 2, 'Agua Mineral 1L', 'Agua purificada', 1.50, 1.00, 25),
(3, 1, 'Detergente Líquido 1L', 'Para lavar ropa', 8.50, 6.00, 5),
(4, 2, 'Jabón de Baño 200g', 'Jabón neutro', 4.20, 3.00, 12)
ON CONFLICT DO NOTHING;

-- Insert initial inventory for products
INSERT INTO inventario (producto_id, stock_actual) VALUES
(1, 50), -- Arroz
(2, 30), -- Fideos
(3, 100), -- Coca Cola
(4, 80), -- Agua
(5, 15), -- Detergente
(6, 25)  -- Jabón
ON CONFLICT DO NOTHING;

-- ==================== Functions and Triggers ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_producto_variantes_updated_at BEFORE UPDATE ON producto_variantes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comprobantes_electronicos_updated_at BEFORE UPDATE ON comprobantes_electronicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate sale number
CREATE OR REPLACE FUNCTION generate_sale_number()
RETURNS TRIGGER AS $$
DECLARE
    current_year TEXT;
    next_number INTEGER;
BEGIN
    current_year := TO_CHAR(CURRENT_DATE, 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(numero_venta FROM 5) AS INTEGER)), 0) + 1
    INTO next_number
    FROM ventas
    WHERE numero_venta LIKE 'V' || current_year || '%';

    NEW.numero_venta := 'V' || current_year || LPAD(next_number::TEXT, 6, '0');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for sale number generation
CREATE TRIGGER generate_sale_number_trigger BEFORE INSERT ON ventas FOR EACH ROW EXECUTE FUNCTION generate_sale_number();

-- ==================== Views ====================

-- View for products with category and supplier info
CREATE OR REPLACE VIEW productos_con_relaciones AS
SELECT
    p.*,
    c.nombre as categoria_nombre,
    pr.nombre as proveedor_nombre
FROM productos p
LEFT JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN proveedores pr ON p.proveedor_id = pr.id;

-- View for sales with user info
CREATE OR REPLACE VIEW ventas_con_usuario AS
SELECT
    v.*,
    u.nombre as usuario_nombre,
    u.apellido as usuario_apellido
FROM ventas v
LEFT JOIN usuarios u ON v.user_id = u.id;

-- ==================== Permissions ====================

-- Grant permissions (adjust as needed for your application)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO amarket_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO amarket_user;

-- ==================== Comments ====================

COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema con roles y permisos';
COMMENT ON TABLE categorias IS 'Categorías de productos para organización';
COMMENT ON TABLE proveedores IS 'Proveedores de productos';
COMMENT ON TABLE productos IS 'Productos disponibles para venta';
COMMENT ON TABLE producto_variantes IS 'Variantes de productos (tallas, colores, etc.)';
COMMENT ON TABLE metodos_pago IS 'Métodos de pago disponibles';
COMMENT ON TABLE ventas IS 'Cabecera de ventas realizadas';
COMMENT ON TABLE venta_detalles IS 'Detalle de productos en cada venta';
COMMENT ON TABLE venta_pagos IS 'Pagos asociados a las ventas';
COMMENT ON TABLE inventario IS 'Stock actual de productos';
COMMENT ON TABLE movimientos_inventario IS 'Historial de movimientos de inventario';
COMMENT ON TABLE comprobantes_electronicos IS 'Comprobantes electrónicos para SUNAT';
COMMENT ON TABLE auditoria IS 'Registro de auditoría del sistema';
