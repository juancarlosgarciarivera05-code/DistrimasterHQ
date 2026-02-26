
import React, { useState } from 'react';

interface VercelLog {
  id: string;
  time: string;
  status: number;
  host: string;
  request: string;
  message: string;
  level: 'info' | 'warn' | 'error';
}

const MOCK_VERCEL_LOGS: VercelLog[] = [
  { 
    id: '1', 
    time: 'FEB 13 12:48:25.71', 
    status: 404, 
    host: 'www.distrimaster...', 
    request: '/.well-known/traffic-advice', 
    message: 'The requested URL was not found on this server.',
    level: 'warn'
  },
  { 
    id: '2', 
    time: 'FEB 13 12:48:24.94', 
    status: 307, 
    host: 'distrimasterhq.s...', 
    request: '/.well-known/traffic-advice', 
    message: 'Redirecting to canonical www domain.',
    level: 'info'
  },
  { 
    id: '3', 
    time: 'FEB 13 12:45:10.22', 
    status: 200, 
    host: 'www.distrimaster...', 
    request: '/index.tsx', 
    message: 'GET 200 /index.tsx - 45ms',
    level: 'info'
  },
  { 
    id: '4', 
    time: 'FEB 13 12:42:05.11', 
    status: 200, 
    host: 'www.distrimaster...', 
    request: '/api/v1/sync', 
    message: 'Database synchronization successful via Supabase Edge.',
    level: 'info'
  },
];

export const AdminSystemLogs: React.FC = () => {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(true);

  return (
    <div className="flex-1 flex flex-col h-full bg-white text-[#171717] font-sans selection:bg-[#0070f3]/20 overflow-hidden">
      {/* BARRA DE HERRAMIENTAS SUPERIOR */}
      <header className="h-16 border-b border-[#eaeaea] flex items-center px-4 gap-4 bg-white shrink-0 z-50">
        <div className="flex items-center gap-2 border border-[#eaeaea] rounded-md p-1 bg-[#fafafa]">
           <button className="p-1.5 hover:bg-white rounded transition-colors shadow-sm"><span className="material-symbols-outlined !text-[20px] text-[#666]">filter_list</span></button>
           <button className="p-1.5 hover:bg-white rounded transition-colors"><span className="material-symbols-outlined !text-[20px] text-[#666]">person</span></button>
           <button className="p-1.5 hover:bg-white rounded transition-colors"><span className="material-symbols-outlined !text-[20px] text-[#666]">view_column</span></button>
        </div>
        
        <div className="flex-1 flex items-center gap-2 border border-[#eaeaea] rounded-md px-3 h-10 bg-white focus-within:border-black transition-colors group">
           <span className="material-symbols-outlined !text-[18px] text-[#999]">search</span>
           <div className="flex gap-2 items-center overflow-hidden">
              <span className="bg-[#f3f3f3] px-2 py-0.5 rounded text-[11px] font-medium text-[#666] whitespace-nowrap border border-[#eaeaea]">deployment:distri-master-m5pqhmm3d</span>
              <span className="bg-[#f3f3f3] px-2 py-0.5 rounded text-[11px] font-medium text-[#666] whitespace-nowrap border border-[#eaeaea]">branch:main</span>
              <input className="border-none outline-none text-sm w-full bg-transparent" placeholder="Search logs..." />
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-4 h-10 rounded-md border border-[#eaeaea] text-sm font-medium transition-all ${isLive ? 'bg-white text-black' : 'bg-[#fafafa] text-[#666]'}`}
           >
              <span className={`size-2 rounded-full ${isLive ? 'bg-[#0070f3] shadow-[0_0_8px_#0070f3] animate-pulse' : 'bg-gray-300'}`}></span>
              Live
           </button>
           <button className="p-2 border border-[#eaeaea] rounded-md hover:bg-[#fafafa]"><span className="material-symbols-outlined !text-[20px] text-[#666]">refresh</span></button>
           <button className="p-2 border border-[#eaeaea] rounded-md hover:bg-[#fafafa]"><span className="material-symbols-outlined !text-[20px] text-[#666]">more_vert</span></button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR DE FILTROS ESTILO VERCEL */}
        <aside className="w-[280px] border-r border-[#eaeaea] bg-white overflow-y-auto custom-scrollbar shrink-0">
           <div className="p-4 border-b border-[#eaeaea] flex justify-between items-center">
              <span className="text-xs font-bold text-black uppercase tracking-tight">Filters</span>
              <button className="text-[11px] text-[#666] hover:text-black font-medium border border-[#eaeaea] px-2 py-1 rounded bg-[#fafafa]">Reset</button>
           </div>
           
           <div className="divide-y divide-[#eaeaea]">
              {[
                { label: 'Timeline', icon: 'keyboard_arrow_down', content: 'Last 30 minutes' },
                { label: 'Contains Console Level', icon: 'keyboard_arrow_down', isCheck: true, items: ['Warning', 'Error', 'Fatal'] },
                { label: 'Resource', icon: 'keyboard_arrow_right' },
                { label: 'Environment', icon: 'keyboard_arrow_right' },
                { label: 'Route', icon: 'keyboard_arrow_right' },
                { label: 'Status Code', icon: 'keyboard_arrow_right' },
                { label: 'Host', icon: 'keyboard_arrow_right' }
              ].map((group, i) => (
                <div key={i} className="p-4 space-y-4">
                   <div className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined !text-[18px] text-[#999] group-hover:text-black">{group.icon}</span>
                        <span className="text-[13px] font-semibold text-black">{group.label}</span>
                      </div>
                   </div>
                   {group.content && (
                     <div className="ml-6 border border-[#eaeaea] rounded-md p-2 flex justify-between items-center text-xs text-black cursor-pointer hover:bg-[#fafafa]">
                        <span>{group.content}</span>
                        <span className="material-symbols-outlined !text-[16px] text-[#999]">expand_more</span>
                     </div>
                   )}
                   {group.isCheck && (
                     <div className="ml-6 space-y-3">
                        {group.items?.map(item => (
                          <div key={item} className="flex items-center justify-between group">
                             <div className="flex items-center gap-2">
                                <input type="checkbox" className="size-4 rounded border-[#eaeaea] text-black focus:ring-0" />
                                <span className="text-[13px] text-[#666] group-hover:text-black">{item}</span>
                             </div>
                             <span className="text-[13px] text-[#999]">0</span>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
              ))}
           </div>
        </aside>

        {/* LOGS LIST AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
           {/* HISTOGRAMA DINÁMICO */}
           <div className="h-24 border-b border-[#eaeaea] px-6 py-4 flex flex-col justify-end bg-white">
              <div className="flex items-end gap-1 h-12 w-full">
                 {Array.from({length: 80}).map((_, i) => (
                   <div key={i} 
                    className={`flex-1 rounded-t-[1px] transition-all ${
                      i === 15 ? 'h-10 bg-[#f5a623]' : 
                      i === 14 ? 'h-6 bg-[#0070f3]' : 
                      i > 10 && i < 20 ? 'h-4 bg-[#eaeaea]' : 'h-1 bg-[#fafafa]'
                    }`}
                   ></div>
                 ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-[#999] font-medium font-mono uppercase">
                 <span>12:21:00</span>
                 <span>12:29:50</span>
                 <span>12:38:20</span>
                 <span>12:51:00</span>
              </div>
           </div>

           {/* CABECERA DE TABLA */}
           <div className="grid grid-cols-12 bg-white border-b border-[#eaeaea] text-[11px] font-medium text-[#666] uppercase tracking-wider px-6 py-2 sticky top-0 z-20">
              <div className="col-span-2">Time</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Host</div>
              <div className="col-span-3">Request</div>
              <div className="col-span-4">Messages</div>
           </div>

           {/* FILAS DE LOGS */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
              {MOCK_VERCEL_LOGS.map((log) => (
                <div 
                  key={log.id} 
                  className={`grid grid-cols-12 px-6 py-3 border-b border-[#fafafa] hover:bg-[#fafafa] transition-colors cursor-pointer group items-start ${log.level === 'warn' ? 'bg-[#fffcf0]' : ''}`}
                >
                   <div className="col-span-2 flex items-center gap-3">
                      {log.level === 'warn' && <span className="material-symbols-outlined !text-[16px] text-[#f5a623]">warning</span>}
                      <span className="text-[12px] font-mono text-[#666] uppercase">{log.time}</span>
                   </div>
                   <div className="col-span-1">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${log.status >= 400 ? 'text-[#f5a623] bg-[#f5a623]/10' : 'text-[#666] bg-[#f0f0f0]'}`}>{log.status}</span>
                   </div>
                   <div className="col-span-2 text-[12px] text-[#666] truncate pr-4 font-medium">{log.host}</div>
                   <div className="col-span-3 flex items-center gap-2">
                      <span className="material-symbols-outlined !text-[16px] text-[#999]">language</span>
                      <span className="text-[12px] font-mono text-black truncate">{log.request}</span>
                   </div>
                   <div className="col-span-4">
                      <p className="text-[12px] text-[#666] line-clamp-1 group-hover:line-clamp-none transition-all">{log.message}</p>
                   </div>
                </div>
              ))}
              
              <div className="py-20 flex flex-col items-center justify-center text-center px-10">
                 <p className="text-[13px] text-[#666] font-medium">No more logs to show within selected timeline</p>
              </div>
           </div>
        </main>
      </div>

      {/* FOOTER TÉCNICO VERCEL STYLE */}
      <footer className="h-10 border-t border-[#eaeaea] bg-[#fafafa] px-6 flex items-center justify-between shrink-0 z-50">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <span className="size-2 rounded-full bg-[#0070f3] animate-pulse"></span>
               <span className="text-[10px] font-bold text-black uppercase tracking-tight">Deployment Online</span>
            </div>
            <span className="text-[10px] font-medium text-[#666] uppercase tracking-widest">distri-master-m5pqhmm3d-distrimasterhqs-projects.vercel.app</span>
         </div>
         <div className="flex items-center gap-4 text-[10px] font-bold text-[#666] uppercase tracking-widest">
            <span>Branch: main</span>
            <span className="text-[#eaeaea]">|</span>
            <span>Region: Southamerica-East1</span>
         </div>
      </footer>
    </div>
  );
};
