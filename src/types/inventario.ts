export interface Inventario {
  id?: number;
  producto_id: number;
  cantidad: number;
  ubicacion?: string;
  lote?: string;
  fecha_vencimiento?: string;
  estado: 'disponible' | 'reservado' | 'dañado';
  created_at?: string;
  updated_at?: string;
}

export interface MovimientoInventario {
  id?: number;
  producto_id: number;
  tipo: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  cantidad: number;
  razon: string;
  referencia_id?: number;
  usuario_id?: number;
  created_at?: string;
}

export interface Variante {
  id?: number;
  producto_id: number;
  nombre: string;
  valores: string | Record<string, any>;
  sku?: string;
  precio_adicional: number;
  stock: number;
  estado: 'activo' | 'inactivo';
  created_at?: string;
  updated_at?: string;
}
