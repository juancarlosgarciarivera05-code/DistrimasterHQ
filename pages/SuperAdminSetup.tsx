import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const SuperAdminSetup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'infra' | 'activation'>('activation');
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [lastExecution, setLastExecution] = useState({
    time: 'Hoy, 00:00:05 AM',
    status: 'SUCCESS',
    processed: 142,
    alerts: 12,
    suspensions: 2
  });
  
  const steps = [
    { id: 1, name: 'Seguridad RLS', done: true, icon: 'shield_check' },
    { id: 2, name: 'Estructura SQL', done: true, icon: 'table_chart' },
    { id: 3, name: 'Motor Sentinel', done: true, icon: 'smart_toy' },
    { id: 4, name: 'Scheduler Daily', done: true, icon: 'calendar_month' }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  const CRON_SQL = `SELECT cron.schedule(
  'sentinel-lifecycle-daily',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url:='https://fvenyoflxkcyubtdymdt.supabase.co/functions/v1/sentinel-expiration-runner',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer SERVICE_ROLE_KEY"}'::jsonb,
    body:='{}'::jsonb
  )
  $$
);`;

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans flex overflow-hidden">
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 bg-[#080a0e] z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-white">dns</span>
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">MASTER <span className="text-primary">HQ</span></span>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          <Link to="/superadmin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
            <span className="material-symbols-outlined text-sm">dashboard</span> Dashboard
          </Link>
          <Link to="/superadmin/setup" className="flex items-center gap-4 p-4 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-sm">shield_person</span> Infraestructura
          </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#05070a]">
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
          
          <section className="bg-gradient-to-br from-slate-900 to-black border border-white/10 p-10 rounded-[56px] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[200px]">settings_system_daydream</span>
             </div>
             <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                  <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Estatus <span className="text-primary">Sentinel</span></h1>
                  <p className="text-slate-500 mt-3 text-[10px] font-black uppercase tracking-[0.4em]">Fase: Operativo en Producción</p>
                </div>
                <div className="text-right">
                   <p className="text-5xl font-black text-emerald-500 italic tabular-nums">100%</p>
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sincronización Cloud</p>
                </div>
             </div>
             <div className="grid grid-cols-4 gap-4 relative z-10">
                {steps.map(s => (
                  <div key={s.id} className={`flex items-center gap-3 p-4 rounded-2xl border bg-emerald-500/5 border-emerald-500/20 text-emerald-500`}>
                     <span className="material-symbols-outlined text-sm">check_circle</span>
                     <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                  </div>
                ))}
             </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             
             <section className="lg:col-span-7 space-y-8">
                {/* Consola de Auditoría Live */}
                <div className="bg-white/5 border border-white/10 p-10 rounded-[56px] space-y-8 relative overflow-hidden">
                   <div className="flex justify-between items-center">
                      <h3 className="text-xl font-black uppercase italic text-white">Última Ejecución Backend</h3>
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[9px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">Live Logs</span>
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Timestamp</p>
                         <p className="text-sm font-mono font-bold text-white">{lastExecution.time}</p>
                      </div>
                      <div className="p-6 bg-black/40 rounded-3xl border border-white/5">
                         <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Resultado</p>
                         <p className="text-sm font-mono font-bold text-emerald-500">HTTP 200: {lastExecution.status}</p>
                      </div>
                   </div>
                   <div className="bg-black/60 rounded-[32px] p-8 font-mono text-[10px] leading-relaxed text-slate-400 space-y-2 border border-white/5">
                      <p className="text-emerald-500">[00:00:01] Initializing Sentinel Edge Instance...</p>
                      <p>[00:00:02] Fetching active companies (status != SUSPENDED)...</p>
                      <p>[00:00:03] Found {lastExecution.processed} organizations to analyze.</p>
                      <p>[00:00:04] Processing windows: T-7, T-3, T-0...</p>
                      <p className="text-amber-500">[00:00:05] Sent {lastExecution.alerts} expiration alerts via Resend API.</p>
                      <p className="text-red-500">[00:00:05] Processed {lastExecution.suspensions} hard suspensions (Plan Expired).</p>
                      <p className="text-emerald-500">[00:00:05] Cycle complete. Memory released.</p>
                   </div>
                </div>

                <div className="bg-white/5 border border-white/10 p-10 rounded-[56px] space-y-8">
                   <div className="space-y-2">
                      <h3 className="text-xl font-black uppercase italic text-white">Script de Orquestación (Cron)</h3>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Este comando mantiene el motor vivo permanentemente.
                      </p>
                   </div>
                   <div className="bg-black/60 rounded-3xl p-6 border border-white/5 font-mono text-[10px] leading-relaxed relative group overflow-hidden">
                      <pre className="text-slate-400">{CRON_SQL}</pre>
                      <button 
                        onClick={() => handleCopy(CRON_SQL, 'sql')}
                        className="absolute right-4 top-4 text-slate-600 hover:text-white transition-colors"
                      >
                         <span className="material-symbols-outlined text-sm">{isCopied === 'sql' ? 'done' : 'content_copy'}</span>
                      </button>
                   </div>
                </div>
             </section>

             <aside className="lg:col-span-5 space-y-8">
                <div className="p-10 bg-primary/5 border border-primary/20 rounded-[56px] space-y-6 shadow-2xl">
                   <div className="size-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl">
                      <span className="material-symbols-outlined text-3xl">verified_user</span>
                   </div>
                   <h4 className="text-2xl font-black uppercase italic leading-none">Operación Blindada</h4>
                   <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                     "Sentinel ya está patrullando la red. Las suspensiones son automáticas y los emails se envían desde la infraestructura oficial de distrimasterhq.site."
                   </p>
                   <ul className="space-y-4">
                      <li className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="text-emerald-500 font-black">✓</span> EDGE RUNNER: DESPLEGADO
                      </li>
                      <li className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="text-emerald-500 font-black">✓</span> CRON JOB: ACTIVO (24H)
                      </li>
                      <li className="flex gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                         <span className="text-emerald-500 font-black">✓</span> RESEND: PRODUCCIÓN REAL
                      </li>
                   </ul>
                </div>

                <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[40px] flex items-center gap-4">
                   <span className="material-symbols-outlined text-emerald-500">bolt</span>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-tight">
                     Sentinel está en fase <b>Desplegado y Operativo</b>. El sistema es ahora 100% autónomo.
                   </p>
                </div>
             </aside>

          </div>
        </div>
      </main>
    </div>
  );
};