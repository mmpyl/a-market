import { createInventarioItem, deleteInventarioItem, getInventario, getMovimientosInventario, updateInventarioItem } from '@/lib/api/inventario';
import { Inventario, MovimientoInventario } from '@/types/inventario';
import { useEffect, useState } from 'react';

export function useInventory(productoId?: number, limit = 20, offset = 0) {
  const [inventario, setInventario] = useState<Inventario[]>([]);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchInventario = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getInventario('', limit, offset);
      setInventario(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar inventario');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovimientos = async () => {
    if (!productoId) return;
    try {
      const response = await getMovimientosInventario(productoId, limit, offset);
      setMovimientos(response.data || []);
    } catch (err: any) {
      console.error('Error al cargar movimientos:', err);
    }
  };

  useEffect(() => {
    fetchInventario();
  }, [limit, offset]);

  useEffect(() => {
    fetchMovimientos();
  }, [productoId, limit, offset]);

  const addInventarioItem = async (item: Omit<Inventario, 'id'>) => {
    try {
      await createInventarioItem(item);
      await fetchInventario(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear item de inventario');
    }
  };

  const editInventarioItem = async (id: number, item: Partial<Inventario>) => {
    try {
      await updateInventarioItem(id, item);
      await fetchInventario(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar item de inventario');
    }
  };

  const removeInventarioItem = async (id: number) => {
    try {
      await deleteInventarioItem(id);
      await fetchInventario(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar item de inventario');
    }
  };

  return {
    inventario,
    movimientos,
    loading,
    error,
    total,
    addInventarioItem,
    editInventarioItem,
    removeInventarioItem,
    refetch: fetchInventario,
    refetchMovimientos: fetchMovimientos,
  };
}
