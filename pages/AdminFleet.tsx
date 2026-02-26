
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import { fleetService } from '../services/api';

const MOCK_FLEET: Vehicle[] = [
  { id: 'BGT-123', model: 'Chevrolet NHR 3.5 Ton', capacityKg: 3500, type: 'PROPIO', status: 'DISPONIBLE' },
  { id: 'FVR-900', model: 'Isuzu FVR 9.0 Ton', capacityKg: 9000, type: 'PROPIO', status: 'EN_RUTA', driver: 'Mario Chofer' },
  { id: 'FUN-998', model: 'Chevrolet N300 1.2 Ton', capacityKg: 1200, type: 'ALQUILADO', status: 'DISPONIBLE' },
  { id: 'HJK-456', model: 'Foton Aumark 5 Ton', capacityKg: 5000, type: 'ALQUILADO', status: 'MANTENIMIENTO' },
];

export const AdminFleet: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_FLEET);
  const [isLoading, setIsLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    type: 'PROPIO',
    status: 'DISPONIBLE'
  });

  // Ejemplo de carga real al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Descomentar cuando la API esté lista:
        // const data = await fleetService.getAll();
        // setVehicles(data);
      } catch (err) {
        console.error("Usando Mocks por error en conexión", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const v = { ...newVehicle, id: newVehicle.id?.toUpperCase() } as Vehicle;
      // Llamada real: await fleetService.create(v);
      setVehicles([...vehicles, v]);
      setIsDrawerOpen(false);
      setNewVehicle({ type: 'PROPIO', status: 'DISPONIBLE' });
    } catch (err) {
      alert("Error al guardar en el servidor");
    }
  };

  const ownCount = vehicles.filter(v => v.type === 'PROPIO').length;
  const rentedCount = vehicles.filter(v => v.type === 'ALQUILADO').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-background-dark font-sans relative">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 p-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Flota de Vehículos</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Registro de transporte y optimización de costos operativos.</p>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="h-12 px-6 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Vincular Vehículo
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
             <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
             <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Consultando Servidor...</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-surface-dark p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Unidades</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{vehicles.length}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-[32px] border border-emerald-100 dark:border-emerald-800/30 shadow-sm">
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Vehículos Propios</p>
                  <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">{ownCount}</p>
                  <p className="text-[9px] font-bold text-emerald-600/60 uppercase mt-1">Cero Costo Alquiler</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-[32px] border border-amber-100 dark:border-amber-800/30 shadow-sm">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Vehículos Alquilados</p>
                  <p className="text-3xl font-black text-amber-700 dark:text-amber-400 mt-1">{rentedCount}</p>
                  <p className="text-[9px] font-bold text-amber-600/60 uppercase mt-1">Costo Flete Variable</p>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl flex flex-col justify-center">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Disponibilidad</p>
                  <p className="text-3xl font-black text-white mt-1">{vehicles.filter(v => v.status === 'DISPONIBLE').length} <span className="text-sm text-slate-500 font-medium">Libres</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(v => (
                <div key={v.id} className="bg-white dark:bg-surface-dark rounded-[32px] p-6 border border-gray-200 dark:border-gray-800 shadow-sm relative group overflow-hidden transition-all hover:border-primary">
                  <div className="flex justify-between items-start mb-6">
                     <div className="flex flex-col">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border w-fit uppercase ${
                          v.type === 'PROPIO' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {v.type}
                        </span>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 leading-none">{v.id}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{v.model}</p>
                     </div>
                     <div className={`size-10 rounded-xl flex items-center justify-center ${
                       v.status === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-600' : 
                       v.status === 'EN_RUTA' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                     }`}>
                       <span className="material-symbols-outlined">{v.status === 'DISPONIBLE' ? 'check_circle' : v.status === 'EN_RUTA' ? 'local_shipping' : 'potted_plant'}</span>
                     </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1">
                      <span>Capacidad de Carga</span>
                      <span>{v.capacityKg} KG</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-slate-300">person</span>
                      <span className="text-xs font-bold text-slate-500">{v.driver || 'Sin conductor'}</span>
                    </div>
                    <button className="text-primary hover:underline text-xs font-black uppercase tracking-widest">Editar Ficha</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Drawer: Nuevo Vehículo */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-surface-dark shadow-2xl z-[110] animate-in slide-in-from-right flex flex-col">
            <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Nuevo Transporte</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400"><span className="material-symbols-outlined">close</span></button>
            </div>
            <form onSubmit={handleCreate} className="p-8 flex-1 space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Placa del Vehículo</label>
                <input required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold uppercase" placeholder="ABC-123" onChange={e => setNewVehicle({...newVehicle, id: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Propiedad</label>
                <div className="grid grid-cols-2 gap-3">
                   <button type="button" onClick={() => setNewVehicle({...newVehicle, type: 'PROPIO'})} className={`py-4 rounded-2xl text-[10px] font-black uppercase border-2 ${newVehicle.type === 'PROPIO' ? 'bg-primary border-primary text-white' : 'border-slate-100 dark:border-slate-800'}`}>Propio (Prioritario)</button>
                   <button type="button" onClick={() => setNewVehicle({...newVehicle, type: 'ALQUILADO'})} className={`py-4 rounded-2xl text-[10px] font-black uppercase border-2 ${newVehicle.type === 'ALQUILADO' ? 'bg-primary border-primary text-white' : 'border-slate-100 dark:border-slate-800'}`}>Alquilado</button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Marca / Modelo</label>
                <input required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold" placeholder="Isuzu NHR / Foton..." onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacidad Máxima (Kg)</label>
                <input required type="number" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold" placeholder="3500" onChange={e => setNewVehicle({...newVehicle, capacityKg: parseInt(e.target.value)})} />
              </div>
            </form>
            <div className="p-8 border-t border-gray-100 dark:border-gray-800">
               <button onClick={handleCreate} className="w-full py-5 bg-primary text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl">Registrar en Almacén</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
