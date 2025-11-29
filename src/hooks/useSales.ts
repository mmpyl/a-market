import { createVenta, deleteVenta, getVentas, updateVenta } from '@/lib/api/ventas';
import { Venta } from '@/lib/schemas';
import { useEffect, useState } from 'react';

export function useSales(search?: string, limit = 20, offset = 0) {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchVentas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getVentas(search, limit, offset);
      setVentas(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, [search, limit, offset]);

  const addVenta = async (venta: Omit<Venta, 'id'>) => {
    try {
      await createVenta(venta);
      await fetchVentas(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear venta');
    }
  };

  const editVenta = async (id: number, venta: Partial<Venta>) => {
    try {
      await updateVenta(id, venta);
      await fetchVentas(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar venta');
    }
  };

  const removeVenta = async (id: number) => {
    try {
      await deleteVenta(id);
      await fetchVentas(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar venta');
    }
  };

  return {
    ventas,
    loading,
    error,
    total,
    addVenta,
    editVenta,
    removeVenta,
    refetch: fetchVentas,
  };
}
