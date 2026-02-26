import React, { useState, useEffect } from 'react';
// BUILD_TAG: 20260226-0640
import { useNavigate, Link } from 'react-router-dom';
import { getPricingConfig } from '../constants';
import { getGeminiResponse } from '../services/geminiService';

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[48px] border border-white/5 hover:border-primary/50 transition-all group flex flex-col h-full shadow-2xl hover:-translate-y-2">
    <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
      <span className="material-symbols-outlined text-4xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-primary transition-colors">{title}</h3>
    <p className="text-slate-400 text-sm font-medium leading-relaxed">{description}</p>
  </div>
);

const PriceCard = ({ plan, price, routes, sellers, features, highlighted, onSelect, isPilot, currency, billingCycle, savingsBadge, freeMonthsBadge, label }: any) => (
  <div className={`relative p-12 rounded-[64px] flex flex-col gap-8 transition-all border-2 ${highlighted ? 'bg-gradient-to-b from-[#0a0f1d] to-[#020617] border-primary shadow-[0_40px_100px_-20px_rgba(0,112,243,0.3)] scale-105 z-10' : 'bg-white/[0.02] border-white/10 hover:border-white/20'}`}>
    {highlighted && (
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">Recomendado</div>
    )}
    {savingsBadge && (
      <div className="absolute top-8 right-8 bg-emerald-500/20 text-emerald-500 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/30 animate-pulse">
        {savingsBadge}
      </div>
    )}
    <div className="space-y-2">
      <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-4">{plan}</p>
      {label && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>}
      <div className="flex items-baseline gap-2">
        <h3 className="text-7xl font-black text-white tracking-tighter">${price}</h3>
        <div className="flex flex-col">
           <span className="text-lg font-black text-primary leading-none uppercase">{currency}</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">/{isPilot ? '90 Días' : 'Mes'}</span>
        </div>
      </div>
      {freeMonthsBadge && billingCycle === 'annual' && (
        <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-2">{freeMonthsBadge}</p>
      )}
      <p className="text-[10px] font-bold text-slate-600 uppercase mt-4 tracking-widest italic border-t border-white/5 pt-4">Suscripción SFA Enterprise Ready</p>
    </div>
    
    <div className="space-y-5 py-8 border-y border-white/5">
       <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary border border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <p className="text-sm font-black text-white uppercase tracking-tight">{sellers} Personal en Campo</p>
       </div>
       <div className="flex items-center gap-4">
          <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 border border-white/10 shadow-inner">
            <span className="material-symbols-outlined text-2xl">alt_route</span>
          </div>
          <p className="text-sm font-black text-white uppercase tracking-tight">{routes} Rutas por Vendedor</p>
       </div>
    </div>

    <ul className="space-y-4 flex-1">
      {features.map((f: string, i: number) => (
        <li key={i} className="flex items-center gap-4 text-xs font-bold text-slate-400">
          <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span> {f}
        </li>
      ))}
    </ul>
    
    <button 
      onClick={onSelect} 
      className={`w-full py-6 rounded-[28px] font-black text-xs uppercase tracking-widest transition-all ${highlighted ? 'bg-primary text-white shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95' : 'bg-white text-black hover:bg-primary hover:text-white'}`}
    >
      {isPilot ? 'Activar Programa Fundador' : 'Contratar Plan'}
    </button>
  </div>
);

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [pricing, setPricing] = useState(getPricingConfig());
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [iaQuestion, setIaQuestion] = useState('');
  const [iaAnswer, setIaAnswer] = useState('');
  const [isIaLoading, setIsIaLoading] = useState(false);

  // Logo Oficial Configurado para alta resolución
  const LOGO_URL = 'https://htmllisto.com/dm_logo_email.png';

  useEffect(() => {
    setPricing(getPricingConfig());
    const handleSync = (e: any) => { if (e.detail) setPricing(e.detail); };
    window.addEventListener('dm_global_sync', handleSync);
    return () => window.removeEventListener('dm_global_sync', handleSync);
  }, []);

  const handleIaAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!iaQuestion.trim() || isIaLoading) return;
    setIsIaLoading(true);
    setIaAnswer('');
    try {
      const prompt = `Actúa como el Estratega Jefe de Distrimaster HQ. Responde sobre: ${iaQuestion}. Somos un SaaS Enterprise para distribución en Colombia con módulos de: Admin HQ, Supervisor Live, Bodega Inteligente, App Preventa SFA, Entregador con Recaudo Digital e IA Predictiva. Sé profesional, convincente y breve.`;
      const response = await getGeminiResponse(prompt, []);
      setIaAnswer(response);
    } catch (err) {
      setIaAnswer("Nuestros servidores de inteligencia están saturados. Por favor, intenta de nuevo en un momento.");
    } finally {
      setIsIaLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary selection:text-white overflow-x-hidden">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[180px]"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      </div>

      {/* REFINED NAVBAR */}
      <nav className="fixed top-6 inset-x-6 h-20 bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[32px] z-[100] px-8 flex items-center justify-between max-w-7xl mx-auto shadow-2xl">
        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
          <div className="relative">
             <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all opacity-0 group-hover:opacity-100"></div>
             <img src={LOGO_URL} alt="DistriMaster HQ" className="h-10 w-auto relative z-10 transition-transform group-hover:scale-105" />
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block"></div>
          <span className="text-xl font-black tracking-tighter uppercase italic hidden md:block">
            DistriMaster <span className="text-primary not-italic font-normal opacity-50">HQ</span>
          </span>
        </div>
        
        <div className="hidden lg:flex gap-10 items-center">
          <button onClick={() => scrollToSection('tech')} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-white transition-all">Módulos</button>
          <button onClick={() => scrollToSection('ia-card')} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-white transition-all">Inteligencia</button>
          <button onClick={() => scrollToSection('pricing')} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-white transition-all">Planes</button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">v22.0.2-LIVE</span>
          </div>
          <a 
            href="/#/login"
            className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
          >
            INICIAR SESIÓN
          </a>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-64 pb-32 px-8 text-center z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="inline-flex items-center gap-4 px-6 py-2.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.5em] rounded-full border border-primary/20 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
             <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
             </span>
             Operación Live en Red Anycast
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] mb-10 uppercase italic text-white animate-in zoom-in duration-1000">
            BUILD SYNC TEST 2026 <br/>
            BUILD TEST NAVBAR <br/>
            Distribución <br/><span className="text-primary not-italic drop-shadow-[0_0_60px_rgba(19,127,236,0.3)]">Automatizada</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed italic animate-in fade-in slide-in-from-bottom-4 delay-300">
            Infraestructura SaaS Enterprise diseñada para liderar el mercado mayorista colombiano con IA y telemetría de campo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
             <button onClick={() => navigate('/onboarding')} className="px-12 py-5 bg-primary text-white rounded-[24px] font-black uppercase text-xs tracking-widest shadow-[0_20px_60px_rgba(19,127,236,0.4)] hover:scale-105 active:scale-95 transition-all">Comenzar Ahora</button>
             <a href="https://calendar.app.google/Ss1AdA2TA6Cc15S66" target="_blank" rel="noreferrer" className="px-12 py-5 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-[24px] font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3">
                Agendar Demo <span className="material-symbols-outlined text-sm">calendar_today</span>
             </a>
          </div>
        </div>
      </header>

      {/* CORE MODULES */}
      <section id="tech" className="py-24 px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24 space-y-4">
           <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Módulos <span className="text-primary">Sentinel</span></h2>
           <p className="text-slate-500 font-medium uppercase tracking-[0.4em] text-[10px]">Dimensiones de Control Logístico</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon="admin_panel_settings" title="Panel HQ" description="Control gerencial con analítica predictiva de ventas y proyecciones de flujo de caja en tiempo real." />
          <FeatureCard icon="radar" title="Control en Vivo" description="Mando táctico para supervisores. Monitoreo GPS y aprobación instantánea de pedidos por QR." />
          <FeatureCard icon="inventory_2" title="Bodega Inteligente" description="Gestión total de Kardex y liquidación digital de rutas al cierre de la jornada operativa." />
          <FeatureCard icon="storefront" title="App SFA Pro" description="Terminal para vendedores con toma de pedidos offline, catálogo digital y gestión de cartera." />
          <FeatureCard icon="local_shipping" title="Última Milla" description="Módulo para entregadores con evidencia fotográfica, firma digital y recaudo integrado." />
          <FeatureCard icon="auto_awesome" title="Núcleo IA" description="Algoritmos de Gemini 3 Pro para optimización de rutas y prevención automática de agotados." />
        </div>
      </section>

      {/* IA INTERACTIVE CARD */}
      <section id="ia-card" className="py-24 px-8 max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-white/5 rounded-[64px] p-8 md:p-16 shadow-3xl overflow-hidden relative">
           <div className="absolute top-0 right-0 p-20 opacity-5 group-hover:scale-110 transition-transform duration-[5000ms] pointer-events-none">
              <span className="material-symbols-outlined text-[300px]">auto_awesome</span>
           </div>
           
           <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                 <div className="inline-flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                    <span className="size-2 bg-primary rounded-full animate-ping"></span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Asistente IA Activo</span>
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-tight">Potencia tu Distribuidora con <span className="text-primary">IA Generativa</span></h2>
                 <div className="space-y-2">
                    <p className="text-primary font-black uppercase tracking-widest text-sm">Asistente DistriMaster IA</p>
                    <p className="text-slate-400 text-lg font-medium italic max-w-xl leading-relaxed">
                       Recibe orientación experta para optimizar tu distribuidora. <br/>
                       Consulta sobre pedidos, clientes, rutas, catálogos y automatización comercial.
                    </p>
                 </div>
              </div>

              <div className="w-full lg:w-[480px] space-y-6">
                 <form onSubmit={handleIaAsk} className="relative">
                    <input 
                      type="text"
                      className="w-full h-20 bg-black/40 border-2 border-white/10 rounded-[28px] px-8 pr-20 text-white font-bold focus:border-primary outline-none transition-all placeholder:text-slate-600 shadow-2xl"
                      placeholder="¿Qué beneficios tiene el catálogo digital?"
                      value={iaQuestion}
                      onChange={(e) => setIaQuestion(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={isIaLoading}
                      className="absolute right-3 top-3 size-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                       <span className={`material-symbols-outlined text-3xl ${isIaLoading ? 'animate-spin' : ''}`}>
                         {isIaLoading ? 'sync' : 'arrow_forward'}
                       </span>
                    </button>
                 </form>

                 <div className={`min-h-[160px] bg-white/[0.02] border border-white/5 rounded-[32px] p-8 transition-all ${iaAnswer ? 'opacity-100' : 'opacity-40'}`}>
                    {isIaLoading ? (
                      <div className="space-y-4">
                         <div className="h-4 bg-white/5 rounded w-full animate-pulse"></div>
                         <div className="h-4 bg-white/5 rounded w-[80%] animate-pulse"></div>
                      </div>
                    ) : iaAnswer ? (
                      <div className="animate-in fade-in slide-in-from-top-2">
                         <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                           <span className="material-symbols-outlined text-sm">robot_2</span> Estratega Jefe Gemini:
                         </p>
                         <p className="text-slate-300 text-base leading-relaxed italic">"{iaAnswer}"</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center py-6">
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Consultoría Estratégica en Tiempo Real</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">Inversión <span className="text-primary">Escalable</span></h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.4em]">Planes adaptados al tamaño de tu flota</p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex flex-col items-center mb-20">
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
          <p className="mt-6 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">
            {billingCycle === 'annual' ? 'Facturación anual (2 meses gratis)' : 'Facturación mensual estándar'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <PriceCard 
            plan="Starter" 
            price={billingCycle === 'monthly' ? pricing.plans.Starter.monthly : pricing.plans.Starter.annual} 
            currency={pricing.currency} 
            sellers="3" 
            routes="1" 
            features={['Módulo Preventa App', 'Catálogo Básico', 'Soporte vía Ticket', 'Pedidos Offline']} 
            onSelect={() => navigate(`/onboarding?plan=starter&billing=${billingCycle}`)}
            billingCycle={billingCycle}
            savingsBadge={billingCycle === 'annual' ? 'Ahorra 20%' : null}
            freeMonthsBadge="2 meses gratis"
          />
          <PriceCard 
            plan="Enterprise Founder" 
            price={pricing.plans.EnterpriseFounder.cycle_price} 
            currency={pricing.currency} 
            sellers="Ilimitados" 
            routes="5" 
            highlighted 
            isPilot
            label="Programa Fundador — Implementación Extendida"
            features={['IA Predictiva Full', 'Módulo Autoventa', 'Soporte 24/7 VIP', 'Integración ERP API', '90 días por ciclo', 'Incluye 2 ciclos automáticos']} 
            onSelect={() => navigate('/onboarding?plan=enterprise_founder')} 
          />
          <PriceCard 
            plan="Professional" 
            price={billingCycle === 'monthly' ? pricing.plans.Professional.monthly : pricing.plans.Professional.annual} 
            currency={pricing.currency} 
            sellers="10" 
            routes="2"
            features={['Supervisión Live', 'Alertas Stock IA', 'Auditoría Recaudos', 'Dashboard Pro']} 
            onSelect={() => navigate(`/onboarding?plan=professional&billing=${billingCycle}`)}
            billingCycle={billingCycle}
            savingsBadge={billingCycle === 'annual' ? 'Ahorra 20%' : null}
            freeMonthsBadge="2 meses gratis"
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-40 border-t border-white/5 bg-[#01030a] pt-32 pb-16 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          
          <div className="space-y-8">
            <img src={LOGO_URL} alt="DistriMaster" className="h-12 w-auto drop-shadow-[0_0_20px_rgba(19,127,236,0.5)]" />
            <p className="text-slate-400 text-sm font-medium leading-relaxed italic pr-4">
              "Liderando la vanguardia tecnológica para distribuidores mayoristas. Infraestructura SaaS segura, escalable y con soporte local."
            </p>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Enlaces</h4>
            <ul className="space-y-4">
              <li><button onClick={() => scrollToSection('tech')} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Tecnología</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Suscripciones</button></li>
              <li><Link to="/onboarding" className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">Acceso Operativo</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Contacto</h4>
            <div className="space-y-6">
              <a href="https://wa.me/573026356966" target="_blank" rel="noreferrer" className="flex items-center gap-4 group">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-inner border border-white/5">
                  <span className="material-symbols-outlined text-xl">forum</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">WhatsApp Business</p>
                  <p className="text-sm font-bold text-white transition-colors uppercase">+57 302 635 6966</p>
                </div>
              </a>
              <a href="mailto:distrimasterenterprisehq@gmail.com" className="flex items-center gap-4 group">
                <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-inner border border-white/5">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Email Corporativo</p>
                  <p className="text-sm font-bold text-white transition-colors uppercase">distrimasterenterprisehq@gmail.com</p>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.5em]">Sede Central</h4>
            <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 space-y-4">
              <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                 <p className="text-xs font-black uppercase text-white tracking-widest">Bogotá, Colombia</p>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase italic">Servicio disponible para toda Latinoamérica.</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 pt-10 border-t border-white/5 flex flex-col items-center text-center gap-4">
          <p className="text-xs font-bold text-primary uppercase tracking-widest">Soporte y contacto: distrimasterenterprisehq@gmail.com</p>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">© {new Date().getFullYear()} DistriMaster HQ — Plataforma inteligente para distribución comercial. <span className="text-primary/40 ml-2">v22.0.2-LIVE</span></p>
        </div>
      </footer>
    </div>
  );
};