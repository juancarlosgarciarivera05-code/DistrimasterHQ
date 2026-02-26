
import React from 'react';

export const RepReports: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark custom-scrollbar p-6 lg:p-10">
      <header className="mb-10">
        <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight uppercase">Mis Reportes de Gestión</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 italic">distrimasterhq.site • Análisis de Impacto Comercial</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1600px] mx-auto w-full pb-20">
        
        {/* KPI BOXES */}
        <div className="bg-white dark:bg-surface-dark p-8 rounded-[48px] shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
           <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Fulfillment Semanal</h3>
           {[
             { label: 'Semana 1', val: 85, color: 'bg-primary' },
             { label: 'Semana 2', val: 42, color: 'bg-indigo-500' },
             { label: 'Semana 3', val: 92, color: 'bg-emerald-500' },
             { label: 'Semana 4', val: 12, color: 'bg-slate-200' },
           ].map(s => (
             <div key={s.label} className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase">
                   <span>{s.label}</span>
                   <span className="text-slate-900 dark:text-white">{s.val}%</span>
                </div>
                <div className="h-2 w-full bg-slate-50 dark:bg-slate-900 rounded-full overflow-hidden">
                   <div className={`${s.color} h-full rounded-full transition-all duration-1000`} style={{ width: `${s.val}%` }}></div>
                </div>
             </div>
           ))}
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[150px]">verified</span>
           </div>
           <div className="relative z-10 space-y-4">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">Comisiones Acumuladas</span>
              <p className="text-5xl font-black tracking-tighter text-emerald-400">$1,128.60</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base: 9% sobre venta neta</p>
           </div>
           <button className="relative z-10 w-full py-5 bg-white/5 border border-white/10 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">Ver Plan de Incentivos</button>
        </div>

        <div className="bg-white dark:bg-surface-dark p-8 rounded-[48px] shadow-sm border border-slate-100 dark:border-slate-800">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-8">Top Productos Movilizados</h3>
           <div className="space-y-6">
              {[
                { name: 'Taladro Dewalt 20V', qty: 45, icon: 'bolt' },
                { name: 'Sierra Bosch Pro', qty: 32, icon: 'grid_view' },
                { name: 'Casco 3M Industrial', qty: 28, icon: 'verified_user' },
                { name: 'Kit Llaves Combinadas', qty: 24, icon: 'build' },
              ].map(p => (
                <div key={p.name} className="flex items-center gap-4 group">
                   <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined text-[20px]">{p.icon}</span>
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase truncate">{p.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{p.qty} Unidades</p>
                   </div>
                   <div className="size-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};
