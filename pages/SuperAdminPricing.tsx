
import React, { useState, useEffect } from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { Link } from 'react-router';
import { getPricingConfig, STORAGE_KEYS } from '../constants';

export const SuperAdminPricing: React.FC = () => {
  // Estado local que el usuario edita
  const [localConfig, setLocalConfig] = useState(getPricingConfig());
  // Estado que refleja lo que hay guardado en el "disco" actualmente
  const [savedConfig, setSavedConfig] = useState(getPricingConfig());
  const [isSaving, setIsSaving] = useState(false);

  const handlePriceChange = (plan: string, value: string) => {
    const num = value === '' ? 0 : parseFloat(value);
    setLocalConfig(prev => ({
      ...prev,
      plans: { ...prev.plans, [plan]: num }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Forzamos el guardado y el evento
    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEYS.PRICES, JSON.stringify(localConfig.plans));
        localStorage.setItem(STORAGE_KEYS.CURRENCY, localConfig.currency);
        
        // Sincronizar el estado de "verificación"
        setSavedConfig({ ...localConfig });
        
        // Gritar a la App que los precios cambiaron (Evento Global)
        window.dispatchEvent(new CustomEvent('dm_global_sync', { detail: localConfig }));
        window.dispatchEvent(new Event('storage')); // Para otras pestañas
        
        setIsSaving(false);
        alert(`✅ SISTEMA SINCRONIZADO\n\nLos cambios son ahora la versión oficial del ecosistema.`);
      } catch (err) {
        setIsSaving(false);
        alert("❌ Error de memoria en el navegador.");
      }
    }, 500);
  };

  const handleReset = () => {
    if (confirm("¿Borrar configuraciones personalizadas y volver a valores de fábrica?")) {
      localStorage.removeItem(STORAGE_KEYS.PRICES);
      localStorage.removeItem(STORAGE_KEYS.CURRENCY);
      const reset = getPricingConfig();
      setLocalConfig(reset);
      setSavedConfig(reset);
      window.dispatchEvent(new CustomEvent('dm_global_sync', { detail: reset }));
      alert("Valores de fábrica restaurados.");
    }
  };

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
          <Link to="/superadmin/pricing" className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
            <span className="material-symbols-outlined text-sm">payments</span> Config Precios
          </Link>
        </nav>
        <button onClick={handleReset} className="p-4 text-[9px] font-black text-slate-600 hover:text-red-500 uppercase tracking-widest text-left">
          Restablecer Todo
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        <div className="max-w-5xl mx-auto space-y-12">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="text-6xl font-black tracking-tight uppercase italic leading-none">Global <span className="text-primary">Pricing</span></h1>
              <p className="text-slate-500 mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Control Maestro de Facturación</p>
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-primary uppercase tracking-[0.2em] ml-1">Moneda del Ecosistema</label>
               <select 
                value={localConfig.currency}
                onChange={(e) => setLocalConfig({...localConfig, currency: e.target.value})}
                className="bg-[#11141a] border-2 border-white/10 rounded-2xl px-6 py-4 text-xs font-black uppercase outline-none focus:border-primary w-64 text-white shadow-xl"
               >
                 <option value="USD">USD - Dólar</option>
                 <option value="COP">COP - Pesos</option>
                 <option value="MXN">MXN - Pesos Mex</option>
                 <option value="EUR">EUR - Euro</option>
               </select>
            </div>
          </header>

          {/* INDICADOR DE ESTADO ACTUAL (VERIFICACIÓN) */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-[32px] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-emerald-500 animate-pulse">verified</span>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Actualmente en Producción:</p>
                   <p className="text-xs font-bold text-white uppercase">{savedConfig.currency} - {Object.values(savedConfig.plans).join(' / ')}</p>
                </div>
             </div>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Base de Datos OK</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.entries(localConfig.plans).map(([plan, value]: [string, any]) => (
              <div key={plan} className="bg-[#0c0f16] border-2 border-white/5 p-10 rounded-[56px] space-y-8 group hover:border-primary/40 transition-all shadow-xl">
                 <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{plan} Plan</p>
                    <span className="material-symbols-outlined text-slate-700">edit</span>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio Mensual</label>
                    <div className="relative">
                       <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10 font-black text-3xl">$</span>
                       <input 
                         type="number" 
                         className="w-full pl-14 pr-6 py-8 bg-white/[0.02] border-2 border-white/5 rounded-[32px] text-5xl font-black focus:border-primary focus:bg-primary/5 outline-none transition-all tabular-nums text-white"
                         value={value}
                         onChange={(e) => handlePriceChange(plan, e.target.value)}
                       />
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <section className="bg-primary/5 border-2 border-primary/20 p-12 rounded-[64px] flex flex-col lg:flex-row justify-between items-center gap-12 shadow-2xl relative overflow-hidden">
             <div className="flex-1 space-y-2 relative z-10">
                <h4 className="text-3xl font-black uppercase tracking-tight italic">Propagar a Todo el Sistema</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">Esto sobreescribirá los precios en la Landing Page y el Checkout inmediatamente.</p>
             </div>
             <button 
              onClick={handleSave}
              disabled={isSaving}
              className="h-24 px-16 bg-primary text-white rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_60px_rgba(19,127,236,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-5 relative z-10 disabled:opacity-50"
             >
               {isSaving ? (
                 <div className="size-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
               ) : (
                 <>Sincronizar Ecosistema <span className="material-symbols-outlined text-2xl">sync</span></>
               )}
             </button>
          </section>
        </div>
      </main>
    </div>
  );
};
