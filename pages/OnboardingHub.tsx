import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../services/supabaseClient';
import { emailService } from '../services/emailService';

export const OnboardingHub: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginDemo } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    companyName: ''
  });
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [showExploreForm, setShowExploreForm] = useState(false);
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false);

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan === 'enterprise_founder') {
      setShowEnterpriseForm(true);
    } else if (plan === 'starter' || plan === 'professional') {
      setShowDemoForm(true);
    }
  }, [searchParams]);

  const LOGO_URL = 'https://htmllisto.com/dm_logo_email.png';

  const handleSandbox = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Guardar lead en Supabase para Nurturing
      const sandboxExpires = new Date();
      sandboxExpires.setDate(sandboxExpires.getDate() + 7);

      await supabase.from('companies').insert([{
        name: formData.companyName || `Explorador_${Date.now()}`,
        email: formData.email,
        owner_name: formData.name || 'Explorador',
        plan: 'SANDBOX',
        status: 'ACTIVE',
        sandbox_started_at: new Date().toISOString(),
        sandbox_expires_at: sandboxExpires.toISOString(),
        nurturing_stage: 'WELCOME_SENT',
        last_nurturing_sent_at: new Date().toISOString()
      }]);

      // 2. Enviar email de bienvenida para exploración
      await emailService.sendExploreWelcome(formData.email, formData.name || 'Explorador');
      navigate('/experience-selector');
    } catch (error) {
      console.error('Error en onboarding sandbox:', error);
      navigate('/experience-selector');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Guardar lead en Supabase para Nurturing
      const trialExpires = new Date();
      trialExpires.setDate(trialExpires.getDate() + 7);

      await supabase.from('companies').insert([{
        name: formData.companyName,
        email: formData.email,
        owner_name: formData.name,
        plan: 'TRIAL',
        status: 'ACTIVE',
        trial_started_at: new Date().toISOString(),
        trial_expires_at: trialExpires.toISOString(), // Campo existente para Sentinel
        nurturing_stage: 'WELCOME_SENT',
        last_nurturing_sent_at: new Date().toISOString()
      }]);

      // 2. Enviar email de activación 7 días
      await emailService.send7DayTrialWelcome(formData.email, formData.name, formData.companyName);
      
      // 3. Login demo para acceso inmediato
      loginDemo('ADMIN_GLOBAL', 'Starter');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error en onboarding demo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterpriseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Guardar lead en Supabase para Nurturing
      await supabase.from('companies').insert([{
        name: formData.companyName,
        email: formData.email,
        owner_name: formData.name,
        plan: 'ENTERPRISE',
        status: 'PENDING',
        nurturing_stage: 'WELCOME_SENT',
        last_nurturing_sent_at: new Date().toISOString()
      }]);

      // 2. Enviar confirmación Enterprise
      await emailService.sendEnterpriseConfirmation(formData.email, formData.name, formData.companyName);
      
      // 3. Guardar datos para checkout
      const plan = searchParams.get('plan') || 'enterprise_founder';
      const billing = searchParams.get('billing') || 'monthly';
      sessionStorage.setItem('pending_plan', plan);
      sessionStorage.setItem('user_data', JSON.stringify(formData));
      
      navigate(`/checkout?plan=${plan}&billing=${billing}`);
    } catch (error) {
      console.error('Error en onboarding enterprise:', error);
      navigate('/checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary selection:text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl w-full z-10 space-y-12">
        <div className="text-center space-y-4">
          <img src={LOGO_URL} alt="DistriMaster HQ" className="h-16 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(19,127,236,0.3)]" />
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
            Comienza tu <span className="text-primary">Evolución</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto italic">
            Selecciona el punto de partida para transformar tu operación logística hoy mismo.
          </p>
        </div>

        {(!showDemoForm && !showExploreForm && !showEnterpriseForm) ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Opción 1: Sandbox */}
            <div 
              onClick={() => setShowExploreForm(true)}
              className="group bg-white/[0.02] backdrop-blur-3xl p-10 rounded-[48px] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col h-full shadow-2xl hover:-translate-y-2"
            >
              <div className="size-16 rounded-2xl bg-slate-500/10 text-slate-400 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-white/10">
                <span className="material-symbols-outlined text-4xl">visibility</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-primary transition-colors">Explorar Plataforma</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
                Acceso instantáneo en modo lectura con datos de prueba. Ideal para conocer la interfaz sin compromiso.
              </p>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Recibe Guía de Bienvenida • Modo Sandbox</div>
            </div>

            {/* Opción 2: Demo 7 Días */}
            <div 
              onClick={() => setShowDemoForm(true)}
              className="group bg-primary/5 backdrop-blur-3xl p-10 rounded-[48px] border border-primary/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col h-full shadow-2xl hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-1000">
                <span className="material-symbols-outlined text-8xl">bolt</span>
              </div>
              <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
                <span className="material-symbols-outlined text-4xl">rocket_launch</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-primary transition-colors">7 Días Gratis</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
                Crea tu propio nodo operativo. Gestiona tus productos, rutas y vendedores con todas las funciones Pro.
              </p>
              <div className="text-xs font-black text-primary uppercase tracking-widest">Acceso Total • Configuración Instantánea</div>
            </div>

            {/* Opción 3: Trial 90 Días */}
            <div 
              onClick={() => setShowEnterpriseForm(true)}
              className="group bg-gradient-to-br from-emerald-500/10 to-transparent backdrop-blur-3xl p-10 rounded-[48px] border border-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col h-full shadow-2xl hover:-translate-y-2"
            >
              <div className="size-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner border border-emerald-500/20">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-emerald-500 transition-colors">Plan Enterprise</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8 flex-1">
                90 días de trial completo. Incluye IA Predictiva, soporte VIP y configuración de infraestructura dedicada.
              </p>
              <div className="text-xs font-black text-emerald-500 uppercase tracking-widest">Garantía Enterprise • 90 Días Trial</div>
            </div>
          </div>
        ) : showExploreForm ? (
          <div className="max-w-md mx-auto bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[48px] border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => setShowExploreForm(false)}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
            </button>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Acceso <span className="text-slate-400">Sandbox</span></h2>
            <form onSubmit={handleSandbox} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Tu Email para recibir la Guía</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Preparando...' : 'Explorar Ahora'}
              </button>
            </form>
          </div>
        ) : showEnterpriseForm ? (
          <div className="max-w-md mx-auto bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[48px] border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => setShowEnterpriseForm(false)}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
            </button>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Plan <span className="text-emerald-500">Enterprise</span></h2>
            <form onSubmit={handleEnterpriseSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="Ej: Carlos Ruiz"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Corporativo</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="carlos@tuempresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre de la Distribuidora</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="Ej: Distribuidora del Norte"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Continuar al Pago'}
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white/[0.02] backdrop-blur-3xl p-12 rounded-[48px] border border-white/10 shadow-3xl animate-in fade-in zoom-in duration-500">
            <button 
              onClick={() => setShowDemoForm(false)}
              className="mb-8 flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span> Volver
            </button>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8">Configura tu <span className="text-primary">Demo</span></h2>
            <form onSubmit={handleDemoSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre Completo</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="Ej: Carlos Ruiz"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Corporativo</label>
                <input 
                  required
                  type="email"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="carlos@tuempresa.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Nombre de la Distribuidora</label>
                <input 
                  required
                  type="text"
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold focus:border-primary outline-none transition-all"
                  placeholder="Ej: Distribuidora del Norte"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Creando Nodo...' : 'Activar Demo Gratuita'}
              </button>
            </form>
          </div>
        )}


        <div className="text-center">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} DistriMaster HQ — Infraestructura Logística Enterprise <span className="text-primary/40 ml-2">v22.0.2-LIVE</span>
          </p>
        </div>
      </div>
    </div>
  );
};

