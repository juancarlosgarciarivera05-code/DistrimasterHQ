
import React, { useState, useRef, useEffect } from 'react';

interface EdgeFunction {
  name: string;
  url: string;
  created: string;
  updated: string;
  deployments: number;
}

interface Secret {
  name: string;
  digest: string;
  updated: string;
}

export const AdminCloudConsole: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'functions' | 'secrets'>('functions');
  const [selectedFunction, setSelectedFunction] = useState<EdgeFunction | null>(null);
  const [functionDetailTab, setFunctionDetailTab] = useState<'overview' | 'invocations' | 'logs' | 'details' | 'code'>('overview');
  const [isEditingSecret, setIsEditingSecret] = useState<Secret | null>(null);
  const [isDeployDropdownOpen, setIsDeployDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const functions: EdgeFunction[] = [
    { name: 'epayco-create-session', url: 'https://fvenyoflxkcyubtdymdt.supabase.co/functions/v1/epayco-crea...', created: '06 Feb, 2026 13:03', updated: '5 hours ago', deployments: 20 },
    { name: 'epayco-webhook', url: 'https://fvenyoflxkcyubtdymdt.supabase.co/functions/v1/epayco-webh...', created: '06 Feb, 2026 13:41', updated: '4 hours ago', deployments: 19 },
  ];

  const secrets: Secret[] = [
    { name: 'SUPABASE_URL', digest: '5ccc6d900dc253191980b025675c9980d40d43da5a80...', updated: '06 Feb 2026 20:34:47 (+0000)' },
    { name: 'EPAYCO_PUBLIC_KEY', digest: '9f62b89450b35545bd42ed3ae21da730db165f42d189...', updated: '06 Feb 2026 22:26:52 (+0000)' },
    { name: 'EPAYCO_PRIVATE_KEY', digest: 'a1bb84c7b0120b81a3934bc735768b22c682e7e29746...', updated: '06 Feb 2026 22:27:37 (+0000)' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDeployDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderFunctionDetail = () => {
    if (!selectedFunction) return null;

    return (
      <div className="space-y-8 animate-in fade-in duration-300">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <span className="hover:text-gray-900 cursor-pointer" onClick={() => setSelectedFunction(null)}>Edge Functions</span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-gray-900">{selectedFunction.name}</span>
        </div>

        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">{selectedFunction.name}</h2>
          <div className="flex gap-2">
            <button className="h-8 px-3 border border-gray-200 bg-white rounded-md text-[11px] font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50">
               <span className="material-symbols-outlined text-[16px]">description</span> Docs
            </button>
            <button className="h-8 px-3 border border-gray-200 bg-white rounded-md text-[11px] font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50">
               <span className="material-symbols-outlined text-[16px]">send</span> Test
            </button>
            {functionDetailTab === 'code' && (
               <button className="h-8 px-4 bg-[#3ecf8e] text-white rounded-md text-[11px] font-semibold hover:bg-[#34b27b] shadow-sm transition-all border border-white">
                 Save & Deploy
               </button>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 gap-6">
          {['overview', 'invocations', 'logs', 'details', 'code'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFunctionDetailTab(tab as any)}
              className={`pb-2 text-sm font-medium border-b-2 transition-all capitalize ${functionDetailTab === tab ? 'border-emerald-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {functionDetailTab === 'overview' ? (
          <div className="space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-md w-fit">
              {['15 min', '1 hour', '3 hours', '1 day'].map(t => (
                <button key={t} className={`px-3 py-1 rounded text-[10px] font-bold ${t === '15 min' ? 'bg-white shadow-sm' : 'text-gray-500'}`}>{t}</button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
                 <h4 className="text-sm font-semibold">Invocations</h4>
                 <div className="h-40 border border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-300 bg-gray-50/30">
                    <span className="material-symbols-outlined text-[32px]">bar_chart</span>
                    <p className="text-[10px] mt-2 font-bold uppercase">No data to show</p>
                 </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-sm">
                 <h4 className="text-sm font-semibold">Error rate</h4>
                 <div className="h-40 border border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-300 bg-gray-50/30">
                    <span className="material-symbols-outlined text-[32px]">warning</span>
                    <p className="text-[10px] mt-2 font-bold uppercase">All systems normal</p>
                 </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-400 italic text-sm">Visualización detallada de la función en la nube.</div>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f9f9f9] text-[#11181c] font-sans min-h-screen overflow-hidden">
      <header className="h-12 border-b border-gray-200 bg-white flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="material-symbols-outlined text-[18px]">home</span>
          <span>/</span>
          <span className="text-gray-900 cursor-pointer hover:underline" onClick={() => { setSelectedFunction(null); setActiveTab('functions'); }}>DistriMasterHQ</span>
          <div className="ml-2 flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded text-orange-700 text-[10px] font-bold uppercase tracking-tighter">
             PROD <span className="opacity-50">V8.2</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="relative">
             <span className="material-symbols-outlined absolute left-2 top-1.5 text-gray-400 text-[16px]">search</span>
             <input className="pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs w-48 focus:ring-1 focus:ring-emerald-500 outline-none" placeholder="Search... ⌘ K" />
           </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-12 border-r border-gray-200 bg-white flex flex-col items-center py-4 gap-6 shrink-0">
          <span className="material-symbols-outlined text-gray-400 hover:text-emerald-500 cursor-pointer transition-colors" onClick={() => setSelectedFunction(null)}>home</span>
          <span className="material-symbols-outlined text-emerald-500 cursor-pointer transition-colors fill-1">code</span>
          <span className="material-symbols-outlined text-gray-400 hover:text-emerald-500 cursor-pointer transition-colors">settings</span>
        </aside>

        <main className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-8 max-w-6xl w-full mx-auto space-y-8">
            
            {selectedFunction ? (
              renderFunctionDetail()
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Funciones Edge</h1>
                  <p className="text-sm text-gray-500">Lógica de servidor anycast distribuida en nodos regionales.</p>
                </div>

                <div className="flex border-b border-gray-200 gap-8">
                  <button 
                    onClick={() => setActiveTab('functions')}
                    className={`pb-2 text-sm font-medium border-b-2 transition-all ${activeTab === 'functions' ? 'border-emerald-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                  >
                    Funciones
                  </button>
                  <button 
                    onClick={() => setActiveTab('secrets')}
                    className={`pb-2 text-sm font-medium border-b-2 transition-all ${activeTab === 'secrets' ? 'border-emerald-500 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
                  >
                    Secretos
                  </button>
                </div>

                {activeTab === 'functions' ? (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <div className="relative">
                         <span className="material-symbols-outlined absolute left-2 top-2.5 text-gray-400 text-[18px]">search</span>
                         <input className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm w-72 focus:border-emerald-500 outline-none" placeholder="Search function names" />
                       </div>
                       <button className="h-9 px-4 bg-[#3ecf8e] text-white rounded-md text-xs font-semibold hover:bg-[#34b27b] shadow-sm transition-all border border-white">
                         Desplegar nueva función
                       </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                       <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                              <th className="px-6 py-3">Nombre</th>
                              <th className="px-6 py-3">URL</th>
                              <th className="px-6 py-3">Creado</th>
                              <th className="px-6 py-3">Despliegues</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-gray-100">
                            {functions.map(f => (
                              <tr key={f.name} className="hover:bg-gray-50 cursor-pointer group transition-colors" onClick={() => setSelectedFunction(f)}>
                                <td className="px-6 py-4 font-semibold text-gray-900 underline-offset-4 group-hover:underline">{f.name}</td>
                                <td className="px-6 py-4 text-gray-500 flex items-center gap-2 text-xs truncate max-w-[200px]">{f.url}</td>
                                <td className="px-6 py-4 text-gray-500">{f.created}</td>
                                <td className="px-6 py-4 text-gray-500">{f.deployments}</td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
                    <div className="lg:col-span-8 space-y-6">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-lg font-semibold text-gray-900">Bóveda de Secretos</h2>
                        <p className="text-sm text-gray-500">Gestión de variables de entorno cifradas.</p>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg p-8 space-y-6 shadow-sm">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Inyección de Credenciales</p>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                               <label className="text-xs font-medium text-gray-700">Name</label>
                               <input className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" placeholder="EPAYCO_PUBLIC_KEY" />
                            </div>
                            <div className="space-y-1.5">
                               <label className="text-xs font-medium text-gray-700">Valor</label>
                               <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm" />
                            </div>
                         </div>
                         <div className="flex justify-end">
                            <button className="h-9 px-6 bg-[#3ecf8e] text-white rounded-md text-xs font-semibold hover:bg-[#34b27b]">Guardar Secreto</button>
                         </div>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                         <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                <th className="px-6 py-3">Variable</th>
                                <th className="px-6 py-3">Digest (SHA256)</th>
                                <th className="px-6 py-3">Actualizado</th>
                              </tr>
                            </thead>
                            <tbody className="text-sm divide-y divide-gray-100">
                              {secrets.map(s => (
                                <tr key={s.name} className="hover:bg-gray-50 group transition-colors">
                                  <td className="px-6 py-4 font-semibold text-gray-900 font-mono text-xs">{s.name}</td>
                                  <td className="px-6 py-4 text-gray-400 font-mono text-[10px] truncate max-w-[150px]">{s.digest}</td>
                                  <td className="px-6 py-4 text-gray-500 text-xs">{s.updated}</td>
                                </tr>
                              ))}
                            </tbody>
                         </table>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                       <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-8 shadow-sm space-y-6">
                          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">Estatus de Producción</h3>
                          <div className="space-y-4">
                             {[
                               { label: 'Cloud Run Engine', status: 'done' },
                               { label: 'Secrets Key Vault', status: 'done' },
                               { label: 'Domain Sync (Anycast)', status: 'pending' },
                               { label: 'Vercel Deployment Protection', status: 'pending' }
                             ].map((step, i) => (
                               <div key={i} className="flex items-center gap-3">
                                  <span className={`material-symbols-outlined text-[18px] ${step.status === 'done' ? 'text-emerald-500' : 'text-gray-300'}`}>
                                     {step.status === 'done' ? 'check_circle' : 'radio_button_unchecked'}
                                  </span>
                                  <span className={`text-[11px] font-medium ${step.status === 'done' ? 'text-gray-900' : 'text-gray-400'}`}>
                                     {step.label}
                                  </span>
                               </div>
                             ))}
                          </div>
                          <div className="pt-4 border-t border-emerald-100">
                             <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Guía para www.distrimasterhq.site:</p>
                             <p className="text-[11px] text-amber-900 leading-relaxed italic">
                               1. En Vercel: Ve a "View project settings".<br/>
                               2. Apaga "Vercel Authentication".<br/>
                               3. Recarga la app para limpiar el caché.
                             </p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
