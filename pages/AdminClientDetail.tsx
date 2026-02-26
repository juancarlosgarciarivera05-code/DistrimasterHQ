import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider.tsx';

interface Order {
  id: string;
  date: string;
  total: string;
  status: 'En Proceso' | 'Entregado' | 'Cancelado';
}

const MOCK_ORDERS: Order[] = [
  { id: '#ORD-4492', date: '24 Oct, 2023', total: '$3,450.00', status: 'En Proceso' },
  { id: '#ORD-4410', date: '10 Oct, 2023', total: '$12,800.00', status: 'Entregado' },
  { id: '#ORD-4305', date: '28 Sep, 2023', total: '$5,220.00', status: 'Entregado' },
  { id: '#ORD-4299', date: '15 Sep, 2023', total: '$980.50', status: 'Cancelado' },
  { id: '#ORD-4112', date: '02 Sep, 2023', total: '$15,400.00', status: 'Entregado' },
];

export const AdminClientDetail: React.FC = () => {
  const navigate = useNavigate();
  const { company } = useAuth();
  const [showQrModal, setShowQrModal] = useState(false);

  const storeUrl = `${window.location.origin}/#/store?cid=CUST-ACME-001&coid=${company?.id}`;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f9fafb] dark:bg-[#080a0e] font-sans">
      <header className="h-20 flex items-center justify-between px-8 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-gray-800 shrink-0 z-10">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate(-1)} className="size-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary transition-all">
             <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex items-center gap-3">
             <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">AC</div>
             <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Acme Corp</h2>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-3 space-y-8">
             <section className="bg-white dark:bg-surface-dark rounded-[48px] border border-slate-100 dark:border-gray-800 shadow-sm p-8 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary to-blue-400 opacity-10"></div>
                <div className="relative z-10 flex flex-col items-center text-center">
                   <div className="size-24 bg-white dark:bg-slate-800 rounded-[32px] shadow-xl flex items-center justify-center text-3xl font-black text-primary border-4 border-white dark:border-slate-900 mb-6">AC</div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Acme Corp</h3>
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-lg uppercase tracking-widest mt-3 border border-emerald-100">Cliente VIP</span>
                </div>

                {company?.plan === 'Enterprise' && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <button 
                      onClick={() => setShowQrModal(true)}
                      className="w-full py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2 hover:scale-105 transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">qr_code_scanner</span>
                      Generar QR Autoservicio
                    </button>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center mt-3">Exclusivo Plan Enterprise</p>
                  </div>
                )}

                <div className="mt-8 space-y-6 pt-8 border-t border-slate-50 dark:border-white/5">
                   <div className="space-y-4">
                      <div className="flex items-start gap-4">
                         <span className="material-symbols-outlined text-slate-300">location_on</span>
                         <p className="text-xs font-bold text-slate-500 leading-relaxed">Av. Reforma 222, Piso 10, CDMX, CP 06600</p>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className="material-symbols-outlined text-slate-300">call</span>
                         <p className="text-xs font-bold text-primary">+52 55 1234 5678</p>
                      </div>
                   </div>
                </div>
             </section>
          </div>

          <div className="lg:col-span-6 space-y-8">
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { label: 'Ventas YTD', val: '$124,500', trend: '+12%', color: 'primary' },
                  { label: 'Saldo Pendiente', val: '$8,250', trend: '1 Mora', color: 'amber-500' },
                  { label: 'Visitas Mes', val: '12/15', trend: '85% Efec.', color: 'emerald-500' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-100 dark:border-gray-800 shadow-sm">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                     <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-2 tracking-tighter">{stat.val}</h4>
                     <p className={`text-[10px] font-black uppercase mt-2 text-${stat.color}`}>{stat.trend}</p>
                  </div>
                ))}
             </div>

             <section className="bg-white dark:bg-surface-dark rounded-[48px] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-8 border-b border-slate-50 dark:border-white/5 flex gap-8">
                   <button className="text-[11px] font-black uppercase tracking-widest text-primary border-b-2 border-primary pb-2">Historial de Pedidos</button>
                   <button className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all pb-2">Facturas</button>
                </div>
                <div className="overflow-x-auto flex-1">
                   <table className="w-full text-left">
                      <thead>
                         <tr className="bg-slate-50/50 dark:bg-slate-900/50 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-5">Orden ID</th>
                            <th className="px-8 py-5">Fecha</th>
                            <th className="px-8 py-5 text-right">Monto</th>
                            <th className="px-8 py-5 text-center">Estado</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                         {MOCK_ORDERS.map(o => (
                           <tr key={o.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="px-8 py-5 font-black text-slate-900 dark:text-white text-sm">{o.id}</td>
                              <td className="px-8 py-5 text-xs font-bold text-slate-500">{o.date}</td>
                              <td className="px-8 py-5 text-right font-black text-slate-900 dark:text-white text-sm">{o.total}</td>
                              <td className="px-8 py-5 text-center">
                                 <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                   o.status === 'Entregado' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                                 }`}>
                                    {o.status}
                                 </span>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </section>
          </div>

          <div className="lg:col-span-3">
             <section className="bg-white dark:bg-surface-dark rounded-[48px] border border-slate-100 dark:border-gray-800 shadow-sm h-full flex flex-col">
                <div className="p-8 border-b border-slate-50 dark:border-white/5">
                   <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Bitácora de Cuenta</h3>
                </div>
                <div className="p-8 space-y-10 overflow-y-auto flex-1 custom-scrollbar relative">
                   <div className="absolute left-[45px] top-10 bottom-10 w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                   {[
                     { icon: 'qr_code_2', title: 'QR Escaneado', time: '12:30 PM', color: 'bg-primary', desc: 'El cliente está navegando la tienda digital.' },
                     { icon: 'shopping_cart', title: 'Nuevo Pedido QR', time: '11:15 AM', color: 'bg-emerald-500', desc: 'Orden en espera de aprobación por Supervisor.' },
                   ].map((ev, idx) => (
                     <div key={idx} className="relative flex gap-6 items-start">
                        <div className={`size-10 rounded-2xl ${ev.color} text-white flex items-center justify-center shrink-0 z-10 shadow-lg`}>
                           <span className="material-symbols-outlined text-lg">{ev.icon}</span>
                        </div>
                        <div className="min-w-0">
                           <p className="font-black text-slate-900 dark:text-white uppercase text-[11px] leading-none">{ev.title}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{ev.time}</p>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{ev.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>
        </div>
      </div>

      {showQrModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowQrModal(false)}></div>
           <div className="relative bg-white rounded-[56px] p-12 w-full max-w-md text-center space-y-10 shadow-2xl animate-in zoom-in duration-300">
              <div className="space-y-3">
                 <h3 className="text-3xl font-black uppercase text-slate-900 italic">QR Autoservicio</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tienda Acme Corp</p>
              </div>
              <div className="p-10 bg-slate-50 rounded-[48px] border-2 border-dashed border-slate-200 flex flex-col items-center">
                 <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(storeUrl)}`} 
                  alt="QR Tienda" 
                  className="size-56"
                 />
                 <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-8 bg-white px-4 py-2 rounded-full border">Escanea para Pedir</p>
              </div>
              <div className="space-y-4">
                 <button onClick={() => window.open(storeUrl, '_blank')} className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl">Imprimir Sticker QR</button>
                 <button onClick={() => setShowQrModal(false)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:underline">Cerrar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};