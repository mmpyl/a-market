'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Inventario } from '@/lib/schemas';

interface InventarioCardProps {
  inventario: Inventario;
  onEdit?: (inventario: Inventario) => void;
  onDelete?: (id: number) => void;
}

export function InventarioCard({ inventario, onEdit, onDelete }: InventarioCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">Producto ID: {inventario.producto_id}</CardTitle>
          <Badge variant={
            inventario.tipo_movimiento === 'entrada' ? 'default' :
            inventario.tipo_movimiento === 'salida' ? 'secondary' : 'outline'
          }>
            {inventario.tipo_movimiento}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Cantidad: {inventario.cantidad}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fecha:</span>
            <span>{new Date(inventario.fecha).toLocaleDateString()}</span>
          </div>
          {inventario.notas && (
            <div className="text-sm">
              <span>Notas:</span>
              <p className="text-gray-600">{inventario.notas}</p>
            </div>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(inventario)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(inventario.id!)}
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
