
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const comprobantesCrud = new CrudOperations('comprobantes_electronicos', context.token);
  
  const data = await comprobantesCrud.findMany({}, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.venta_id || !body.tipo_comprobante || !body.serie || !body.numero) {
    return createErrorResponse({
      errorMessage: 'Venta, tipo, serie y número de comprobante son requeridos',
      status: 400,
    });
  }
  
  const comprobantesCrud = new CrudOperations('comprobantes_electronicos', context.token);
  const data = await comprobantesCrud.create(body);
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
  const comprobantesCrud = new CrudOperations('comprobantes_electronicos', context.token);
  
  const existing = await comprobantesCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Comprobante no encontrado',
      status: 404,
    });
  }
  
  const data = await comprobantesCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
