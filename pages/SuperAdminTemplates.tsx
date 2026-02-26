
import React, { useState } from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { Link } from 'react-router';
import { useAuth } from '../components/AuthProvider';
import { emailService } from '../services/emailService';

interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  docUrl: string;
  tags: string[];
  status: 'CONNECTED' | 'DISCONNECTED';
}

const INITIAL_TEMPLATES: EmailTemplate[] = [
  { id: 'T1', name: 'Bienvenida Trial Directo', description: 'Código único para nuevos registros.', docUrl: 'https://docs.google.com/document/d/1fymVfGrbFZHNFdjD6Sd6QmYaCJReK_j1SvQzJWUL5_M/edit', tags: ['{{NOMBRE}}', '{{CODIGO}}'], status: 'CONNECTED' },
  { id: 'T2', name: 'Campaña Marketing', description: 'Invitación masiva desde ferias.', docUrl: 'https://docs.google.com/document/d/1f6OPDPY37nT7ZqcitRlJMxgVmTnUjZJIFfvwkAZxzuA/edit', tags: ['{{COUPON}}'], status: 'CONNECTED' }
];

export const SuperAdminTemplates: React.FC = () => {
  const { logout, user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(INITIAL_TEMPLATES[0]);

  return (
    <div className="min-h-screen bg-[#05070a] text-white font-sans flex overflow-hidden">
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 bg-[#080a0e] z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-white">dns</span>
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">MASTER <span className="text-primary">HQ</span></span>
        </div>
        <nav className="flex flex-col gap-2">
           <Link to="/superadmin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
             <span className="material-symbols-outlined text-sm">dashboard</span> Panel Global
           </Link>
           <Link to="/superadmin/templates" className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
             <span className="material-symbols-outlined text-sm">mail</span> Email Templates
           </Link>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#05070a]">
        <div className="max-w-6xl mx-auto space-y-12">
          <header className="flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">Email <span className="text-primary">Master</span></h1>
              <p className="text-slate-500 mt-4 text-[10px] font-black uppercase tracking-[0.4em]">Gestor de Plantillas Dinámicas</p>
            </div>
            <button className="h-14 px-8 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-xl">
               <span className="material-symbols-outlined text-sm">sync</span> Forzar Sincronización Google
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 space-y-4">
              {INITIAL_TEMPLATES.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSelectedTemplate(t)}
                  className={`w-full text-left p-6 rounded-[32px] border-2 transition-all ${selectedTemplate?.id === t.id ? 'bg-primary/10 border-primary shadow-lg' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                >
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">{t.id} • {t.status}</p>
                  <h3 className="text-sm font-black uppercase text-white truncate">{t.name}</h3>
                </button>
              ))}
            </div>

            <div className="lg:col-span-8">
               {selectedTemplate && (
                 <div className="bg-white/5 border border-white/10 rounded-[56px] p-12 space-y-10 animate-in fade-in duration-500">
                    <div className="flex justify-between items-start">
                       <div>
                          <h2 className="text-3xl font-black uppercase tracking-tight leading-none">{selectedTemplate.name}</h2>
                          <p className="text-slate-500 mt-3 text-sm font-medium">{selectedTemplate.description}</p>
                       </div>
                       <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2">
                          <span className="size-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></span>
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Enlazado</span>
                       </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-2xl min-h-[400px] text-black font-serif italic text-lg opacity-90">
                       {/* Simulación del previsualizador de Google Docs */}
                       <div className="bg-primary -m-10 mb-10 p-6 text-center text-white"><h1 className="text-2xl font-black uppercase">DISTRIMASTER HQ</h1></div>
                       <p className="mb-6">Hola [Nombre],</p>
                       <p>Tu acceso a la infraestructura inteligente está habilitado bajo la llave:</p>
                       <div className="bg-slate-900 text-white p-8 rounded-3xl text-center text-3xl font-mono font-black tracking-widest my-8">[CÓDIGO_ÚNICO]</div>
                       <p className="text-sm font-sans font-bold text-slate-500 uppercase">Seguridad verificada por Anycast Network</p>
                    </div>

                    <div className="flex gap-4">
                       <button onClick={() => window.open(selectedTemplate.docUrl)} className="flex-1 h-16 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary hover:text-white transition-all">
                          <img src="https://www.gstatic.com/images/branding/product/1x/docs_48dp.png" className="size-5" />
                          Editar en Google Docs
                       </button>
                       <button className="flex-1 h-16 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-primary/20">
                          <span className="material-symbols-outlined text-sm">send</span>
                          Enviar Prueba a mi Email
                       </button>
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
