import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider.tsx';
import { staffService } from '../services/api.ts';
import { SupervisorDashboard } from './SupervisorDashboard.tsx';

export const AdminSupervisors: React.FC = () => {
  const { company } = useAuth();
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingAsSupervisor, setViewingAsSupervisor] = useState<any | null>(null);

  useEffect(() => {
    if (company?.id) loadSupervisors();
  }, [company?.id]);

  const loadSupervisors = async () => {
    try {
      setIsLoading(true);
      const allStaff = await staffService.getAll(company!.id);
      setSupervisors(allStaff.filter((s: any) => s.role === 'SUPERVISOR'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (viewingAsSupervisor) {
    return (
      <div className="animate-in zoom-in duration-500 h-full overflow-hidden flex flex-col">
        <SupervisorDashboard 
          viewingAsAdmin={true} 
          supervisorData={viewingAsSupervisor} 
          onBackToHq={() => setViewingAsSupervisor(null)} 
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#0a0c10] font-sans">
      <header className="h-24 px-10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0d1117]/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex flex-col">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">Estructura de Mandos</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Supervisión de Zonas y Tropa</p>
        </div>
        <button onClick={loadSupervisors} className="size-12 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center hover:scale-105 transition-all">
           <span className="material-symbols-outlined text-slate-500">sync</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="bg-white dark:bg-[#1a242d] p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supervisores en Campo</p>
                <h3 className="text-5xl font-black text-slate-900 dark:text-white mt-2">{supervisors.length}</h3>
             </div>
             <div className="bg-white dark:bg-[#1a242d] p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rutas Bajo Mando</p>
                <h3 className="text-5xl font-black text-primary mt-2">{supervisors.length * 4}</h3>
             </div>
             <div className="bg-emerald-500 text-white p-8 rounded-[40px] shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[100px] opacity-10">verified</span>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Salud Operativa Global</p>
                <h3 className="text-5xl font-black mt-2">84%</h3>
             </div>
          </div>

          <section className="space-y-6">
             {isLoading ? (
               <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-[10px]">Cargando Jerarquía...</div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {supervisors.map(sup => {
                    const randomHealth = Math.floor(Math.random() * 30) + 70;
                    return (
                      <div key={sup.id} className="bg-white dark:bg-[#1a242d] rounded-[48px] border border-slate-100 dark:border-white/5 p-8 hover:shadow-2xl hover:border-primary/40 transition-all group">
                         <div className="flex items-center gap-5 mb-8">
                            <div className="size-16 rounded-[24px] bg-cover bg-center border-4 border-slate-50 dark:border-white/10 shadow-lg" style={{ backgroundImage: `url(${sup.avatar_url})` }}></div>
                            <div className="min-w-0">
                               <p className="font-black text-slate-900 dark:text-white uppercase truncate">{sup.full_name}</p>
                               <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{sup.city}</p>
                            </div>
                         </div>
                         <button 
                          onClick={() => setViewingAsSupervisor(sup)}
                          className="w-full mt-8 h-16 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl"
                         >
                            Auditar Dashboard de Zona <span className="material-symbols-outlined text-sm">visibility</span>
                         </button>
                      </div>
                    );
                  })}
               </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
};