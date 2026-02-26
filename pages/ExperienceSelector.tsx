import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';

interface ExperienceCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  buttonText: string;
  color: string;
  onClick: () => void;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ title, description, icon, buttonText, color, onClick }) => {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  };

  const colorClasses = colorMap[color] || colorMap.primary;

  return (
    <div 
      onClick={onClick}
      className="group bg-white/[0.02] backdrop-blur-3xl p-8 rounded-[40px] border border-white/5 hover:border-white/20 transition-all cursor-pointer flex flex-col h-full shadow-2xl hover:-translate-y-2 relative overflow-hidden"
    >
      <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border ${colorClasses}`}>
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-3 italic group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-slate-400 text-xs font-medium leading-relaxed mb-6 flex-1">
        {description}
      </p>
      <button className={`w-full py-4 rounded-2xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest group-hover:bg-primary group-hover:text-white transition-all`}>
        {buttonText}
      </button>
    </div>
  );
};

export const ExperienceSelector: React.FC = () => {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const LOGO_URL = 'https://htmllisto.com/dm_logo_email.png';

  const handleSelect = (profile: any) => {
    loginDemo(profile, 'Enterprise');
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-primary selection:text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl w-full z-10 space-y-12">
        <div className="text-center space-y-4">
          <img src={LOGO_URL} alt="DistriMaster HQ" className="h-12 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(19,127,236,0.3)]" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
            Explora DistriMaster según tu <span className="text-primary">Rol Operativo</span>
          </h1>
          <p className="text-slate-400 text-base font-medium max-w-3xl mx-auto italic">
            Descubre cómo funciona la plataforma desde diferentes perspectivas operativas. Selecciona el módulo que más te interese y navega con datos de prueba reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExperienceCard 
            id="admin"
            title="Administración"
            description="Panel estratégico para dueños y gerentes. Visualiza indicadores, inventario, ventas y control operativo completo de la empresa."
            icon="admin_panel_settings"
            buttonText="Explorar Administración"
            color="primary"
            onClick={() => handleSelect('ADMIN_GLOBAL')}
          />
          <ExperienceCard 
            id="supervisor"
            title="Supervisión"
            description="Monitorea vendedores, rutas, cumplimiento y desempeño en tiempo real. Ideal para supervisores comerciales y coordinadores de operación."
            icon="radar"
            buttonText="Explorar Supervisión"
            color="indigo"
            onClick={() => handleSelect('SUPERVISOR_DEMO')}
          />
          <ExperienceCard 
            id="warehouse"
            title="Jefe de Bodega"
            description="Gestiona inventario, entradas, salidas, picking y control de stock. Vive la experiencia operativa del almacén."
            icon="inventory_2"
            buttonText="Explorar Bodega"
            color="amber"
            onClick={() => handleSelect('BOD_ADMIN')}
          />
          <ExperienceCard 
            id="sales"
            title="Vendedor"
            description="Simula la creación de pedidos, gestión de clientes y catálogo digital desde el punto de venta. Experimenta la operación comercial en campo."
            icon="storefront"
            buttonText="Explorar Ventas"
            color="emerald"
            onClick={() => handleSelect('REP_BOGOTA')}
          />
          <ExperienceCard 
            id="delivery"
            title="Entregador"
            description="Visualiza rutas, entregas pendientes, confirmaciones y logística de distribución en tiempo real."
            icon="local_shipping"
            buttonText="Explorar Entregas"
            color="sky"
            onClick={() => handleSelect('DELIVERER_MASTER')}
          />
          <ExperienceCard 
            id="analytics"
            title="Analítica Inteligente"
            description="Descubre predicciones, métricas y análisis automatizados con IA para optimizar decisiones estratégicas."
            icon="auto_awesome"
            buttonText="Explorar Analítica"
            color="violet"
            onClick={() => handleSelect('IA_PREDICTIVE')}
          />
        </div>

        <div className="text-center space-y-6">
          <p className="text-xs font-bold text-slate-500 italic">
            Puedes navegar libremente. Los datos son de prueba y se reinician automáticamente al salir del sistema.
          </p>
          <button 
            onClick={() => navigate('/onboarding')}
            className="text-[10px] font-black text-primary uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            Volver al Hub de Onboarding
          </button>
        </div>
      </div>
    </div>
  );
};
