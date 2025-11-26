
-- =====================================================
-- PERFILES DE USUARIO
-- =====================================================
CREATE TABLE user_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nombre_completo VARCHAR(200) NOT NULL,
    documento_identidad VARCHAR(20),
    telefono VARCHAR(20),
    direccion TEXT,
    rol_sistema VARCHAR(50) NOT NULL CHECK (rol_sistema IN ('vendedor', 'almacenero', 'administrador', 'auditor')),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Crear perfil por defecto para el administrador
INSERT INTO user_profiles (user_id, nombre_completo, rol_sistema) 
VALUES (1, 'Administrador del Sistema', 'administrador');

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_rol_sistema ON user_profiles(rol_sistema);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_profiles_select_policy ON user_profiles
    FOR SELECT USING (user_id = uid());

CREATE POLICY user_profiles_insert_policy ON user_profiles
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY user_profiles_update_policy ON user_profiles
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

CREATE POLICY user_profiles_delete_policy ON user_profiles
    FOR DELETE USING (user_id = uid());

-- =====================================================
-- PROVEEDORES
-- =====================================================
CREATE TABLE proveedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    ruc VARCHAR(11),
    contacto VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX idx_proveedores_ruc ON proveedores(ruc);

-- Datos de ejemplo para proveedores
INSERT INTO proveedores (nombre, ruc, contacto, telefono, email, direccion) VALUES
('Distribuidora Lima SAC', '20123456789', 'Juan Pérez', '987654321', 'ventas@distrilima.com', 'Av. Argentina 1234, Lima'),
('Alimentos del Norte EIRL', '20987654321', 'María García', '912345678', 'contacto@alinorte.com', 'Jr. Comercio 567, Trujillo'),
('Bebidas Premium SAC', '20456789123', 'Carlos Rodríguez', '998877665', 'info@bebidaspremium.com', 'Av. Industrial 890, Lima'),
('Abarrotes Mayorista SRL', '20789123456', 'Ana Torres', '955443322', 'ventas@abarrotesmay.com', 'Calle Los Olivos 234, Arequipa'),
('Productos de Limpieza Total', '20321654987', 'Roberto Sánchez', '966554433', 'contacto@limpiezatotal.com', 'Av. Grau 456, Callao');

-- =====================================================
-- CATEGORÍAS DE PRODUCTOS
-- =====================================================
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#2563eb',
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_categorias_nombre ON categorias(nombre);

-- Datos de ejemplo para categorías
INSERT INTO categorias (nombre, descripcion, color, icono) VALUES
('Bebidas', 'Bebidas gaseosas, jugos y agua', '#3b82f6', 'drink'),
('Abarrotes', 'Productos de despensa y alimentos básicos', '#10b981', 'shopping-bag'),
('Lácteos', 'Leche, yogurt, quesos y derivados', '#f59e0b', 'milk'),
('Snacks', 'Galletas, papas fritas y golosinas', '#ef4444', 'cookie'),
('Limpieza', 'Productos de limpieza y cuidado del hogar', '#8b5cf6', 'spray'),
('Higiene Personal', 'Jabones, shampoo y cuidado personal', '#ec4899', 'user'),
('Panadería', 'Pan, pasteles y productos de panadería', '#f97316', 'bread'),
('Frutas y Verduras', 'Productos frescos', '#22c55e', 'apple');

-- =====================================================
-- PRODUCTOS
-- =====================================================
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    categoria_id BIGINT NOT NULL,
    proveedor_id BIGINT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    codigo_barras VARCHAR(50) UNIQUE,
    precio_venta DECIMAL(10, 2) NOT NULL,
    precio_costo DECIMAL(10, 2) NOT NULL,
    stock_minimo INTEGER DEFAULT 10,
    tiene_variantes BOOLEAN DEFAULT false,
    imagen_url TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);
CREATE INDEX idx_productos_proveedor_id ON productos(proveedor_id);
CREATE INDEX idx_productos_codigo_barras ON productos(codigo_barras);
CREATE INDEX idx_productos_nombre ON productos(nombre);

-- Datos de ejemplo para productos
INSERT INTO productos (categoria_id, proveedor_id, nombre, descripcion, codigo_barras, precio_venta, precio_costo, stock_minimo, imagen_url) VALUES
(1, 3, 'Coca Cola 500ml', 'Gaseosa Coca Cola personal', '7501055300013', 3.50, 2.50, 20, 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'),
(1, 3, 'Inca Kola 1.5L', 'Gaseosa Inca Kola familiar', '7750885000116', 6.00, 4.20, 15, 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400'),
(2, 4, 'Arroz Costeño 1kg', 'Arroz superior', '7750670000017', 4.50, 3.20, 30, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
(2, 4, 'Aceite Primor 1L', 'Aceite vegetal', '7750670000024', 8.50, 6.00, 25, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'),
(3, 1, 'Leche Gloria 1L', 'Leche evaporada entera', '7750670000031', 5.00, 3.50, 40, 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'),
(3, 1, 'Yogurt Gloria 1L', 'Yogurt frutado fresa', '7750670000048', 6.50, 4.50, 20, 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'),
(4, 4, 'Galletas Soda Field 6pack', 'Galletas de soda', '7750670000055', 3.00, 2.00, 50, 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400'),
(4, 4, 'Papas Lays 180g', 'Papas fritas clásicas', '7750670000062', 5.50, 3.80, 30, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'),
(5, 5, 'Detergente Ariel 1kg', 'Detergente en polvo', '7750670000079', 12.00, 8.50, 15, 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400'),
(5, 5, 'Lejía Clorox 1L', 'Lejía desinfectante', '7750670000086', 4.50, 3.00, 20, 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400');

-- =====================================================
-- VARIANTES DE PRODUCTOS
-- =====================================================
CREATE TABLE producto_variantes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    nombre_variante VARCHAR(100) NOT NULL,
    valor_variante VARCHAR(100) NOT NULL,
    codigo_barras VARCHAR(50) UNIQUE,
    precio_adicional DECIMAL(10, 2) DEFAULT 0,
    stock_actual INTEGER DEFAULT 0,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_producto_variantes_producto_id ON producto_variantes(producto_id);
CREATE INDEX idx_producto_variantes_codigo_barras ON producto_variantes(codigo_barras);

-- =====================================================
-- INVENTARIO
-- =====================================================
CREATE TABLE inventario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT NOT NULL,
    variante_id BIGINT,
    stock_actual INTEGER DEFAULT 0,
    stock_reservado INTEGER DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventario_producto_id ON inventario(producto_id);
CREATE INDEX idx_inventario_variante_id ON inventario(variante_id);

-- Datos de ejemplo para inventario
INSERT INTO inventario (producto_id, stock_actual) VALUES
(1, 50), (2, 30), (3, 100), (4, 45), (5, 80),
(6, 35), (7, 120), (8, 60), (9, 25), (10, 40);

-- =====================================================
-- MOVIMIENTOS DE INVENTARIO
-- =====================================================
CREATE TABLE movimientos_inventario (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    variante_id BIGINT,
    tipo_movimiento VARCHAR(50) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'transferencia', 'venta', 'devolucion')),
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    motivo TEXT,
    referencia VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movimientos_inventario_user_id ON movimientos_inventario(user_id);
CREATE INDEX idx_movimientos_inventario_producto_id ON movimientos_inventario(producto_id);
CREATE INDEX idx_movimientos_inventario_tipo ON movimientos_inventario(tipo_movimiento);
CREATE INDEX idx_movimientos_inventario_created_at ON movimientos_inventario(created_at);

ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;

CREATE POLICY movimientos_inventario_select_policy ON movimientos_inventario
    FOR SELECT USING (user_id = uid());

CREATE POLICY movimientos_inventario_insert_policy ON movimientos_inventario
    FOR INSERT WITH CHECK (user_id = uid());

-- =====================================================
-- VENTAS
-- =====================================================
CREATE TABLE ventas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    numero_venta VARCHAR(50) UNIQUE NOT NULL,
    tipo_comprobante VARCHAR(20) NOT NULL CHECK (tipo_comprobante IN ('boleta', 'factura', 'ticket')),
    serie_comprobante VARCHAR(10),
    numero_comprobante VARCHAR(20),
    cliente_nombre VARCHAR(200),
    cliente_documento VARCHAR(20),
    cliente_email VARCHAR(100),
    subtotal DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    impuesto DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    estado VARCHAR(20) DEFAULT 'completada' CHECK (estado IN ('pendiente', 'completada', 'anulada')),
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_ventas_user_id ON ventas(user_id);
CREATE INDEX idx_ventas_numero_venta ON ventas(numero_venta);
CREATE INDEX idx_ventas_created_at ON ventas(created_at);
CREATE INDEX idx_ventas_estado ON ventas(estado);

ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY ventas_select_policy ON ventas
    FOR SELECT USING (user_id = uid());

CREATE POLICY ventas_insert_policy ON ventas
    FOR INSERT WITH CHECK (user_id = uid());

CREATE POLICY ventas_update_policy ON ventas
    FOR UPDATE USING (user_id = uid()) WITH CHECK (user_id = uid());

-- =====================================================
-- DETALLE DE VENTAS
-- =====================================================
CREATE TABLE venta_detalles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    variante_id BIGINT,
    cantidad INTEGER NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    descuento DECIMAL(10, 2) DEFAULT 0,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venta_detalles_venta_id ON venta_detalles(venta_id);
CREATE INDEX idx_venta_detalles_producto_id ON venta_detalles(producto_id);

-- =====================================================
-- MÉTODOS DE PAGO
-- =====================================================
CREATE TABLE metodos_pago (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('efectivo', 'tarjeta', 'yape', 'plin', 'transferencia')),
    requiere_referencia BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de ejemplo para métodos de pago
INSERT INTO metodos_pago (nombre, tipo, requiere_referencia) VALUES
('Efectivo', 'efectivo', false),
('Tarjeta Visa/Mastercard', 'tarjeta', true),
('Yape', 'yape', true),
('Plin', 'plin', true),
('Transferencia Bancaria', 'transferencia', true);

-- =====================================================
-- PAGOS DE VENTAS
-- =====================================================
CREATE TABLE venta_pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    metodo_pago_id BIGINT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    referencia VARCHAR(100),
    estado VARCHAR(20) DEFAULT 'completado' CHECK (estado IN ('pendiente', 'completado', 'rechazado')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venta_pagos_venta_id ON venta_pagos(venta_id);
CREATE INDEX idx_venta_pagos_metodo_pago_id ON venta_pagos(metodo_pago_id);

-- =====================================================
-- COMPROBANTES ELECTRÓNICOS (SUNAT/GREENTER)
-- =====================================================
CREATE TABLE comprobantes_electronicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    venta_id BIGINT NOT NULL,
    tipo_comprobante VARCHAR(20) NOT NULL CHECK (tipo_comprobante IN ('boleta', 'factura')),
    serie VARCHAR(10) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    ruc_emisor VARCHAR(11) NOT NULL,
    razon_social_emisor VARCHAR(200) NOT NULL,
    documento_cliente VARCHAR(20),
    nombre_cliente VARCHAR(200),
    fecha_emision TIMESTAMP NOT NULL,
    moneda VARCHAR(3) DEFAULT 'PEN',
    total DECIMAL(10, 2) NOT NULL,
    xml_content TEXT,
    pdf_url TEXT,
    cdr_content TEXT,
    hash_cpe VARCHAR(100),
    estado_sunat VARCHAR(50) DEFAULT 'pendiente' CHECK (estado_sunat IN ('pendiente', 'aceptado', 'rechazado', 'anulado')),
    mensaje_sunat TEXT,
    fecha_envio_sunat TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(serie, numero)
);

CREATE INDEX idx_comprobantes_venta_id ON comprobantes_electronicos(venta_id);
CREATE INDEX idx_comprobantes_estado_sunat ON comprobantes_electronicos(estado_sunat);
CREATE INDEX idx_comprobantes_fecha_emision ON comprobantes_electronicos(fecha_emision);

-- =====================================================
-- AUDITORÍA
-- =====================================================
CREATE TABLE auditoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    tabla VARCHAR(100) NOT NULL,
    registro_id BIGINT,
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('crear', 'actualizar', 'eliminar', 'venta', 'pago', 'inventario', 'login', 'logout')),
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(50),
    user_agent TEXT,
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_auditoria_user_id ON auditoria(user_id);
CREATE INDEX idx_auditoria_tabla ON auditoria(tabla);
CREATE INDEX idx_auditoria_accion ON auditoria(accion);
CREATE INDEX idx_auditoria_created_at ON auditoria(created_at);

-- =====================================================
-- TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA
-- =====================================================
DELIMITER //

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_producto_variantes_updated_at BEFORE UPDATE ON producto_variantes
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_inventario_updated_at BEFORE UPDATE ON inventario
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_ventas_updated_at BEFORE UPDATE ON ventas
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

CREATE TRIGGER update_comprobantes_updated_at BEFORE UPDATE ON comprobantes_electronicos
    FOR EACH ROW
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END //

DELIMITER ;
