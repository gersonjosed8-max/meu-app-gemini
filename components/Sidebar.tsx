
import React from 'react';
import { 
  FileText, Map as MapIcon, Settings, LogOut, Database, 
  Activity, LayoutDashboard, HelpCircle, History 
} from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  user: User;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  const menuItems = [
    { id: 'admin', icon: LayoutDashboard, label: 'Dashboard', roles: [UserRole.ADMIN] },
    { id: 'editor', icon: FileText, label: 'Translator Editor', roles: [UserRole.ADMIN, UserRole.TRANSLATOR] },
    { id: 'glossary', icon: Database, label: 'Koti Glossary', roles: [UserRole.ADMIN, UserRole.TRANSLATOR] },
    { id: 'history', icon: History, label: 'Histórico', roles: [UserRole.ADMIN, UserRole.TRANSLATOR] },
    { id: 'maps', icon: MapIcon, label: 'Mapas Bíblicos', roles: [UserRole.ADMIN, UserRole.TRANSLATOR] },
    { id: 'manual', icon: HelpCircle, label: 'Manual', roles: [UserRole.ADMIN, UserRole.TRANSLATOR, UserRole.READER] },
    { id: 'qc', icon: Activity, label: 'Team Approval', roles: [UserRole.ADMIN] },
  ];

  return (
    <aside className="w-72 bg-zinc-950 flex flex-col border-r border-zinc-900 shrink-0 z-50">
      <div className="p-8 flex-1 flex flex-col">
        <div className="mb-10 group cursor-default">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-2xl shadow-blue-900/40 group-hover:rotate-6 transition-transform text-white">
              G
            </div>
            <div>
              <div className="font-black text-xl tracking-tighter text-white">GERGER.GE</div>
              <div className="text-[9px] text-blue-500 font-bold tracking-[0.2em] uppercase leading-none">Professional Suite</div>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-blue-600/50 via-zinc-800 to-transparent mt-4"></div>
        </div>

        <nav className="space-y-3">
          {menuItems.filter(item => item.roles.includes(user.role)).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)] ring-1 ring-blue-500/50' 
                    : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-100 hover:translate-x-1'
                }`}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
                )}
                
                <item.icon 
                  size={20} 
                  className={`transition-all duration-500 ${
                    isActive 
                      ? 'text-white scale-110' 
                      : 'text-zinc-700 group-hover:text-blue-500 group-hover:scale-110'
                  }`} 
                />
                
                <span className={`text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive ? 'italic' : 'opacity-80'
                }`}>
                  {item.label}
                </span>

                {/* Subtle shine effect on hover */}
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-8 space-y-4 border-t border-zinc-900 bg-black/20">
        <button 
          onClick={() => setActiveTab('preferences')}
          className={`w-full flex items-center space-x-4 px-5 py-3 transition-all duration-300 rounded-xl group ${
            activeTab === 'preferences' 
              ? 'text-blue-400 bg-blue-500/5 ring-1 ring-blue-500/20 shadow-lg' 
              : 'text-zinc-600 hover:text-zinc-200 hover:bg-zinc-900'
          }`}
        >
          <Settings size={18} className={`transition-transform duration-500 group-hover:rotate-90 ${activeTab === 'preferences' ? 'text-blue-500' : ''}`} />
          <span className="text-[10px] font-black uppercase tracking-widest">Preferências</span>
        </button>
        
        <button 
          onClick={() => window.location.reload()}
          className="w-full flex items-center space-x-4 px-5 py-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Sair da Suite</span>
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </aside>
  );
};
