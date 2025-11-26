import { NextRequest, NextResponse } from 'next/server';
import CrudOperations from '@/lib/crud-operations';
import { ventaSchema } from '@/lib/schemas';
import { createErrorResponse } from '@/lib/create-response';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return createErrorResponse({
        errorMessage: 'No autorizado',
        status: 401,
        errorCode: 'AUTH_ERROR',
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const estado = searchParams.get('estado');
    const fecha_inicio = searchParams.get('fecha_inicio');
    const fecha_fin = searchParams.get('fecha_fin');

    const crud = new CrudOperations('ventas', token);
    
    const filters: Record<string, any> = {};
    if (estado) filters.estado = estado;

    const ventas = await crud.findMany(filters, {
      limit,
      offset,
      orderBy: { column: 'fecha', direction: 'desc' },
    });

    return NextResponse.json({
      success: true,
      data: ventas,
      pagination: {
        limit,
        offset,
        total: ventas.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching ventas:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return createErrorResponse({
        errorMessage: 'No autorizado',
        status: 401,
        errorCode: 'AUTH_ERROR',
      });
    }

    const body = await request.json();

    // Validar con Zod
    const validatedData = ventaSchema.parse(body);

    const crud = new CrudOperations('ventas', token);
    const venta = await crud.create(validatedData);

    return NextResponse.json(
      { success: true, data: venta, message: 'Venta creada exitosamente' },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating venta:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, message: 'Validación fallida', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
