import React from 'react';
import { Link } from 'react-router-dom';

export const RoleSelection: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1000px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-4xl w-full space-y-16 relative z-10 text-center">
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="size-24 bg-primary rounded-[32px] flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(19,127,236,0.3)] border border-white/10 mb-8 relative">
             <div className="absolute inset-0 bg-primary rounded-[32px] animate-ring"></div>
             <span className="material-symbols-outlined text-5xl text-white relative z-10">analytics</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none text-white">
            MANDO <br/><span className="text-primary not-italic">MAESTRO</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium italic tracking-wide max-w-xl mx-auto">"Iniciando enlace con la infraestructura de distribución DistriMaster HQ."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/admin/dashboard" className="glass p-12 rounded-[56px] hover:border-primary/50 hover:bg-primary/5 transition-all group text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 group-hover:opacity-[0.05] transition-all">
              <span className="material-symbols-outlined text-[150px]">admin_panel_settings</span>
            </div>
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-4xl text-primary">admin_panel_settings</span>
            </div>
            <h2 className="text-3xl font-black uppercase italic mb-4 text-white">Administración</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Control total de inventarios, rutas de preventa y auditoría de recaudos en tiempo real.</p>
            <div className="mt-10 flex items-center gap-2 text-[11px] font-black text-primary uppercase tracking-[0.3em]">
              Entrar a HQ <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>

          <Link to="/rep/dashboard" className="glass p-12 rounded-[56px] hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group text-left relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:scale-125 group-hover:opacity-[0.05] transition-all">
              <span className="material-symbols-outlined text-[150px]">storefront</span>
            </div>
            <div className="size-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner">
              <span className="material-symbols-outlined text-4xl text-emerald-500">storefront</span>
            </div>
            <h2 className="text-3xl font-black uppercase italic mb-4 text-white">Operación Campo</h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">Terminal inteligente para toma de pedidos, catálogo digital inmersivo y gestión proactiva.</p>
            <div className="mt-10 flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em]">
              Iniciar Terminal <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </div>
          </Link>
        </div>

        <footer className="pt-20 opacity-30">
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-500">System Build v22.0.4-Anycast • distrimasterhq.site</p>
        </footer>
      </div>
    </div>
  );
};