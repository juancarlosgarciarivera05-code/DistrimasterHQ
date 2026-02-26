import React, { useState, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { useAuth } from '../components/AuthProvider';
import { performanceService } from '../services/api';

export const RepDashboard: React.FC = () => {
  const { user, company } = useAuth();
  const [aiBriefing, setAiBriefing] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSold: 0,
    monthlyTarget: 1,
    orderCount: 0,
    visitEfectivity: 0,
    dropSize: 0
  });

  useEffect(() => {
    if (user?.id && company?.id) loadData();
  }, [user?.id, company?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await performanceService.getRepStats(user!.id, company!.id);
      setStats(data);
      const percent = ((data.totalSold / data.monthlyTarget) * 100).toFixed(0);
      const prompt = `Briefing motivador de 2 frases para ${user?.name}. Ventas: $${data.totalSold.toLocaleString()}. Cumplimiento: ${percent}%.`;
      const response = await getGeminiResponse(prompt, []);
      setAiBriefing(response || "¡Hola! Continúa con la excelente ejecución en campo.");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cumplimiento = (stats.totalSold / stats.monthlyTarget) * 100;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-background-light dark:bg-[#020617] custom-scrollbar p-6 md:p-10">
      <header className="flex flex-wrap justify-between gap-6 mb-12 items-end">
        <h2 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black uppercase tracking-tighter italic">Hola, {user?.name.split(' ')[0]}</h2>
      </header>

      <div className="flex flex-col gap-8 max-w-[1400px] mx-auto w-full pb-32">
        <section className="relative overflow-hidden rounded-[56px] bg-slate-900 p-12 shadow-2xl border border-white/10 group">
          <div className="relative z-10 space-y-6">
            <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">Briefing Predictivo Gemini</span>
            <p className="text-white text-3xl font-bold leading-tight italic tracking-tight">"{aiBriefing}"</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0f172a] p-12 rounded-[56px] border border-slate-100 dark:border-white/5 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Venta Transmitida</span>
            <h3 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums mt-4">${stats.totalSold.toLocaleString()}</h3>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[48px] border border-emerald-100">
             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Efectividad Ruta</span>
             <p className="text-6xl font-black text-emerald-700 dark:text-emerald-400 mt-4 tabular-nums">{stats.visitEfectivity.toFixed(0)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};