import { NextRequest } from 'next/server';
import CrudOperations from '@/lib/crud-operations';
import { productoSchema } from '@/lib/schemas';
import { createErrorResponse } from '@/lib/create-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const crud = new CrudOperations('productos', token);
    const producto = await crud.findById(id);

    if (!producto) {
      return Response.json({ success: false, message: 'Producto no encontrado' }, { status: 404 });
    }

    return Response.json({ success: true, data: producto });
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
    const validatedData = productoSchema.partial().parse(body);

    const crud = new CrudOperations('productos', token);
    const producto = await crud.update(id, validatedData);

    return Response.json({ success: true, data: producto, message: 'Producto actualizado' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json(
        { success: false, message: 'Validación fallida', errors: error.errors },
        { status: 400 }
      );
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

    const crud = new CrudOperations('productos', token);
    const result = await crud.delete(id);

    return Response.json({ success: true, data: result, message: 'Producto eliminado' });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
