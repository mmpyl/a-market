
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const movimientosCrud = new CrudOperations('movimientos_inventario', context.token);
  
  const data = await movimientosCrud.findMany({}, { limit, offset, orderBy: { column: 'created_at', direction: 'desc' } });
  return createSuccessResponse(data);
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body.producto_id || !body.tipo_movimiento || body.cantidad === undefined) {
    return createErrorResponse({
      errorMessage: 'Producto, tipo de movimiento y cantidad son requeridos',
      status: 400,
    });
  }
  
  const user_id = context.payload?.sub;
  
  if (!user_id) {
    return createErrorResponse({
      errorMessage: 'Usuario no autenticado',
      status: 401,
    });
  }
  
  const movimientosCrud = new CrudOperations('movimientos_inventario', context.token);
  
  const data = await movimientosCrud.create({
    ...body,
    user_id: parseInt(user_id),
  });
  
  return createSuccessResponse(data, 201);
}, true);
