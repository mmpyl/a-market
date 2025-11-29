'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Producto } from '@/lib/schemas';

interface ProductoCardProps {
  producto: Producto;
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
}

export function ProductoCard({ producto, onEdit, onDelete }: ProductoCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{producto.nombre}</CardTitle>
          <Badge variant={producto.estado === 'activo' ? 'default' : 'secondary'}>
            {producto.estado}
          </Badge>
        </div>
        {producto.descripcion && (
          <p className="text-sm text-gray-600">{producto.descripcion}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Código:</span>
            <span className="font-mono">{producto.codigo_barras || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Precio:</span>
            <span className="font-semibold">S/. {producto.precio_venta.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Stock:</span>
            <span className={producto.stock <= producto.stock_minimo ? 'text-red-600' : 'text-green-600'}>
              {producto.stock}
            </span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(producto)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(producto.id!)}
                className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
