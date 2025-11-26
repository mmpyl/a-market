
export interface User {
  sub: string;
  email: string;
  role: string;
  isAdmin: boolean;
  rol_sistema?: 'vendedor' | 'almacenero' | 'administrador' | 'auditor';
  nombre_completo?: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  nombre_completo: string;
  documento_identidad?: string;
  telefono?: string;
  direccion?: string;
  rol_sistema: 'vendedor' | 'almacenero' | 'administrador' | 'auditor';
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  icono?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoVariante {
  id: number;
  producto_id: number;
  nombre_variante: string;
  valor_variante: string;
  codigo_barras?: string;
  precio_adicional: number;
  stock_actual: number;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Producto {
  id: number;
  categoria_id: number;
  proveedor_id?: number;
  nombre: string;
  descripcion?: string;
  codigo_barras?: string;
  precio_venta: number;
  precio_costo: number;
  stock_minimo: number;
  tiene_variantes: boolean;
  imagen_url?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  ruc?: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface MetodoPago {
  id: number;
  nombre: string;
  tipo: 'efectivo' | 'tarjeta' | 'yape' | 'plin' | 'transferencia';
  requiere_referencia: boolean;
  activo: boolean;
  created_at: string;
}

export interface Venta {
  id: number;
  user_id: number;
  numero_venta: string;
  tipo_comprobante: 'boleta' | 'factura' | 'ticket';
  serie_comprobante?: string;
  numero_comprobante?: string;
  cliente_nombre?: string;
  cliente_documento?: string;
  cliente_email?: string;
  subtotal: number;
  descuento: number;
  impuesto: number;
  total: number;
  estado: 'pendiente' | 'completada' | 'anulada';
  observaciones?: string;
  created_at: string;
  updated_at: string;
}

export interface VentaDetalle {
  id: number;
  venta_id: number;
  producto_id: number;
  variante_id?: number;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  created_at: string;
}

export interface VentaPago {
  id: number;
  venta_id: number;
  metodo_pago_id: number;
  monto: number;
  referencia?: string;
  estado: 'pendiente' | 'completado' | 'rechazado';
  created_at: string;
}

export interface Inventario {
  id: number;
  producto_id: number;
  variante_id?: number;
  stock_actual: number;
  stock_reservado: number;
  ultima_actualizacion: string;
  created_at: string;
  updated_at: string;
}

export interface MovimientoInventario {
  id: number;
  user_id: number;
  producto_id: number;
  variante_id?: number;
  tipo_movimiento: 'entrada' | 'salida' | 'ajuste' | 'transferencia' | 'venta' | 'devolucion';
  cantidad: number;
  stock_anterior: number;
  stock_nuevo: number;
  motivo?: string;
  referencia?: string;
  created_at: string;
}

export interface ComprobanteElectronico {
  id: number;
  venta_id: number;
  tipo_comprobante: 'boleta' | 'factura';
  serie: string;
  numero: string;
  ruc_emisor: string;
  razon_social_emisor: string;
  documento_cliente?: string;
  nombre_cliente?: string;
  fecha_emision: string;
  moneda: string;
  total: number;
  xml_content?: string;
  pdf_url?: string;
  cdr_content?: string;
  hash_cpe?: string;
  estado_sunat: 'pendiente' | 'aceptado' | 'rechazado' | 'anulado';
  mensaje_sunat?: string;
  fecha_envio_sunat?: string;
  created_at: string;
  updated_at: string;
}

export interface Auditoria {
  id: number;
  user_id: number;
  tabla: string;
  registro_id?: number;
  accion: 'crear' | 'actualizar' | 'eliminar' | 'venta' | 'pago' | 'inventario' | 'login' | 'logout';
  datos_anteriores?: Record<string, any>;
  datos_nuevos?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  descripcion?: string;
  created_at: string;
}
