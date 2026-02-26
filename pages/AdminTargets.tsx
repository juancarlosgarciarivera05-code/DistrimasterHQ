import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { routeService, targetService, dashboardService } from '../services/api';
import { SalesTarget, ZoneTarget } from '../types';

export const AdminTargets: React.FC = () => {
  const { company } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [currentSales, setCurrentSales] = useState(0);

  useEffect(() => {
    if (company?.id) loadData();
  }, [company?.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const dashStats = await dashboardService.getStats(company!.id);
      setCurrentSales(dashStats.revenue || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#0a0c10] font-sans">
      <header className="h-24 px-10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0d1117]/80 backdrop-blur-xl shrink-0 z-20">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
            Command <span className="text-primary">Metas</span>
          </h1>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-10 pb-32">
           <div className="bg-white dark:bg-surface-dark p-12 rounded-[56px] border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Ventas Consolidadas</p>
              <h2 className="text-6xl font-black text-slate-900 dark:text-white tabular-nums">${currentSales.toLocaleString()}</h2>
           </div>
        </div>
      </main>
    </div>
  );
};