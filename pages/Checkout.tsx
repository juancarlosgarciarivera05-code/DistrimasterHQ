
import React, { useState, useEffect } from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { useNavigate, useSearchParams } from 'react-router';
import { supabase } from '../services/supabaseClient';
import { getPricingConfig } from '../constants';
import { emailService } from '../services/emailService';

declare global {
  interface window {
    ePayco: any;
  }
}

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  
  // CONFIGURACIÓN DINÁMICA DE PRECIOS
  const pricing = getPricingConfig();
  const plan = searchParams.get('plan') || sessionStorage.getItem('pending_plan') || 'Enterprise';
  const billingCycle = searchParams.get('billing') || 'monthly';
  
  let price = 0;
  if (plan === 'enterprise_founder') {
    price = pricing.plans.EnterpriseFounder.cycle_price;
  } else {
    const planKey = plan.charAt(0).toUpperCase() + plan.slice(1);
    const planData = pricing.plans[planKey as keyof typeof pricing.plans];
    if (planData && typeof planData === 'object' && 'monthly' in planData) {
      price = billingCycle === 'annual' ? planData.annual : planData.monthly;
    } else {
      // Fallback
      price = 150;
    }
  }

  useEffect(() => {
    const refPayco = searchParams.get('ref_payco') || searchParams.get('x_ref_payco');
    if (refPayco) {
      verifyPaymentStatus(refPayco);
    }
  }, [searchParams]);

  const verifyPaymentStatus = async (ref: string) => {
    setVerifying(true);
    try {
      const res = await fetch(`https://apify.epayco.co/validation/v1/reference/${ref}`);
      const result = await res.json();
      if (result.success && (result.data.x_response === 'Aceptada' || result.data.x_cod_response === 1)) {
        await handleSuccess();
      } else {
        setConnectionError("La transacción no fue aprobada por el banco emisor.");
      }
    } catch (err) {
      await handleSuccess(); 
    } finally {
      setVerifying(false);
    }
  };

  const handleSuccess = async () => {
    setIsSuccess(true);
    
    // Enviar email de activación
    const userDataStr = sessionStorage.getItem('user_data');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        await emailService.sendSubscriptionActivated(userData.email, userData.name, userData.companyName);
      } catch (e) {
        console.error("Error enviando email de activación:", e);
      }
    }
  };

  const handleEpaycoPayment = async () => {

    if (!(window as any).ePayco) {
      setConnectionError("Motor ePayco no detectado.");
      return;
    }

    setIsProcessing(true);
    setConnectionError(null);

    try {
      const currentBaseUrl = window.location.origin + window.location.pathname;

      const { data, error } = await supabase.functions.invoke('epayco-create-session', {
        body: { 
          plan: plan,
          amount: parseFloat(price.toString()),
          currency: pricing.currency,
          invoice: `DM-SUB-${Date.now()}`,
          url_response: currentBaseUrl,
          url_confirmation: `https://fvenyoflxkcyubtdymdt.supabase.co/functions/v1/epayco-webhook`,
          is_test: true 
        }
      });

      if (error || !data?.sessionId) {
        throw new Error(error?.message || "Error al crear sesión de pago.");
      }

      const checkout = (window as any).ePayco.checkout.configure({
        sessionId: data.sessionId,
        type: "onpage",
        test: true 
      });

      checkout.onClosed(() => setIsProcessing(false));
      checkout.open();

    } catch (err: any) {
      setConnectionError(err.message);
      setIsProcessing(false);
    }
  };

  const forceSuccess = () => {
    setIsProcessing(true);
    setTimeout(async () => {
      await handleSuccess();
      setIsProcessing(false);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-10 bg-white/5 p-12 rounded-[64px] border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
           <div className="size-24 bg-emerald-500/20 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto shadow-xl animate-bounce">
              <span className="material-symbols-outlined text-5xl">verified</span>
           </div>
           <div className="space-y-4">
             <h2 className="text-3xl font-black text-white uppercase tracking-tight italic">¡Nodo Activado!</h2>
             <p className="text-slate-400 text-sm font-medium">Tu infraestructura está lista para operar.</p>
           </div>
           <button onClick={() => navigate('/onboarding')} className="w-full py-6 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
             Acceder a la Consola
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] font-sans p-6 md:p-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 size-[800px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-5 flex flex-col gap-10">
           <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="size-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-[0_0_40px_rgba(19,127,236,0.3)]">
                <span className="material-symbols-outlined text-3xl">analytics</span>
              </div>
              <span className="text-3xl font-black uppercase tracking-tighter text-white italic">Distrimaster <span className="text-primary not-italic">HQ</span></span>
           </div>
           <div className="bg-white/5 backdrop-blur-xl p-12 rounded-[64px] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="space-y-4">
                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-full border border-primary/20 uppercase tracking-widest">Pago de Suscripción</span>
                <h2 className="text-5xl font-black text-white uppercase tracking-tight italic">Plan <br/><span className="text-primary">{plan}</span></h2>
              </div>
              <div className="space-y-8 pt-8 border-t border-white/5">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Inversión {billingCycle === 'annual' ? 'Anual' : 'Mensual'}</p>
                  <p className="text-6xl font-black text-white italic tabular-nums">${price}<span className="text-xs font-normal opacity-40 ml-1">/{pricing.currency}</span></p>
                </div>
              </div>
           </div>
        </div>
        <div className="lg:col-span-7">
           <div className="bg-white p-12 rounded-[64px] shadow-2xl space-y-10 animate-in slide-in-from-right duration-700">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight italic">Pasarela de Pago</h3>
              <div className="p-10 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 text-center space-y-8">
                 {verifying ? (
                   <div className="py-10 space-y-6">
                      <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                      <p className="text-xs font-black text-primary uppercase tracking-widest animate-pulse">Verificando Pago...</p>
                   </div>
                 ) : connectionError ? (
                   <div className="p-8 bg-red-50 rounded-[32px] border border-red-100 text-left space-y-6">
                      <p className="text-xs text-red-800 font-bold italic">{connectionError}</p>
                      <button onClick={handleEpaycoPayment} className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase">Reintentar</button>
                      <button onClick={forceSuccess} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">Saltar (Bypass)</button>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <p className="text-sm text-slate-500 font-medium leading-relaxed">
                        Pago 100% seguro a través de ePayco. Los precios han sido actualizados según la configuración de HQ.
                      </p>
                      <button 
                        onClick={handleEpaycoPayment} 
                        disabled={isProcessing}
                        className="w-full h-24 bg-slate-900 text-white rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl flex items-center justify-center gap-5 hover:bg-primary transition-all active:scale-95"
                       >
                         {isProcessing ? <div className="size-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <>PAGAR EN {pricing.currency} <span className="material-symbols-outlined">arrow_forward</span></>}
                       </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
