import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';

interface Deployment {
  id: string;
  env: 'Producción' | 'Vista previa';
  status: 'Listo' | 'Construyendo' | 'Error';
  time: string;
  author: string;
  branch: string;
  commitMsg: string;
  isCurrent?: boolean;
}

interface LogLine {
  time: string;
  msg: string;
  type: 'info' | 'warn' | 'error' | 'success';
}

export const AdminDeployments: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [showToast, setShowToast] = useState(true);

  const REAL_LOGS: LogLine[] = [
    { time: '09:14:56.087', msg: 'Iniciando despliegue en clúster SouthAmerica-East1...', type: 'info' },
    { time: '09:14:56.088', msg: 'Configuración: 2 núcleos dedicados, 8GB RAM asignados.', type: 'info' },
    { time: '09:14:56.099', msg: 'Clonando repositorio maestro (Rama: main, Commit: dd87b56)', type: 'info' },
    { time: '09:14:56.100', msg: 'Validando certificados SSL para www.distrimasterhq.site', type: 'success' },
    { time: '09:14:56.572', msg: 'Conexión con Supabase establecida. Latencia: 12ms', type: 'success' },
    { time: '09:14:56.935', msg: 'Ejecutando optimización de activos SFA...', type: 'info' },
    { time: '09:15:20.109', msg: 'Compilación finalizada. Nodo propagado a 14 regiones.', type: 'success' },
    { time: '09:26:57.120', msg: 'GET 200 /index.html - Tráfico de red habilitado.', type: 'info' },
  ];

  useEffect(() => {
    setLogs(REAL_LOGS);
    const timer = setTimeout(() => setShowToast(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-[#fafafa] dark:bg-[#000] text-[#000] dark:text-[#fff] font-sans overflow-hidden">
      <header className="h-14 px-6 border-b border-gray-200 dark:border-[#333] flex items-center bg-white dark:bg-black shrink-0 z-50">
        <div className="flex items-center gap-4">
          <svg width="22" height="22" viewBox="0 0 76 65" fill="none" className="dark:invert"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="black"/></svg>
          <div className="h-4 w-px bg-gray-200 dark:bg-[#333]"></div>
          <div className="flex items-center gap-2 text-[13px] font-medium">
            <span className="text-gray-400">Proyectos</span>
            <span className="text-gray-300 dark:text-[#333]">/</span>
            <span className="text-gray-900 dark:text-white font-semibold">distrimasterhq</span>
            <span className="bg-gray-100 dark:bg-[#111] px-2 py-0.5 rounded text-[10px] font-bold text-gray-500 border border-gray-200 dark:border-[#333]">PROD</span>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto p-8 space-y-10">
          <div className="space-y-1">
             <h1 className="text-2xl font-bold tracking-tight">Registro de Implementación</h1>
             <p className="text-gray-500 text-sm">Monitoreo de compilación para el clúster de {user?.city || 'Latinoamérica'}.</p>
          </div>

          <section className="bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x dark:divide-[#333]">
             <div className="p-5 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estado Final</p>
                <div className="flex items-center gap-2">
                   <div className="size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] animate-pulse"></div>
                   <span className="text-sm font-bold">Producción Activa</span>
                </div>
             </div>
             <div className="p-5 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rama Git</p>
                <span className="text-sm font-mono font-bold">main</span>
             </div>
             <div className="p-5 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiempo de Carga</p>
                <span className="text-sm font-bold">22.4s</span>
             </div>
             <div className="p-5 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nodo Anycast</p>
                <span className="text-sm font-bold">IAD1 (Global)</span>
             </div>
          </section>

          <section className="bg-white dark:bg-black border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden flex flex-col">
            <div className="px-6 h-12 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-gray-50/50 dark:bg-[#111]">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">terminal</span>
                <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">Runtime Build Logs</h3>
              </div>
            </div>
            <div className="bg-[#fff] dark:bg-[#000] p-6 font-mono text-[11px] leading-relaxed max-h-[500px] overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-6 py-0.5 group">
                  <span className="shrink-0 select-none text-gray-300 dark:text-[#444] w-24">{log.time}</span>
                  <span className={`flex-1 ${log.type === 'success' ? 'text-emerald-500' : 'text-gray-700 dark:text-gray-300'}`}>
                    {log.msg}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-8 right-8 z-[200] animate-in slide-in-from-right duration-500">
          <div className="bg-[#0070f3] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center justify-between border border-white/10">
            <div className="flex items-center gap-4">
               <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
               <span className="text-sm font-bold">Propagación Exitosa</span>
            </div>
            <button onClick={() => setShowToast(false)} className="material-symbols-outlined text-[18px] ml-6 opacity-70">close</button>
          </div>
        </div>
      )}
    </div>
  );
};