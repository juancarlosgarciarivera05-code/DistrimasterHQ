import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GLOBAL_PRICING } from '../constants';

const PlanCard = ({ plan, price, features, highlighted, onSelect, billingCycle, savingsBadge, freeMonthsBadge, label }: any) => (
  <div className={`relative p-10 rounded-[48px] flex flex-col gap-6 transition-all border-2 ${highlighted ? 'bg-gradient-to-b from-[#0a0f1d] to-[#020617] border-primary shadow-[0_30px_80px_-20px_rgba(0,112,243,0.3)] scale-105 z-10' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}>
    {highlighted && (
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl">Más elegido por empresas en crecimiento</div>
    )}
    {savingsBadge && (
      <div className="absolute top-6 right-6 bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/30">
        {savingsBadge}
      </div>
    )}
    <div className="space-y-2">
      <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">{plan}</p>
      {label && <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>}
      <div className="flex items-baseline gap-2">
        <h3 className="text-5xl font-black text-white tracking-tighter">${price}</h3>
        <div className="flex flex-col">
           <span className="text-sm font-black text-primary leading-none uppercase">USD</span>
           <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">/Mes</span>
        </div>
      </div>
      {freeMonthsBadge && billingCycle === 'annual' && (
        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-1">{freeMonthsBadge}</p>
      )}
    </div>

    <ul className="space-y-3 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-400">
          <span className="material-symbols-outlined text-emerald-500 text-base">check_circle</span> {f}
        </li>
      ))}
    </ul>
    
    <button 
      onClick={onSelect} 
      className={`w-full py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all ${highlighted ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95' : 'bg-white text-black hover:bg-primary hover:text-white'}`}
    >
      Seleccionar Plan
    </button>
  </div>
);

export const EnterprisePlanSelection: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const LOGO_URL = 'https://htmllisto.com/dm_logo_email.png';

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col items-center mb-16 text-center">
          <img src={LOGO_URL} alt="DistriMaster HQ" className="h-12 w-auto mb-8" />
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-4">Selecciona tu <span className="text-primary">Plan Definitivo</span></h1>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.4em]">Has completado tu programa de implementación. Elige cómo deseas continuar.</p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-3xl border border-white/10 backdrop-blur-xl">
            <button 
              onClick={() => setBillingCycle('monthly')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Mensual
            </button>
            <button 
              onClick={() => setBillingCycle('annual')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all relative ${billingCycle === 'annual' ? 'bg-primary text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}
            >
              Anual
              <span className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[8px] px-2 py-1 rounded-full font-black animate-bounce shadow-lg">AHORRA 20%</span>
            </button>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlanCard 
            plan="Starter" 
            price={billingCycle === 'monthly' ? GLOBAL_PRICING.plans.Starter.monthly : GLOBAL_PRICING.plans.Starter.annual} 
            features={['Módulo Preventa App', 'Catálogo Básico', 'Soporte vía Ticket', 'Pedidos Offline']} 
            onSelect={() => navigate('/checkout?plan=starter')}
            billingCycle={billingCycle}
            savingsBadge={billingCycle === 'annual' ? 'Ahorra 20%' : null}
            freeMonthsBadge="2 meses gratis"
          />
          <PlanCard 
            plan="Enterprise Normal" 
            price={billingCycle === 'monthly' ? GLOBAL_PRICING.plans.Enterprise.monthly : GLOBAL_PRICING.plans.Enterprise.annual} 
            highlighted 
            features={['IA Predictiva Full', 'Módulo Autoventa', 'Soporte 24/7 VIP', 'Integración ERP API', 'Trazabilidad Total', 'BI Avanzado']} 
            onSelect={() => navigate('/checkout?plan=enterprise')}
            billingCycle={billingCycle}
            savingsBadge={billingCycle === 'annual' ? 'Ahorra 20%' : null}
            freeMonthsBadge="2 meses gratis"
          />
          <PlanCard 
            plan="Professional" 
            price={billingCycle === 'monthly' ? GLOBAL_PRICING.plans.Professional.monthly : GLOBAL_PRICING.plans.Professional.annual} 
            features={['Supervisión Live', 'Alertas Stock IA', 'Auditoría Recaudos', 'Dashboard Pro']} 
            onSelect={() => navigate('/checkout?plan=professional')}
            billingCycle={billingCycle}
            savingsBadge={billingCycle === 'annual' ? 'Ahorra 20%' : null}
            freeMonthsBadge="2 meses gratis"
          />
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">© {new Date().getFullYear()} DistriMaster HQ — Infraestructura para distribución comercial.</p>
        </div>
      </div>
    </div>
  );
};
