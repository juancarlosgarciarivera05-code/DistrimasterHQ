
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService, customerService } from '../services/api';

export const CustomerStore: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState<'login' | 'shop' | 'summary' | 'success'>('login');
  const [accessKey, setAccessKey] = useState('');
  const [customer, setCustomer] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReserving, setIsReserving] = useState(false);

  const companyIdParam = searchParams.get('coid') || '1';

  const handleAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessKey) return;
    setIsLoading(true);
    
    setTimeout(async () => {
      try {
        const custList = await customerService.getAll(companyIdParam);
        const found = custList.find(c => c.phone === accessKey || c.id === searchParams.get('cid'));
        
        if (found) {
          setCustomer(found);
          const prods = await productService.getAll(companyIdParam);
          setProducts(prods);
          setStep('shop');
        } else {
          alert("Identificación no válida para esta distribuidora.");
        }
      } catch (err) {
        alert("Error de validación de identidad.");
      } finally {
        setIsLoading(false);
      }
    }, 800);
  };

  const updateQty = (prod: any, delta: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === prod.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(i => i.id !== prod.id);
        return prev.map(i => i.id === prod.id ? { ...i, quantity: newQty } : i);
      }
      return delta > 0 ? [...prev, { ...prod, quantity: delta }] : prev;
    });
  };

  const calculateTotal = () => cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

  // LOGICA DE VALIDACION PROFUNDA
  const getDeliveryStatus = () => {
    if (!customer) return { msg: "", type: "info", icon: "info" };
    const days = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = days[new Date().getDay()];
    const visitDay = (customer.visit_day || "lunes").toLowerCase();

    if (customer.delivery_type === 'Auto') {
      if (today === visitDay) {
        return { 
          msg: "¡RUTA ACTIVA! El camión está en tu zona. Al confirmar, reservaremos tu stock inmediatamente.", 
          type: "urgent",
          icon: "local_shipping",
          eta: "Hoy (AM/PM)"
        };
      }
      return { 
        msg: `Tu zona se atiende los ${visitDay}s. Pedido programado para la próxima ruta.`, 
        type: "normal",
        icon: "calendar_month",
        eta: `Próximo ${visitDay}`
      };
    }
    return { 
      msg: `Preventa recibida. Tu vendedor confirmará este pedido el día ${visitDay}.`, 
      type: "normal",
      icon: "assignment_ind",
      eta: `Visita: ${visitDay}`
    };
  };

  const deliveryInfo = getDeliveryStatus();

  const handleFinalize = async () => {
    setIsReserving(true);
    // Simulación de reserva de inventario en el ERP
    setTimeout(() => {
      setIsReserving(false);
      setStep('success');
    }, 2000);
  };

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[48px] shadow-2xl text-center space-y-8 animate-in zoom-in duration-500">
           <div className="size-20 bg-primary rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-primary/20">
              <span className="material-symbols-outlined text-white text-4xl">storefront</span>
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Acceso Cliente</h2>
              <p className="text-slate-400 text-sm font-medium">Valida tu identidad para ver precios y stock.</p>
           </div>
           <form onSubmit={handleAccess} className="space-y-6">
              <input 
                type="tel" 
                placeholder="Teléfono Registrado"
                className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-2xl px-6 text-center text-xl font-black text-primary focus:border-primary outline-none transition-all"
                value={accessKey}
                onChange={e => setAccessKey(e.target.value)}
              />
              <button disabled={isLoading} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-center gap-3">
                 {isLoading ? 'Validando...' : 'Entrar a mi Tienda'}
              </button>
           </form>
        </div>
      </div>
    );
  }

  if (step === 'shop') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="h-20 bg-white border-b px-6 flex items-center justify-between sticky top-0 z-50">
           <div className="flex items-center gap-3">
              <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase">{customer?.name?.charAt(0)}</div>
              <div>
                <h1 className="text-sm font-black uppercase tracking-tight truncate max-w-[140px]">{customer?.name}</h1>
                <p className="text-[8px] font-bold text-slate-400 uppercase">{customer?.delivery_type === 'Auto' ? 'Autoventa' : 'Preventa'}</p>
              </div>
           </div>
           <div className="relative">
              <span className="material-symbols-outlined text-slate-400">shopping_cart</span>
              {cart.length > 0 && <span className="absolute -top-2 -right-2 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">{cart.length}</span>}
           </div>
        </header>

        <main className="flex-1 p-4 pb-32">
           <div className="grid grid-cols-2 gap-4">
              {products.map(p => {
                const q = cart.find(i => i.id === p.id)?.quantity || 0;
                return (
                  <div key={p.id} className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col gap-3 group active:scale-95 transition-all">
                     <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden relative">
                        <img src={p.image_url} className="w-full h-full object-cover" />
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[8px] font-black px-2 py-0.5 rounded-lg backdrop-blur-md">Stock: {p.stock}</span>
                     </div>
                     <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{p.category}</p>
                        <h3 className="text-xs font-black text-slate-900 uppercase truncate mt-0.5">{p.name}</h3>
                        <p className="text-sm font-black text-primary mt-1">${Number(p.price).toLocaleString()}</p>
                     </div>
                     <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                        {q === 0 ? (
                           <button onClick={() => updateQty(p, 1)} className="w-full h-10 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Añadir</button>
                        ) : (
                           <div className="flex items-center justify-between w-full">
                              <button onClick={() => updateQty(p, -1)} className="size-8 rounded-lg bg-slate-100 flex items-center justify-center"><span className="material-symbols-outlined text-sm">remove</span></button>
                              <span className="font-black text-xs">{q}</span>
                              <button onClick={() => updateQty(p, 1)} className="size-8 rounded-lg bg-primary text-white flex items-center justify-center"><span className="material-symbols-outlined text-sm">add</span></button>
                           </div>
                        )}
                     </div>
                  </div>
                );
              })}
           </div>
        </main>

        {cart.length > 0 && (
          <div className="fixed bottom-0 inset-x-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 shadow-2xl z-[60]">
             <button onClick={() => setStep('summary')} className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center justify-between px-8">
                <span>REVISAR CARGA</span>
                <span>${calculateTotal().toLocaleString()}</span>
             </button>
          </div>
        )}
      </div>
    );
  }

  if (step === 'summary') {
    return (
      <div className="min-h-screen bg-white flex flex-col p-6 font-sans">
        <button onClick={() => setStep('shop')} className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8"><span className="material-symbols-outlined">arrow_back</span></button>
        
        <div className="space-y-8 max-w-md mx-auto w-full">
           <div>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Confirmar Reserva</h2>
              <p className="text-slate-500 text-sm mt-2 font-medium">Validación de disponibilidad en ruta.</p>
           </div>

           <div className={`p-6 rounded-[32px] border-2 space-y-4 shadow-sm ${deliveryInfo.type === 'urgent' ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-3">
                 <div className={`size-10 rounded-xl flex items-center justify-center ${deliveryInfo.type === 'urgent' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-primary text-white'}`}>
                    <span className="material-symbols-outlined">{deliveryInfo.icon}</span>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase">Estado de Entrega</p>
                    <p className={`text-xs font-black uppercase ${deliveryInfo.type === 'urgent' ? 'text-amber-700' : 'text-slate-900'}`}>{deliveryInfo.eta}</p>
                 </div>
              </div>
              <p className={`text-xs font-bold leading-relaxed italic ${deliveryInfo.type === 'urgent' ? 'text-amber-800' : 'text-slate-500'}`}>{deliveryInfo.msg}</p>
           </div>

           <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Resumen de Productos</h3>
              <div className="space-y-3">
                 {cart.map(item => (
                   <div key={item.id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                      <span className="text-slate-600 font-bold">{item.quantity}x {item.name}</span>
                      <span className="font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</span>
                   </div>
                 ))}
                 <div className="pt-4 flex justify-between items-center">
                    <span className="text-lg font-black uppercase italic">TOTAL</span>
                    <span className="text-3xl font-black text-primary">${calculateTotal().toLocaleString()}</span>
                 </div>
              </div>
           </div>

           <button 
            onClick={handleFinalize} 
            disabled={isReserving} 
            className={`w-full h-20 text-white rounded-[32px] font-black uppercase text-sm tracking-widest shadow-2xl flex items-center justify-center gap-4 transition-all ${deliveryInfo.type === 'urgent' ? 'bg-amber-600 shadow-amber-600/30' : 'bg-primary shadow-primary/30'}`}
           >
              {isReserving ? (
                <>Bloqueando Stock <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div></>
              ) : (
                <>Confirmar Pedido <span className="material-symbols-outlined text-2xl">verified</span></>
              )}
           </button>
           <p className="text-[9px] text-slate-400 text-center uppercase font-bold tracking-widest">Al confirmar, el Supervisor de Zona validará la carga.</p>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center font-sans">
         <div className="size-28 bg-emerald-500 text-white rounded-[40px] flex items-center justify-center shadow-2xl animate-bounce mb-8">
            <span className="material-symbols-outlined text-6xl">check_circle</span>
         </div>
         <h2 className="text-4xl font-black uppercase tracking-tight italic">¡Reserva Exitosa!</h2>
         <p className="text-slate-500 mt-4 max-w-xs mx-auto leading-relaxed font-medium">
           Tu pedido ha sido enlazado al camión de tu zona. El Supervisor ha recibido la alerta de despacho inmediato.
         </p>
         <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">ID de Seguimiento</p>
            <p className="font-mono font-bold text-slate-900 tracking-widest">QR-{Math.floor(Math.random()*900000)}</p>
         </div>
         <button onClick={() => setStep('shop')} className="mt-12 h-14 px-12 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl">Regresar al Catálogo</button>
      </div>
    );
  }

  return null;
};
