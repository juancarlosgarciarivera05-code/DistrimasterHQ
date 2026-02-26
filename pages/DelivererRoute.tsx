
import React, { useState, useRef, useEffect } from 'react';
import { DeliveryStop } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { useAuth } from '../components/AuthProvider';
import { emailService } from '../services/emailService';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { useNavigate } from 'react-router';

// Componente interno para la Firma Electrónica
const SignaturePad: React.FC<{ onSave: (data: string) => void }> = ({ onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) onSave(canvas.toDataURL());
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      onSave('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Firma del Cliente</label>
        <button onClick={clear} className="text-[10px] font-black text-primary uppercase">Limpiar</button>
      </div>
      <canvas 
        ref={canvasRef}
        width={400}
        height={180}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-crosshair touch-none"
      />
    </div>
  );
};

export const DelivererRoute: React.FC = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stops, setStops] = useState<DeliveryStop[]>([
    { id: '1', client: 'Supermercado El Sol', address: 'Carrera 7 #45-12', orders: 1, amount: '$1,250,000', status: 'active', products: [{ ...MOCK_PRODUCTS[0], quantity: 2 }, { ...MOCK_PRODUCTS[1], quantity: 10 }] },
    { id: '2', client: 'Tienda La Esperanza', address: 'Calle 100 #15-30', orders: 1, amount: '$450,000', status: 'pending', products: [{ ...MOCK_PRODUCTS[2], quantity: 5 }] },
  ]);

  const [activeModal, setActiveModal] = useState<DeliveryStop | null>(null);
  const [modalStep, setModalStep] = useState<'info' | 'payment' | 'qr_company' | 'evidence' | 'success'>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState('');
  
  // Estados para la evidencia real
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const companyQr = localStorage.getItem(`qr_company_${company?.id}`);

  const handleStatusUpdate = (status: DeliveryStop['status']) => {
    if (!activeModal) return;
    if (!photoPreview || !signatureData) {
      return alert("Por favor complete la evidencia (Foto y Firma) para continuar.");
    }
    
    setIsProcessing(true);
    setTimeout(() => {
      const docId = `FE-${Math.floor(1000 + Math.random() * 9000)}`;
      setGeneratedDocId(docId);
      setStops(prev => prev.map(s => s.id === activeModal.id ? { ...s, status } : s));
      setIsProcessing(false);
      setModalStep('success');
    }, 1200);
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalStep('info');
    setPhotoPreview(null);
    setSignatureData(null);
  };

  const sendByWhatsApp = () => {
    if (!activeModal) return;
    const message = `🧾 *Factura Electrónica ${generatedDocId}*\n\nHola *${activeModal.client}*, hemos confirmado la entrega de tu pedido en *${company?.name}*.\n\n💰 *Monto Recaudado:* ${activeModal.amount}\n✅ *Estado:* Entregado y Pagado\n\n_Documento legal generado vía DistriMaster Enterprise_`;
    window.open(`https://wa.me/57?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-background-light dark:bg-background-dark font-sans animate-in fade-in duration-500">
      
      {/* Lista de Paradas */}
      <aside className="w-full md:w-[420px] bg-white dark:bg-surface-dark border-r border-slate-100 dark:border-slate-800 flex flex-col h-full z-10 shadow-lg">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50">
           <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Plan de Entrega</h2>
           <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-1">Sincronizado con Almacén</p>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
           {stops.map((stop, i) => (
             <div 
               key={stop.id} 
               onClick={() => (stop.status === 'pending' || stop.status === 'active') && setActiveModal(stop)}
               className={`relative flex gap-4 p-5 rounded-[32px] border transition-all cursor-pointer ${
                 stop.status === 'active' 
                   ? 'bg-white dark:bg-slate-800 border-primary shadow-xl ring-2 ring-primary/10' 
                   : stop.status === 'delivered' 
                     ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 opacity-60' 
                     : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'
               }`}
             >
                {i < stops.length - 1 && (
                  <div className="absolute left-10 top-16 bottom-[-24px] w-0.5 bg-slate-100 dark:bg-slate-700 z-0"></div>
                )}
                <div className={`relative z-10 size-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 shadow-sm ${
                  stop.status === 'delivered' ? 'bg-emerald-500 text-white' : 
                  stop.status === 'active' ? 'bg-primary text-white animate-pulse' : 
                  'bg-slate-100 dark:bg-slate-700 text-slate-400'
                }`}>
                   {stop.status === 'delivered' ? <span className="material-symbols-outlined text-[18px]">done</span> : i + 1}
                </div>
                <div className="flex-1 min-w-0">
                   <div className="flex justify-between items-start">
                      <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm truncate">{stop.client}</h4>
                      <span className="text-[10px] font-black text-primary">{stop.amount}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">{stop.address}</p>
                </div>
             </div>
           ))}
        </div>
      </aside>

      <section className="hidden md:block flex-1 relative bg-slate-100 dark:bg-[#0a0c10] overflow-hidden">
        <div className="absolute inset-0 opacity-40 grayscale pointer-events-none" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-o7NNIVilqcRptVNy7TdKCBUEj_7PUtP7GLWw3gzcxGsncdGDmZQCgM9a9bEjmL5WqHopROwcW_TH5k38ERGZ2xM6wRFBpmnkBLhoHUhcGV9e9P9AVYSv7oyGOFWXr8xZmyFKqR78qAk2sH6Kx1x_tOtg4uhkU3DiJm03AEGguG_1AIObLWSPtnlCnhrbVyys1SKpvIkkQWEhkYnwHpKlg5Fsd2wqhxhM_CtviU5zFv9bJ1z92pGGZ4o8pdlEoLa16ULhSFm3zjc4')", backgroundSize: 'cover' }}></div>
      </section>

      {/* Modal de Entrega con Firma y Cámara Reales */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeModal}></div>
           <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-[40px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col min-h-[400px]">
              
              <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/50">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight truncate pr-4">{activeModal.client}</h3>
                <button onClick={closeModal} className="text-slate-400"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="p-8 space-y-8 overflow-y-auto max-h-[75vh] custom-scrollbar">
                {modalStep === 'info' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Productos</p>
                       <div className="space-y-2">
                          {activeModal.products?.map((p, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm font-bold">
                               <span className="text-slate-600 dark:text-slate-300">{p.quantity}x {p.name}</span>
                               <span className="text-slate-900 dark:text-white font-black">${(p.price * p.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <button onClick={() => setModalStep('payment')} className="w-full py-5 bg-primary text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">Confirmar y Cobrar</button>
                  </div>
                )}

                {modalStep === 'payment' && (
                  <div className="space-y-4 animate-in fade-in">
                    <button onClick={() => setModalStep('evidence')} className="w-full py-5 bg-slate-50 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3 text-slate-700"><span className="material-symbols-outlined">payments</span> Efectivo</button>
                    <button onClick={() => companyQr ? setModalStep('qr_company') : alert("Sin QR")} className="w-full py-5 bg-emerald-50 text-emerald-700 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-3"><span className="material-symbols-outlined">qr_code_2</span> Transferencia</button>
                  </div>
                )}

                {modalStep === 'qr_company' && (
                  <div className="text-center space-y-6">
                    <div className="bg-white p-6 rounded-[48px] shadow-2xl border-4 border-primary/10 max-w-[280px] mx-auto">
                       <img src={companyQr!} className="w-full h-full object-contain" alt="QR Recaudo" />
                    </div>
                    <button onClick={() => setModalStep('evidence')} className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Pago Confirmado</button>
                  </div>
                )}

                {modalStep === 'evidence' && (
                  <div className="space-y-8 animate-in slide-in-from-right">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Evidencia Fotográfica</label>
                      <input type="file" ref={fileInputRef} onChange={handlePhotoCapture} className="hidden" accept="image/*" capture="environment" />
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="h-48 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 overflow-hidden relative group cursor-pointer"
                      >
                         {photoPreview ? (
                           <img src={photoPreview} className="w-full h-full object-cover" />
                         ) : (
                           <>
                             <span className="material-symbols-outlined text-4xl text-slate-300">photo_camera</span>
                             <p className="text-[10px] font-black text-slate-400 uppercase mt-2">Tomar Foto Entrega</p>
                           </>
                         )}
                      </div>
                    </div>

                    <SignaturePad onSave={setSignatureData} />

                    <button 
                      disabled={isProcessing}
                      onClick={() => handleStatusUpdate('delivered')} 
                      className="w-full py-6 bg-emerald-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {isProcessing ? <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Transmitir Soporte Legal <span className="material-symbols-outlined">verified</span></>}
                    </button>
                  </div>
                )}

                {modalStep === 'success' && (
                  <div className="text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="size-20 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                       <span className="material-symbols-outlined text-4xl">check_circle</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase leading-none">Entrega Exitosa</h2>
                    <div className="p-4 bg-white rounded-2xl shadow-xl w-fit mx-auto">
                       <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedDocId}`} className="size-24" alt="QR Digital" />
                    </div>
                    <button onClick={sendByWhatsApp} className="w-full h-16 bg-[#25D366] text-white rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-4">
                       <span className="material-symbols-outlined">send</span> WhatsApp
                    </button>
                    <button onClick={closeModal} className="w-full py-2 text-[10px] font-black text-slate-400 uppercase hover:text-slate-900">Continuar Ruta</button>
                  </div>
                )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
