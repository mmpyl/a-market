import { NextRequest } from 'next/server';
import CrudOperations from '@/lib/crud-operations';
import { usuarioSchema } from '@/lib/schemas';
import { createErrorResponse } from '@/lib/create-response';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const crud = new CrudOperations('usuarios', token);
    const usuarios = await crud.findMany(undefined, { limit, offset });

    return Response.json({
      success: true,
      data: usuarios,
      pagination: { limit, offset, total: usuarios.length },
    });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) return createErrorResponse({ errorMessage: 'No autorizado', status: 401 });

    const body = await request.json();
    const validatedData = usuarioSchema.parse(body);

    const crud = new CrudOperations('usuarios', token);
    const usuario = await crud.create(validatedData as any);

    return Response.json({ success: true, data: usuario, message: 'Usuario creado' }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return Response.json({ success: false, message: 'Validación fallida', errors: error.errors }, { status: 400 });
    }
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}
