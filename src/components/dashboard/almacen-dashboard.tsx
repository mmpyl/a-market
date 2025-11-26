
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, AlertTriangle, Plus } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export function AlmacenDashboard() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await api.get('/productos');
      setProductos(data.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productosAlerta = filteredProductos.filter(p => p.stock_minimo && p.stock_minimo > 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Gestión de Inventario
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>

          {productosAlerta.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                    Productos con Stock Bajo
                  </h3>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    {productosAlerta.length} producto(s) requieren reabastecimiento
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {filteredProductos.map((producto) => (
              <div
                key={producto.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800"
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Código: {producto.codigo_barras || 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{producto.stock_minimo || 0}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stock actual
                  </p>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  Ajustar
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
