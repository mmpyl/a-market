
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const metodosCrud = new CrudOperations('metodos_pago', context.token);
  
  const data = await metodosCrud.findMany({ activo: true }, { limit, offset });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.nombre || !body.tipo) {
    return createErrorResponse({
      errorMessage: 'Nombre y tipo de método de pago son requeridos',
      status: 400,
    });
  }
  
  const metodosCrud = new CrudOperations('metodos_pago', context.token);
  const data = await metodosCrud.create(body);
  return createSuccessResponse(data, 201);
}, true);
