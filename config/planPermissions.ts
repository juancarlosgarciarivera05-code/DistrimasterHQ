import { PlanType } from "../types";

/**
 * Mapa de permisos basado en el plan de suscripción.
 * Determina qué módulos y capacidades técnicas están habilitados para la organización.
 */
export const PLAN_PERMISSIONS: Record<PlanType, string[]> = {
  Starter: [
    "VIEW_DASHBOARD",
    "VIEW_OPERATIONS",
    "VIEW_CATALOG",
    "VIEW_ROUTE",
    "VIEW_ORDERS",
    "VIEW_CUSTOMERS",
    "VIEW_SETTINGS"
  ],

  Professional: [
    "VIEW_DASHBOARD",
    "VIEW_OPERATIONS",
    "VIEW_CATALOG",
    "VIEW_ROUTE",
    "VIEW_ORDERS",
    "CREATE_ORDERS",
    "VIEW_INVENTORY",
    "MANAGE_INVENTORY",
    "APPROVE_ORDERS",
    "VIEW_TELEMETRY",
    "VIEW_CUSTOMERS",
    "VIEW_SETTINGS",
    "VIEW_TARGETS",
    "VIEW_RECOVERY"
  ],

  Enterprise: [
    "VIEW_DASHBOARD",
    "VIEW_OPERATIONS",
    "VIEW_CATALOG",
    "VIEW_ROUTE",
    "VIEW_ORDERS",
    "CREATE_ORDERS",
    "VIEW_INVENTORY",
    "MANAGE_INVENTORY",
    "APPROVE_ORDERS",
    "VIEW_TELEMETRY",
    "EDIT_ORDERS",
    "USE_AI",
    "MANAGE_STAFF",
    "MANAGE_TENANTS",
    "ADVANCED_ANALYTICS",
    "CLOUD_CONSOLE",
    "SYSTEM_LOGS",
    "VIEW_CUSTOMERS",
    "VIEW_SETTINGS",
    "VIEW_TARGETS",
    "VIEW_RECOVERY",
    "VIEW_DEPLOYMENTS",
    "VIEW_AUTOMATION"
  ]
};