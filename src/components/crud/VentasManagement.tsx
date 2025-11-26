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
import { Venta } from '@/lib/schemas';

export function VentasManagement() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVenta, setEditingVenta] = useState<Venta | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<Partial<Venta>>({
    estado: 'pendiente',
  });

  useEffect(() => {
    fetchVentas();
  }, [page]);

  const fetchVentas = async () => {
    try {
      setLoading(true);
      const data = await api.get(`/ventas-crud?limit=20&offset=${(page - 1) * 20}`);
      setVentas(data?.data || []);
    } catch (error) {
      toast.error('Error al cargar ventas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVenta(null);
    setFormData({ estado: 'pendiente' });
    setIsModalOpen(true);
  };

  const handleEdit = (venta: Venta) => {
    setEditingVenta(venta);
    setFormData(venta);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.delete(`/ventas-crud/${id}`);
      toast.success('Venta eliminada exitosamente');
      fetchVentas();
    } catch (error) {
      toast.error('Error al eliminar venta');
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingVenta) {
        await api.put(`/ventas-crud/${editingVenta.id}`, formData);
        toast.success('Venta actualizada');
      } else {
        await api.post('/ventas-crud', formData);
        toast.success('Venta creada exitosamente');
      }
      setIsModalOpen(false);
      fetchVentas();
    } catch (error) {
      toast.error('Error al guardar venta');
      console.error(error);
    }
  };

  const columns = [
    { key: 'numero_venta' as const, label: 'Número' },
    { key: 'fecha' as const, label: 'Fecha' },
    {
      key: 'total' as const,
      label: 'Total',
      render: (value: number) => `S/. ${value.toFixed(2)}`,
    },
    {
      key: 'estado' as const,
      label: 'Estado',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded text-sm font-medium ${
          value === 'completada' ? 'bg-green-100 text-green-800' :
          value === 'cancelada' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
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
          <CardTitle>Gestión de Ventas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por número de venta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button onClick={handleCreate} className="gap-2">
              <Plus className="w-4 h-4" />
              Nueva Venta
            </Button>
          </div>

          <DataTable
            data={ventas}
            columns={columns}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              page,
              pageSize: 20,
              total: ventas.length,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingVenta ? 'Editar Venta' : 'Nueva Venta'}
        onSubmit={handleSubmit}
        submitLabel={editingVenta ? 'Actualizar' : 'Crear'}
      >
        <div className="space-y-4">
          <Input
            placeholder="Número de venta"
            value={formData.numero_venta || ''}
            onChange={(e) => setFormData({ ...formData, numero_venta: e.target.value })}
            required
          />
          <Input
            type="date"
            value={formData.fecha instanceof Date ? formData.fecha.toISOString().split('T')[0] : formData.fecha || ''}
            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
            required
          />
          <Input
            type="number"
            placeholder="Total"
            value={formData.total || ''}
            onChange={(e) => setFormData({ ...formData, total: parseFloat(e.target.value) })}
            required
            step="0.01"
          />
          <select
            title="Estado de la venta"
            value={formData.estado || 'pendiente'}
            onChange={(e) => setFormData({ ...formData, estado: e.target.value as any })}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="pendiente">Pendiente</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </FormModal>
    </div>
  );
}
