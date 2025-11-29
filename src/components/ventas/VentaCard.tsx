'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Venta } from '@/lib/schemas';

interface VentaCardProps {
  venta: Venta;
  onEdit?: (venta: Venta) => void;
  onDelete?: (id: number) => void;
}

export function VentaCard({ venta, onEdit, onDelete }: VentaCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{venta.numero_venta}</CardTitle>
          <Badge variant={
            venta.estado === 'completada' ? 'default' :
            venta.estado === 'pendiente' ? 'secondary' : 'destructive'
          }>
            {venta.estado}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          {venta.cliente_nombre || 'Cliente no especificado'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Fecha:</span>
            <span>{new Date(venta.fecha).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total:</span>
            <span className="font-semibold">S/. {venta.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>IGV:</span>
            <span>S/. {venta.igv.toFixed(2)}</span>
          </div>
        </div>
        {(onEdit || onDelete) && (
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <button
                onClick={() => onEdit(venta)}
                className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(venta.id!)}
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
