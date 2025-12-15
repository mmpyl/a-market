// ============================================================
// Archivo: src/app/api/productos/route.ts
// ============================================================

import { requestMiddleware, responseError, responseSuccess } from '@/lib/api-utils';
import CrudOperations from '@/lib/crud-operations';

// GET - Obtener productos (requiere autenticación)
export const GET = requestMiddleware(async (request, context) => {
  try {
    // context.token contiene el token válido
    // context.payload contiene: { sub, email, role, isAdmin }

    const productosCrud = new CrudOperations('productos', context.token!);
    
    // Obtener todos los productos
    const productos = await productosCrud.getAll();
    

    return responseSuccess(productos, 'Productos obtenidos correctamente');
  } catch (error) {
    console.error('Error fetching productos:', error);
    return responseError(500, 'Error al obtener productos');
  }
});

// POST - Crear producto (requiere autenticación Y ser admin)
export const POST = requestMiddleware(async (request, context) => {
  try {
    // Verificar que sea administrador
    if (!context.payload?.isAdmin) {
      return responseError(403, 'Acceso denegado: se requieren permisos de administrador', 'FORBIDDEN');
    }

    const body = await request.json();
    const productosCrud = new CrudOperations('productos', context.token!);
    const nuevoProducto = await productosCrud.create(body);

    return responseSuccess(nuevoProducto, 'Producto creado correctamente');
  } catch (error) {
    console.error('Error creating producto:', error);
    return responseError(500, 'Error al crear producto');
  }
});

