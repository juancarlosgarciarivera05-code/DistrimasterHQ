import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { productService, orderService } from '../services/api';
import { useAuth } from '../components/AuthProvider';

export const RepOrder: React.FC = () => {
  const { company, user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (company?.id) loadProducts();
  }, [company?.id]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getAll(company!.id);
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (product: any, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = existing.quantity + delta;
        if (newQty <= 0) return prev.filter(item => item.id !== product.id);
        if (newQty > product.stock) {
           alert("Stock insuficiente.");
           return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQty } : item);
      }
      if (delta > 0) return [...prev, { ...product, quantity: delta }];
      return prev;
    });
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + ((item.is_promo ? item.promo_price : item.price) * item.quantity), 0);
    const iva = subtotal * 0.19;
    return { subtotal, total: subtotal + iva };
  };

  const totals = calculateTotals();

  const handleSubmitOrder = async () => {
    if (cart.length === 0 || !company?.id || !user?.id) return;
    try {
      setIsSubmitting(true);
      await orderService.createOrder({
        company_id: company.id,
        rep_id: user.id,
        total_amount: totals.total,
        status: 'PENDING'
      }, cart);
      alert("¡Pedido Sincronizado!");
      setCart([]);
      loadProducts();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-slate-50 dark:bg-background-dark font-sans overflow-hidden">
      <main className="flex-1 overflow-y-auto p-8">
        <header className="mb-8 flex justify-between items-center">
           <h1 className="text-3xl font-black uppercase italic">Toma de Pedido</h1>
           <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-64 h-12 px-6 rounded-2xl border-none shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
           />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
           {filtered.map(p => (
             <div key={p.id} className="bg-white p-6 rounded-[32px] border shadow-sm group">
                <div className="aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-4">
                  <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <h3 className="font-bold text-slate-900 uppercase truncate">{p.name}</h3>
                <p className="text-primary font-black mt-2">${p.price.toLocaleString()}</p>
                <button onClick={() => updateQuantity(p, 1)} className="mt-4 w-full h-10 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">Añadir al Carro</button>
             </div>
           ))}
        </div>
      </main>

      <aside className="w-full lg:w-96 bg-white border-l p-8 flex flex-col gap-8 shadow-2xl">
         <h2 className="text-xl font-black uppercase italic border-b pb-4">Carrito</h2>
         <div className="flex-1 overflow-y-auto space-y-4">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                 <div className="min-w-0">
                    <p className="text-xs font-black truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-400">{item.quantity} Uni</p>
                 </div>
                 <button onClick={() => updateQuantity(item, -1)} className="text-red-500 material-symbols-outlined">delete</button>
              </div>
            ))}
         </div>
         <div className="pt-4 border-t space-y-4">
            <div className="flex justify-between font-black"><span>Total + IVA</span><span className="text-primary">${totals.total.toLocaleString()}</span></div>
            <button 
              disabled={cart.length === 0 || isSubmitting}
              onClick={handleSubmitOrder}
              className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase shadow-xl disabled:opacity-30"
            >
              Transmitir Pedido
            </button>
         </div>
      </aside>
    </div>
  );
};