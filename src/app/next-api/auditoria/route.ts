
import CrudOperations from '@/lib/crud-operations';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';
import { requestMiddleware, parseQueryParams, validateRequestBody } from '@/lib/api-utils';

export const runtime = 'edge';

export const GET = requestMiddleware(async (request, context) => {
  const { limit, offset } = parseQueryParams(request);
  const auditoriaCrud = new CrudOperations('auditoria', context.token);

  const data = await auditoriaCrud.findMany({}, { limit, offset, orderBy: { column: 'created_at', direction: 'desc' } });
  return createSuccessResponse({ data });
}, true);

export const POST = requestMiddleware(async (request, context) => {
  const body = await validateRequestBody(request);
  
  if (!body?.tabla || !body?.accion) {
    return createErrorResponse({
      errorMessage: 'Table and action are required',
      status: 400,
    });
  }
  
  const userIdStr = context?.payload?.sub;
  if (!userIdStr) {
    return createErrorResponse({
      errorMessage: 'User ID is required',
      status: 400,
    });
  }

  const auditoriaCrud = new CrudOperations('auditoria', context.token);
  
  const data = await auditoriaCrud.create({
    ...body,
    user_id: parseInt(userIdStr, 10),
  });
  
  return createSuccessResponse(data, 201);
}, true);
    