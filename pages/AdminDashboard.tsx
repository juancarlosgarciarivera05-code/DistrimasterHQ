import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { dashboardService } from '../services/api';
import { getGeminiResponse } from '../services/geminiService';
import { PermissionGuard } from '../components/PermissionGuard';

export const AdminDashboard: React.FC = () => {
  const { company } = useAuth();
  const [stats, setStats] = useState({ revenue: 0, orderCount: 0 });
  const [aiAnalysis, setAiAnalysis] = useState('Escaneando red de distribución...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      const data = await dashboardService.getStats(company?.id || '');
      setStats(data);
      const res = await getGeminiResponse(`Analiza ventas de $${data.revenue} y genera una directriz de mando de 10 palabras.`, []);
      setAiAnalysis(res);
      setIsLoading(false);
    };
    load();
  }, [company?.id]);

  return (
    <div className="flex-1 flex flex-col bg-[#000000] h-full overflow-hidden text-white font-sans">
      <nav className="h-16 border-b border-white/10 flex items-center px-8 gap-6 bg-black/80 backdrop-blur-3xl shrink-0 z-50">
        <svg width="24" height="24" viewBox="0 0 76 65" fill="none" className="invert brightness-0"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="white"/></svg>
        <div className="h-4 w-px bg-white/10 mx-2"></div>
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Node: {company?.name || 'ORGANIZACIÓN'}</span>
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-10">
        <div className="max-w-7xl mx-auto space-y-12 pb-20">
          <header className="flex justify-between items-end">
            <div className="space-y-2">
               <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em]">Infraestructura de Red: Operativa</p>
               </div>
               <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">Centro de <span className="text-primary not-italic">Mando</span></h1>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* REVENUE - Protegido por permiso financiero */}
            <PermissionGuard permission="VIEW_DASHBOARD">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Recaudo Total</p>
                <h3 className="text-5xl font-black tabular-nums tracking-tighter">${stats.revenue.toLocaleString()}</h3>
              </div>
            </PermissionGuard>

            {/* IA GEMINI - Protegido por permiso de uso de IA */}
            <PermissionGuard permission="USE_AI">
              <div className="bg-primary/5 border border-primary/20 p-10 rounded-[48px] space-y-6 relative overflow-hidden">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Cerebro IA Gemini</p>
                <p className="text-lg font-bold italic text-slate-200 leading-relaxed">"{aiAnalysis}"</p>
              </div>
            </PermissionGuard>

            {/* OPERACIONES - Protegido por permiso operativo */}
            <PermissionGuard permission="VIEW_OPERATIONS">
              <div className="bg-white/5 border border-white/10 p-10 rounded-[48px] space-y-4">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Tropa Activa</p>
                <h3 className="text-5xl font-black tabular-nums tracking-tighter">14 / 15</h3>
              </div>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </div>
  );
};