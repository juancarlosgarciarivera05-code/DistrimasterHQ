
import React, { useState, useEffect } from 'react';
import { productService } from '../services/api';
import { useAuth } from '../components/AuthProvider';

export const RepCatalog: React.FC = () => {
  const { company } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  useEffect(() => {
    if (company?.id) loadCatalog();
  }, [company?.id]);

  const loadCatalog = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll(company!.id);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todas', ...new Set(products.map(p => p.category))];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-background-dark custom-scrollbar font-sans">
      <div className="max-w-[1400px] mx-auto w-full py-10 px-6">
        
        <header className="flex flex-wrap justify-between gap-8 mb-12 items-end">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Vitrina Digital</h1>
            <p className="text-slate-500 text-sm font-medium">Stock en tiempo real de <span className="text-primary font-black uppercase">{company?.name}</span></p>
          </div>
          <button onClick={loadCatalog} className="h-12 px-6 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-sm flex items-center gap-3 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-[18px]">sync</span> Actualizar Precios
          </button>
        </header>

        <div className="sticky top-0 z-40 bg-slate-50/80 dark:bg-background-dark/80 backdrop-blur-2xl py-6 mb-10 space-y-6">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-6 flex items-center text-slate-400 group-focus-within:text-primary transition-colors"><span className="material-symbols-outlined text-2xl">search</span></span>
            <input 
              type="text" 
              placeholder="¿Qué buscas hoy? (SKU o Nombre)" 
              className="w-full h-16 pl-16 pr-8 bg-white dark:bg-surface-dark border-none rounded-[28px] shadow-xl shadow-slate-200/50 dark:shadow-none focus:ring-2 focus:ring-primary text-base font-bold transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 px-2 no-scrollbar">
             {categories.map(cat => (
               <button 
                key={cat} 
                onClick={() => setCategoryFilter(cat)}
                className={`h-10 px-6 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${categoryFilter === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white dark:bg-surface-dark text-slate-500 border-slate-100 dark:border-white/5 hover:border-slate-300'}`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-40 text-center space-y-4">
             <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Verificando Disponibilidad...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-32">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white dark:bg-surface-dark rounded-[40px] border border-slate-100 dark:border-white/5 overflow-hidden hover:shadow-2xl transition-all group flex flex-col">
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={product.image_url || 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=600'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-lg backdrop-blur-md ${product.stock > 0 ? 'bg-emerald-500/80 text-white border-emerald-400' : 'bg-red-500/80 text-white border-red-400'}`}>
                      {product.stock > 0 ? `${product.stock} UNI` : 'OUT'}
                    </span>
                    {product.is_promo && <span className="px-3 py-1.5 bg-amber-500/90 text-white text-[9px] font-black uppercase rounded-xl shadow-lg border border-amber-400 tracking-widest">PROMO</span>}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-1 leading-tight uppercase line-clamp-2">{product.name}</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                       {product.is_promo ? (
                         <>
                           <span className="text-xl font-black text-red-500 tabular-nums">${Number(product.promo_price).toLocaleString()}</span>
                           <span className="text-[10px] text-slate-400 line-through font-bold">${Number(product.price).toLocaleString()}</span>
                         </>
                       ) : (
                         <span className="text-xl font-black text-primary tabular-nums">${Number(product.price).toLocaleString()}</span>
                       )}
                    </div>
                    <button className="w-full h-12 bg-slate-900 dark:bg-white/5 text-white dark:text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-md group-active:scale-95">
                       <span className="material-symbols-outlined text-lg">shopping_cart_checkout</span> Quick Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-40 text-center opacity-30">
                <span className="material-symbols-outlined text-8xl">inventory_2</span>
                <p className="font-black text-xl uppercase tracking-widest mt-6">Sin resultados en este filtro</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
