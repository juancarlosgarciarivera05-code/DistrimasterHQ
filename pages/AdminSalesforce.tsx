import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { useAuth } from '../components/AuthProvider';
import { staffService } from '../services/api';

export const AdminSalesforce: React.FC = () => {
  const { company } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'REPRESENTATIVE' as UserRole,
    city: 'Bogotá',
  });

  useEffect(() => {
    if (company?.id) loadStaff();
  }, [company?.id]);

  const loadStaff = async () => {
    try {
      setIsLoading(true);
      const data = await staffService.getAll(company!.id);
      setStaff(data);
    } catch (err) {
      console.error("Error al cargar personal:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSellersCount = () => staff.filter(s => s.role === 'REPRESENTATIVE').length;

  const getPlanLimits = () => {
    switch (company?.plan) {
      case 'Starter': return 3;
      case 'Professional': return 10;
      case 'Enterprise': return 20;
      default: return 3;
    }
  };

  const generateID = (city: string, role: UserRole) => {
    const cityCode = city.substring(0, 3).toUpperCase();
    let roleCode = 'USR';
    if (role === 'ADMIN') roleCode = 'ADM';
    else if (role === 'WAREHOUSE_ADMIN') roleCode = 'BOD';
    else if (role === 'REPRESENTATIVE') roleCode = 'VEN';
    else if (role === 'DELIVERER') roleCode = 'ENT';
    else if (role === 'SUPERVISOR') roleCode = 'SUP';
    
    const random = Math.floor(100 + Math.random() * 900);
    return `${cityCode}-DM-${roleCode}-${random}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("ID Copiado al portapapeles");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;

    if (formData.role === 'REPRESENTATIVE') {
      const currentCount = getSellersCount();
      const limit = getPlanLimits();
      if (currentCount >= limit) {
        alert(`❌ LÍMITE DE PLAN ALCANZADO\n\nTu plan ${company.plan} permite máximo ${limit} vendedores.`);
        return;
      }
    }

    try {
      const newID = generateID(formData.city, formData.role);
      const payload = {
        company_id: company.id,
        email: formData.email.toLowerCase(),
        full_name: formData.name,
        role: formData.role,
        city: formData.city,
        sku: newID, // Guardamos el ID generado en el campo SKU del perfil
        avatar_url: `https://i.pravatar.cc/150?u=${newID}`
      };

      await staffService.create(payload);
      alert(`COLABORADOR REGISTRADO CON ÉXITO\n\nEl ID de ingreso es: ${newID}\n\nPor favor entréguelo al colaborador.`);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', role: 'REPRESENTATIVE', city: 'Bogotá' });
      loadStaff();
    } catch (err: any) {
      alert("Error al registrar colaborador: " + err.message);
    }
  };

  const sellersCount = getSellersCount();
  const sellersLimit = getPlanLimits();

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden font-sans relative">
      <header className="bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-800 p-8 shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Personal y Roles</h1>
            <div className="flex items-center gap-3 mt-1">
               <p className="text-slate-500 text-sm italic">Gestión de credenciales para App Móvil</p>
            </div>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined">person_add</span>
            Nuevo Colaborador
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-6">
          
          {/* Alerta de Capacidad */}
          <div className="p-6 bg-blue-50 border border-blue-100 rounded-[32px] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
                   <span className="material-symbols-outlined">badge</span>
                </div>
                <div>
                   <p className="text-xs font-black text-slate-900 uppercase">Capacidad de Tropa</p>
                   <p className="text-[10px] text-slate-500 font-bold uppercase">Plan {company?.plan}: {sellersLimit} Vendedores Máximo</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                   <div className="h-full bg-primary" style={{ width: `${(sellersCount/sellersLimit)*100}%` }}></div>
                </div>
                <span className="text-xs font-black text-primary">{sellersCount}/{sellersLimit}</span>
             </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] animate-pulse">Sincronizando Staff...</div>
          ) : (
            <div className="bg-white dark:bg-surface-dark rounded-[40px] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-white/5">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-8 py-6">Colaborador / Ciudad</th>
                    <th className="px-8 py-6">ID de Acceso (Único)</th>
                    <th className="px-8 py-6">Rol de Sistema</th>
                    <th className="px-8 py-6">Estatus</th>
                    <th className="px-8 py-6 text-right">Mando</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {staff.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-4">
                           <div className="size-11 rounded-2xl bg-cover bg-center border-2 border-white shadow-md shrink-0" style={{ backgroundImage: `url(${member.avatar_url})` }}></div>
                           <div className="min-w-0">
                             <p className="font-black text-slate-900 dark:text-white text-sm uppercase truncate">{member.full_name}</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{member.city} • {member.email}</p>
                           </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <span className="px-4 py-2 bg-slate-900 text-primary font-mono text-xs font-black rounded-xl tracking-widest border border-primary/20 shadow-inner group-hover:scale-105 transition-transform">
                              {member.sku || 'N/A-SYSTEM'}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(member.sku)}
                              className="size-8 rounded-lg bg-slate-50 text-slate-400 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                              title="Copiar ID"
                            >
                               <span className="material-symbols-outlined text-[18px]">content_copy</span>
                            </button>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                          member.role === 'ADMIN' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                          member.role === 'SUPERVISOR' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                          member.role === 'REPRESENTATIVE' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {member.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`size-2 rounded-full ${!member.active ? 'bg-slate-300' : 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse'}`}></span>
                          <span className="text-[10px] font-black uppercase text-slate-400">{member.active ? 'Online' : 'Inactivo'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                         <button className="p-2 text-slate-300 hover:text-primary transition-colors"><span className="material-symbols-outlined">settings_account_box</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a2632] rounded-[48px] shadow-2xl border border-gray-100 dark:border-[#2a3b4c] flex flex-col overflow-hidden animate-in zoom-in duration-300">
             <div className="p-10 border-b border-gray-100 bg-slate-50/50">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Registrar Staff</h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">El sistema generará el ID de ingreso automáticamente</p>
             </div>
             
             <form onSubmit={handleSubmit} className="p-10 space-y-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                    <input required className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 rounded-2xl text-sm font-bold focus:border-primary outline-none" placeholder="Ej: Mario Duarte" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad Base</label>
                        <select className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}>
                          <option>Bogotá</option>
                          <option>Medellín</option>
                          <option>Cali</option>
                        </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1">Rol Operativo</label>
                        <select required className="w-full h-14 px-5 bg-primary/5 border-2 border-primary/20 rounded-2xl text-[10px] font-black text-primary uppercase" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as UserRole})}>
                          <option value="REPRESENTATIVE">Vendedor (SFA)</option>
                          <option value="SUPERVISOR">Supervisor</option>
                          <option value="DELIVERER">Entregador</option>
                          <option value="WAREHOUSE_ADMIN">Bodega</option>
                        </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Corporativo</label>
                    <input required type="email" className="w-full h-14 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold" placeholder="staff@distribuidora.co" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <button type="submit" className="w-full h-20 bg-primary text-white rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                  Crear Acceso y Generar ID
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};