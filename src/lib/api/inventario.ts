import { Inventario } from '@/lib/schemas';
import { api } from './client';

export async function getInventario(search?: string, limit = 20, offset = 0) {
  const response = await api.get(`/inventario-crud?limit=${limit}&offset=${offset}&search=${search || ''}`);
  return response;
}

export async function getInventarioItem(id: number) {
  const response = await api.get(`/inventario-crud/${id}`);
  return response;
}

export async function createInventarioItem(item: Omit<Inventario, 'id'>) {
  const response = await api.post('/inventario-crud', item);
  return response;
}

export async function updateInventarioItem(id: number, item: Partial<Inventario>) {
  const response = await api.put(`/inventario-crud/${id}`, item);
  return response;
}

export async function deleteInventarioItem(id: number) {
  const response = await api.delete(`/inventario-crud/${id}`);
  return response;
}

export async function getMovimientosInventario(productoId?: number, limit = 20, offset = 0) {
  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
  });

  if (productoId) {
    params.append('producto_id', productoId.toString());
  }

  const response = await api.get(`/movimientos-inventario?${params}`);
  return response;
}
