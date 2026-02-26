import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { emailService } from '../services/emailService';
import { subscriptionLifecycleService } from '../services/subscriptionLifecycleService';
import { GoogleGenAI, Modality } from "@google/genai";

const ENGINES = [
  { id: 'ADMIN', name: 'Admin Global', tagline: 'Control Estratégico 360', desc: 'Gestión corporativa centralizada para gerentes y dueños de negocio.', icon: 'admin_panel_settings' },
  { id: 'SUPERVISOR', name: 'Supervisor', tagline: 'Mando Táctico Live', desc: 'Monitoreo de tropa en tiempo real por GPS y auditoría de zonas.', icon: 'supervisor_account' },
  { id: 'BODEGA', name: 'Bodega Central', tagline: 'Logística de Alta Precisión', desc: 'Gestión de cargues, Kardex maestro y liquidación QR de rutas.', icon: 'inventory_2' },
  { id: 'VENDEDOR', name: 'Vendedor SFA', tagline: 'Fuerza de Ventas Pro', desc: 'Pedidos offline, catálogo digital y gestión de clientes en campo.', icon: 'storefront' },
  { id: 'ENTREGADOR', name: 'Entregador', tagline: 'Eficiencia Última Milla', desc: 'Evidencia de entrega, recaudo digital y firmas electrónicas.', icon: 'local_shipping' },
  { id: 'IA', name: 'Cerebro IA', tagline: 'Inteligencia Predictiva', desc: 'Potenciado por Gemini 3 Pro para prevención de agotados y optimización.', icon: 'auto_awesome' }
];

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const SuperAdminMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'VOICE' | 'TRIAL' | 'SENTINEL'>('TRIAL');
  const [selectedEngine, setSelectedEngine] = useState(ENGINES[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const [prospectName, setProspectName] = useState('');
  const [prospectEmail, setProspectEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGeneratedCode, setLastGeneratedCode] = useState<string | null>(null);
  
  const [isSentinelRunning, setIsSentinelRunning] = useState(false);
  const [sentinelResults, setSentinelResults] = useState<any>(null);

  const handleGenerateTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prospectName || !prospectEmail || !companyName) return alert("Complete todos los campos.");
    
    setIsGenerating(true);
    const code = `DM90-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      const result = await emailService.sendTrialInvitation(prospectEmail, prospectName, companyName, code);
      if (result.success) {
        setLastGeneratedCode(code);
        alert(`¡INFRAESTRUCTURA ENTERPRISE PROVISIONADA!\n\nSe ha notificado a ${prospectName} con su llave exclusiva por 90 días.`);
        setProspectName('');
        setProspectEmail('');
        setCompanyName('');
      } else { 
        alert("El correo no pudo ser entregado, pero el código fue generado."); 
      }
    } catch (err) { 
      alert("Fallo crítico en el enlace Anycast."); 
    } finally { 
      setIsGenerating(false); 
    }
  };

  const handleRunSentinel = async () => {
    setIsSentinelRunning(true);
    setSentinelResults(null);
    try {
      const results = await subscriptionLifecycleService.checkAllExpirations();
      setSentinelResults(results);
    } catch (error) {
      alert("Fallo al ejecutar el motor Sentinel.");
    } finally {
      setIsSentinelRunning(false);
    }
  };

  const handleSpeak = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Actúa como narrador premium. Describe: "${selectedEngine.name}. ${selectedEngine.tagline}. ${selectedEngine.desc}"`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = ctx;
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsSpeaking(false);
        source.start();
      } else { setIsSpeaking(false); }
    } catch (error) { setIsSpeaking(false); }
  };

  return (
    <div className="flex h-screen w-full bg-[#05070a] text-white font-sans flex overflow-hidden">
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 shrink-0 bg-[#080a0e] z-50">
        <div className="flex items-center gap-4 mb-12">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-2xl">
            <span className="material-symbols-outlined text-white">dns</span>
          </div>
          <span className="text-xl font-black italic uppercase tracking-tighter">MASTER <span className="text-primary">HQ</span></span>
        </div>
        <nav className="flex flex-col gap-2">
           <Link to="/superadmin/dashboard" className="flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest transition-all">
             <span className="material-symbols-outlined text-sm">dashboard</span> Cockpit Global
           </Link>
           <Link to="/superadmin/marketing" className="flex items-center gap-4 p-4 rounded-2xl bg-primary text-white font-black uppercase text-[10px] tracking-widest shadow-lg">
             <span className="material-symbols-outlined text-sm">rocket_launch</span> Growth Studio
           </Link>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col p-12 relative overflow-hidden bg-[#05070a] custom-scrollbar overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full space-y-12 relative z-10 pb-20">
          <header className="flex justify-between items-end">
             <div className="space-y-4">
                <h1 className="text-6xl font-black uppercase tracking-tighter italic">Growth <span className="text-primary">Studio</span></h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Aprovisionamiento Enterprise & Automatización Lifecycle</p>
             </div>
             <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button onClick={() => setActiveTab('TRIAL')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'TRIAL' ? 'bg-primary text-white shadow-xl' : 'text-slate-500'}`}>Trial</button>
                <button onClick={() => setActiveTab('SENTINEL')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SENTINEL' ? 'bg-primary text-white shadow-xl' : 'text-slate-500'}`}>Sentinel</button>
                <button onClick={() => setActiveTab('VOICE')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'VOICE' ? 'bg-primary text-white shadow-xl' : 'text-slate-500'}`}>Voz IA</button>
             </div>
          </header>

          {activeTab === 'TRIAL' && (
            <div className="space-y-12 animate-in fade-in duration-500">
               <section className="bg-white/5 border border-white/10 p-12 rounded-[64px] backdrop-blur-3xl space-y-10">
                  <div className="space-y-2">
                     <h2 className="text-4xl font-black uppercase tracking-tight italic leading-none">Provisionar <span className="text-primary">Plan Piloto</span></h2>
                     <p className="text-slate-400 text-sm font-medium">Asignación directa de 90 días Enterprise para clientes calificados.</p>
                  </div>
                  <form onSubmit={handleGenerateTrial} className="space-y-8">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Contacto Principal</label>
                           <input required className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none text-white transition-all" placeholder="Nombre completo" value={prospectName} onChange={e => setProspectName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Organización</label>
                           <input required className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none text-white transition-all" placeholder="Nombre de la empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 text-primary">Email de Activación</label>
                           <input required type="email" className="w-full h-16 bg-primary/5 border-2 border-primary/20 rounded-2xl px-6 text-sm font-bold focus:border-primary outline-none text-white transition-all" placeholder="correo@empresa.com" value={prospectEmail} onChange={e => setProspectEmail(e.target.value)} />
                        </div>
                     </div>
                     <div className="flex gap-6 items-center">
                        <button type="submit" disabled={isGenerating} className="flex-1 h-20 bg-primary text-white rounded-[32px] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
                           {isGenerating ? <div className="size-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div> : <>PROVISIONAR Y NOTIFICAR <span className="material-symbols-outlined">rocket_launch</span></>}
                        </button>
                        {lastGeneratedCode && (
                          <div className="bg-emerald-500/10 border border-emerald-500/20 px-10 h-20 rounded-[32px] flex flex-col justify-center text-center">
                             <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Código Activo</p>
                             <p className="text-xl font-black text-white tracking-widest">{lastGeneratedCode}</p>
                          </div>
                        )}
                     </div>
                  </form>
               </section>
            </div>
          )}

          {activeTab === 'SENTINEL' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
               <section className="bg-white/5 border border-white/10 p-12 rounded-[64px] backdrop-blur-3xl space-y-10">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                       <h2 className="text-4xl font-black uppercase tracking-tight italic leading-none">Motor <span className="text-primary">Sentinel</span></h2>
                       <p className="text-slate-400 text-sm font-medium">Supervisión automática de expiraciones y cumplimiento de pagos.</p>
                    </div>
                    <button 
                      onClick={handleRunSentinel}
                      disabled={isSentinelRunning}
                      className="h-16 px-10 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-primary hover:text-white transition-all disabled:opacity-50 shadow-xl"
                    >
                      <span className={`material-symbols-outlined ${isSentinelRunning ? 'animate-spin' : ''}`}>sync</span>
                      {isSentinelRunning ? 'Barriendo Nodos...' : 'Ejecutar Mantenimiento Manual'}
                    </button>
                  </div>

                  {sentinelResults ? (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-in zoom-in">
                       <div className="p-8 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">Avisos 7D</p>
                          <p className="text-4xl font-black">{sentinelResults.alerts7d}</p>
                       </div>
                       <div className="p-8 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Críticos 3D</p>
                          <p className="text-4xl font-black">{sentinelResults.alerts3d}</p>
                       </div>
                       <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-2">Suspensiones</p>
                          <p className="text-4xl font-black">{sentinelResults.expired}</p>
                       </div>
                       <div className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Errores</p>
                          <p className="text-4xl font-black">{sentinelResults.errors}</p>
                       </div>
                    </div>
                  ) : (
                    <div className="py-20 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-slate-500 opacity-40">
                       <span className="material-symbols-outlined text-6xl">shield_moon</span>
                       <p className="text-xs font-black uppercase tracking-widest mt-4">Motor en Standby</p>
                    </div>
                  )}

                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-3xl flex items-center gap-4">
                     <span className="material-symbols-outlined text-primary">info</span>
                     <p className="text-[10px] text-slate-400 font-bold uppercase leading-relaxed">
                        Este motor se ejecuta automáticamente cada 24h vía Supabase Cron. El botón manual se reserva para auditorías técnicas o forzar suspensiones tras impagos confirmados.
                     </p>
                  </div>
               </section>
            </div>
          )}

          {activeTab === 'VOICE' && (
            <div className="space-y-12 animate-in slide-in-from-right duration-500">
               <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {ENGINES.map(e => (
                    <button key={e.id} onClick={() => setSelectedEngine(e)} className={`p-8 rounded-[40px] border-2 transition-all flex flex-col items-center gap-4 group ${selectedEngine.id === e.id ? 'bg-primary/10 border-primary shadow-2xl scale-105' : 'bg-white/5 border-white/5 hover:border-white/20'}`}>
                      <div className={`size-16 rounded-2xl flex items-center justify-center shadow-inner transition-all ${selectedEngine.id === e.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'}`}>
                         <span className="material-symbols-outlined text-3xl">{e.icon}</span>
                      </div>
                      <p className="text-[11px] font-black uppercase tracking-widest">{e.name}</p>
                    </button>
                  ))}
               </div>
               <div className="p-12 bg-white/5 rounded-[64px] border border-white/10 space-y-8 backdrop-blur-3xl text-center">
                  <h2 className="text-4xl font-black italic text-primary uppercase tracking-tight">{selectedEngine.tagline}</h2>
                  <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-2xl mx-auto italic">"{selectedEngine.desc}"</p>
                  <button onClick={handleSpeak} disabled={isSpeaking} className="h-20 px-16 bg-white text-black rounded-[28px] font-black text-xs uppercase tracking-widest flex items-center gap-4 mx-auto hover:bg-primary hover:text-white transition-all disabled:opacity-50">
                    <span className={`material-symbols-outlined text-2xl ${isSpeaking ? 'animate-pulse' : ''}`}>{isSpeaking ? 'graphic_eq' : 'volume_up'}</span>
                    {isSpeaking ? 'Generando Narración...' : 'Escuchar Presentación IA'}
                  </button>
               </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};