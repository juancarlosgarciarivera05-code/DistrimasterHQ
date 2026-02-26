import React, { useState, useEffect } from 'react';
// Fix: Use 'react-router-dom' for DOM-specific components like Link
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { manifestService } from '../services/api';

export const DelivererDashboard: React.FC = () => {
  const { user } = useAuth();
  const [manifest, setManifest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) loadActiveManifest();
  }, [user?.id]);

  const loadActiveManifest = async () => {
    try {
      setIsLoading(true);
      const data = await manifestService.getActiveForDriver(user!.id);
      setManifest(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalKg = manifest?.manifest_items?.reduce((acc: number, curr: any) => acc + (curr.quantity_loaded * (curr.products?.weight_kg || 0)), 0) || 0;
  const totalItems = manifest?.manifest_items?.reduce((acc: number, curr: any) => acc + curr.quantity_loaded, 0) || 0;

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-500 pb-24">
      {/* Header Profile Info */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Mi Operación</h2>
           <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.2em] mt-2 italic">Entorno de Venta Directa</p>
        </div>
        <div className="size-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
           <span className="material-symbols-outlined text-slate-400">notifications</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-[10px]">Verificando Manifiesto Live...</div>
      ) : manifest ? (
        <>
          {/* Card Manifiesto y Vehículo */}
          <section className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[120px]">local_shipping</span>
            </div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="px-3 py-1 bg-primary text-white text-[9px] font-black rounded-lg uppercase tracking-widest">En Ruta: {manifest.vehicle_id}</span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">ID: #{manifest.id.substring(0,8)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                 <div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Carga Actual</p>
                   <p className="text-2xl font-black tabular-nums">{(totalKg / 1000).toFixed(1)} <span className="text-xs font-medium text-slate-500">Ton</span></p>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items Totales</p>
                   <p className="text-2xl font-black tabular-nums">{totalItems} <span className="text-xs font-medium text-slate-500">Uni</span></p>
                 </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <Link to="/deliverer/route" className="w-full h-14 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                   Ver Hoja de Ruta <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Actions Commercial */}
          <div className="grid grid-cols-2 gap-4">
             <Link to="/deliverer/catalog" className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group active:scale-95 transition-all">
                <div className="size-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                   <span className="material-symbols-outlined">shopping_cart_checkout</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Venta en Frío</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Nuevo Pedido</h4>
             </Link>
             <Link to="/deliverer/contacts" className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group active:scale-95 transition-all">
                <div className="size-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                   <span className="material-symbols-outlined">person_add</span>
                </div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prospectar</span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Nuevo Cliente</h4>
             </Link>
          </div>

          {/* Inventario del Vehículo */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Stock en Vehículo</h3>
              <span className="text-[8px] font-black text-primary uppercase bg-primary/5 px-2 py-1 rounded">Actualizado</span>
            </div>
            <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-50 dark:divide-slate-800">
               {manifest?.manifest_items?.slice(0, 3).map((item: any) => (
                 <div key={item.id} className="p-5 flex justify-between items-center">
                    <div className="min-w-0">
                       <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate">{item.products?.name}</p>
                       <p className="text-[9px] text-slate-400 font-bold mt-0.5">SKU: {item.products?.sku}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-primary">{item.quantity_loaded} Uni</p>
                    </div>
                 </div>
               ))}
               <Link to="/deliverer/catalog" className="block p-4 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                  Ver Inventario Completo
               </Link>
            </div>
          </section>
        </>
      ) : (
        <div className="py-20 text-center flex flex-col items-center gap-6">
           <div className="size-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
             <span className="material-symbols-outlined text-5xl">local_shipping</span>
           </div>
           <div>
             <h3 className="text-xl font-black uppercase text-slate-900">Sin Manifiesto</h3>
             <p className="text-sm text-slate-500 mt-2">Almacén no ha liberado tu carga hoy.</p>
           </div>
           <button onClick={loadActiveManifest} className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Consultar de nuevo</button>
        </div>
      )}

      {/* Checklist de Salida */}
      <section className="space-y-4">
         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Estatus Operativo</h3>
         <div className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 grid grid-cols-1 gap-4">
            {[
              { label: 'GPS Telemático', icon: 'share_location', color: 'text-emerald-500' },
              { label: 'Cierre Fiscal (DIAN)', icon: 'description', color: 'text-blue-500' },
              { label: 'Pasarela Recaudo QR', icon: 'qr_code_2', color: 'text-amber-500' }
            ].map(check => (
              <div key={check.label} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className={`size-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center ${check.color}`}>
                       <span className="material-symbols-outlined text-[18px]">{check.icon}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{check.label}</span>
                 </div>
                 <span className="material-symbols-outlined text-emerald-500 text-[18px]">verified</span>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};