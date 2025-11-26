
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const runtime = 'edge';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const ventasCrud = new CrudOperations('ventas', context.token);

  const data = await ventasCrud.findMany({}, { limit, offset });
  return createSuccessResponse({ data });
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.numero_venta || !body.tipo_comprobante || !body.total) {
    return createErrorResponse({
      errorMessage: 'Número de venta, tipo de comprobante y total son requeridos',
      status: 400,
    });
  }
  
  const user_id = context.payload?.sub;
  const ventasCrud = new CrudOperations('ventas', context.token);
  
  const data = await ventasCrud.create({
    ...body,
    user_id: parseInt(user_id),
  });
  
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
  const ventasCrud = new CrudOperations('ventas', context.token);
  
  const existing = await ventasCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Venta no encontrada',
      status: 404,
    });
  }
  
  const data = await ventasCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
