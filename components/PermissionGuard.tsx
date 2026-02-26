import React from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { usePermissions } from "../hooks/usePermissions";
import { UserRole, PlanType } from "../types";

const PLAN_LEVELS: Record<PlanType, number> = {
  'Starter': 1,
  'Professional': 2,
  'Enterprise': 3
};

interface Props {
  permission?: string;
  allowedRoles?: UserRole[];
  minPlan?: PlanType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const PermissionGuard: React.FC<Props> = ({
  permission,
  allowedRoles,
  minPlan,
  children,
  fallback = null,
  redirectTo
}) => {
  const { isAuthenticated, user, company, isInitializing } = useAuth();
  const { hasPermission } = usePermissions();

  if (isInitializing) {
    return null;
  }

  // Si se requiere redirección (comportamiento de ProtectedRoute)
  if (redirectTo && (!isAuthenticated || !user)) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si no está autenticado y no hay redirección, mostrar fallback
  if (!isAuthenticated || !user) {
    return <>{fallback}</>;
  }

  // Validar Roles
  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {
    return redirectTo ? <Navigate to="/" replace /> : <>{fallback}</>;
  }

  // Validar Permisos
  if (permission && !hasPermission(permission)) {
    return redirectTo ? <Navigate to="/unauthorized" replace /> : <>{fallback}</>;
  }

  // Validar Plan
  if (minPlan) {
    const currentLevel = company ? PLAN_LEVELS[company.plan] : 0;
    const requiredLevel = PLAN_LEVELS[minPlan];

    if (currentLevel < requiredLevel) {
      if (redirectTo) {
        return (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617] h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl w-full bg-white dark:bg-surface-dark rounded-[56px] p-12 text-center shadow-2xl border border-slate-100 dark:border-white/5 space-y-10 animate-in zoom-in duration-500">
               <div className="relative size-24 mx-auto">
                  <div className="absolute inset-0 bg-primary/10 rounded-[32px] animate-pulse"></div>
                  <div className="relative size-24 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl flex items-center justify-center text-primary border border-slate-100 dark:border-slate-700">
                    <span className="material-symbols-outlined text-5xl">lock</span>
                  </div>
               </div>
    
               <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Función Restringida</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Este módulo requiere una suscripción nivel <span className="text-primary font-black uppercase tracking-widest">{minPlan}</span>. 
                    Tu plan actual es <span className="font-bold text-slate-700 dark:text-slate-200">{company?.plan}</span>.
                  </p>
               </div>
    
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
                     <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Beneficio del Plan</p>
                     <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">Acceso a {minPlan === 'Enterprise' ? 'Inteligencia Predictiva y Telemetría Live' : 'Gestión Avanzada de Supervisores y Metas'}.</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
                     <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Disponibilidad</p>
                     <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight">Activación inmediata tras el upgrade de tu nodo.</p>
                  </div>
               </div>
    
               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link 
                    to="/checkout" 
                    className="flex-1 py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                  >
                    Hacer Upgrade Ahora
                  </Link>
                  <button 
                    onClick={() => window.history.back()}
                    className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Volver
                  </button>
               </div>
               
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Distrimaster Infrastructure • V22.0</p>
            </div>
          </div>
        );
      }
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

