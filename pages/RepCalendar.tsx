
import React, { useState } from 'react';

interface Event {
  id: string;
  client: string;
  time: string;
  type: 'Preventa' | 'Autoventa' | 'Cobro';
  status: 'completado' | 'pendiente' | 'reprogramado';
}

const MOCK_EVENTS: Record<number, Event[]> = {
  24: [
    { id: '1', client: 'Supermercado El Sol', time: '08:30 AM', type: 'Preventa', status: 'completado' },
    { id: '2', client: 'Abarrotes Doña Maria', time: '10:15 AM', type: 'Autoventa', status: 'pendiente' },
    { id: '3', client: 'Ferretería Central', time: '02:00 PM', type: 'Cobro', status: 'pendiente' },
  ],
  25: [
    { id: '4', client: 'Mini Market Express', time: '09:00 AM', type: 'Preventa', status: 'pendiente' },
    { id: '5', client: 'Tienda La Esquina', time: '11:30 AM', type: 'Preventa', status: 'pendiente' },
  ]
};

export const RepCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState(24);
  const daysInMonth = 31;
  const startDayOffset = 1; // Martes (0=Dom, 1=Lun...)

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const currentEvents = MOCK_EVENTS[selectedDay] || [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-background-light dark:bg-background-dark font-display custom-scrollbar">
      <header className="px-6 lg:px-10 py-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-slate-900 dark:text-white text-3xl font-black tracking-tight">Agenda de Visitas</h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              <p className="text-base font-medium">Octubre 2023 • Planificación Semanal</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
               <span className="material-symbols-outlined text-[20px]">today</span>
               <span>Hoy</span>
             </button>
             <button className="bg-primary text-white rounded-xl px-6 py-2.5 text-sm font-bold shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex items-center gap-2">
               <span className="material-symbols-outlined text-[20px]">add</span>
               Agendar Visita
             </button>
          </div>
        </div>
      </header>

      <main className="px-6 lg:px-10 pb-12 w-full max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left: Monthly Calendar View */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Octubre 2023</h3>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button className="px-4 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 text-primary rounded-lg shadow-sm">Mes</button>
                <button className="px-4 py-1.5 text-xs font-bold text-slate-500">Semana</button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-inner">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="bg-slate-50 dark:bg-slate-900/50 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
                  {day}
                </div>
              ))}
              
              {/* Empty offsets for the start of the month */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white dark:bg-surface-dark h-28 opacity-50"></div>
              ))}

              {calendarDays.map(day => {
                const hasEvents = MOCK_EVENTS[day]?.length > 0;
                const isSelected = selectedDay === day;
                const isToday = day === 24;

                return (
                  <button 
                    key={day} 
                    onClick={() => setSelectedDay(day)}
                    className={`bg-white dark:bg-surface-dark h-28 p-3 text-left transition-all relative border border-slate-50 dark:border-slate-800/50 group hover:z-10 hover:shadow-xl ${
                      isSelected ? 'ring-2 ring-inset ring-primary z-10 bg-primary/5 dark:bg-primary/5' : ''
                    }`}
                  >
                    <span className={`text-sm font-black ${
                      isToday ? 'bg-primary text-white size-7 flex items-center justify-center rounded-lg shadow-sm' : 
                      isSelected ? 'text-primary' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {day}
                    </span>
                    {hasEvents && (
                      <div className="mt-2 space-y-1">
                        {MOCK_EVENTS[day].slice(0, 2).map(ev => (
                          <div key={ev.id} className={`text-[9px] font-bold px-1.5 py-0.5 rounded truncate ${
                            ev.status === 'completado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                          }`}>
                            {ev.time} {ev.client}
                          </div>
                        ))}
                        {MOCK_EVENTS[day].length > 2 && (
                          <div className="text-[9px] text-slate-400 font-bold pl-1">
                            + {MOCK_EVENTS[day].length - 2} más
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Daily Agenda Detail */}
        <div className="xl:col-span-4 flex flex-col gap-6 lg:sticky lg:top-8">
          <section className="bg-white dark:bg-surface-dark rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Agenda: Día {selectedDay}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Octubre 2023</p>
              </div>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">event_note</span>
              </div>
            </div>

            <div className="p-6 flex-1 space-y-4">
              {currentEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4 opacity-50 italic text-center">
                  <span className="material-symbols-outlined text-5xl">event_busy</span>
                  <p className="text-sm">No hay visitas programadas<br/>para este día.</p>
                </div>
              ) : currentEvents.map((ev, idx) => (
                <div key={ev.id} className="relative group">
                  {idx < currentEvents.length - 1 && (
                    <div className="absolute left-4 top-10 bottom-[-16px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                  )}
                  <div className="flex gap-4">
                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm ${
                      ev.status === 'completado' ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">
                        {ev.status === 'completado' ? 'check' : 'schedule'}
                      </span>
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 group-hover:border-primary/30 transition-all hover:shadow-md">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{ev.time}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border uppercase tracking-wider ${
                          ev.type === 'Cobro' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {ev.type}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{ev.client}</h4>
                      <div className="flex items-center gap-4 mt-3">
                        <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">map</span> Mapa
                        </button>
                        <button className="text-[10px] font-black text-slate-400 hover:text-primary uppercase tracking-widest flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">edit</span> Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {currentEvents.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                <button className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md hover:bg-blue-600 transition-all">
                  Iniciar Ruta del Día
                </button>
              </div>
            )}
          </section>

          {/* Productivity Stats */}
          <section className="bg-primary/5 dark:bg-primary/10 p-6 rounded-3xl border border-primary/20">
            <h3 className="text-xs font-black text-slate-900 dark:text-white mb-4 uppercase tracking-widest">Productividad Semanal</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  <span>Visitas Completadas</span>
                  <span className="text-primary">12/15</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: '80%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  <span>Efectividad Cobros</span>
                  <span className="text-emerald-600">92%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
