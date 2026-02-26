import React, { useState, useEffect, useRef } from 'react';
import { customerService, routeService } from '../services/api';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../services/supabaseClient';

declare var XLSX: any;

const MERCHANT_TYPES = [
  { id: 'Tienda', label: 'Tienda de Barrio', icon: 'storefront', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'Supermercado', label: 'Supermercado', icon: 'shopping_cart', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { id: 'Ferreteria', label: 'Ferretería', icon: 'build', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'Restaurante', label: 'Restaurante / Horeca', icon: 'restaurant', color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'Farmacia', label: 'Droguería / Farmacia', icon: 'medical_services', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'Otro', label: 'Otro / Especial', icon: 'category', color: 'text-slate-500', bg: 'bg-slate-50' },
];

export const RepMerchantConfig: React.FC = () => {
  const { company } = useAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    owner_name: '',
    address: '',
    city: '',
    barrio: '',
    merchant_type: 'Tienda',
    phone: '',
    zone: 'Norte',
    route_id: '',
    delivery_type: 'Pre'
  });

  useEffect(() => {
    if (company?.id) loadData();
  }, [company?.id]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [custList, routeList] = await Promise.all([
        customerService.getAll(company!.id),
        routeService.getAll(company!.id)
      ]);
      setCustomers(custList);
      setRoutes(routeList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;
    try {
      await customerService.create({ ...formData, company_id: company.id });
      alert("Comercio registrado exitosamente.");
      setFormData({ name: '', owner_name: '', address: '', city: '', barrio: '', merchant_type: 'Tienda', phone: '', zone: 'Norte', route_id: '', delivery_type: 'Pre' });
      loadData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      <header className="px-8 py-8 border-b border-slate-100 flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase tracking-tight">Maestro de Clientes</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <div className="bg-white dark:bg-[#1a242d] p-8 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5">
           <h3 className="text-xl font-black mb-8 uppercase tracking-tight text-slate-900 dark:text-white">Nuevo Comercio</h3>
           <form onSubmit={handleSubmit} className="space-y-5">
              <input required className="w-full h-12 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-sm font-bold dark:text-white" placeholder="Nombre del Negocio" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <button type="submit" className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-2xl">Registrar Comercio</button>
           </form>
        </div>
      </div>
    </div>
  );
};