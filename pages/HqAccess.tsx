import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

const MASTER_HQ_KEY = "DM-HQ-2025";

export const HqAccess: React.FC = () => {
  const { loginDemo } = useAuth();
  const navigate = useNavigate();
  const [masterInput, setMasterInput] = useState('');
  const [errorMaster, setErrorMaster] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Autofocus al cargar
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const handleMasterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (masterInput === MASTER_HQ_KEY) {
      // Autenticar como SuperAdmin Global
      loginDemo('SUPER_MASTER');
      navigate('/superadmin/dashboard');
    } else {
      setErrorMaster(true);
      setMasterInput('');
      // Efecto sacudida y error
      setTimeout(() => setErrorMaster(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] flex items-center justify-center p-6 relative overflow-hidden">
      {/* BOTÓN VOLVER TÉCNICO */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all border border-white/5 backdrop-blur-md group"
      >
        <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Volver al Inicio
      </button>

      {/* Background ambient lighting */}
      <div className="absolute inset-0">
         <div className="absolute top-[-20%] left-[-10%] size-[800px] bg-primary/10 rounded-full blur-[150px]"></div>
         <div className="absolute bottom-[-20%] right-[-10%] size-[800px] bg-indigo-900/10 rounded-full blur-[150px]"></div>
      </div>

      <div className={`relative w-full max-w-md bg-white/5 backdrop-blur-2xl rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden transition-all duration-300 ${errorMaster ? 'animate-shake border-red-500/50' : ''}`}>
        <div className="p-12 text-center space-y-10">
          <div className="space-y-4">
            <div className={`size-24 mx-auto rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${errorMaster ? 'bg-red-500 scale-90' : 'bg-primary shadow-primary/20 animate-pulse'}`}>
              <span className="material-symbols-outlined text-5xl text-white fill-1">
                {errorMaster ? 'lock_reset' : 'terminal'}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tighter">Control de Acceso HQ</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2">DISTRIMASTER ENTERPRISE v8.0</p>
            </div>
          </div>

          <form onSubmit={handleMasterSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block ml-4">Llave de Desafío Maestra</label>
              <input 
                ref={inputRef}
                type="password" 
                value={masterInput}
                onChange={(e) => setMasterInput(e.target.value)}
                className={`w-full h-20 bg-black/40 border-2 rounded-[24px] text-center text-3xl font-mono font-black tracking-[0.6em] focus:ring-0 transition-all ${errorMaster ? 'border-red-500 text-red-500' : 'border-white/10 focus:border-primary text-primary'}`}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full h-20 bg-white text-black rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
            >
              AUTENTICAR SISTEMA
            </button>
            
            <div className="pt-4 flex justify-end items-center px-2">
               <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest italic">Conexión Cifrada</span>
            </div>
          </form>
        </div>
        
        {errorMaster && (
          <div className="bg-red-500/90 text-white text-[10px] font-black text-center py-2 uppercase tracking-widest animate-pulse backdrop-blur-md">
            Llave Maestra Inválida - Acceso Denegado
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.3s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
};