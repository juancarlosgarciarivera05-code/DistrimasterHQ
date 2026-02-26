
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { routeService, staffService } from '../services/api';

export const AdminRouteManagement: React.FC = () => {
  const { company } = useAuth();
  const [routes, setRoutes] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isRouteDrawerOpen, setIsRouteDrawerOpen] = useState(false);
  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);

  const [newRoute, setNewRoute] = useState({
    name: '',
    zone: 'Bogotá Norte',
    type: 'Preventa' as 'Autoventa' | 'Preventa',
    assignedToId: ''
  });

  const [newZone, setNewZone] = useState({
    name: '',
    supervisorId: '',
    selectedRouteIds: [] as string[]
  });

  const ZONES_LIST = ['Bogotá Norte', 'Bogotá Sur', 'Medellín Centro', 'Medellín Sur', 'Cali Industrial', 'Barranquilla Puerto'];

  useEffect(() => {
    if (company?.id) {
      loadData();
    }
  }, [company?.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [routeData, staffData] = await Promise.all([
        routeService.getAll(company!.id),
        staffService.getAll(company!.id)
      ]);
      setRoutes(routeData);
      setStaff(staffData);
    } catch (err) {
      console.error("Error cargando maestros:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanLimits = () => {
    const sellersLimit = company?.plan === 'Starter' ? 3 : company?.plan === 'Professional' ? 10 : 20;
    const routesPerSeller = company?.plan === 'Starter' ? 1 : company?.plan === 'Professional' ? 2 : 5;
    return { sellersLimit, routesPerSeller, totalRoutes: sellersLimit * routesPerSeller };
  };

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;

    const limits = getPlanLimits();

    // 1. VALIDACIÓN: Límite Total de Rutas de la Empresa
    if (routes.length >= limits.totalRoutes) {
      alert(`❌ CAPACIDAD TERRITORIAL AGOTADA\n\nTu plan ${company.plan} permite un máximo de ${limits.totalRoutes} rutas totales.\n\nDebes mejorar tu suscripción para habilitar más sectores.`);
      return;
    }

    // 2. VALIDACIÓN: Límite de Rutas por Vendedor (Regla Anti-Trampa)
    if (newRoute.assignedToId) {
      const routesForThisSeller = routes.filter(r => r.assigned_to_id === newRoute.assignedToId).length;
      if (routesForThisSeller >= limits.routesPerSeller) {
        const sellerName = staff.find(s => s.id === newRoute.assignedToId)?.full_name || 'este vendedor';
        alert(`❌ LÍMITE POR VENDEDOR ALCANZADO\n\n${sellerName} ya tiene asignadas ${routesForThisSeller} rutas.\n\nEn el plan ${company.plan}, el límite es de ${limits.routesPerSeller} rutas por persona.`);
        return;
      }
    }

    try {
      const payload = {
        company_id: company.id,
        name: newRoute.name,
        zone: newRoute.zone,
        type: newRoute.type,
        assigned_to_id: newRoute.assignedToId || null
      };

      await routeService.create(payload);
      alert(`RUTA ASIGNADA EXITOSAMENTE\n\nSector: ${newRoute.name}`);
      setIsRouteDrawerOpen(false);
      setNewRoute({ name: '', zone: 'Bogotá Norte', type: 'Preventa', assignedToId: '' });
      loadData();
    } catch (err: any) {
      alert("Error al crear ruta: " + err.message);
    }
  };

  const handleCreateZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZone.name || !newZone.supervisorId) {
      return alert("Complete el nombre de la zona y asigne un supervisor.");
    }
    alert(`ZONA DEFINIDA EXITOSAMENTE\n\nEstructura de mando actualizada.`);
    setIsZoneModalOpen(false);
    setNewZone({ name: '', supervisorId: '', selectedRouteIds: [] });
  };

  const limits = getPlanLimits();
  const supervisors = staff.filter(s => s.role === 'SUPERVISOR');
  const sellers = staff.filter(s => s.role === 'REPRESENTATIVE');

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden font-sans">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 p-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Zonas y Rutas</h1>
            <div className="flex items-center gap-3 mt-1">
               <p className="text-slate-500 text-sm">Capacidad del Plan:</p>
               <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/10">
                  <span className={`text-xs font-black ${routes.length >= limits.totalRoutes ? 'text-red-500' : 'text-primary'}`}>{routes.length}</span>
                  <span className="text-[10px] font-bold text-slate-400">/ {limits.totalRoutes} Rutas Máx.</span>
               </div>
            </div>
          </div>
          <div className="flex gap-4">
             <button 
               onClick={() => setIsZoneModalOpen(true)}
               className="h-14 px-6 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
             >
                <span className="material-symbols-outlined text-primary">map</span>
                Definir Zona
             </button>
             <button 
               onClick={() => setIsRouteDrawerOpen(true)}
               className="h-14 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
             >
               <span className="material-symbols-outlined">add_road</span>
               Nueva Ruta
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary text-white p-8 rounded-[40px] shadow-xl shadow-primary/20 relative overflow-hidden group">
               <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 group-hover:scale-110 transition-transform">map</span>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Zonas Activas</p>
               <h3 className="text-5xl font-black mt-2">6</h3>
            </div>
            <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-200 dark:border-gray-800 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Límite por Vendedor</p>
               <h3 className="text-5xl font-black text-slate-900 dark:text-white mt-2">{limits.routesPerSeller}</h3>
            </div>
            <div className="bg-white dark:bg-surface-dark p-8 rounded-[40px] border border-gray-200 dark:border-gray-800 shadow-sm">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Supervisores</p>
               <h3 className="text-5xl font-black text-emerald-500 mt-2">{supervisors.length}</h3>
            </div>
          </div>

          <section className="bg-white dark:bg-surface-dark rounded-[32px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {isLoading ? (
              <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] animate-pulse">Obteniendo Hoja de Ruta...</div>
            ) : (
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800">
                    <th className="px-8 py-5">Trayecto (Ruta)</th>
                    <th className="px-8 py-5">Territorio (Zona)</th>
                    <th className="px-8 py-5">Asignado a</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {routes.map(route => {
                    const assignedUser = staff.find(s => s.id === route.assigned_to_id);
                    return (
                      <tr key={route.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-900 dark:text-white text-sm uppercase">{route.name}</p>
                           <span className="text-[9px] font-black px-1.5 py-0.5 rounded border border-blue-100 bg-blue-50 text-blue-600 uppercase mt-1 inline-block">{route.type}</span>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500 uppercase tracking-widest">{route.zone}</td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className="size-2 rounded-full bg-emerald-500"></span>
                              <p className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase">{assignedUser?.full_name || 'Sin asignar'}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-slate-300 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </section>
        </div>
      </main>

      {/* Modal: Definir Zona */}
      {isZoneModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsZoneModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white dark:bg-[#1a2632] rounded-[48px] shadow-2xl border border-gray-100 dark:border-[#2a3b4c] flex flex-col overflow-hidden animate-in zoom-in duration-300">
             <div className="p-10 border-b border-gray-100 dark:border-[#2a3b4c] bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Definir Zona</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">Configuración de Territorio y Supervisión</p>
                </div>
                <button onClick={() => setIsZoneModalOpen(false)} className="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">close</span></button>
             </div>
             
             <form onSubmit={handleCreateZone} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre de la Zona</label>
                    <input 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-[#2a3b4c] rounded-2xl text-sm font-bold focus:border-primary focus:ring-0" 
                      placeholder="Ej: Zona Norte Industrial" 
                      value={newZone.name}
                      onChange={e => setNewZone({...newZone, name: e.target.value})}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Supervisor Encargado</label>
                    <select 
                      required 
                      className="w-full px-5 py-4 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 rounded-2xl text-sm font-black text-primary uppercase appearance-none"
                      value={newZone.supervisorId}
                      onChange={e => setNewZone({...newZone, supervisorId: e.target.value})}
                    >
                      <option value="">Seleccione Supervisor...</option>
                      {supervisors.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit" className="w-full py-6 bg-primary text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all">
                  Guardar Estructura de Zona
                </button>
             </form>
          </div>
        </div>
      )}

      {/* Drawer: Nueva Ruta */}
      {isRouteDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsRouteDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-[#1a2632] shadow-2xl z-[110] animate-in slide-in-from-right border-l border-gray-100 dark:border-[#2a3b4c] flex flex-col">
            <div className="p-10 border-b border-gray-100 dark:border-[#2a3b4c] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">Nueva Ruta</h2>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Maestro Logístico</p>
              </div>
              <button onClick={() => setIsRouteDrawerOpen(false)} className="size-12 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="p-10 flex-1 space-y-10 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial de la Ruta</label>
                  <input 
                    required
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-[#2a3b4c] rounded-2xl focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white"
                    placeholder="Ej: Ruta 05 - Sur Industrial"
                    value={newRoute.name}
                    onChange={e => setNewRoute({...newRoute, name: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zona Territorial</label>
                  <select 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-[#2a3b4c] rounded-2xl focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white cursor-pointer"
                    value={newRoute.zone}
                    onChange={e => setNewRoute({...newRoute, zone: e.target.value})}
                  >
                    {ZONES_LIST.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                   <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Vendedor Responsable</label>
                   <select 
                    className="w-full px-5 py-4 bg-primary/5 dark:bg-primary/10 border-2 border-primary/20 rounded-2xl focus:border-primary focus:ring-0 text-[10px] font-black text-primary uppercase"
                    value={newRoute.assignedToId}
                    onChange={e => setNewRoute({...newRoute, assignedToId: e.target.value})}
                   >
                     <option value="">Seleccione Vendedor...</option>
                     {sellers.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                   </select>
                   <p className="text-[9px] text-slate-400 font-bold ml-1">Límite según Plan: {limits.routesPerSeller} rutas x persona.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Modelo de Venta</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setNewRoute({...newRoute, type: 'Preventa'})}
                      className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                        newRoute.type === 'Preventa' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-[#2a3b4c] text-slate-400'
                      }`}
                    >
                      Preventa
                    </button>
                    <button 
                      type="button"
                      onClick={() => setNewRoute({...newRoute, type: 'Autoventa'})}
                      className={`py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${
                        newRoute.type === 'Autoventa' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-[#2a3b4c] text-slate-400'
                      }`}
                    >
                      Autoventa
                    </button>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-6 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
              >
                Guardar y Asignar Ruta
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
