import { Producto } from '@/lib/schemas';
import { api } from './client';

export async function getProductos(search?: string, limit = 20, offset = 0) {
  const response = await api.get(`/productos-crud?limit=${limit}&offset=${offset}&search=${search || ''}`);
  return response;
}

export async function getProducto(id: number) {
  const response = await api.get(`/productos-crud/${id}`);
  return response;
}

export async function createProducto(producto: Omit<Producto, 'id'>) {
  const response = await api.post('/productos-crud', producto);
  return response;
}

export async function updateProducto(id: number, producto: Partial<Producto>) {
  const response = await api.put(`/productos-crud/${id}`, producto);
  return response;
}

export async function deleteProducto(id: number) {
  const response = await api.delete(`/productos-crud/${id}`);
  return response;
}
