import { ROLES, Role } from './roles';

export const PERMISSIONS = {
  // Productos
  CREATE_PRODUCT: 'create_product',
  READ_PRODUCT: 'read_product',
  UPDATE_PRODUCT: 'update_product',
  DELETE_PRODUCT: 'delete_product',

  // Ventas
  CREATE_SALE: 'create_sale',
  READ_SALE: 'read_sale',
  UPDATE_SALE: 'update_sale',
  DELETE_SALE: 'delete_sale',

  // Inventario
  CREATE_INVENTORY: 'create_inventory',
  READ_INVENTORY: 'read_inventory',
  UPDATE_INVENTORY: 'update_inventory',
  DELETE_INVENTORY: 'delete_inventory',

  // Usuarios
  CREATE_USER: 'create_user',
  READ_USER: 'read_user',
  UPDATE_USER: 'update_user',
  DELETE_USER: 'delete_user',

  // Auditoría
  READ_AUDIT: 'read_audit',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.ADMINISTRADOR]: Object.values(PERMISSIONS),
  [ROLES.VENDEDOR]: [
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.CREATE_SALE,
    PERMISSIONS.READ_SALE,
    PERMISSIONS.UPDATE_SALE,
  ],
  [ROLES.ALMACENERO]: [
    PERMISSIONS.CREATE_PRODUCT,
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.UPDATE_PRODUCT,
    PERMISSIONS.CREATE_INVENTORY,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.UPDATE_INVENTORY,
  ],
  [ROLES.AUDITOR]: [
    PERMISSIONS.READ_PRODUCT,
    PERMISSIONS.READ_SALE,
    PERMISSIONS.READ_INVENTORY,
    PERMISSIONS.READ_USER,
    PERMISSIONS.READ_AUDIT,
  ],
};
