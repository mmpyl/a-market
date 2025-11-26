/**
 * Environment validation utility
 * Verifica que todas las variables de entorno críticas estén configuradas
 */

interface EnvConfig {
  required: string[];
  optional: string[];
}

const envConfig: EnvConfig = {
  required: [
    'POSTGREST_URL',
    'POSTGREST_API_KEY',
    'JWT_SECRET',
  ],
  optional: [
    'RESEND_API_KEY',
    'HASH_SALT_KEY',
  ],
};

export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
 * Valida que todas las variables de entorno requeridas estén configuradas
 * @throws {EnvironmentError} Si faltan variables requeridas
 */
export function validateEnvironment(): void {
  const missing: string[] = [];

  for (const key of envConfig.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    const missingVars = missing.join(', ');
    throw new EnvironmentError(
      `Missing required environment variables: ${missingVars}`
    );
  }
}

/**
 * Obtiene el valor de una variable de entorno requerida
 * @param key - Nombre de la variable
 * @throws {EnvironmentError} Si la variable no existe
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new EnvironmentError(`Required environment variable not set: ${key}`);
  }
  return value;
}

/**
 * Obtiene el valor de una variable de entorno opcional
 * @param key - Nombre de la variable
 * @param defaultValue - Valor por defecto
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Verifica si estamos en ambiente de desarrollo
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Verifica si estamos en ambiente de producción
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Obtiene información del ambiente
 */
export function getEnvironmentInfo() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    hasDatabase: !!process.env.POSTGREST_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
  };
}

// Ejecutar validación al importar el módulo en servidor
if (typeof window === 'undefined') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('[Environment Error]', error instanceof Error ? error.message : error);
    // No lanzar error para permitir que el servidor inicie, pero registrar el problema
  }
}
