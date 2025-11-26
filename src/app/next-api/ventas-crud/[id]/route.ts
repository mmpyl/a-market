import { NextRequest } from 'next/server';
import CrudOperations from '@/lib/crud-operations';
import { ventaSchema } from '@/lib/schemas';
import { createErrorResponse } from '@/lib/create-response';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const crud = new CrudOperations('ventas', token);
    const venta = await crud.findById(id);

    if (!venta) {
      return Response.json({ success: false, message: 'Venta no encontrada' }, { status: 404 });
    }

    return Response.json({ success: true, data: venta });
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
    const validatedData = ventaSchema.partial().parse(body);

    const crud = new CrudOperations('ventas', token);
    const venta = await crud.update(id, validatedData);

    return Response.json({ success: true, data: venta, message: 'Venta actualizada' });
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

    const crud = new CrudOperations('ventas', token);
    const result = await crud.delete(id);

    return Response.json({ success: true, data: result, message: 'Venta eliminada' });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
