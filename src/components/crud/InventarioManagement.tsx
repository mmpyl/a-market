'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Plus, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import { Inventario } from '@/lib/schemas';

export function InventarioManagement() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventario | null>(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<Partial<Inventario>>({
    estado: 'disponible',
  });

  useEffect(() => {
    fetchInventario();
  }, [page]);

  const fetchInventario = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/inventario?limit=20&offset=${(page - 1) * 20}`);
      setInventario(data?.data || []);
    } catch (error) {
      toast.error('Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({ estado: 'disponible' });
    setIsModalOpen(true);
  };

  const handleEdit = (item: Inventario) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.delete(`/inventario/${id}`);
      toast.success('Registro de inventario eliminado');
      fetchInventario();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingItem?.id) {
        await api.put(`/inventario/${editingItem.id}`, formData);
        toast.success('Inventario actualizado');
      } else {
        await api.post('/inventario', formData);
        toast.success('Registro de inventario creado');
      }
      setIsModalOpen(false);
      fetchInventario();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const columns = [
    { key: 'producto_id' as const, label: 'Producto ID' },
    { key: 'cantidad' as const, label: 'Cantidad' },
    { key: 'ubicacion' as const, label: 'Ubicación' },
    { key: 'lote' as const, label: 'Lote' },
    {
      key: 'estado' as const,
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-sm ${
          value === 'disponible' ? 'bg-green-100 text-green-800' :
          value === 'reservado' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total Disponible</p>
            <p className="text-2xl font-bold">
              {inventario.filter(i => i.estado === 'disponible').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Reservado</p>
            <p className="text-2xl font-bold">
              {inventario.filter(i => i.estado === 'reservado').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Dañado
            </p>
            <p className="text-2xl font-bold">
              {inventario.filter(i => i.estado === 'dañado').length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Inventario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Nuevo Registro
          </Button>

          <DataTable
            data={inventario}
            columns={columns}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              page,
              pageSize: 20,
              total: inventario.length,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingItem ? 'Editar Inventario' : 'Nuevo Registro'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-3">
          <Input
            type="number"
            placeholder="ID del Producto"
            value={formData.producto_id || ''}
            onChange={(e) => setFormData({ ...formData, producto_id: parseInt(e.target.value) })}
            required
          />
          <Input
            type="number"
            placeholder="Cantidad"
            value={formData.cantidad || ''}
            onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
            required
          />
          <Input
            placeholder="Ubicación (Ej: Estante A-1)"
            value={formData.ubicacion || ''}
            onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
          />
          <Input
            placeholder="Lote"
            value={formData.lote || ''}
            onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
          />
          <select
            title="Estado del inventario"
            value={formData.estado || 'disponible'}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="dañado">Dañado</option>
          </select>
        </div>
      </FormModal>
    </div>
  );
}
