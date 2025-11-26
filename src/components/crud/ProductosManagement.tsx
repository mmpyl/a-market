'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Plus, Search } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Producto } from '@/lib/schemas';

export function ProductosManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<Partial<Producto>>({
    estado: 'activo',
    stock_minimo: 10,
  });

  useEffect(() => {
    fetchProductos();
  }, [page]);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/productos-crud?limit=20&offset=${(page - 1) * 20}`);
      setProductos(data?.data || []);
    } catch (error) {
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProducto(null);
    setFormData({ estado: 'activo', stock_minimo: 10 });
    setIsModalOpen(true);
  };

  const handleEdit = (producto: Producto) => {
    setEditingProducto(producto);
    setFormData(producto);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.delete(`/productos-crud/${id}`);
      toast.success('Producto eliminado');
      fetchProductos();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingProducto?.id) {
        await api.put(`/productos-crud/${editingProducto.id}`, formData);
        toast.success('Producto actualizado');
      } else {
        await api.post('/productos-crud', formData);
        toast.success('Producto creado');
      }
      setIsModalOpen(false);
      fetchProductos();
    } catch (error) {
      toast.error('Error al guardar producto');
    }
  };

  const columns = [
    { key: 'nombre' as const, label: 'Nombre' },
    { key: 'codigo_barras' as const, label: 'Código' },
    {
      key: 'precio_venta' as const,
      label: 'Precio',
      render: (value: number) => `S/. ${value.toFixed(2)}`,
    },
    { key: 'stock' as const, label: 'Stock' },
    {
      key: 'estado' as const,
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-sm ${
          value === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Productos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input placeholder="Buscar productos..." className="pl-10" />
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Producto
            </Button>
          </div>

          <DataTable
            data={productos}
            columns={columns}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              page,
              pageSize: 20,
              total: productos.length,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-3">
          <Input
            placeholder="Nombre del producto"
            value={formData.nombre || ''}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
          <Input
            placeholder="Código de barras"
            value={formData.codigo_barras || ''}
            onChange={(e) => setFormData({ ...formData, codigo_barras: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Precio de costo"
            value={formData.precio_costo || ''}
            onChange={(e) => setFormData({ ...formData, precio_costo: parseFloat(e.target.value) })}
            required
            step="0.01"
          />
          <Input
            type="number"
            placeholder="Precio de venta"
            value={formData.precio_venta || ''}
            onChange={(e) => setFormData({ ...formData, precio_venta: parseFloat(e.target.value) })}
            required
            step="0.01"
          />
          <Input
            type="number"
            placeholder="Stock"
            value={formData.stock || ''}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            required
          />
          <select
            title="Estado del producto"
            value={formData.estado || 'activo'}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
      </FormModal>
    </div>
  );
}
