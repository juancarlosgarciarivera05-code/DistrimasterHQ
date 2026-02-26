
import React, { useState } from 'react';

export const AdminConfigDist: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Pre' | 'Auto'>('Pre');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 py-6 px-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white uppercase tracking-tighter">Configuración de Distribución</h2>
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-medium">
              Defina flujos y parámetros para los modelos de {activeTab === 'Pre' ? 'Preventa' : 'Autoventa'}.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="h-11 px-6 bg-white dark:bg-gray-800 border-2 border-slate-100 dark:border-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button className="h-11 px-6 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all">
              Guardar Cambios
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex gap-8 border-b border-gray-100 dark:border-gray-800">
          <button 
            onClick={() => setActiveTab('Pre')}
            className={`pb-3 border-b-4 text-xs font-black uppercase tracking-[0.2em] px-2 flex items-center gap-2 transition-all ${
              activeTab === 'Pre' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">assignment_ind</span>
            Preventa
          </button>
          <button 
            onClick={() => setActiveTab('Auto')}
            className={`pb-3 border-b-4 text-xs font-black uppercase tracking-[0.2em] px-2 flex items-center gap-2 transition-all ${
              activeTab === 'Auto' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">local_shipping</span>
            Autoventa
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50 dark:bg-background-dark">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'Pre' ? (
            /* CONTENIDO PREVENTA RESTAURADO */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-8 space-y-8">
                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Parámetros Operativos Preventa</h3>
                    <span className="material-symbols-outlined text-primary">tune</span>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="flex items-center justify-between p-6 rounded-[24px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 group hover:border-primary transition-all">
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">Permitir venta sin stock</span>
                        <span className="text-xs text-text-secondary-light font-medium">Los vendedores podrán generar pedidos con saldo negativo.</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Días máximos de preventa</label>
                        <div className="relative">
                          <input type="number" defaultValue="3" className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white" />
                          <span className="absolute right-6 top-4 text-[10px] font-black text-slate-400 uppercase">DÍAS</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Monto Mínimo de Pedido</label>
                        <div className="relative">
                          <input type="number" defaultValue="150.00" className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-10 focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white" />
                          <span className="absolute left-6 top-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">$</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                   <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Zonificación de Clientes</h3>
                    <span className="material-symbols-outlined text-primary">map</span>
                  </div>
                  <div className="p-8">
                    <div className="p-16 border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[40px] flex flex-col items-center gap-6 text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                      <div className="size-20 bg-primary/10 text-primary rounded-[24px] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-5xl">distance</span>
                      </div>
                      <div className="max-w-sm">
                        <p className="font-black text-lg text-slate-900 dark:text-white tracking-tight uppercase">Configuración Geográfica</p>
                        <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">Defina perímetros de entrega y asigne grupos de clientes a rutas de preventa automáticas.</p>
                      </div>
                      <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl px-10 py-4 text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105">Abrir Editor de Mapa</button>
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4">
                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sticky top-8 h-fit">
                  <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex flex-col">
                      <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Flujo de Visita</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Secuencia en campo</p>
                    </div>
                    <button className="text-primary hover:bg-primary/10 rounded-xl p-2 transition-colors">
                      <span className="material-symbols-outlined">settings_suggest</span>
                    </button>
                  </div>
                  <div className="p-8 space-y-4">
                    {[
                      { icon: 'location_on', label: 'Check-in Geográfico', color: 'bg-blue-100 text-blue-600' },
                      { icon: 'inventory_2', label: 'Inventario en Anaquel', color: 'bg-purple-100 text-purple-600' },
                      { icon: 'shopping_basket', label: 'Toma de Pedido', color: 'bg-green-100 text-green-600' },
                      { icon: 'payments', label: 'Gestión de Cartera', color: 'bg-amber-100 text-amber-600' },
                      { icon: 'photo_camera', label: 'Evidencia Fotográfica', color: 'bg-rose-100 text-rose-600' },
                    ].map((step, idx) => (
                      <div key={idx} className="group flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing">
                        <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">drag_indicator</span>
                        <div className={`p-2.5 rounded-xl ${step.color} shadow-sm shrink-0`}>
                          <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 dark:text-slate-200 flex-1 truncate">{step.label}</span>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500">
                           <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                      Añadir Paso Personalizado
                    </button>
                  </div>
                </section>
              </div>
            </div>
          ) : (
            /* CONTENIDO AUTOVENTA MANTENIDO */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="lg:col-span-8 space-y-8">
                {/* Parámetros de Carga */}
                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Reglas de Carga en Vehículo</h3>
                    <span className="material-symbols-outlined text-primary">local_shipping</span>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Alerta de Stock Crítico en Camión</label>
                        <div className="relative">
                          <input type="number" defaultValue="15" className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white" />
                          <span className="absolute right-6 top-4 text-[10px] font-black text-slate-400 uppercase">% STOCK</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Límite de Peso Máximo (Kg)</label>
                        <div className="relative">
                          <input type="number" defaultValue="3500" className="w-full h-14 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 focus:border-primary focus:ring-0 text-sm font-bold text-slate-900 dark:text-white" />
                          <span className="absolute right-6 top-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">KG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recaudo y Finanzas */}
                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                  <div className="px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Políticas de Recaudo en Campo</h3>
                    <span className="material-symbols-outlined text-emerald-500">payments</span>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['Efectivo', 'Tarjeta (POS)', 'Transferencia', 'Cheque'].map(method => (
                        <div key={method} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
                          <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-0" />
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">{method}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4">
                {/* Liquidación Panel */}
                <section className="bg-white dark:bg-surface-dark rounded-[32px] shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col sticky top-8 h-fit overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                    <div className="flex flex-col">
                      <h3 className="font-black text-sm uppercase tracking-widest text-slate-900 dark:text-white">Liquidación de Ruta</h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Cierre de Jornada</p>
                    </div>
                    <span className="material-symbols-outlined text-amber-500">account_balance_wallet</span>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase">Cierre Automático</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-black text-slate-600 dark:text-slate-300 uppercase">Bloquear si hay Deuda</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                    
                    <button 
                      onClick={() => setIsAuditModalOpen(true)}
                      className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-[24px] hover:scale-105 transition-all shadow-xl shadow-slate-900/10"
                    >
                      Ver Protocolo de Auditoría
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL: PROTOCOLO DE AUDITORÍA (Mantenido) */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" 
            onClick={() => setIsAuditModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-4xl bg-white dark:bg-surface-dark rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100 dark:border-slate-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-3xl">verified_user</span>
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight leading-none">Protocolo de Auditoría</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mt-1.5">Estándar de Seguridad Operacional</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAuditModalOpen(false)}
                className="size-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-10">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">Módulo 01</span>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest">Conciliación de Inventario</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Carga Inicial</p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">450 <span className="text-sm font-medium text-slate-400">Uni</span></p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas Reportadas</p>
                    <p className="text-3xl font-black text-emerald-500 mt-1">392 <span className="text-sm font-medium text-slate-400">Uni</span></p>
                  </div>
                  <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-primary/10 border-2 border-primary/20">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Retorno Esperado</p>
                    <p className="text-3xl font-black mt-1">58 <span className="text-sm font-medium text-white/40">Uni</span></p>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest">Módulo 02</span>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-widest">Cierre de Caja y Recaudo</h3>
                </div>
                <div className="overflow-hidden border border-slate-100 dark:border-slate-800 rounded-[32px]">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Método de Pago</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Monto en App</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Monto Físico</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase text-center">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                      {[
                        { name: 'Efectivo', app: '$1,250.00', physical: '$1,250.00', status: 'OK' },
                        { name: 'Transferencia', app: '$480.00', physical: '$480.00', status: 'OK' }
                      ].map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="px-8 py-5 text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.name}</td>
                          <td className="px-8 py-5 text-sm font-mono text-slate-600 dark:text-slate-400 text-right">{row.app}</td>
                          <td className="px-8 py-5 text-sm font-mono text-slate-600 dark:text-slate-400 text-right">{row.physical}</td>
                          <td className="px-8 py-5 text-center">
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${row.status === 'OK' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800">
                 <h3 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
                   <span className="material-symbols-outlined text-primary">fact_check</span>
                   Protocolo de Seguridad Final
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {[
                     'Validación de Kilometraje Inicial/Final',
                     'Verificación de estado mecánico del camión',
                     'Sincronización de pedidos Offline completa',
                     'Reporte de incidencias de GPS firmado'
                   ].map((check, i) => (
                     <label key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary transition-all group">
                       <input type="checkbox" className="size-6 rounded-lg text-primary focus:ring-0 border-2" />
                       <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">{check}</span>
                     </label>
                   ))}
                 </div>
              </section>
            </div>

            <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <button onClick={() => setIsAuditModalOpen(false)} className="text-xs font-black uppercase text-slate-400 hover:text-slate-600 tracking-widest">
                Volver sin guardar
              </button>
              <div className="flex gap-4 w-full md:w-auto">
                <button className="flex-1 md:flex-none h-14 px-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                   <span className="material-symbols-outlined">print</span>
                   Imprimir Acta
                </button>
                <button className="flex-1 md:flex-none h-14 px-10 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/30 hover:bg-blue-600 transition-all">
                   Finalizar Auditoría
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
