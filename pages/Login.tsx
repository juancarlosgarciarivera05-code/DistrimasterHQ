import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

export const Login: React.FC = () => {
  const { loginWithMagicLink, loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/home';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await loginWithMagicLink(email.trim());
      setMessage({ 
        type: 'success', 
        text: '¡Enlace enviado! Revisa tu bandeja de entrada para iniciar sesión.' 
      });
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Ocurrió un error al enviar el enlace.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Ocurrió un error con Google OAuth.' 
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0">
         <div className="absolute top-[-20%] left-[-10%] size-[800px] bg-primary/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] size-[800px] bg-indigo-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* LOGO AREA */}
        <div className="text-center mb-10 space-y-4">
          <div className="relative inline-block">
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl"></div>
            <img src="https://htmllisto.com/dm_logo_email.png" alt="DistriMaster HQ" className="h-16 w-auto relative z-10 mx-auto" />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
            DistriMaster <span className="text-primary not-italic font-normal opacity-50">HQ</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Acceso a Infraestructura SaaS</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Iniciar Sesión</h2>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">Ingresa tu email corporativo para recibir un enlace de acceso seguro.</p>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleMagicLinkSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-4">Email Corporativo</label>
              <input 
                ref={inputRef}
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 bg-black/40 border border-white/10 rounded-[20px] px-6 text-white font-bold focus:border-primary outline-none transition-all placeholder:text-slate-700"
                placeholder="ejemplo@empresa.com"
                required
                disabled={isLoading}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-primary text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <span className="material-symbols-outlined animate-spin">sync</span>
              ) : (
                <>
                  <span className="material-symbols-outlined">magic_button</span>
                  Enviar Magic Link
                </>
              )}
            </button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#050811] px-4 text-[10px] font-black text-slate-600 uppercase tracking-widest">O continuar con</span>
            </div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-16 bg-white/5 border border-white/10 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            Google Workspace
          </button>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            ← Volver a la página principal
          </button>
        </div>
      </div>
    </div>
  );
};
