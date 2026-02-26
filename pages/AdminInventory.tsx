import React, { useState, useEffect } from 'react';
import { productService, inventoryService } from '../services/api.ts';
import { useAuth } from '../components/AuthProvider.tsx';
import { analyzeStockRisks } from '../services/geminiService.ts';

export const AdminInventory: React.FC = () => {
  const { company, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'kardex' | 'ai'>('kardex');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [aiRisks, setAiRisks] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    if (company?.id) loadProducts();
  }, [company?.id]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll(company!.id);
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsAiLoading(true);
    try {
      const risks = await analyzeStockRisks(products);
      setAiRisks(risks);
    } catch (err) {
      alert("Error en el motor IA.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background-light dark:bg-background-dark overflow-hidden">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-100 p-8 shrink-0">
        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white">Centro Logístico</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             <div className="lg:col-span-8">
                <section className="bg-white dark:bg-surface-dark rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                   <div className="p-6 bg-slate-50/50 border-b flex justify-between items-center">
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Existencias en Vivo</h3>
                   </div>
                   <div className="overflow-x-auto">
                      <table className="w-full text-left">
                         <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                               <th className="px-8 py-5">Producto / SKU</th>
                               <th className="px-8 py-5 text-center">Saldo Actual</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y">
                            {products.map(p => (
                              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                 <td className="px-8 py-6">
                                    <p className="font-bold text-slate-900 dark:text-white text-sm uppercase">{p.name}</p>
                                    <p className="text-[10px] font-mono text-slate-400 uppercase">SKU: {p.sku}</p>
                                 </td>
                                 <td className="px-8 py-6 text-center">
                                    <span className="px-4 py-1.5 rounded-xl font-black text-xs bg-slate-50 text-slate-700">
                                      {p.stock} UNI
                                    </span>
                                 </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </section>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};