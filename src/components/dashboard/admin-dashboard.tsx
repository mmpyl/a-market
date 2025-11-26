
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, TrendingUp, Package, Settings, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalInventario: 0,
    totalUsuarios: 0,
    ganancias: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Llamadas a APIs para obtener estadísticas
      const [ventasData, inventarioData, usuariosData] = await Promise.allSettled([
        api.get('/ventas?limit=100&offset=0'),
        api.get('/inventario'),
        api.get('/auth/users'),
      ]).then(results => 
        results.map(result => result.status === 'fulfilled' ? result.value : null)
      );

      // Calcular totales (con valores por defecto si falla la API)
      let totalVentas = 0;
      let totalInventario = 0;
      let totalUsuarios = 0;
      let ganancias = 0;

      if (ventasData && Array.isArray(ventasData)) {
        totalVentas = ventasData.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        ganancias = ventasData.reduce((sum: number, venta: any) => sum + (venta.ganancia || 0), 0);
      }

      if (inventarioData && Array.isArray(inventarioData)) {
        totalInventario = inventarioData.length;
      }

      if (usuariosData && Array.isArray(usuariosData)) {
        totalUsuarios = usuariosData.length;
      }

      setStats({
        totalVentas,
        totalInventario,
        totalUsuarios,
        ganancias,
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/. {stats.totalVentas.toFixed(2)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Este mes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ganancias</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">S/. {stats.ganancias.toFixed(2)}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Margen neto</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
            <Package className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInventario}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Productos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-gray-600 dark:text-gray-400">Activos en el sistema</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Administración</p>
                  <p className="text-xs text-gray-600">Gestionar sistema</p>
                </div>
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/vendedor">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Ventas</p>
                  <p className="text-xs text-gray-600">Gestionar ventas</p>
                </div>
                <ShoppingCart className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/almacen">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Almacén</p>
                  <p className="text-xs text-gray-600">Gestionar inventario</p>
                </div>
                <Package className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/auditoria">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auditoría</p>
                  <p className="text-xs text-gray-600">Ver registros</p>
                </div>
                <BarChart3 className="w-5 h-5 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="ventas" className="w-full">
            <TabsList>
              <TabsTrigger value="ventas">Ventas</TabsTrigger>
              <TabsTrigger value="inventario">Inventario</TabsTrigger>
              <TabsTrigger value="ganancias">Ganancias</TabsTrigger>
            </TabsList>
            <TabsContent value="ventas" className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Reportes de ventas diarios, semanales y mensuales
              </p>
            </TabsContent>
            <TabsContent value="inventario" className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Análisis de inventario y movimientos
              </p>
            </TabsContent>
            <TabsContent value="ganancias" className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                Análisis de rentabilidad y márgenes
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
