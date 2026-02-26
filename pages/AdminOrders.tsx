import React, { useState, useEffect } from 'react';
import { orderService } from '../services/api';
import { useAuth } from '../components/AuthProvider';

export const AdminOrders: React.FC = () => {
  const { company } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company?.id) loadOrders();
  }, [company?.id]);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await orderService.getCompanyOrders(company!.id);
    setOrders(data);
    setIsLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white font-sans overflow-hidden">
      <header className="h-24 px-8 border-b border-gray-100 flex flex-col justify-center bg-white shrink-0">
        <h1 className="text-3xl font-bold tracking-tight">Ventas y Pedidos</h1>
        <p className="text-xs font-medium text-gray-400 mt-1">Todas las órdenes sincronizadas desde la red central.</p>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-8 custom-scrollbar">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse"><div className="loader-bar mx-auto"></div></div>
          ) : (
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white divide-y divide-gray-100">
               {orders.map(o => (
                 <div key={o.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-12 flex-1 min-w-0">
                       <div className="min-w-[120px]">
                          <p className="text-sm font-bold text-black font-mono tracking-tight cursor-pointer hover:underline">
                            {o.id.substring(0, 8)}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                             <p className="text-[11px] font-medium text-gray-500 uppercase">Producción</p>
                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded-full border border-blue-100 uppercase">Actual</span>
                          </div>
                       </div>

                       <div className="flex items-center gap-3">
                          <div className="v19-status-dot ready"></div>
                          <div className="min-w-[80px]">
                             <p className="text-sm font-bold text-gray-900">Listo</p>
                             <p className="text-[11px] text-gray-400 font-medium">hace 30s</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3 flex-1 truncate">
                          <svg width="18" height="18" viewBox="0 0 76 65" fill="none" className="shrink-0"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="#888"/></svg>
                          <p className="text-sm font-medium text-gray-600 truncate">{o.customers?.name || 'Cliente Externo'}</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-8 mt-4 md:mt-0">
                       <div className="hidden lg:flex items-center gap-2 text-gray-400">
                          <span className="material-symbols-outlined text-[18px]">history</span>
                          <p className="text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">Sincronizado vía SFA</p>
                       </div>
                       <div className="flex items-center gap-3">
                          <p className="text-[11px] font-bold text-gray-500 text-right">
                            {new Date(o.created_at).toLocaleDateString()} by {o.profiles?.full_name?.split(' ')[0] || 'System'}
                          </p>
                          <div className="size-8 rounded-full bg-gray-100 border border-gray-200 bg-cover bg-center shrink-0" style={{ backgroundImage: `url(https://i.pravatar.cc/150?u=${o.id})` }}></div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};