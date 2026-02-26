import React, { useState, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService.ts';
import { MOCK_PRODUCTS } from '../constants.ts';
import { Product, Vehicle } from '../types.ts';

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'BGT-123', model: 'NHR 3.5 Ton', capacityKg: 3500, type: 'PROPIO', status: 'DISPONIBLE' },
  { id: 'FUN-998', model: 'N300 1.5 Ton', capacityKg: 1500, type: 'ALQUILADO', status: 'DISPONIBLE' },
];

interface DespachoState {
  route: string;
  zone: string;
  rep: string;
  vehicle: string;
  maxCapacity: number;
}

interface LoadItem extends Product {
  loadQty: number;
  returnQty: number; 
  soldQty: number;   
  preSaleQty: number; 
}

export const AdminAutoventa: React.FC = () => {
  const [despacho, setDespacho] = useState<DespachoState>({
    route: 'Ruta Norte - Sector A',
    zone: 'Bogotá Norte',
    rep: 'Juan Vendedor',
    vehicle: 'BGT-123',
    maxCapacity: 3500
  });

  const [items, setItems] = useState<LoadItem[]>(
    MOCK_PRODUCTS.slice(0, 4).map(p => ({ ...p, loadQty: 0, returnQty: 0, soldQty: 0, preSaleQty: Math.floor(Math.random() * 5) }))
  );

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'loading' | 'audit'>('loading');
  const [selectedDriverClosure, setSelectedDriverClosure] = useState<any | null>(null);

  const totalWeight = items.reduce((acc, item) => acc + (item.loadQty * item.weight), 0);
  const capacityPercent = (totalWeight / despacho.maxCapacity) * 100;
  const totalValue = items.reduce((acc, item) => acc + (item.loadQty * item.price), 0);

  const handleUpdateQty = (id: string, qty: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, loadQty: Math.max(0, qty) } : item));
  };

  const handleAiSuggestion = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Sugiere cantidades de carga extra para autoventa en la ruta ${despacho.route}. 
      Considerando que ya lleva preventas de: ${items.map(i => `${i.name} (${i.preSaleQty}u)`).join(', ')}.`;
      await getGeminiResponse(prompt, []);
      setItems(prev => prev.map((item) => ({ ...item, loadQty: item.preSaleQty + Math.floor(Math.random() * 15) + 5 })));
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleOpenClosure = (driverName: string) => {
    setSelectedDriverClosure({
      id: 'MAN-4920',
      driver: driverName,
      vehicle: 'BGT-123',
      preSaleRevenue: 1850000, 
      autoVentaRevenue: 600000,  
      cash: 1450000,
      transfer: 1000000,
      returns: [
        { sku: 'DW-998-X', name: 'Taladro Percutor', qty: 2, value: 1560000 },
        { sku: '3M-H-500', name: 'Casco Industrial', qty: 5, value: 294500 }
      ]
    });
  };

  const confirmSettlement = () => {
    alert("CIERRE CONCILIADO CON ÉXITO\n\n1. Dinero de Preventa y Autoventa ingresado.\n2. Stock de retorno reintegrado al Kardex.\n3. Hoja de ruta cerrada legalmente.");
    setSelectedDriverClosure(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#f8fafc] dark:bg-[#0a0c10] font-sans">
      <header className="h-24 px-10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0d1117]/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Consola de Autoventa</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Cargues de Bodega Móvil y Cierres</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5">
             <button onClick={() => setViewMode('loading')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'loading' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Cargue Vehículo</button>
             <button onClick={() => setViewMode('audit')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'audit' ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>Liquidación HQ</button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          {viewMode === 'loading' ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
              <div className="lg:col-span-4 space-y-8">
                <section className="bg-white dark:bg-[#1a242d] rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm p-10">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary mb-8 flex items-center gap-3"><span className="material-symbols-outlined">settings_suggest</span> Configurar Salida</h3>
                  <div className="space-y-8">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ruta Autoventa</label>
                      <select className="w-full h-16 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl px-6 text-sm font-black uppercase">
                        <option>Ruta 08 - Autoventa Norte</option>
                        <option>Ruta 12 - Autoventa Industrial</option>
                      </select>
                    </div>
                  </div>
                </section>
                <div className="bg-slate-900 p-8 rounded-[48px] text-white">
                  <p className="text-[10px] font-black uppercase text-slate-500 mb-2">Carga Actual</p>
                  <p className="text-4xl font-black">{totalWeight} KG</p>
                  <div className="h-1 w-full bg-white/10 mt-4 rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${Math.min(100, capacityPercent)}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-white dark:bg-[#1a242d] rounded-[48px] border overflow-hidden">
                  <div className="p-8 border-b flex justify-between items-center">
                    <h3 className="font-black uppercase tracking-widest text-sm">Ítems de Carga</h3>
                    <button onClick={handleAiSuggestion} disabled={isAiLoading} className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase">
                       {isAiLoading ? 'Sincronizando...' : 'Sugerir IA'}
                    </button>
                  </div>
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black text-slate-400 uppercase border-b">
                           <th className="p-8">Producto</th>
                           <th className="p-8 text-center">Cant.</th>
                           <th className="p-8 text-right">Peso</th>
                        </tr>
                     </thead>
                     <tbody>
                        {items.map(p => (
                          <tr key={p.id} className="border-b last:border-0">
                             <td className="p-8">
                                <p className="font-bold uppercase text-slate-900 dark:text-white">{p.name}</p>
                                <p className="text-[10px] text-slate-400">SKU: {p.sku}</p>
                             </td>
                             <td className="p-8 text-center">
                                <div className="flex items-center justify-center gap-4">
                                   <button onClick={() => handleUpdateQty(p.id, p.loadQty - 1)} className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">-</button>
                                   <span className="font-black w-4">{p.loadQty}</span>
                                   <button onClick={() => handleUpdateQty(p.id, p.loadQty + 1)} className="size-8 rounded-lg bg-primary text-white flex items-center justify-center">+</button>
                                </div>
                             </td>
                             <td className="p-8 text-right font-black">{(p.loadQty * p.weight).toFixed(1)}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
             <div className="py-20 text-center text-slate-300 italic">Módulo de Liquidación...</div>
          )}
        </div>
      </div>
    </div>
  );
};