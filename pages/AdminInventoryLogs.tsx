
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../components/AuthProvider';

export const AdminInventoryLogs: React.FC = () => {
  const { company } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (company?.id) fetchLogs();
  }, [company?.id]);

  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      // Usamos la vista vw_inventory_history creada en el setup SQL
      const { data, error } = await supabase
        .from('inventory_transactions')
        .select(`
          id, type, quantity, reason, created_at,
          products (name, sku),
          profiles (full_name)
        `)
        .eq('company_id', company!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-background-dark font-sans overflow-hidden">
      <header className="bg-white dark:bg-surface-dark border-b border-slate-100 p-8 shrink-0">
        <div className="flex justify-between items-center">
           <div>
             <h1 className="text-3xl font-black uppercase tracking-tight">Auditoría de Movimientos</h1>
             <p className="text-slate-500 text-sm font-medium mt-1">Kardex detallado y trazabilidad de staff.</p>
           </div>
           <button onClick={fetchLogs} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">refresh</span>
           </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase text-xs">Escaneando transacciones de bodega...</div>
          ) : (
            <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
               <table className="w-full text-left">
                  <thead>
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                        <th className="px-8 py-5">Fecha / Hora</th>
                        <th className="px-8 py-5">Producto</th>
                        <th className="px-8 py-5 text-center">Tipo</th>
                        <th className="px-8 py-5 text-center">Cantidad</th>
                        <th className="px-8 py-5">Responsable</th>
                        <th className="px-8 py-5">Motivo</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {logs.map(log => (
                       <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-8 py-6">
                             <p className="font-bold text-slate-900 text-xs">{new Date(log.created_at).toLocaleDateString()}</p>
                             <p className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString()}</p>
                          </td>
                          <td className="px-8 py-6">
                             <p className="font-bold text-slate-700 text-sm">{log.products?.name}</p>
                             <p className="text-[10px] font-mono text-slate-400">{log.products?.sku}</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <span className={`px-2 py-1 rounded text-[9px] font-black uppercase ${
                               log.type === 'INBOUND' ? 'bg-emerald-50 text-emerald-600' : 
                               log.type === 'OUTBOUND' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                             }`}>
                                {log.type}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-center">
                             <p className={`font-black text-base ${log.type === 'INBOUND' ? 'text-emerald-500' : 'text-slate-900'}`}>
                               {log.type === 'INBOUND' ? '+' : '-'}{log.quantity}
                             </p>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-bold text-slate-600">{log.profiles?.full_name || 'Sistema'}</span>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs text-slate-400 italic max-w-[200px] truncate">{log.reason}</p>
                          </td>
                       </tr>
                     ))}
                     {logs.length === 0 && (
                       <tr><td colSpan={6} className="py-20 text-center text-slate-300 italic">No hay movimientos registrados en este periodo.</td></tr>
                     )}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
