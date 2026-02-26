import React, { useState } from 'react';
import { useAuth } from '../components/AuthProvider.tsx';

export const AdminSettings: React.FC = () => {
  const { company, user } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] font-sans overflow-hidden">
      <header className="h-24 px-10 border-b border-slate-200 flex flex-col justify-center bg-white shrink-0">
        <div className="flex items-center gap-3 mb-4">
           <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Configuración Corporativa</h1>
           <span className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-full uppercase tracking-widest border border-primary/20">Plan {company?.plan}</span>
        </div>
        <div className="flex gap-8 border-b border-transparent">
           {['Perfil', 'Facturación', 'Seguridad', 'Notificaciones'].map(t => (
             <button 
              key={t}
              onClick={() => setActiveTab(t.toLowerCase())}
              className={`text-[10px] font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${activeTab === t.toLowerCase() ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
             >
              {t}
             </button>
           ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <section className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm space-y-10">
             <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                <div>
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Identidad de la Empresa</h3>
                   <p className="text-xs text-slate-400 font-medium mt-1">Esta información aparecerá en sus facturas y remisiones.</p>
                </div>
                <button className="h-10 px-6 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Guardar Cambios</button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                      <input className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none" defaultValue={company?.name} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">NIT / ID Fiscal</label>
                      <input className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none" placeholder="900.000.000-1" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Principal</label>
                      <input className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none" placeholder="Calle 10 # 43 - 12" />
                   </div>
                </div>

                <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/50 group hover:border-primary transition-all cursor-pointer">
                   <div className="size-32 bg-white rounded-[32px] shadow-xl flex items-center justify-center p-6 mb-6 group-hover:scale-105 transition-transform">
                      <img src={company?.logo} alt="Logo" className="w-full h-full object-contain" />
                   </div>
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest">Cambiar Logotipo</p>
                   <p className="text-[8px] text-slate-400 uppercase font-bold mt-2">JPG o PNG (Max 2MB)</p>
                </div>
             </div>
          </section>

          <section className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-sm space-y-8">
             <div className="flex items-center gap-4 text-emerald-600">
                <span className="material-symbols-outlined text-3xl">payments</span>
                <h3 className="text-xl font-black uppercase tracking-tight">Parámetros Tributarios</h3>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Tasa de IVA (%)</p>
                   <input type="number" className="bg-transparent border-none p-0 text-2xl font-black text-slate-900 focus:ring-0 w-full" defaultValue="19" />
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Moneda</p>
                   <select className="bg-transparent border-none p-0 text-sm font-black text-slate-900 focus:ring-0 w-full uppercase">
                      <option>COP (Peso Colombiano)</option>
                      <option>USD (Dólar)</option>
                      <option>MXN (Peso Mexicano)</option>
                   </select>
                </div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Retención en Fuente</p>
                   <input type="number" step="0.1" className="bg-transparent border-none p-0 text-2xl font-black text-slate-900 focus:ring-0 w-full" defaultValue="2.5" />
                </div>
             </div>
          </section>

          <div className="p-10 bg-slate-900 rounded-[48px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/5">
             <div>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-2">Gestión de Suscripción</p>
                <h4 className="text-2xl font-black text-white uppercase tracking-tight italic">Plan {company?.plan} Enterprise</h4>
                <p className="text-slate-500 text-xs font-bold mt-2">Próximo cobro: 15 de Noviembre, 2024</p>
             </div>
             <button className="h-16 px-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Ver Facturas de Pago</button>
          </div>

        </div>
      </div>
    </div>
  );
};