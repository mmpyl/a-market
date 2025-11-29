export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  codigo_barras?: string;
  categoria_id: number;
  proveedor_id?: number;
  precio_costo: number;
  precio_venta: number;
  stock: number;
  stock_minimo: number;
  estado: 'activo' | 'inactivo';
  imagen_url?: string;
  created_at?: string;
  updated_at?: string;
}
