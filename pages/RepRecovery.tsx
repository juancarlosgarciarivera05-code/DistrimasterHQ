
import React, { useState } from 'react';

interface FailedDelivery {
  id: string;
  client: string;
  reason: string;
  amount: number;
  vehicle: string;
  phone: string;
  status: 'pendiente' | 'rescatado' | 'devuelto_a_bodega';
}

const MOCK_FAILED: FailedDelivery[] = [
  { id: 'ORD-882', client: 'Ferretería El Martillo', reason: 'Comercio Cerrado', amount: 1250000, vehicle: 'BGT-123', phone: '3102223344', status: 'pendiente' },
  { id: 'ORD-901', client: 'Depósito Central', reason: 'Pedido Rechazado (Precio)', amount: 450000, vehicle: 'FVR-900', phone: '3005556677', status: 'pendiente' },
];

export const RepRecovery: React.FC = () => {
  const [failed, setFailed] = useState(MOCK_FAILED);

  const handleAction = (id: string, newStatus: 'rescatado' | 'devuelto_a_bodega') => {
    setFailed(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    alert(newStatus === 'rescatado' ? "¡Venta Rescatada! Se notificó al chofer para que re-intente la entrega." : "Venta confirmada como devolución.");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-background-dark font-sans overflow-hidden">
      <header className="bg-white dark:bg-surface-dark p-8 border-b border-slate-100 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Bandeja de Rescate</h1>
          <p className="text-slate-500 text-sm font-medium">Pedidos rechazados hoy que requieren tu intervención comercial.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-6">
          {failed.filter(f => f.status === 'pendiente').map(item => (
            <div key={item.id} className="bg-white dark:bg-surface-dark rounded-[32px] p-8 border-2 border-red-100 shadow-xl shadow-red-500/5 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-[10px] font-black uppercase rounded-full">Alerta de Rechazo</span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 uppercase">{item.client}</h3>
                </div>
                <p className="text-xl font-black text-primary">${item.amount.toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Motivo Reportado</p>
                  <p className="text-sm font-bold text-red-500">{item.reason}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">En Vehículo</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.vehicle}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <a href={`tel:${item.phone}`} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">call</span> Llamar Cliente
                </a>
                <button onClick={() => handleAction(item.id, 'rescatado')} className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-blue-600 transition-all">
                  Confirmar Rescate
                </button>
                <button onClick={() => handleAction(item.id, 'devuelto_a_bodega')} className="px-6 py-4 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all">
                  No se pudo
                </button>
              </div>
            </div>
          ))}

          {failed.filter(f => f.status === 'pendiente').length === 0 && (
            <div className="text-center py-20">
               <div className="size-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="material-symbols-outlined text-4xl">check_circle</span>
               </div>
               <h2 className="text-xl font-black text-slate-900 uppercase">Sin novedades pendientes</h2>
               <p className="text-slate-500 font-medium">Todas tus ventas están en camino o han sido gestionadas.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
