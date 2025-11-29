export interface Venta {
  id?: number;
  numero_venta: string;
  fecha: string | Date;
  cliente_id?: number;
  cliente_nombre?: string;
  total: number;
  igv: number;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago_id?: number;
  comprobante_id?: number;
  notas?: string;
  created_at?: string;
  updated_at?: string;
}

export interface VentaDetalle {
  id?: number;
  venta_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: number;
  descuento: number;
  subtotal: number;
  created_at?: string;
}
