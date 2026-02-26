
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerService } from '../services/api';
import { useAuth } from '../components/AuthProvider';

export const AdminCustomers: React.FC = () => {
  const { company } = useAuth();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (company?.id) loadData();
  }, [company?.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await customerService.getAll(company!.id);
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#f9fafb] dark:bg-[#080a0e] font-sans overflow-hidden">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 p-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Directorio de Clientes</h1>
            <p className="text-slate-500 text-sm font-medium mt-1">Gestión centralizada de cuentas y valor vitalicio (LTV).</p>
          </div>
          <div className="flex gap-3">
             <button className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-lg">download</span> Exportar
             </button>
             <button className="h-12 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                + Nuevo Cliente
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white dark:bg-surface-dark p-4 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
             <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-4 top-3 text-slate-400">search</span>
                <input 
                  type="text" 
                  placeholder="Buscar por nombre, NIT o ciudad..."
                  className="w-full h-12 pl-12 pr-4 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
                {['Todos', 'VIP', 'Nuevos', 'Inactivos'].map(f => (
                  <button key={f} className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all border border-transparent hover:border-primary/20">{f}</button>
                ))}
             </div>
          </div>

          <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
             {isLoading ? (
               <div className="py-40 text-center animate-pulse text-slate-400 font-black uppercase text-[10px]">Consultando Base de Datos...</div>
             ) : (
               <table className="w-full text-left">
                  <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-gray-800">
                     <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Comercio / Representante</th>
                        <th className="px-8 py-6">Ubicación</th>
                        <th className="px-8 py-6">Segmento</th>
                        <th className="px-8 py-6 text-right">Crédito</th>
                        <th className="px-8 py-6 text-right">Acciones</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                     {filtered.map((c, i) => (
                       <tr key={c.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate('/admin/customer-detail')}>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="size-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-lg shadow-inner">
                                   {c.name.charAt(0)}
                                </div>
                                <div>
                                   <p className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">{c.name}</p>
                                   <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{c.owner_name || 'Sin Propietario'}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{c.barrio ? `${c.barrio}, ` : ''}{c.city}</p>
                             <p className="text-[10px] text-slate-400 mt-0.5">{c.address}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                               i % 3 === 0 ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                             }`}>
                                {i % 3 === 0 ? 'VIP' : 'ESTÁNDAR'}
                             </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <p className="font-black text-slate-900 dark:text-white text-sm">$15.0M</p>
                             <p className="text-[9px] text-slate-400 uppercase font-bold">Cupo Disponible</p>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="p-2 text-slate-300 hover:text-primary transition-all group-hover:scale-110">
                                <span className="material-symbols-outlined">chevron_right</span>
                             </button>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
             )}
          </div>
        </div>
      </main>
    </div>
  );
};
