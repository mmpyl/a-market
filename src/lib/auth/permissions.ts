import { PERMISSIONS, Permission } from '@/constants/permissions';
import { Role } from '@/constants/roles';

export function hasPermission(userRole: Role, permission: Permission): boolean {
  const rolePermissions = PERMISSIONS[userRole];
  return rolePermissions ? rolePermissions.includes(permission) : false;
}

export function hasAnyPermission(userRole: Role, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

export function hasAllPermissions(userRole: Role, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

export function getRolePermissions(role: Role): Permission[] {
  return PERMISSIONS[role] || [];
}

export function canAccessResource(userRole: Role, resource: string, action: string): boolean {
  // Map resource and action to permission
  const permissionKey = `${action}_${resource}` as Permission;
  return hasPermission(userRole, permissionKey);
}
