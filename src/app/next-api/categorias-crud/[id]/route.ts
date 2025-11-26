import { NextRequest } from 'next/server';
import CrudOperations from '@/lib/crud-operations';
import { categoriaSchema } from '@/lib/schemas';
import { createErrorResponse } from '@/lib/create-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const crud = new CrudOperations('categorias', token);
    const categoria = await crud.findById(id);

    if (!categoria) return Response.json({ success: false, message: 'Categoría no encontrada' }, { status: 404 });

    return Response.json({ success: true, data: categoria });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const body = await request.json();
    const validatedData = categoriaSchema.partial().parse(body);

    const crud = new CrudOperations('categorias', token);
    const updated = await crud.update(id, validatedData as any);

    return Response.json({ success: true, data: updated, message: 'Categoría actualizada' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json({ success: false, message: 'Validación fallida', errors: error.errors }, { status: 400 });
    }
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const crud = new CrudOperations('categorias', token);
    const result = await crud.delete(id);

    return Response.json({ success: true, data: result, message: 'Categoría eliminada' });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
