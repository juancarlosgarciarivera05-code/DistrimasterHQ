
import React, { useState } from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { Link } from 'react-router';
import { Company } from '../types';

const INITIAL_TENANTS: Company[] = [
  { id: '101', name: 'Ferretería El Martillo', plan: 'Starter', status: 'ACTIVE', createdAt: '2024-05-12', logo: '', primaryColor: '' },
  { id: '102', name: 'Distribuidora Medellín S.A.', plan: 'Enterprise', status: 'ACTIVE', createdAt: '2023-11-20', logo: '', primaryColor: '' },
  { id: '103', name: 'Cali Ventas Express', plan: 'Professional', status: 'TRIAL', trialEndDate: '2024-12-30', createdAt: '2024-09-30', logo: '', primaryColor: '' },
  { id: '104', name: 'Almacén Los Laureles', plan: 'Enterprise', status: 'SUSPENDED', createdAt: '2024-02-15', logo: '', primaryColor: '' },
];

export const SuperAdminTenants: React.FC = () => {
  const [tenants, setTenants] = useState<Company[]>(INITIAL_TENANTS);

  const toggleStatus = (id: string) => {
    setTenants(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans flex overflow-hidden">
      {/* SIDEBAR HQ REPETIDO PARA CONSISTENCIA */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 bg-[#080a0e] z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-white">dns</span>
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">MASTER <span className="text-primary">HQ</span></span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/superadmin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">dashboard</span> Panel Global
          </Link>
          <Link to="/superadmin/tenants" className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-sm">corporate_fare</span> Empresas
          </Link>
          <Link to="/superadmin/pricing" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">payments</span> Planes y Precios
          </Link>
          <Link to="/superadmin/templates" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">mail</span> Email Templates
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">Global <span className="text-primary">Clients</span></h1>
              <p className="text-slate-500 mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Directorio de Organizaciones Activas</p>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-3 text-slate-500">search</span>
              <input className="pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold focus:border-primary outline-none min-w-[350px]" placeholder="Buscar por Nombre, NIT o ID..." />
            </div>
          </header>

          <div className="bg-white/5 border border-white/10 rounded-[56px] overflow-hidden">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 bg-white/[0.02]">
                      <th className="px-10 py-8">Organización / ID</th>
                      <th className="px-8 py-8 text-center">Plan</th>
                      <th className="px-8 py-8">Estado Operativo</th>
                      <th className="px-10 py-8 text-right">Mando</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {tenants.map(t => (
                     <tr key={t.id} className="hover:bg-white/[0.03] transition-colors group">
                        <td className="px-10 py-8">
                           <p className="font-black text-white text-lg uppercase tracking-tight">{t.name}</p>
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Tenant ID: {t.id} • Creado: {t.createdAt}</p>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex justify-center">
                              <span className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                t.plan === 'Enterprise' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.2)]' :
                                t.plan === 'Professional' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-slate-500/10 text-slate-400 border-slate-500/20'
                              }`}>
                                {t.plan}
                              </span>
                           </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="flex items-center gap-3">
                              <span className={`size-2.5 rounded-full ${t.status === 'ACTIVE' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : t.status === 'SUSPENDED' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-blue-500 animate-pulse'}`}></span>
                              <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'SUSPENDED' ? 'text-red-400' : 'text-slate-300'}`}>{t.status}</span>
                           </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                           <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                              <button className="h-10 px-5 bg-white/5 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Editar</button>
                              <button 
                                onClick={() => toggleStatus(t.id)}
                                className={`h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t.status === 'SUSPENDED' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white'}`}
                              >
                                {t.status === 'SUSPENDED' ? 'Reactivar' : 'Suspender'}
                              </button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>
      </main>
    </div>
  );
};
