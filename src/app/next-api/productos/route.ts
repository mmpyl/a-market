import { NextRequest } from 'next/server';
import { createSuccessResponse, createErrorResponse } from '@/lib/create-response';

// Mock data for development
const mockProductos = [
  {
    id: 1,
    nombre: 'Arroz Superior 5kg',
    descripcion: 'Arroz blanco de primera calidad',
    categoria_id: 1,
    precio_compra: 18.50,
    precio_venta: 22.00,
    precio_mayorista: 20.50,
    unidad_medida: 'unidad',
    stock_minimo: 10,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: 2,
    nombre: 'Aceite Vegetal 1L',
    descripcion: 'Aceite de girasol refinado',
    categoria_id: 1,
    precio_compra: 8.20,
    precio_venta: 10.50,
    precio_mayorista: 9.80,
    unidad_medida: 'unidad',
    stock_minimo: 15,
    activo: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const GET = async (request: NextRequest) => {
  try {
    // For development, return mock data
    return createSuccessResponse({
      data: mockProductos,
    });

  } catch (error) {
    console.error('Error fetching productos:', error);
    return createErrorResponse({
      errorMessage: 'Internal server error',
      status: 500,
    });
  }
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();

    // For development, simulate creating a product
    const newProducto = {
      id: mockProductos.length + 1,
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return createSuccessResponse({
      data: newProducto,
    });

  } catch (error) {
    console.error('Error creating producto:', error);
    return createErrorResponse({
      errorMessage: 'Internal server error',
      status: 500,
    });
  }
};
