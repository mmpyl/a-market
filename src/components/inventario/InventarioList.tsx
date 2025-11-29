'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { FormModal } from '@/components/ui/form-modal';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api-client';
import { Inventario } from '@/lib/schemas';
import { Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { InventarioForm } from './InventarioForm';

export function InventarioList() {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInventario, setEditingInventario] = useState<Inventario | null>(null);
  const [page, setPage] = useState(1);

  // 🔍 buscador
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  const [formData, setFormData] = useState<Partial<Inventario>>({
    tipo_movimiento: 'entrada',
    cantidad: 0,
  });

  useEffect(() => {
    fetchInventario();
  }, [page, debouncedQuery]);

  const fetchInventario = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/inventario-crud?limit=20&offset=${(page - 1) * 20}&search=${debouncedQuery}`
      );

      setInventario(res.data || []);
      setTotal(res.total || 0);
    } catch (error: any) {
      toast.error(error?.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingInventario(null);
    setFormData({ tipo_movimiento: 'entrada', cantidad: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (inventarioItem: Inventario) => {
    setEditingInventario(inventarioItem);
    setFormData(inventarioItem);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number | string) => {
    try {
      await api.delete(`/inventario-crud/${id}`);
      toast.success('Movimiento de inventario eliminado');
      fetchInventario();
    } catch (error: any) {
      toast.error(error?.message || 'Error al eliminar movimiento de inventario');
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingInventario?.id) {
        await api.put(`/inventario-crud/${editingInventario.id}`, formData);
        toast.success('Movimiento de inventario actualizado');
      } else {
        await api.post('/inventario-crud', formData);
        toast.success('Movimiento de inventario creado');
      }
      fetchInventario();
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.message || 'Error al guardar movimiento de inventario');
    }
  };

  const columns = useMemo(() => [
    {
      key: 'producto_id',
      header: 'Producto ID',
      render: (item: Inventario) => item.producto_id,
    },
    {
      key: 'tipo_movimiento',
      header: 'Tipo',
      render: (item: Inventario) => item.tipo_movimiento,
    },
    {
      key: 'cantidad',
      header: 'Cantidad',
      render: (item: Inventario) => item.cantidad,
    },
    {
      key: 'fecha',
      header: 'Fecha',
      render: (item: Inventario) => new Date(item.fecha).toLocaleDateString(),
    },
    {
      key: 'notas',
      header: 'Notas',
      render: (item: Inventario) => item.notas || '-',
    },
  ], []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Inventario</span>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Movimiento
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Buscar movimientos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <DataTable
            data={inventario}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              page,
              pageSize: 20,
              total,
              onPageChange: setPage,
            }}
          />
        </CardContent>
      </Card>

      <FormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={editingInventario ? 'Editar Movimiento de Inventario' : 'Nuevo Movimiento de Inventario'}
        onSubmit={handleSubmit}
      >
        <InventarioForm
          inventario={editingInventario || undefined}
          onSubmit={setFormData}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}
