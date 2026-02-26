
import React from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { useNavigate } from 'react-router';
import { useAuth } from '../components/AuthProvider';

export const SuspendedAccount: React.FC = () => {
  const { logout, company } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl border border-red-100 dark:border-red-900/20 overflow-hidden text-center flex flex-col">
         <div className="p-12 md:p-20 space-y-8">
            <div className="size-24 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-[32px] flex items-center justify-center mx-auto shadow-xl animate-pulse">
               <span className="material-symbols-outlined text-5xl">lock_person</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Cuenta Suspendida</h1>
              <p className="text-lg font-bold text-red-500 uppercase tracking-widest">{company?.name}</p>
              <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                El acceso a su plataforma DistriMaster ha sido restringido. Esto puede deberse a una <span className="font-bold">factura pendiente de pago</span> o una acción administrativa.
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">¿Cómo restaurar el servicio?</p>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="size-1.5 rounded-full bg-red-500"></span> Contacte a su asesor de cuenta.
                  </li>
                  <li className="flex items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span className="size-1.5 rounded-full bg-red-500"></span> Realice el pago en el portal de HQ.
                  </li>
               </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                Ir a Facturación y Pagar
              </button>
              <button 
                onClick={logout}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline"
              >
                Cerrar Sesión
              </button>
            </div>
         </div>
         <div className="p-6 bg-red-50 dark:bg-red-900/10 border-t border-red-100 dark:border-red-900/20">
            <p className="text-[10px] font-black text-red-700 dark:text-red-400 uppercase tracking-[0.2em]">Distrimaster Enterprise • Soporte: +57 (302) 635-6966</p>
         </div>
      </div>
    </div>
  );
};
