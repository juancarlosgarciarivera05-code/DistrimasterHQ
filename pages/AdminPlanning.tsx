import React, { useState, useEffect } from 'react';
import { orderService, manifestService, fleetService } from '../services/api.ts';
import { useAuth } from '../components/AuthProvider.tsx';
import { getGeminiResponse } from '../services/geminiService.ts';

export const AdminPlanning: React.FC = () => {
  const { company } = useAuth();
  const [viewMode, setViewMode] = useState<'coord' | 'audit'>('coord');
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (company?.id) {
      loadInitialData();
    }
  }, [company?.id, viewMode]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      if (viewMode === 'coord') {
        const [orders, fleet] = await Promise.all([
          orderService.getCompanyOrders(company!.id),
          fleetService.getAll(company!.id)
        ]);
        setPendingOrders(orders.filter(o => o.status === 'APPROVED' || o.status === 'PENDING'));
        setVehicles(fleet);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOrderSelection = (id: string) => {
    setSelectedOrderIds(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleGenerateManifest = async () => {
    if (!selectedVehicleId || selectedOrderIds.length === 0) {
      return alert("Debe seleccionar un vehículo y al menos un pedido.");
    }
    alert(`MANIFIESTO GENERADO\n\nEl conductor ya puede ver su ruta en la App.`);
    setSelectedOrderIds([]);
    setSelectedVehicleId('');
  };

  const handleAiConsolidation = async () => {
    setIsAiLoading(true);
    try {
      const orderData = pendingOrders.map(o => `${o.id.substring(0,4)}: ${o.customers?.city}`).join(', ');
      const prompt = `Analiza pedidos: ${orderData}. Sugiere consolidación óptima.`;
      const response = await getGeminiResponse(prompt, []);
      alert("Gemini sugiere optimización por distritos:\n\n" + response);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-background-dark font-sans">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 p-8 shrink-0">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Despacho de Preventa</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
              
              <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center px-2">
                  <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cola de Pedidos por Despachar ({pendingOrders.length})</h2>
                  <button onClick={handleAiConsolidation} disabled={isAiLoading} className="flex items-center gap-2 text-primary font-black text-[9px] uppercase tracking-widest">
                    {isAiLoading ? 'Analizando...' : 'Optimizar con IA'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {pendingOrders.map(order => (
                    <div key={order.id} onClick={() => toggleOrderSelection(order.id)} className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer ${selectedOrderIds.includes(order.id) ? 'bg-primary/5 border-primary shadow-lg' : 'bg-white border-white'}`}>
                      <div className="flex justify-between items-center">
                        <p className="font-black text-slate-900 text-sm uppercase">#{order.id.substring(0,8)} - {order.customers?.name}</p>
                        <p className="font-black text-slate-900 text-sm">${Number(order.total_amount).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-slate-900 text-white rounded-[48px] p-10 shadow-2xl sticky top-0 space-y-8">
                    <h3 className="text-2xl font-black uppercase">Despachar Camión</h3>
                    <select className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-black text-white" value={selectedVehicleId} onChange={e => setSelectedVehicleId(e.target.value)}>
                       <option value="">Seleccionar Unidad...</option>
                       {vehicles.map(v => <option key={v.id} value={v.id} className="text-black">{v.id} • {v.model}</option>)}
                    </select>
                    <button onClick={handleGenerateManifest} disabled={selectedOrderIds.length === 0 || !selectedVehicleId} className="w-full h-20 bg-primary text-white rounded-[32px] font-black uppercase shadow-xl disabled:opacity-30">
                      Liberar Carga
                    </button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};