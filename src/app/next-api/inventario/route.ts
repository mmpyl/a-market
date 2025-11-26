
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const inventarioCrud = new CrudOperations('inventario', context.token);
  
  const data = await inventarioCrud.findMany({}, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.producto_id) {
    return createErrorResponse({
      errorMessage: 'El ID del producto es requerido',
      status: 400,
    });
  }
  
  const inventarioCrud = new CrudOperations('inventario', context.token);
  const data = await inventarioCrud.create(body);
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
  const inventarioCrud = new CrudOperations('inventario', context.token);
  
  const existing = await inventarioCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Registro de inventario no encontrado',
      status: 404,
    });
  }
  
  const data = await inventarioCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
