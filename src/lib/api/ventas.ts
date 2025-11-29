import { Venta } from '@/lib/schemas';
import { api } from './client';

export async function getVentas(search?: string, limit = 20, offset = 0) {
  const response = await api.get(`/ventas-crud?limit=${limit}&offset=${offset}&search=${search || ''}`);
  return response;
}

export async function getVenta(id: number) {
  const response = await api.get(`/ventas-crud/${id}`);
  return response;
}

export async function createVenta(venta: Omit<Venta, 'id'>) {
  const response = await api.post('/ventas-crud', venta);
  return response;
}

export async function updateVenta(id: number, venta: Partial<Venta>) {
  const response = await api.put(`/ventas-crud/${id}`, venta);
  return response;
}

export async function deleteVenta(id: number) {
  const response = await api.delete(`/ventas-crud/${id}`);
  return response;
}
