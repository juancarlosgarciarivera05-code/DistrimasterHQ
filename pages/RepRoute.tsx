
import React, { useState } from 'react';
// Fix: Change 'react-router-dom' to 'react-router' to resolve exported member errors
import { useNavigate } from 'react-router';
import { getGeminiResponse } from '../services/geminiService.ts';

interface RouteDefinition {
  id: string;
  name: string;
  type: 'Preventa' | 'Autoventa';
  clientCount: number;
  estimatedTime: string;
  description: string;
  color: string;
  icon: string;
}

interface RouteStop {
  id: number;
  type: 'Preventa' | 'Autoventa';
  name: string;
  address: string;
  eta: string;
  priority?: 'Alta' | 'Normal';
  status: 'pending' | 'active' | 'completed';
  customerId?: string; 
}

const AVAILABLE_ROUTES: RouteDefinition[] = [
  { id: 'R-NORTH', name: 'Ruta Norte - Sector A', type: 'Autoventa', clientCount: 12, estimatedTime: '6h 30m', description: 'Zona comercial norte.', color: 'blue', icon: 'local_shipping' },
  { id: 'R-CENTER', name: 'Centro / Galerías', type: 'Preventa', clientCount: 18, estimatedTime: '7h 15m', description: 'Casco histórico.', color: 'purple', icon: 'assignment_ind' }
];

const INITIAL_STOPS: RouteStop[] = [
  { id: 1, customerId: 'CUST-001', type: 'Preventa', name: 'Supermercado El Sol', address: 'Av. Principal 123', eta: '08:30 AM', priority: 'Alta', status: 'active' },
  { id: 2, customerId: 'CUST-002', type: 'Autoventa', name: 'Abarrotes Doña Maria', address: 'Calle 5 de Mayo #45', eta: '09:15 AM', status: 'pending' }
];

export const RepRoute: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<RouteDefinition | null>(null);
  const [stops, setStops] = useState<RouteStop[]>(INITIAL_STOPS);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSelectRoute = (route: RouteDefinition) => {
    setSelectedRoute(route);
  };

  const handleStartVisit = (stop: RouteStop) => {
    const mode = selectedRoute?.type.toUpperCase() || 'PREVENTA';
    navigate(`/rep/visit-execution?customerId=${stop.customerId || 'GENERIC'}&customerName=${encodeURIComponent(stop.name)}&mode=${mode}`);
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const prompt = `Analiza esta ruta de ventas: ${stops.map(s => s.name).join(', ')}. Breve reporte.`;
      const response = await getGeminiResponse(prompt, []);
      console.log(response);
      setStops([...stops].sort((a, b) => (a.priority === 'Alta' ? -1 : 1)));
    } catch (e) {
      console.error(e);
    } finally {
      setIsOptimizing(false);
    }
  };

  if (!selectedRoute) {
    return (
      <div className="flex-1 p-10 bg-slate-50 dark:bg-background-dark">
          <h1 className="text-4xl font-black uppercase mb-10">Selecciona tu Ruta</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {AVAILABLE_ROUTES.map((route) => (
              <button key={route.id} onClick={() => handleSelectRoute(route)} className="bg-white p-8 rounded-[32px] text-left border hover:border-primary transition-all">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">{route.icon}</span>
                <h3 className="text-xl font-black uppercase">{route.name}</h3>
                <p className="text-sm text-slate-500 mt-2">{route.description}</p>
              </button>
            ))}
          </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-[420px] bg-white border-r flex flex-col">
        <div className="p-8 border-b bg-slate-50">
          <h1 className="text-xl font-black uppercase">{selectedRoute.name}</h1>
          <button onClick={handleOptimize} disabled={isOptimizing} className="mt-4 w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase shadow-xl">
            {isOptimizing ? 'Optimizando...' : 'Optimizar con IA'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {stops.map((stop, idx) => (
            <div key={stop.id} className={`p-6 rounded-3xl border ${idx === 0 ? 'border-primary bg-primary/5' : 'bg-white'}`}>
              <h4 className="font-black uppercase text-sm">{stop.name}</h4>
              <p className="text-[10px] text-slate-500 mt-1">{stop.address}</p>
              {idx === 0 && (
                <button onClick={() => handleStartVisit(stop)} className="mt-4 w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase">Iniciar Visita</button>
              )}
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 bg-slate-100 relative overflow-hidden">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA-o7NNIVilqcRptVNy7TdKCBUEj_7PUtP7GLWw3gzcxGsncdGDmZQCgM9a9bEjmL5WqHopROwcW_TH5k38ERGZ2xM6wRFBpmnkBLhoHUhcGV9e9P9AVYSv7oyGOFWXr8xZmyFKqR78qAk2sH6Kx1x_tOtg4uhkU3DiJm03AEGguG_1AIObLWSPtnlCnhrbVyys1SKpvIkkQWEhkYnwHpKlg5Fsd2wqhxhM_CtviU5zFv9bJ1z92pGGZ4o8pdlEoLa16ULhSFm3zjc4')", backgroundSize: 'cover' }}></div>
      </main>
    </div>
  );
};
