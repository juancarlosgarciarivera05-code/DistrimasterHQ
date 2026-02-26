import React, { useState, useEffect } from 'react';
import { Notification } from '../types.ts';

interface Transaction {
  id: string;
  dateTime: string;
  client: string;
  amount: string;
  type: 'Factura' | 'Pedido';
  status: 'Error' | 'Pendiente' | 'Sincronizada';
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'FAC-1024', dateTime: '24 Oct, 10:30', client: 'Juan Pérez', amount: '$1,200.00', type: 'Factura', status: 'Error' },
  { id: 'PED-1025', dateTime: '24 Oct, 10:15', client: 'Abarrotes El Sol', amount: '$540.50', type: 'Pedido', status: 'Pendiente' },
  { id: 'FAC-1023', dateTime: '24 Oct, 09:45', client: 'María González', amount: '$3,100.00', type: 'Factura', status: 'Sincronizada' },
  { id: 'FAC-1022', dateTime: '23 Oct, 16:20', client: 'Tienda La Esquina', amount: '$850.00', type: 'Factura', status: 'Sincronizada' },
  { id: 'PED-1021', dateTime: '23 Oct, 15:00', client: 'Carlos Ruiz', amount: '$2,100.00', type: 'Pedido', status: 'Sincronizada' },
];

export const AdminAutomation: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<'Todas' | 'Sincronizada' | 'Pendiente' | 'Error'>('Todas');
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 'n1', title: 'Discrepancia de Stock', message: 'El SKU DW-998-X no tiene inventario suficiente para procesar FAC-1024.', type: 'error', timestamp: '10:30 AM', isRead: false, actionLabel: 'Corregir' },
    { id: 'n2', title: 'Ruta Finalizada', message: 'Juan Vendedor ha completado la Ruta Norte - Sector A.', type: 'success', timestamp: '09:15 AM', isRead: true, actionLabel: 'Ver Liquidación' }
  ]);
  const [isNotifPanelOpen, setIsNotifPanelOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<Notification | null>(null);

  const filteredTransactions = MOCK_TRANSACTIONS.filter(t => 
    statusFilter === 'Todas' || t.status === statusFilter
  );

  const simulateNewNotification = () => {
    const newNotif: Notification = {
      id: Math.random().toString(),
      title: 'Nuevo Pedido Crítico',
      message: 'Se ha detectado un pedido de alta prioridad con error de sincronización.',
      type: 'error',
      timestamp: 'Ahora',
      isRead: false,
      actionLabel: 'Resolver'
    };
    setNotifications([newNotif, ...notifications]);
    setActiveToast(newNotif);
    setTimeout(() => setActiveToast(null), 5000);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#000] relative">
      {activeToast && (
        <div className="fixed top-6 right-6 z-[200] w-full max-w-sm animate-in slide-in-from-right duration-500">
          <div className={`p-5 rounded-[24px] shadow-2xl border-2 flex gap-4 backdrop-blur-xl ${
            activeToast.type === 'error' ? 'bg-red-50/90 border-red-100 text-red-900' : 'bg-emerald-50/90 border-emerald-100 text-emerald-900'
          }`}>
            <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${
              activeToast.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
            }`}>
              <span className="material-symbols-outlined">{activeToast.type === 'error' ? 'warning' : 'check_circle'}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-black uppercase tracking-tight text-xs">{activeToast.title}</h4>
              <p className="text-[11px] font-bold mt-1 opacity-80">{activeToast.message}</p>
              <div className="flex gap-3 mt-3">
                <button className="px-3 py-1.5 bg-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm hover:scale-105 transition-transform">
                  {activeToast.actionLabel}
                </button>
                <button onClick={() => setActiveToast(null)} className="text-[10px] font-black uppercase tracking-widest opacity-50">Ignorar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-[#0d1117] border-b border-gray-100 dark:border-gray-800 p-8 flex justify-between items-center shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Sincronización Central</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Control de flujos offline y alertas de integridad.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsNotifPanelOpen(!isNotifPanelOpen)}
              className={`size-12 rounded-2xl flex items-center justify-center transition-all ${
                isNotifPanelOpen ? 'bg-primary text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full ring-4 ring-white dark:ring-[#0d1117]">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
             <div className="bg-white dark:bg-[#0d1117] p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pendientes</p>
                <p className="text-3xl font-black text-amber-500 mt-1">12</p>
             </div>
             <div className="md:col-span-3 bg-primary text-white p-6 rounded-[32px] shadow-xl shadow-primary/20 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">Estado Servidor</p>
                  <p className="text-2xl font-black mt-1 uppercase tracking-tight">Totalmente Sincronizado</p>
                </div>
                <span className="material-symbols-outlined text-4xl animate-pulse">cloud_done</span>
             </div>
          </div>

          <div className="flex flex-col bg-white dark:bg-[#0d1117] rounded-[40px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-6">ID / Fecha</th>
                    <th className="px-8 py-6">Cliente</th>
                    <th className="px-8 py-6">Monto</th>
                    <th className="px-8 py-6">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900 dark:text-white">{t.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{t.dateTime}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-700 dark:text-slate-300">{t.client}</td>
                      <td className="px-8 py-6 font-black text-slate-900 dark:text-white">{t.amount}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          t.status === 'Error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-primary border-blue-100'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};