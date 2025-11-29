import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Email inválido');

export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
  .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
  .regex(/[0-9]/, 'La contraseña debe contener al menos un número');

export const phoneSchema = z
  .string()
  .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Número de teléfono inválido');

export const positiveNumberSchema = z
  .number()
  .positive('Debe ser un número positivo');

export const nonNegativeNumberSchema = z
  .number()
  .min(0, 'No puede ser negativo');

// Product validation
export const productSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  precio_costo: positiveNumberSchema,
  precio_venta: positiveNumberSchema,
  stock: nonNegativeNumberSchema,
  estado: z.enum(['activo', 'inactivo']),
  stock_minimo: nonNegativeNumberSchema.optional(),
  codigo_barras: z.string().optional(),
});

// Sale validation
export const saleSchema = z.object({
  numero_venta: z.string().min(1, 'El número de venta es requerido'),
  cliente_nombre: z.string().optional(),
  total: positiveNumberSchema,
  igv: nonNegativeNumberSchema,
  estado: z.enum(['pendiente', 'completada', 'cancelada']),
  fecha: z.string().min(1, 'La fecha es requerida'),
  notas: z.string().optional(),
});

// Inventory validation
export const inventorySchema = z.object({
  producto_id: z.number().int().positive('ID de producto inválido'),
  tipo_movimiento: z.enum(['entrada', 'salida', 'ajuste']),
  cantidad: positiveNumberSchema,
  fecha: z.string().min(1, 'La fecha es requerida'),
  notas: z.string().optional(),
});

// User validation
export const userSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  email: emailSchema,
  rol: z.enum(['administrador', 'vendedor', 'almacenero', 'auditor']),
  estado: z.enum(['activo', 'inactivo']),
});

// Validation helpers
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { success: false, errors: result.error };
  }
}

export function formatValidationErrors(error: z.ZodError): string[] {
  return error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
}
