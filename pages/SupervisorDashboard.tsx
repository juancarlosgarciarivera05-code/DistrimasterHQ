import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider.tsx';
import { getGeminiResponse } from '../services/geminiService.ts';

export const SupervisorDashboard: React.FC<any> = ({ viewingAsAdmin, supervisorData, onBackToHq }) => {
  const { user: authUser, company } = useAuth();
  const [aiBriefing, setAiBriefing] = useState<string>('Analizando métricas de zona...');
  const [showNotifications, setShowNotifications] = useState(false);
  const [qrOrders, setQrOrders] = useState<any[]>([
    { 
      id: 'QR-882', 
      client: 'Supermercado El Sol', 
      amount: 1450000, 
      type: 'AUTOSERVICIO_QR', 
      reason: 'REPOSICIÓN_URGENTE',
      stockStatus: 'AVAILABLE_IN_VAN', 
      driver: 'Mario Chofer',
      time: 'Hace 3 min' 
    },
    { 
      id: 'QR-901', 
      client: 'Ferretería Central', 
      amount: 320000, 
      type: 'AUTOSERVICIO_QR', 
      reason: 'VENTA_NUEVA',
      stockStatus: 'WAREHOUSE_ONLY', 
      driver: 'Andrés Paisa',
      time: 'Hace 15 min' 
    }
  ]);

  const activeUser = viewingAsAdmin ? supervisorData : authUser;

  useEffect(() => {
    loadAiBriefing();
  }, [activeUser?.id]);

  const loadAiBriefing = async () => {
    const prompt = `Dashboard Supervisor: Da una directriz táctica de 15 palabras para la zona ${activeUser?.city || 'Norte'}.`;
    const res = await getGeminiResponse(prompt, []);
    setAiBriefing(res || "Foco en efectividad de ruta y cobros vencidos.");
  };

  const handleApprove = (orderId: string) => {
    setQrOrders(prev => prev.filter(o => o.id !== orderId));
    alert(`ORDEN ${orderId} APROBADA.\n\nSincronizando con ERP para facturación y cargue.`);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto custom-scrollbar font-sans p-6 md:p-10 pb-32 relative">
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4">
           {viewingAsAdmin && (
             <button onClick={onBackToHq} className="size-10 bg-white rounded-xl flex items-center justify-center text-slate-400 hover:text-primary shadow-sm"><span className="material-symbols-outlined">arrow_back</span></button>
           )}
           <div>
             <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Monitor de Zona</h1>
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mt-1">{activeUser?.city || 'Bogotá Norte'} • Gestión de Tropa</p>
           </div>
        </div>
        
        <div className="relative">
           <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`size-16 rounded-3xl flex items-center justify-center transition-all ${qrOrders.length > 0 ? 'bg-primary text-white shadow-[0_0_30px_rgba(19,127,236,0.4)] animate-bounce' : 'bg-white text-slate-400'}`}
           >
              <span className="material-symbols-outlined text-4xl">notifications_active</span>
              {qrOrders.length > 0 && <span className="absolute -top-1 -right-1 size-7 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-4 border-background-light">{qrOrders.length}</span>}
           </button>

           {showNotifications && (
             <div className="absolute right-0 top-20 w-[380px] bg-white dark:bg-surface-dark border border-slate-100 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.3)] rounded-[40px] z-[100] p-8 animate-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-8">
                   <div>
                      <h3 className="text-lg font-black uppercase text-slate-900 leading-none italic">Alertas QR</h3>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pedidos Autoservicio Pendientes</p>
                   </div>
                   <button onClick={() => setShowNotifications(false)} className="text-slate-300 hover:text-red-500 transition-colors"><span className="material-symbols-outlined">close</span></button>
                </div>
                
                <div className="space-y-5">
                   {qrOrders.map(order => (
                     <div key={order.id} className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[32px] border border-slate-100 dark:border-white/5 space-y-4">
                        <div className="flex justify-between items-start">
                           <div className="min-w-0">
                              <span className="text-[8px] font-black bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest">{order.reason}</span>
                              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase truncate mt-2">{order.client}</h4>
                           </div>
                           <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{order.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 py-3 border-y border-slate-100 dark:border-white/5">
                           <div className={`size-8 rounded-lg flex items-center justify-center ${order.stockStatus === 'AVAILABLE_IN_VAN' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                              <span className="material-symbols-outlined text-[18px]">{order.stockStatus === 'AVAILABLE_IN_VAN' ? 'check_circle' : 'warehouse'}</span>
                           </div>
                           <div>
                              <p className="text-[9px] font-black uppercase text-slate-400">Estado Logístico</p>
                              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{order.stockStatus === 'AVAILABLE_IN_VAN' ? `En camión de ${order.driver}` : 'Requiere Carga Central'}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between">
                           <p className="text-lg font-black text-primary">${order.amount.toLocaleString()}</p>
                           <div className="flex gap-2">
                              <button onClick={() => handleApprove(order.id)} className="h-10 px-6 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Aprobar</button>
                              <button className="size-10 bg-white border border-slate-100 text-slate-300 rounded-xl flex items-center justify-center hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-sm">close</span></button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
        <section className="lg:col-span-8 space-y-8">
           <div className="bg-slate-900 rounded-[56px] p-12 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:scale-110 transition-transform duration-[3000ms]">
                <span className="material-symbols-outlined text-[300px]">hub</span>
              </div>
              <div className="relative z-10 space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 animate-pulse">
                       <span className="material-symbols-outlined text-white text-3xl fill-1">auto_awesome</span>
                    </div>
                    <span className="text-primary text-[11px] font-black uppercase tracking-[0.6em]">IA Territorial Core</span>
                 </div>
                 <p className="text-3xl md:text-5xl font-bold text-white leading-[1.1] tracking-tighter italic">"{aiBriefing}"</p>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Rutas Activas', val: '12/14', icon: 'route', color: 'primary' },
                { label: 'Efectividad Cobro', val: '92%', icon: 'payments', color: 'emerald-500' }
              ].map(stat => (
                <div key={stat.label} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex items-center gap-8">
                   <div className={`size-16 rounded-[24px] bg-${stat.color}/10 text-${stat.color} flex items-center justify-center shadow-inner`}>
                      <span className="material-symbols-outlined text-4xl">{stat.icon}</span>
                   </div>
                   <div>
                      <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.val}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        <aside className="lg:col-span-4">
           <div className="bg-white dark:bg-surface-dark p-10 rounded-[56px] border border-slate-100 shadow-sm sticky top-10 flex flex-col h-full justify-between">
              <div className="space-y-10">
                 <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Status de Recaudo Zona</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-end">
                       <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">$15.4M</p>
                       <span className="text-[10px] font-black text-emerald-500 uppercase">En Meta</span>
                    </div>
                    <div className="h-4 w-full bg-slate-50 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                       <div className="h-full bg-primary shadow-[0_0_20px_rgba(19,127,236,0.3)]" style={{ width: '84%' }}></div>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest italic leading-relaxed">Meta de la semana: $18.5M <br/> Días restantes: 2</p>
                 </div>
              </div>
              <button className="w-full mt-12 py-5 bg-slate-900 text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Reporte Consolidado</button>
           </div>
        </aside>
      </div>
    </div>
  );
};