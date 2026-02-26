import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../components/AuthProvider';
import { ChatBot } from '../components/ChatBot';

const GlobalStatCard: React.FC<{ label: string; value: string; trend: string; icon: string; color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] hover:border-primary/50 transition-all group relative overflow-hidden">
    <div className={`absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform text-[100px] material-symbols-outlined ${color}`}>
      {icon}
    </div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div className={`size-12 rounded-2xl flex items-center justify-center bg-white/5 ${color} shadow-inner`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded border border-emerald-500/20 uppercase tracking-widest">{trend}</span>
      </div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">{label}</p>
      <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">{value}</h3>
    </div>
  </div>
);

export const SuperAdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white font-sans flex overflow-hidden">
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 bg-black/40 backdrop-blur-xl z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_25px_#137fec] animate-pulse">
            <span className="material-symbols-outlined text-white">dns</span>
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">MASTER <span className="text-primary">HQ</span></span>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/superadmin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-sm">dashboard</span> Cockpit Global
          </Link>
          <Link to="/superadmin/tenants" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">corporate_fare</span> Organizaciones
          </Link>
          <Link to="/superadmin/pricing" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">payments</span> Facturación SaaS
          </Link>
          <Link to="/superadmin/marketing" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">rocket_launch</span> Growth & Leads
          </Link>
          <div className="my-6 h-px bg-white/5 mx-4"></div>
          <Link to="/superadmin/setup" className="flex items-center gap-4 p-4 rounded-2xl text-red-500/70 border border-red-500/20 hover:text-white hover:bg-red-500/20 font-black uppercase text-[10px] tracking-widest transition-all shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <span className="material-symbols-outlined text-sm">shield_person</span> Instalación y Seguridad
          </Link>
        </nav>

        <button onClick={logout} className="mt-auto flex items-center gap-4 p-4 rounded-2xl text-red-500/50 hover:text-red-500 transition-all font-black uppercase text-[10px] tracking-widest">
          <span className="material-symbols-outlined text-sm">logout</span> Terminar Sesión
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#137fec05,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          
          <header className="flex justify-between items-end">
             <div>
                <div className="flex items-center gap-3 mb-2">
                   <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse"></span>
                   <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Plataforma Online: distrimasterhq.site</p>
                </div>
                <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">Global <span className="text-primary">Operations</span></h1>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1 opacity-50">System Uptime</p>
                <p className="text-2xl font-black tabular-nums text-white/80">{formatUptime(uptime)}</p>
             </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GlobalStatCard label="Total Revenue (MRR)" value="$12.4k" trend="+12%" icon="account_balance_wallet" color="text-primary" />
            <GlobalStatCard label="Organizaciones" value="42" trend="+4" icon="hub" color="text-indigo-400" />
            <GlobalStatCard label="Transacciones IA" value="1.2M" trend="High" icon="auto_awesome" color="text-purple-400" />
            <GlobalStatCard label="Tropa en Calle" value="142" trend="Active" icon="person_pin_circle" color="text-emerald-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <section className="lg:col-span-8 space-y-8">
                <div className="bg-white/5 border border-white/10 rounded-[56px] p-10 space-y-8 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-10 opacity-5">
                      <span className="material-symbols-outlined text-[150px]">verified_user</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-white/5 pb-6">
                      <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400">Health Monitor</h3>
                      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                         <span className="size-2 bg-emerald-500 rounded-full animate-ping"></span>
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Sentinel Core: ACTIVE</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { name: 'Core Engine (Vercel)', status: 'Operational', latency: '24ms', color: 'bg-emerald-500' },
                        { name: 'Database (Supabase)', status: 'Operational', latency: '42ms', color: 'bg-emerald-500' },
                        { name: 'IA Gemini API', status: 'Active', latency: '1.2s', color: 'bg-emerald-500' },
                        { name: 'Sentinel Automator', status: 'Scanning', latency: 'Daily', color: 'bg-primary' },
                      ].map(s => (
                        <div key={s.name} className="flex items-center justify-between p-6 bg-white/[0.03] rounded-3xl border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className={`size-3 rounded-full ${s.color} shadow-[0_0_10px_currentColor]`}></div>
                              <div>
                                 <p className="text-xs font-black uppercase text-white tracking-tight">{s.name}</p>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{s.status}</p>
                              </div>
                           </div>
                           <span className="text-[10px] font-mono text-primary">{s.latency}</span>
                        </div>
                      ))}
                   </div>

                   <div className="mt-8 p-8 bg-primary/5 rounded-[32px] border border-primary/10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                           <span className="material-symbols-outlined text-2xl">database_sync</span>
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Throughput de Red</p>
                           <p className="text-xs text-slate-400 font-medium">Capacidad de respuesta global de los nodos de distribución.</p>
                         </div>
                      </div>
                      <div className="flex gap-1 items-end">
                         {[4, 7, 5, 8, 4, 9, 6, 8, 10, 7].map((h, i) => (
                           <div key={i} className="w-1.5 bg-primary/40 rounded-t-sm animate-pulse" style={{ height: `${h * 4}px`, animationDelay: `${i * 0.1}s` }}></div>
                         ))}
                      </div>
                   </div>
                </div>
             </section>

             <aside className="lg:col-span-4 bg-white/5 border border-white/10 rounded-[56px] p-10 flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Activity Feed</h3>
                <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                   {[
                     { msg: 'Sentinel: Suspensión ejecutada en Nodo 104', time: 'Just now', icon: 'gavel', color: 'text-red-400' },
                     { msg: 'Nueva empresa: "Distribuidora El Sol"', time: '2m ago', icon: 'add_business', color: 'text-primary' },
                     { msg: 'Sentinel: Alerta 3D enviada a Cali Express', time: '12m ago', icon: 'notification_important', color: 'text-amber-400' },
                     { msg: 'Pago suscripción Professional: $199', time: '15m ago', icon: 'payments', color: 'text-emerald-500' },
                   ].map((ev, i) => (
                     <div key={i} className="flex gap-5 items-start">
                        <div className={`size-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 ${ev.color}`}>
                           <span className="material-symbols-outlined text-xl">{ev.icon}</span>
                        </div>
                        <div className="min-w-0">
                           <p className="text-xs font-bold text-slate-300 leading-tight">{ev.msg}</p>
                           <p className="text-[9px] font-black uppercase text-slate-600 mt-1.5 tracking-widest">{ev.time}</p>
                        </div>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-10 h-14 border border-white/10 rounded-[20px] font-black text-[10px] uppercase tracking-widest text-slate-500 hover:text-white hover:bg-white/5 transition-all">Ver Historial de Logs</button>
             </aside>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 right-0 h-10 w-[calc(100%-288px)] border-t border-white/5 bg-black/60 backdrop-blur-md px-12 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.3em] text-slate-600 z-40">
         <div className="flex gap-10">
            <span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-emerald-500"></span> Google Cloud: SouthAmerica-East1</span>
            <span>IP: 34.120.XX.XX</span>
         </div>
         <div className="flex gap-4 items-center">
            <span>Security: AES-256 Encrypted</span>
            <span className="text-white/20">|</span>
            <span>Build v8.0.4-LATEST</span>
         </div>
      </footer>
      <ChatBot />
    </div>
  );
};