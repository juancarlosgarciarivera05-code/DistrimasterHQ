import React, { useState } from 'react';
// Fix: Use 'react-router-dom' for DOM-specific components like Link
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const DelivererLayout: React.FC = () => {
  const location = useLocation();
  const { user, company, logout } = useAuth();
  const [showQuickQR, setShowQuickQR] = useState(false);
  const companyQr = localStorage.getItem(`qr_company_${company?.id}`);

  const navItems = [
    { path: '/deliverer/dashboard', icon: 'dashboard', label: 'Inicio' },
    { path: '/deliverer/route', icon: 'route', label: 'Ruta' },
    { path: '/deliverer/catalog', icon: 'shopping_cart_checkout', label: 'Venta' },
    { path: '/deliverer/contacts', icon: 'group', label: 'Clientes' },
    { path: '/deliverer/settlement', icon: 'account_balance_wallet', label: 'Cierre' },
  ];

  return (
    <div className="flex h-screen w-full flex-col bg-slate-50 dark:bg-background-dark overflow-hidden font-sans">
      {/* App Bar Móvil Mejorada */}
      <header className="h-16 px-6 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[120px]">{user?.name?.split(' ')[0] || 'Entregador'}</h1>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Autoventa NHR-350</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {companyQr && (
            <button 
              onClick={() => setShowQuickQR(true)}
              className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm border border-emerald-100 animate-pulse"
              title="Mostrar QR de Recaudo"
            >
              <span className="material-symbols-outlined text-[22px]">qr_code_2</span>
            </button>
          )}
          <button onClick={logout} className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </div>
      </header>

      {/* Modal QR Rápido */}
      {showQuickQR && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowQuickQR(false)}></div>
          <div className="relative bg-white rounded-[48px] p-10 w-full max-w-sm text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
             <div className="space-y-2">
               <h3 className="text-xl font-black uppercase text-slate-900">QR de Recaudo</h3>
               <p className="text-xs font-bold text-primary uppercase tracking-widest">{company?.name}</p>
             </div>
             <div className="p-4 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                <img src={companyQr!} className="w-full aspect-square object-contain" alt="QR Empresa" />
             </div>
             <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                Muestra este código al cliente para pagos por Nequi, Daviplata o Bancolombia.
             </p>
             <button 
              onClick={() => setShowQuickQR(false)}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
             >
               Cerrar
             </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <Outlet />
      </main>

      {/* Bottom Nav móvil - Estilo "Autoventa" */}
      <nav className="h-20 bg-white dark:bg-surface-dark border-t border-slate-100 dark:border-slate-800 flex items-center justify-around px-2 shrink-0 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path} 
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}
            >
               <span className={`material-symbols-outlined text-[26px] ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
               <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};