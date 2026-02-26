import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { visitService } from '../services/api.ts';
import { useAuth } from '../components/AuthProvider.tsx';

export const RepVisitExecution: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, company } = useAuth();
  
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('customerName');
  const operationMode = searchParams.get('mode') || 'PREVENTA';

  const [step, setStep] = useState(1);
  const [visitId, setVisitId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsLocked, setGpsLocked] = useState(false);
  const [shelfNotes, setShelfNotes] = useState('');

  const handleCheckIn = async () => {
    if (!customerId || !user?.id || !company?.id) return;
    
    setIsSubmitting(true);
    setTimeout(async () => {
      try {
        const visit = await visitService.startVisit({
          customer_id: customerId,
          rep_id: user.id,
          company_id: company.id
        });
        setVisitId(visit.id);
        setGpsLocked(true);
        setTimeout(() => setStep(2), 1500);
      } catch (err) {
        alert("Error al registrar entrada.");
      } finally {
        setIsSubmitting(false);
      }
    }, 2000);
  };

  const handleFinishVisit = async (outcome: 'COMPLETED' | 'NO_SALE') => {
    if (!visitId) return;
    
    setIsSubmitting(true);
    try {
      await visitService.endVisit(visitId, outcome, shelfNotes);
      alert(outcome === 'COMPLETED' ? "Visita finalizada con éxito." : "Visita cerrada sin venta.");
      navigate('/rep/route');
    } catch (err) {
      alert("Error al cerrar visita.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark font-sans overflow-hidden">
      <header className="bg-white dark:bg-surface-dark border-b border-slate-100 p-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
           <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-2xl">location_on</span>
           </div>
           <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white truncate max-w-[200px] md:max-w-md">{customerName || 'Ejecución de Visita'}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className={`size-1.5 rounded-full ${gpsLocked ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{gpsLocked ? 'Posición Validada' : 'Validando Proximidad...'}</p>
              </div>
           </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
        <div className="max-w-lg mx-auto flex flex-col gap-8 relative z-10">
          
          <div className="flex items-center gap-3 px-2">
             {[1, 2, 3].map((s) => (
                <div key={s} className="flex-1 flex flex-col gap-2">
                   <div className={`h-1.5 rounded-full transition-all ${step >= s ? 'bg-primary shadow-[0_0_8px_rgba(19,127,236,0.5)]' : 'bg-slate-200'}`}></div>
                   <span className={`text-[9px] font-black uppercase tracking-widest text-center ${step === s ? 'text-primary' : 'text-slate-400'}`}>
                      {s === 1 ? 'Llegada' : s === 2 ? 'Audit' : 'Gestión'}
                   </span>
                </div>
             ))}
          </div>

          {step === 1 && (
            <section className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-xl border border-slate-100 animate-in slide-in-from-bottom-4">
               <div className="text-center space-y-6">
                  <div className="size-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
                     <span className="material-symbols-outlined text-4xl text-slate-300">hub</span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">Registro de Arribo</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                     El sistema validará su posición GPS para habilitar la toma de pedidos en este comercio.
                  </p>
                  <button 
                    disabled={isSubmitting}
                    onClick={handleCheckIn}
                    className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-4 transition-all"
                  >
                    {isSubmitting ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Hacer Check-In <span className="material-symbols-outlined">how_to_reg</span></>}
                  </button>
               </div>
            </section>
          )}

          {step === 2 && (
            <section className="bg-white dark:bg-surface-dark rounded-[40px] p-10 shadow-xl border border-slate-100 animate-in slide-in-from-right">
               <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-black uppercase text-slate-900 dark:text-white italic">Inventario Anaquel</h3>
                    <span className="material-symbols-outlined text-primary">inventory</span>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Observaciones de Exhibición</label>
                     <textarea 
                        className="w-full h-40 bg-slate-50 dark:bg-slate-900 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder="Registra faltantes o novedades..."
                        value={shelfNotes}
                        onChange={(e) => setShelfNotes(e.target.value)}
                     />
                  </div>
                  <button onClick={() => setStep(3)} className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-4">
                    Continuar a Gestión <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
               </div>
            </section>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 gap-6 animate-in zoom-in duration-300">
               <button 
                 onClick={() => navigate(`/rep/orders?mode=${operationMode}&customerName=${encodeURIComponent(customerName || '')}`)}
                 className="bg-primary p-10 rounded-[48px] text-white text-left shadow-2xl shadow-primary/20 relative overflow-hidden group"
               >
                  <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform">shopping_cart</span>
                  <div className="relative z-10 space-y-2">
                     <h3 className="text-3xl font-black uppercase italic">Toma de Pedido</h3>
                     <p className="text-white/70 text-xs font-medium uppercase tracking-widest">Registrar nueva venta</p>
                  </div>
               </button>

               <button 
                 onClick={() => handleFinishVisit('NO_SALE')}
                 disabled={isSubmitting}
                 className="bg-white dark:bg-surface-dark p-10 rounded-[48px] text-left border-2 border-slate-100 dark:border-slate-800 group"
               >
                  <div className="flex justify-between items-center">
                     <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase text-slate-400 italic">Cerrar sin Venta</h3>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Continuar a siguiente parada</p>
                     </div>
                     <span className="material-symbols-outlined text-slate-300 group-hover:text-red-500 transition-colors">cancel</span>
                  </div>
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};