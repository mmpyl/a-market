/**
 * Development test users configuration
 * NOTA: Este archivo solo debe usarse en desarrollo.
 * En producción, todos los usuarios deben venir de la base de datos.
 */

interface DevUser {
  email: string;
  password: string;
  rol_sistema: string;
}

const DEV_USERS: DevUser[] = [
  {
    email: process.env.DEV_USER_ADMIN || 'admin@adminmarket.com',
    password: process.env.DEV_PASSWORD_ADMIN || 'admin123',
    rol_sistema: 'administrador',
  },
  {
    email: process.env.DEV_USER_VENDEDOR || 'vendedor@adminmarket.com',
    password: process.env.DEV_PASSWORD_VENDEDOR || 'vendedor123',
    rol_sistema: 'vendedor',
  },
  {
    email: process.env.DEV_USER_ALMACEN || 'almacen@adminmarket.com',
    password: process.env.DEV_PASSWORD_ALMACEN || 'almacen123',
    rol_sistema: 'almacenero',
  },
  {
    email: process.env.DEV_USER_AUDITOR || 'auditor@adminmarket.com',
    password: process.env.DEV_PASSWORD_AUDITOR || 'auditor123',
    rol_sistema: 'auditor',
  },
];

export function getDevUsers(): DevUser[] {
  // Solo permitir usuarios de desarrollo en ambiente de desarrollo
  if (process.env.NODE_ENV !== 'development') {
    console.warn('Dev users should only be used in development environment');
    return [];
  }
  return DEV_USERS;
}

export function validateDevUserExists(email: string): boolean {
  if (process.env.NODE_ENV !== 'development') {
    return false;
  }
  return DEV_USERS.some(user => user.email === email);
}
