
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const detallesCrud = new CrudOperations('venta_detalles', context.token);
  
  const data = await detallesCrud.findMany({}, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.venta_id || !body.producto_id || !body.cantidad || !body.precio_unitario) {
    return createErrorResponse({
      errorMessage: 'Venta, producto, cantidad y precio son requeridos',
      status: 400,
    });
  }
  
  const detallesCrud = new CrudOperations('venta_detalles', context.token);
  const data = await detallesCrud.create(body);
  return createSuccessResponse(data, 201);
}, true);
