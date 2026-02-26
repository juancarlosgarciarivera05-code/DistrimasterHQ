
import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../types';
import { productService } from '../services/api';
import { useAuth } from '../components/AuthProvider';

export const AdminProducts: React.FC = () => {
  const { company } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    category: 'Herramientas Eléctricas',
    price: '',
    stock: '',
    weight_kg: '1',
    image_url: '',
    is_promo: false,
    promo_price: ''
  });

  useEffect(() => {
    loadProducts();
  }, [company?.id]);

  const loadProducts = async () => {
    if (!company?.id) return;
    try {
      setIsLoading(true);
      const data = await productService.getAll(company.id);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company?.id) return;

    try {
      const payload = {
        company_id: company.id,
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        weight_kg: parseFloat(newProduct.weight_kg),
        promo_price: newProduct.promo_price ? parseFloat(newProduct.promo_price) : null
      };

      await productService.create(payload);
      setIsDrawerOpen(false);
      loadProducts();
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  const resetForm = () => {
    setNewProduct({ name: '', sku: '', category: 'Herramientas Eléctricas', price: '', stock: '', weight_kg: '1', image_url: '', is_promo: false, promo_price: '' });
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...new Set(products.map(p => p.category))];

  return (
    <div className="flex-1 flex flex-col bg-[#f8fafc] dark:bg-[#0a0c10] overflow-hidden font-sans relative">
      <header className="h-24 px-10 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white dark:bg-[#0d1117]/80 backdrop-blur-xl shrink-0 z-20">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Gestión de SKUs</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Control Maestro de Inventario</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 mr-6">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase">Valuación Total</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">$452.8M</span>
             </div>
             <div className="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase">Referencias</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{products.length}</span>
             </div>
          </div>
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="h-14 px-8 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-blue-600 transition-all flex items-center gap-3"
          >
            <span className="material-symbols-outlined">add_box</span> Nuevo Producto
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1600px] mx-auto space-y-8">
          
          {/* BARRA DE FILTROS TÁCTICOS */}
          <div className="bg-white dark:bg-[#1a242d] p-4 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-sm flex flex-col lg:flex-row gap-6 items-center">
             <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-5 top-3.5 text-slate-400">search</span>
                <input 
                  type="text" 
                  className="w-full h-14 pl-14 pr-6 bg-slate-50 dark:bg-slate-900/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Buscar por Nombre, Marca o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 custom-scrollbar w-full lg:w-auto">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${categoryFilter === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-transparent hover:border-slate-200'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          {isLoading ? (
            <div className="py-40 text-center animate-pulse">
               <div className="size-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
               <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">Sincronizando Almacén...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
               {filteredProducts.map(p => (
                 <div key={p.id} className="bg-white dark:bg-[#1a242d] rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                       <img src={p.image_url || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 flex flex-col gap-2">
                          <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase rounded-lg border border-white/10 tracking-widest">{p.category}</span>
                          {p.is_promo && <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg shadow-lg animate-pulse">Oferta</span>}
                       </div>
                       <button className="absolute top-4 right-4 size-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary">
                          <span className="material-symbols-outlined text-xl">edit</span>
                       </button>
                    </div>
                    
                    <div className="p-8">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight uppercase line-clamp-1">{p.name}</h3>
                            <p className="text-[10px] font-mono text-primary font-black uppercase mt-1">SKU: {p.sku}</p>
                          </div>
                       </div>

                       <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                             <span className={p.stock < 10 ? 'text-red-500' : 'text-slate-400'}>Salud de Stock</span>
                             <span className="dark:text-white">{p.stock} Uni</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${p.stock < 10 ? 'bg-red-500' : p.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock / 200) * 100)}%` }}></div>
                          </div>
                       </div>

                       <div className="flex justify-between items-end">
                          <div className="flex flex-col">
                             <span className="text-[9px] font-black text-slate-400 uppercase">Precio Base</span>
                             <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">${Number(p.is_promo ? p.promo_price : p.price).toLocaleString()}</span>
                                {p.is_promo && <span className="text-xs text-slate-400 line-through font-bold">${Number(p.price).toLocaleString()}</span>}
                             </div>
                          </div>
                          <button className="size-12 bg-slate-900 dark:bg-white/5 text-white dark:text-white rounded-2xl flex items-center justify-center hover:bg-primary transition-all">
                             <span className="material-symbols-outlined">analytics</span>
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}
        </div>
      </main>

      {/* DRAWER DE CREACIÓN OPTIMIZADO */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] animate-in fade-in" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-[#1a242d] shadow-2xl z-[110] animate-in slide-in-from-right duration-500 border-l border-white/5 flex flex-col">
            <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
               <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ficha Técnica</h2>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">Nuevo Registro Maestro</p>
               </div>
               <button onClick={() => setIsDrawerOpen(false)} className="size-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-sm"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10 flex-1 overflow-y-auto custom-scrollbar space-y-10">
               <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial del Producto</label>
                     <input required className="w-full h-16 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-lg font-black focus:border-primary focus:ring-0" placeholder="Ej: Arroz Premium 1kg" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código SKU</label>
                        <input required className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-sm font-bold uppercase" placeholder="ABC-001" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                        <select className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-sm font-bold" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                           <option>Abarrotes</option>
                           <option>Bebidas</option>
                           <option>Limpieza</option>
                           <option>Cuidado Personal</option>
                           <option>Herramientas</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio ($)</label>
                        <input required type="number" className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-sm font-black text-primary" placeholder="0" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Inicial</label>
                        <input required type="number" className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-sm font-black" placeholder="0" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (Kg)</label>
                        <input required type="number" step="0.1" className="w-full h-14 px-6 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-white/5 rounded-2xl text-sm font-black" placeholder="1.0" value={newProduct.weight_kg} onChange={e => setNewProduct({...newProduct, weight_kg: e.target.value})} />
                     </div>
                  </div>

                  <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/10 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-primary uppercase tracking-tight">Motor de Promociones</span>
                           <span className="text-[10px] text-slate-500 font-bold uppercase">Habilitar precio de oferta</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={newProduct.is_promo} onChange={e => setNewProduct({...newProduct, is_promo: e.target.checked})} />
                           <div className="w-14 h-7 bg-slate-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all shadow-inner"></div>
                        </label>
                     </div>
                     {newProduct.is_promo && (
                       <div className="animate-in slide-in-from-top-4 duration-300">
                          <label className="text-[10px] font-black text-primary uppercase tracking-widest ml-1 mb-2 block">Precio Promocional ($)</label>
                          <input type="number" className="w-full h-14 px-6 bg-white dark:bg-slate-900 border-2 border-primary/20 rounded-2xl text-lg font-black text-red-500" placeholder="Ingresa precio con descuento..." value={newProduct.promo_price} onChange={e => setNewProduct({...newProduct, promo_price: e.target.value})} />
                       </div>
                     )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Imagen del Producto</label>
                    <div onClick={() => fileInputRef.current?.click()} className="h-44 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[32px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 cursor-pointer hover:border-primary transition-all overflow-hidden relative group">
                       {newProduct.image_url ? (
                         <img src={newProduct.image_url} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-center">
                            <span className="material-symbols-outlined text-slate-300 text-5xl mb-2 group-hover:scale-110 transition-transform">add_a_photo</span>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargar Media</p>
                         </div>
                       )}
                       <input type="file" ref={fileInputRef} onChange={(e) => {
                         const file = e.target.files?.[0];
                         if (file) {
                           const reader = new FileReader();
                           reader.onloadend = () => setNewProduct(prev => ({ ...prev, image_url: reader.result as string }));
                           reader.readAsDataURL(file);
                         }
                       }} className="hidden" accept="image/*" />
                    </div>
                  </div>
               </div>

               <div className="pt-4">
                  <button type="submit" className="w-full h-20 bg-primary text-white rounded-[28px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4">
                    Guardar y Sincronizar <span className="material-symbols-outlined">cloud_upload</span>
                  </button>
               </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};
