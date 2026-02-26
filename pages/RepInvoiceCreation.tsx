
import React, { useState, useEffect } from 'react';
import { emailService } from '../services/emailService.ts';
import { useAuth } from '../components/AuthProvider.tsx';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { useSearchParams } from 'react-router';

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
}

const INITIAL_ITEMS: InvoiceItem[] = [
  { id: '1', name: 'Taladro Percutor 20V', description: 'Garantía extendida 1 año', quantity: 1, price: 780000, discount: 0 },
  { id: '2', name: 'Kit Brocas Cobalto', description: 'Set x 12 unidades', quantity: 2, price: 125000, discount: 5 },
];

export const RepInvoiceCreation: React.FC = () => {
  const { company } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<InvoiceItem[]>(INITIAL_ITEMS);
  const [isEmitting, setIsEmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedDocId, setGeneratedDocId] = useState('');
  
  const operationMode = searchParams.get('mode') || 'PREVENTA';
  const isPreventa = operationMode === 'PREVENTA';

  const [clientData, setClientData] = useState({
    name: searchParams.get('customerName') || 'Ferretería El Clavo S.A.S.',
    nit: '900.123.456-1',
    email: '',
    phone: ''
  });

  const updateQty = (id: string, delta: number) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
    ));
  };

  const baseImponible = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalDescuentos = items.reduce((acc, item) => acc + (item.price * item.quantity * (item.discount / 100)), 0);
  const iva = (baseImponible - totalDescuentos) * 0.19; 
  const totalDocumento = baseImponible - totalDescuentos + iva;
  const docId = isPreventa ? `REM-${Math.floor(1000 + Math.random() * 9000)}` : `FE-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleEmit = () => {
    if (items.length === 0) return alert("El documento no tiene ítems.");
    setIsEmitting(true);
    setTimeout(() => {
      setGeneratedDocId(docId);
      setIsEmitting(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  const sendByWhatsApp = () => {
    const docType = isPreventa ? 'Confirmación de Pedido' : 'Factura Electrónica';
    const message = `🧾 *${docType} ${generatedDocId}*\n\nHola *${clientData.name}*, adjuntamos el soporte digital de tu operación en *${company?.name}*.\n\n💰 *Monto:* $${totalDocumento.toLocaleString()}\n📌 *Tipo:* ${isPreventa ? 'Pedido Programado' : 'Venta Directa'}`;
    const phone = clientData.phone.replace(/\s/g, '');
    window.open(`https://wa.me/57${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const sendByEmail = async () => {
    if (!clientData.email) return alert("Ingrese email.");
    const success = await emailService.sendEmail(clientData.email, 'INV', {
      customerName: clientData.name,
      invoiceId: generatedDocId
    });
    if (success) alert("Enviado con éxito.");
  };

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#f8fafc] dark:bg-[#0a0c10] font-sans custom-scrollbar relative">
      <header className="px-10 py-10 shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex flex-col gap-2">
           <div className="flex items-center gap-3">
             <h2 className={`text-3xl font-black uppercase tracking-tighter ${isPreventa ? 'text-indigo-600' : 'text-slate-900 dark:text-white'}`}>
               {isPreventa ? 'Remisión de Pedido' : 'Facturación Electrónica'}
             </h2>
             <span className={`px-3 py-1 text-[9px] font-black rounded-full border uppercase tracking-widest ${isPreventa ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                {isPreventa ? 'MODO PREVENTA' : 'MODO AUTOVENTA'}
             </span>
           </div>
           <p className="text-slate-500 text-xs font-bold uppercase tracking-widest italic">Documento Digital Inteligente</p>
        </div>
      </header>

      <main className="px-10 pb-20 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white dark:bg-[#1a242d] rounded-[48px] p-10 border border-slate-100 dark:border-white/5 shadow-sm space-y-8">
             <div className="flex justify-between items-start">
                <div className="flex gap-6">
                   <div className={`size-16 rounded-3xl flex items-center justify-center font-black text-2xl shadow-inner ${isPreventa ? 'bg-indigo-100 text-indigo-600' : 'bg-primary/10 text-primary'}`}>
                     {clientData.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{clientData.name}</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">NIT: {clientData.nit}</p>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold" placeholder="WhatsApp" value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})} />
                <input className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold" placeholder="Email" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} />
             </div>
          </section>

          <section className="bg-white dark:bg-[#1a242d] rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  <th className="px-10 py-6">Producto</th>
                  <th className="px-6 py-6 text-center">Cant.</th>
                  <th className="px-10 py-6 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-10 py-8">
                      <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.name}</p>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center justify-center gap-4">
                        <button onClick={() => updateQty(item.id, -1)} className="size-8 rounded-lg bg-slate-100">-</button>
                        <span className="font-black">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="size-8 rounded-lg bg-primary text-white">+</button>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-slate-900 dark:text-white">
                       ${(item.price * item.quantity).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        <aside className="lg:col-span-4">
          <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl space-y-8">
             <h3 className="text-sm font-black uppercase tracking-[0.3em] text-primary">Liquidación</h3>
             <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-500">Total a Pagar</p>
                <p className="text-6xl font-black tracking-tighter tabular-nums">${totalDocumento.toLocaleString()}</p>
             </div>
             <button 
              disabled={isEmitting}
              onClick={handleEmit}
              className="w-full h-20 bg-primary text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl"
             >
               {isEmitting ? 'Transmitiendo...' : 'Confirmar Documento'}
             </button>
          </div>
        </aside>
      </main>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
           <div className="relative bg-white dark:bg-[#1a242d] rounded-[56px] p-12 w-full max-w-lg text-center space-y-8">
              <div className="size-20 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-bounce">
                <span className="material-symbols-outlined text-4xl">verified</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic">Sincronizado</h2>
              <div className="p-4 bg-white rounded-2xl shadow-xl w-fit mx-auto">
                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${generatedDocId}`} className="size-32" alt="QR" />
              </div>
              <div className="space-y-4">
                 <button onClick={sendByWhatsApp} className="w-full py-5 bg-[#25D366] text-white rounded-3xl font-black text-xs uppercase">WhatsApp</button>
                 <button onClick={() => setShowSuccessModal(false)} className="w-full py-5 bg-slate-100 text-slate-400 rounded-3xl font-black text-xs uppercase">Cerrar</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
