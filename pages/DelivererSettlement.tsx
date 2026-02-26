
import React, { useState } from 'react';

export const DelivererSettlement: React.FC = () => {
  const [showQR, setShowQR] = useState(false);
  const cashTotal = 2450000;
  const transferTotal = 890500;
  
  const returnItems = [
    { name: 'Taladro Percutor 20V', qty: 2, sku: 'DW-998-X' },
    { name: 'Casco Industrial', qty: 5, sku: '3M-H-500' },
  ];

  return (
    <div className="p-6 pb-24 flex flex-col gap-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Mi Liquidación</h2>
        <p className="text-[10px] text-primary font-bold uppercase tracking-[0.2em] mt-2">ID Manifiesto: #MAN-4920</p>
      </div>

      {!showQR ? (
        <>
          <section className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group border border-white/5">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[100px]">payments</span>
            </div>
            <div className="relative z-10 space-y-8">
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Efectivo en Caja</p>
                   <p className="text-3xl font-black text-primary">${cashTotal.toLocaleString('es-CO')}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transferencias</p>
                   <p className="text-xl font-black">${transferTotal.toLocaleString('es-CO')}</p>
                 </div>
               </div>
               <div className="h-px bg-white/10 w-full"></div>
               <div className="flex justify-between items-center">
                 <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Recaudado</p>
                 <p className="text-2xl font-black">${(cashTotal + transferTotal).toLocaleString('es-CO')}</p>
               </div>
            </div>
          </section>

          <section className="space-y-4">
             <div className="flex items-center gap-3 ml-1">
                <span className="material-symbols-outlined text-red-500">inventory_2</span>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Carga de Retorno (No Entregado)</h3>
             </div>
             <div className="space-y-3">
                {returnItems.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-surface-dark p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm">
                     <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{item.sku}</p>
                     </div>
                     <div className="flex flex-col items-center gap-1">
                        <span className="text-xl font-black text-primary">{item.qty}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase">Unidades</span>
                     </div>
                  </div>
                ))}
             </div>
          </section>

          <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[32px] border-2 border-dashed border-amber-200 dark:border-amber-900/30 text-center">
             <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed uppercase tracking-widest">
                Atención: Entrega tu efectivo al Jefe de Bodega y escanea el QR para cerrar tu ruta permanentemente.
             </p>
          </div>

          <button 
            onClick={() => setShowQR(true)}
            className="w-full py-6 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
             <span className="material-symbols-outlined">qr_code_scanner</span>
             Generar QR de Cierre
          </button>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in zoom-in">
           <div className="text-center space-y-2">
              <h3 className="text-2xl font-black uppercase text-slate-900 dark:text-white">QR de Liquidación</h3>
              <p className="text-sm font-medium text-slate-500">Muestra este código al Jefe de Bodega</p>
           </div>

           <div className="p-8 bg-white rounded-[48px] shadow-2xl border-4 border-primary/20 relative">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DM-CLOSURE-MAN4920-CASH2450000" 
                alt="QR Cierre"
                className="size-64 object-contain"
              />
              <div className="absolute -top-3 -right-3 size-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg">
                <span className="material-symbols-outlined animate-spin">sync</span>
              </div>
           </div>

           <div className="w-full space-y-3">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Operación</span>
                 <span className="text-xs font-black text-slate-900 dark:text-white">MAN-4920</span>
              </div>
              <button 
                onClick={() => setShowQR(false)}
                className="w-full py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors"
              >
                 Cancelar Cierre
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
