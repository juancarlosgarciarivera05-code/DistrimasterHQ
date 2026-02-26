import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { monitoringService } from '../services/api';

export const AdminLiveMonitor: React.FC = () => {
  const { company } = useAuth();
  const [data, setData] = useState<{ visits: any[], manifests: any[] }>({ visits: [], manifests: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [scanTime, setScanTime] = useState(new Date());

  useEffect(() => {
    loadStatus();
    const interval = setInterval(() => {
      loadStatus();
      setScanTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, [company?.id]);

  const loadStatus = async () => {
    try {
      const liveData = await monitoringService.getLiveStaffStatus(company?.id || '1');
      setData(liveData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#020408] text-white font-sans overflow-hidden select-none">
      {/* HUD HEADER */}
      <header className="h-28 px-12 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-3xl shrink-0 z-50">
        <div className="flex flex-col">
          <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-5">
            <div className="relative flex h-6 w-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-40"></span>
              <span className="relative inline-flex rounded-full h-6 w-6 bg-primary shadow-[0_0_25px_#137fec]"></span>
            </div>
            Torre de Control <span className="text-primary font-light italic text-2xl ml-3 opacity-30">ANYCAST LIVE</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] mt-3 flex items-center gap-3">
            <span className="text-emerald-500 animate-pulse drop-shadow-[0_0_10px_#10b981]">● Enlace Activo con distrimasterhq.site</span> • {scanTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-10 items-center">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-50">Unidades de Tropa</span>
              <span className="text-3xl font-black text-primary tabular-nums tracking-tighter">14.00</span>
           </div>
           <button onClick={loadStatus} className="h-16 px-10 bg-primary text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(19,127,236,0.3)] border border-white/20">
             Escanear Red
           </button>
        </div>
      </header>

      <div className="flex-1 relative overflow-hidden bg-black">
         {/* TECH GRID LAYER */}
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#137fec05,transparent_70%)]"></div>
         
         {/* RADAR SWEEPER ENHANCED */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1800px] pointer-events-none">
            <div className="absolute top-0 left-1/2 w-2 h-1/2 bg-gradient-to-t from-primary/40 to-transparent origin-bottom animate-[spin_8s_linear_infinite] blur-[1px]"></div>
         </div>

         {/* RADAR RINGS */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[1000px] border border-white/[0.03] rounded-full shadow-[inset_0_0_100px_rgba(19,127,236,0.02)]"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] border border-white/[0.03] rounded-full"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] border border-white/[0.05] rounded-full"></div>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[100px] border border-primary/20 rounded-full animate-pulse"></div>

         {/* LIVE NODES (MOCK) */}
         <div className="absolute top-[35%] left-[42%] group cursor-pointer z-10">
            <div className="relative">
               <div className="absolute -inset-6 bg-primary/10 rounded-full animate-pulse"></div>
               <div className="size-6 rounded-full border-2 border-white bg-primary shadow-[0_0_30px_#137fec] relative z-20 group-hover:scale-125 transition-transform duration-500"></div>
               <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[24px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-2xl">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black uppercase text-primary tracking-widest">Entregador • NHR-350</span>
                     <h4 className="text-base font-black uppercase text-white">Mario Duarte</h4>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight border-t border-white/5 pt-2 mt-1">Sincronizando Evidencia en Ferretería El Sol</p>
                  </div>
               </div>
            </div>
         </div>

         <div className="absolute top-[58%] left-[52%] group cursor-pointer z-10">
            <div className="relative">
               <div className="absolute -inset-6 bg-emerald-500/10 rounded-full animate-pulse"></div>
               <div className="size-6 rounded-full border-2 border-white bg-emerald-500 shadow-[0_0_30px_#10b981] relative z-20 group-hover:scale-125 transition-transform duration-500"></div>
               <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[24px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-2xl">
                  <div className="flex flex-col gap-2">
                     <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Prevendedor • RUTA 01</span>
                     <h4 className="text-base font-black uppercase text-white">Juan Vendedor</h4>
                     <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight border-t border-white/5 pt-2 mt-1">Generando Pedido SFA • 12 ítems</p>
                  </div>
               </div>
            </div>
         </div>

         {/* HUD TELEMETRY PANEL */}
         <div className="absolute bottom-12 left-12 glass rounded-[48px] p-10 w-[380px] space-y-8 animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-2xl">analytics</span>
               </div>
               <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-[0.2em]">Telemetría de Datos</h3>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1 italic">Motor Sincronización Real-Time</p>
               </div>
            </div>
            
            <div className="space-y-6">
               <div className="space-y-3">
                  <div className="flex justify-between items-end">
                     <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Visitas del Día</span>
                     <span className="text-2xl font-black tabular-nums">142<span className="text-xs text-slate-600 ml-1">/180</span></span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 shadow-inner">
                     <div className="h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_#137fec] rounded-full transition-all duration-1000" style={{ width: '78.8%' }}></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Latencia</p>
                     <p className="text-sm font-black text-emerald-500">0.02 MS</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                     <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Integridad Paquetes</p>
                     <p className="text-sm font-black text-primary">100%</p>
                  </div>
               </div>
            </div>
            
            <div className="pt-6 border-t border-white/5 flex justify-between items-center">
               <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">System v8.0 Enterprise</span>
               <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#137fec]"></div>
            </div>
         </div>
      </div>
    </div>
  );
};