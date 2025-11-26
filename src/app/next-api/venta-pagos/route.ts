
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const pagosCrud = new CrudOperations('venta_pagos', context.token);
  
  const data = await pagosCrud.findMany({}, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.venta_id || !body.metodo_pago_id || !body.monto) {
    return createErrorResponse({
      errorMessage: 'Venta, método de pago y monto son requeridos',
      status: 400,
    });
  }
  
  const pagosCrud = new CrudOperations('venta_pagos', context.token);
  const data = await pagosCrud.create(body);
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
  const pagosCrud = new CrudOperations('venta_pagos', context.token);
  
  const existing = await pagosCrud.findById(id);
  if (!existing) {
    return createErrorResponse({
      errorMessage: 'Pago no encontrado',
      status: 404,
    });
  }
  
  const data = await pagosCrud.update(id, body);
  return createSuccessResponse(data);
}, true);
