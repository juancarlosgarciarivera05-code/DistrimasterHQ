import { useAuth } from "../components/AuthProvider";

/**
 * Mapeo de permisos por defecto para usuarios demo o fallbacks de rol.
 * Se utilizan los identificadores que consume la UI (Sidebar/Layouts).
 */
const DEMO_ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'],
  ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_INVENTORY',
    'MANAGE_INVENTORY',
    'VIEW_ORDERS',
    'MANAGE_STAFF',
    'VIEW_CUSTOMERS',
    'VIEW_SETTINGS',
    'VIEW_OPERATIONS',
    'VIEW_DEPLOYMENTS'
  ],
  REPRESENTATIVE: [
    'VIEW_DASHBOARD',
    'VIEW_ORDERS',
    'VIEW_CATALOG',
    'VIEW_ROUTE',
    'VIEW_CUSTOMERS'
  ],
  DELIVERER: [
    'VIEW_ROUTE',
    'VIEW_ORDERS'
  ],
  WAREHOUSE_ADMIN: [
    'VIEW_INVENTORY',
    'MANAGE_INVENTORY'
  ],
  SUPERVISOR: [
    'VIEW_DASHBOARD',
    'VIEW_TELEMETRY',
    'APPROVE_ORDERS',
    'VIEW_TARGETS'
  ]
};

/**
 * Hook de Permisos SFA
 * Proporciona utilidades para verificar el nivel de acceso del usuario 
 * basado en el modelo RBAC cargado desde Supabase o el rol de usuario.
 */
export const usePermissions = () => {
  const { permissions: dbPermissions = [], user } = useAuth();

  /**
   * Pasa a usar los permisos de la base de datos si existen, 
   * de lo contrario, aplica los permisos por defecto del rol (Demo/Fallback).
   */
  const effectivePermissions = (dbPermissions && dbPermissions.length > 0)
    ? dbPermissions
    : (user?.role ? (DEMO_ROLE_PERMISSIONS[user.role] || []) : []);

  const hasWildcard = effectivePermissions.includes('*');

  /**
   * Verifica si el usuario tiene un permiso específico.
   * Retorna true si tiene el permiso o si posee el comodín '*' (total access).
   */
  const can = (permission: string): boolean => {
    if (!effectivePermissions) return false;
    return hasWildcard || effectivePermissions.includes(permission);
  };

  /**
   * Verifica si el usuario tiene al menos uno de los permisos de la lista. (Lógica OR)
   */
  const canAny = (permissionList: string[]): boolean => {
    if (!effectivePermissions) return false;
    if (hasWildcard) return true;
    return permissionList.some(p => effectivePermissions.includes(p));
  };

  /**
   * Verifica si el usuario tiene todos los permisos de la lista. (Lógica AND)
   */
  const canAll = (permissionList: string[]): boolean => {
    if (!effectivePermissions) return false;
    if (hasWildcard) return true;
    return permissionList.every(p => effectivePermissions.includes(p));
  };

  return {
    hasPermission: can, // Alias para compatibilidad
    can,
    canAny,
    canAll,
    permissions: effectivePermissions
  };
};