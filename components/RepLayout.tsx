import React, { useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { ChatBot } from './ChatBot';
import { useAuth } from './AuthProvider';
import { usePermissions } from '../hooks/usePermissions';

export const RepLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const { can } = usePermissions();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const navItems = [
    { path: '/rep/dashboard', icon: 'dashboard', label: 'Panel', permission: 'VIEW_DASHBOARD' },
    { path: '/rep/route', icon: 'route', label: 'Mi Ruta', permission: 'VIEW_ROUTE' },
    { path: '/rep/recovery', icon: 'assignment_return', label: 'Rescate Ventas', alert: true, permission: 'VIEW_RECOVERY' },
    { path: '/rep/catalog', icon: 'grid_view', label: 'Catálogo', permission: 'VIEW_CATALOG' },
    { path: '/rep/invoice', icon: 'receipt', label: 'Facturación', permission: 'VIEW_ORDERS' },
    { path: '/rep/contacts', icon: 'group', label: 'Contactos', permission: 'VIEW_CUSTOMERS' },
    { path: '/rep/orders', icon: 'shopping_cart', label: 'Pedidos', permission: 'VIEW_ORDERS' },
  ];

  // Filtrado dinámico por permisos
  const visibleItems = navItems.filter(item => can(item.permission));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-background-dark transition-colors duration-200">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 h-full bg-white dark:bg-surface-dark border-r border-slate-100 dark:border-slate-800 shrink-0 z-40">
        <div className="p-8 border-b border-slate-50 dark:border-slate-800 mb-6">
           <div className="flex items-center gap-4">
              <div className="size-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined">storefront</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white leading-none italic">SFA Terminal</span>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Field Operation</span>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
           {visibleItems.length > 0 ? (
             visibleItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                 <Link 
                  key={item.path} 
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${
                    isActive 
                      ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                      : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                  }`}
                 >
                   <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
                   <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                   {item.alert && !isActive && <span className="size-2 rounded-full bg-red-500 ml-auto animate-pulse"></span>}
                 </Link>
               );
             })
           ) : (
             <div className="p-6 text-center italic text-slate-400 text-[10px] uppercase tracking-widest">Sin módulos asignados</div>
           )}
        </nav>

        <div className="p-8 mt-auto border-t border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5">
           <div className="flex items-center gap-4 mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="size-12 rounded-2xl bg-cover bg-center border-2 border-white dark:border-slate-700 shadow-md cursor-pointer hover:opacity-80 transition-all relative group"
                style={{ backgroundImage: `url(${user?.avatar})` }}
              >
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-all">
                    <span className="material-symbols-outlined text-white text-xs">edit</span>
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" accept="image/*" />
              </div>
              <div className="min-w-0">
                 <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate">{user?.name}</p>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user?.city}</p>
              </div>
           </div>
           <button onClick={logout} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-red-600 transition-all shadow-xl">
             <span className="material-symbols-outlined text-sm">logout</span> Finalizar Turno
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 md:hidden px-6 bg-white dark:bg-surface-dark border-b border-slate-100 flex items-center justify-between z-50">
           <div className="flex items-center gap-3">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">storefront</span>
              </div>
              <span className="text-xs font-black uppercase italic text-slate-900 dark:text-white">DistriMaster SFA</span>
           </div>
           <button onClick={logout} className="text-slate-400"><span className="material-symbols-outlined">logout</span></button>
        </header>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
        
        <ChatBot />
      </div>
      
      {/* Mobile Bottom Nav */}
      <nav className="md:hidden h-20 bg-white dark:bg-surface-dark border-t border-slate-100 flex items-center justify-around px-2 z-50 shrink-0">
        {visibleItems.slice(0, 5).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-slate-400'}`}
            >
               <span className={`material-symbols-outlined text-[24px] ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
               <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};