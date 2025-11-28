/**
 * Environment validation utility
 * Verifica que todas las variables de entorno críticas estén configuradas
 * 
 * @module environment
 */

// ==================== Types ====================

interface EnvConfig {
  required: string[];
  optional: string[];
  deprecated?: string[];
}

interface EnvInfo {
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  hasDatabase: boolean;
  hasJwtSecret: boolean;
  hasEmailService: boolean;
  hasHashSalt: boolean;
}

interface ValidationResult {
  valid: boolean;
  missing: string[];
  deprecated: string[];
  warnings: string[];
}

// ==================== Configuration ====================

const envConfig: EnvConfig = {
  required: [
    'POSTGREST_URL',
    'POSTGREST_API_KEY',
    'JWT_SECRET',
    'POSTGREST_SCHEMA',
    'SCHEMA_ADMIN_USER',
  ],
  optional: [
    'RESEND_API_KEY',
    'HASH_SALT_KEY',
    'FROM_EMAIL',
    'NEXT_PUBLIC_BASE_URL',
  ],
  deprecated: [
    // Agregar variables obsoletas aquí para mostrar warnings
  ],
};

// ==================== Custom Error ====================

export class EnvironmentError extends Error {
  constructor(message: string, public missingVars?: string[]) {
    super(message);
    this.name = 'EnvironmentError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnvironmentError);
    }
  }
}

// ==================== Validation Functions ====================

/**
 * Valida que todas las variables de entorno requeridas estén configuradas
 * 
 * @throws {EnvironmentError} Si faltan variables requeridas
 * 
 * @example
 * try {
 *   validateEnvironment();
 * } catch (error) {
 *   console.error('Environment validation failed:', error);
 *   process.exit(1);
 * }
 */
export function validateEnvironment(): void {
  const result = validateEnvironmentDetailed();
  
  if (!result.valid) {
    const missingVars = result.missing.join(', ');
    throw new EnvironmentError(
      `Missing required environment variables: ${missingVars}`,
      result.missing
    );
  }
  
  // Mostrar warnings sobre variables deprecadas
  if (result.deprecated.length > 0) {
    console.warn(
      `[Environment Warning] Deprecated environment variables: ${result.deprecated.join(', ')}`
    );
  }
  
  // Mostrar otros warnings
  result.warnings.forEach(warning => {
    console.warn(`[Environment Warning] ${warning}`);
  });
}

/**
 * Valida el ambiente y retorna resultado detallado sin lanzar error
 * 
 * @returns Objeto con validación detallada
 * 
 * @example
 * const result = validateEnvironmentDetailed();
 * if (!result.valid) {
 *   console.log('Missing vars:', result.missing);
 * }
 */
export function validateEnvironmentDetailed(): ValidationResult {
  const missing: string[] = [];
  const deprecated: string[] = [];
  const warnings: string[] = [];
  
  // Verificar variables requeridas
  for (const key of envConfig.required) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }
  
  // Verificar variables deprecadas
  if (envConfig.deprecated) {
    for (const key of envConfig.deprecated) {
      if (process.env[key]) {
        deprecated.push(key);
      }
    }
  }
  
  // Warnings adicionales
  if (isProduction() && !process.env.RESEND_API_KEY) {
    warnings.push('RESEND_API_KEY not set in production - email features will be disabled');
  }
  
  if (!process.env.HASH_SALT_KEY) {
    warnings.push('HASH_SALT_KEY not set - using default salt (not recommended for production)');
  }
  
  return {
    valid: missing.length === 0,
    missing,
    deprecated,
    warnings,
  };
}

// ==================== Environment Getters ====================

/**
 * Obtiene el valor de una variable de entorno requerida
 * 
 * @param key - Nombre de la variable
 * @returns Valor de la variable
 * @throws {EnvironmentError} Si la variable no existe
 * 
 * @example
 * const jwtSecret = getRequiredEnv('JWT_SECRET');
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  
  if (!value) {
    throw new EnvironmentError(
      `Required environment variable not set: ${key}`,
      [key]
    );
  }
  
  return value;
}

/**
 * Obtiene el valor de una variable de entorno opcional
 * 
 * @param key - Nombre de la variable
 * @param defaultValue - Valor por defecto
 * @returns Valor de la variable o el default
 * 
 * @example
 * const apiUrl = getOptionalEnv('API_URL', 'http://localhost:3000');
 */
export function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

/**
 * Obtiene una variable de entorno como número
 * 
 * @param key - Nombre de la variable
 * @param defaultValue - Valor por defecto
 * @returns Valor numérico o el default
 * 
 * @example
 * const port = getEnvAsNumber('PORT', 3000);
 */
export function getEnvAsNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  const parsed = parseInt(value, 10);
  
  if (isNaN(parsed)) {
    console.warn(`[Environment Warning] ${key} is not a valid number, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  return parsed;
}

/**
 * Obtiene una variable de entorno como boolean
 * 
 * @param key - Nombre de la variable
 * @param defaultValue - Valor por defecto
 * @returns Valor booleano
 * 
 * @example
 * const debugMode = getEnvAsBoolean('DEBUG', false);
 */
export function getEnvAsBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  const normalized = value.toLowerCase().trim();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
}

/**
 * Obtiene una variable de entorno como array
 * 
 * @param key - Nombre de la variable
 * @param separator - Separador (default: ',')
 * @param defaultValue - Valor por defecto
 * @returns Array de strings
 * 
 * @example
 * const allowedOrigins = getEnvAsArray('ALLOWED_ORIGINS', ',', ['http://localhost:3000']);
 */
export function getEnvAsArray(
  key: string,
  separator: string = ',',
  defaultValue: string[] = []
): string[] {
  const value = process.env[key];
  
  if (!value) {
    return defaultValue;
  }
  
  return value
    .split(separator)
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

// ==================== Environment Checks ====================

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
 * Verifica si estamos en ambiente de testing
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

/**
 * Verifica si estamos en el servidor (Node.js)
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * Verifica si estamos en el cliente (browser)
 */
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// ==================== Environment Info ====================

/**
 * Obtiene información completa del ambiente
 * 
 * @returns Objeto con información del ambiente
 * 
 * @example
 * const info = getEnvironmentInfo();
 * console.log('Running in:', info.nodeEnv);
 */
export function getEnvironmentInfo(): EnvInfo {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    isDevelopment: isDevelopment(),
    isProduction: isProduction(),
    isTest: isTest(),
    hasDatabase: !!process.env.POSTGREST_URL,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasEmailService: !!process.env.RESEND_API_KEY,
    hasHashSalt: !!process.env.HASH_SALT_KEY,
  };
}

/**
 * Imprime información del ambiente en consola
 * Útil para debugging
 */
export function printEnvironmentInfo(): void {
  const info = getEnvironmentInfo();
  const validation = validateEnvironmentDetailed();
  
  console.log('\n=== Environment Information ===');
  console.log(`Environment: ${info.nodeEnv}`);
  console.log(`Is Development: ${info.isDevelopment}`);
  console.log(`Is Production: ${info.isProduction}`);
  console.log(`Is Test: ${info.isTest}`);
  console.log('\n--- Services Status ---');
  console.log(`Database: ${info.hasDatabase ? '✓' : '✗'}`);
  console.log(`JWT Secret: ${info.hasJwtSecret ? '✓' : '✗'}`);
  console.log(`Email Service: ${info.hasEmailService ? '✓' : '✗'}`);
  console.log(`Hash Salt: ${info.hasHashSalt ? '✓' : '✗'}`);
  
  if (!validation.valid) {
    console.log('\n--- Missing Required Variables ---');
    validation.missing.forEach(key => {
      console.log(`✗ ${key}`);
    });
  }
  
  if (validation.warnings.length > 0) {
    console.log('\n--- Warnings ---');
    validation.warnings.forEach(warning => {
      console.log(`⚠ ${warning}`);
    });
  }
  
  console.log('===============================\n');
}

// ==================== Auto-validation ====================

/**
 * Ejecutar validación al importar el módulo en servidor
 * Solo en producción lanzamos error, en desarrollo solo advertimos
 */
if (isServer()) {
  try {
    validateEnvironment();
    
    if (isDevelopment()) {
      // En desarrollo, mostrar info completa
      printEnvironmentInfo();
    }
  } catch (error) {
    const envError = error as EnvironmentError;
    console.error('[Environment Error]', envError.message);
    
    if (isProduction()) {
      // En producción, fallar rápido
      console.error('Cannot start server with missing environment variables');
      process.exit(1);
    } else {
      // En desarrollo, solo advertir
      console.warn('Some environment variables are missing, but continuing in development mode');
    }
  }
}

// ==================== Exports ====================

export type { EnvConfig, EnvInfo, ValidationResult };
