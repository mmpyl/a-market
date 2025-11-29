import { createProducto, deleteProducto, getProductos, updateProducto } from '@/lib/api/productos';
import { Producto } from '@/lib/schemas';
import { useEffect, useState } from 'react';

export function useProducts(search?: string, limit = 20, offset = 0) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProductos(search, limit, offset);
      setProductos(response.data || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [search, limit, offset]);

  const addProducto = async (producto: Omit<Producto, 'id'>) => {
    try {
      await createProducto(producto);
      await fetchProductos(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al crear producto');
    }
  };

  const editProducto = async (id: number, producto: Partial<Producto>) => {
    try {
      await updateProducto(id, producto);
      await fetchProductos(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al actualizar producto');
    }
  };

  const removeProducto = async (id: number) => {
    try {
      await deleteProducto(id);
      await fetchProductos(); // Refresh list
    } catch (err: any) {
      throw new Error(err.message || 'Error al eliminar producto');
    }
  };

  return {
    productos,
    loading,
    error,
    total,
    addProducto,
    editProducto,
    removeProducto,
    refetch: fetchProductos,
  };
}
