
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const variantesCrud = new CrudOperations('producto_variantes', context.token);
  
  const data = await variantesCrud.findMany({}, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.producto_id || !body.nombre_variante || !body.valor_variante) {
    return createErrorResponse({
      errorMessage: 'Producto, nombre y valor de variante son requeridos',
      status: 400,
    });
  }
  
  const variantesCrud = new CrudOperations('producto_variantes', context.token);
  const data = await variantesCrud.create(body);
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
  const variantesCrud = new CrudOperations('producto_variantes', context.token);
  
  const existing = await variantesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Variante no encontrada',
      status: 404,
    });
  }
  
  const data = await variantesCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
