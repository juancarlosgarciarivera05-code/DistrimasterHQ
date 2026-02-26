import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { usePermissions } from '../hooks/usePermissions';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { can } = usePermissions();
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 15) + 15);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard', permission: 'VIEW_DASHBOARD' },
    { path: '/admin/deployments', icon: 'history', label: 'Despliegues', permission: 'VIEW_DEPLOYMENTS' },
    { path: '/admin/orders', icon: 'receipt_long', label: 'Ventas y Pedidos', permission: 'VIEW_ORDERS' },
    { path: '/admin/inventory', icon: 'inventory_2', label: 'Centro Logístico', permission: 'VIEW_INVENTORY' },
    { path: '/admin/live-monitor', icon: 'radar', label: 'Telemetría Live', permission: 'VIEW_TELEMETRY' },
    { path: '/admin/targets', icon: 'rocket_launch', label: 'Objetivos', permission: 'VIEW_TARGETS' },
    { path: '/admin/customers', icon: 'group', label: 'Clientes', permission: 'VIEW_CUSTOMERS' },
    { path: '/admin/cloud-console', icon: 'cloud', label: 'Consola Cloud', permission: 'CLOUD_CONSOLE' },
    { path: '/admin/settings/salesforce', icon: 'badge', label: 'Personal y Roles', permission: 'MANAGE_STAFF' },
    { path: '/admin/settings', icon: 'settings', label: 'Ajustes Proyecto', permission: 'VIEW_SETTINGS' },
  ];

  // Filtrado dinámico por permisos
  const visibleItems = navItems.filter(item => can(item.permission));

  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-white dark:bg-[#000] border-r border-gray-200 dark:border-[#333] flex-shrink-0 z-40 font-sans">
      <div className="p-6 mb-4 flex items-center gap-3">
         <div className="size-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black">
            <span className="material-symbols-outlined !text-[20px]">analytics</span>
         </div>
         <div className="flex flex-col">
            <span className="text-[12px] font-bold tracking-tight text-black dark:text-white uppercase leading-none italic">DistriMaster</span>
            <span className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-widest">Sede Central Enterprise</span>
         </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.length > 0 ? (
          visibleItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-2.5 rounded-lg transition-all text-[11px] font-bold uppercase tracking-widest ${
                  isActive 
                    ? 'bg-gray-100 dark:bg-[#111] text-black dark:text-white' 
                    : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined !text-[20px] ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })
        ) : (
          <div className="py-10 px-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500/50 bg-red-500/5 p-4 rounded-xl border border-red-500/10 italic leading-relaxed">
              Sin módulos asignados
            </p>
          </div>
        )}
      </nav>

      <div className="p-6 mt-auto space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Sincronización Activa</span>
           </div>
           <span className="text-[9px] font-mono text-gray-400">{latency}ms</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#111] rounded-xl border border-gray-100 dark:border-[#333]">
           <div className="size-10 rounded-full border border-gray-200 dark:border-[#333] bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url(${user?.avatar})` }}></div>
           <div className="min-w-0">
              <p className="text-[11px] font-bold text-black dark:text-white truncate uppercase">{user?.name.split(' ')[0]}</p>
              <p className="text-[9px] text-gray-400 uppercase font-medium truncate">{user?.role?.replace('_', ' ')}</p>
           </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-[11px] font-bold uppercase tracking-widest"
        >
          <span className="material-symbols-outlined !text-[18px]">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};