
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const proveedoresCrud = new CrudOperations('proveedores', context.token);
  
  const data = await proveedoresCrud.findMany({ activo: true }, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.nombre) {
    return createErrorResponse({
      errorMessage: 'El nombre del proveedor es requerido',
      status: 400,
    });
  }
  
  const proveedoresCrud = new CrudOperations('proveedores', context.token);
  const data = await proveedoresCrud.create(body);
  return createSuccessResponse(data, 201);
}, true);

export const PUT = requestMiddleware(async (request, context) => {
  const { id } = parseQueryParams(request);
  
  if (!id) {
    return createErrorResponse({
      errorMessage: 'ID es requerido',
      status: 400,
    });
  }
  
  const body = await validateRequestBody(request);
  const proveedoresCrud = new CrudOperations('proveedores', context.token);
  
  const existing = await proveedoresCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Proveedor no encontrado',
      status: 404,
    });
  }
  
  const data = await proveedoresCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
