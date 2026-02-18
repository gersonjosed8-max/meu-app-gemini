
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { AdminDashboard } from './components/AdminDashboard';
import { Glossary } from './components/Glossary';
import { Maps } from './components/Maps';
import { Manual } from './components/Manual';
import { TeamApproval } from './components/TeamApproval';
import { Preferences } from './components/Preferences';
import { History } from './components/History';
import { Login } from './components/Login';
import { StatusBar } from './components/StatusBar';
import { User, UserRole } from './types';
import { ShieldCheck, Terminal } from 'lucide-react';

const GERSON_ADMIN: User = {
  id: 'admin-001',
  name: 'Gerson Jose De Jesus Selemane',
  email: 'gersonjosed8@gmail.com',
  role: UserRole.ADMIN,
  approved: true,
};

const INITIAL_TEAM: User[] = [
  { id: 'admin-001', name: 'Gerson Jose', email: 'gersonjosed8@gmail.com', role: UserRole.ADMIN, approved: true }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'glossary' | 'maps' | 'admin' | 'manual' | 'qc' | 'preferences' | 'history'>('admin');
  const [isLocked, setIsLocked] = useState(true);
  const [team, setTeam] = useState<User[]>(() => {
    const saved = localStorage.getItem('gerger_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM;
  });
  const [showSplash, setShowSplash] = useState(true);
  const [lastSaveTime, setLastSaveTime] = useState<string>(new Date().toLocaleTimeString());
  const [syncStatus, setSyncStatus] = useState<'Sincronizado' | 'Modo Offline' | 'Gravando...'>('Sincronizado');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('gerger_team', JSON.stringify(team));
  }, [team]);

  useEffect(() => {
    const handleSaveEvent = () => {
      setSyncStatus('Gravando...');
      setTimeout(() => {
        setSyncStatus('Sincronizado');
        setLastSaveTime(new Date().toLocaleTimeString());
      }, 1000);
    };
    window.addEventListener('gerger_save_trigger', handleSaveEvent);
    return () => window.removeEventListener('gerger_save_trigger', handleSaveEvent);
  }, []);

  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black select-none">
        <div className="relative mb-8">
          <div className="text-8xl font-black text-blue-600 animate-pulse tracking-tighter italic text-shadow-glow">GERGER</div>
          <div className="absolute -bottom-4 right-0 text-blue-400 font-bold tracking-[0.4em] text-xs">TRANSLATOR</div>
        </div>
        <div className="text-sm text-zinc-700 tracking-[0.8em] font-black uppercase mb-12 animate-in fade-in duration-1000">Zapuura Project Engine</div>
        <div className="flex items-center gap-3 text-zinc-800 text-[10px] font-black uppercase tracking-widest animate-bounce">
          <Terminal size={14} /> Protocolos de Gerson Iniciando...
        </div>
      </div>
    );
  }

  if (isLocked) {
    return (
      <Login 
        onLogin={(user) => {
          setCurrentUser(user);
          setIsLocked(false);
        }} 
        team={team} 
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black font-sans text-slate-200">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={currentUser!} 
      />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-[#09090b]">
        {activeTab !== 'editor' && (
          <header className="h-20 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between px-12 shrink-0 z-50 shadow-2xl">
            <div className="flex items-center space-x-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Gerson Professional Suite</span>
                <span className="text-xl text-blue-500 font-black tracking-tighter italic uppercase leading-none">ZAPUURA CORE ENGINE</span>
              </div>
              <div className="h-10 w-px bg-zinc-900"></div>
              <div className="flex items-center gap-4 text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em]">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
                Status: {currentUser?.role}
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="flex items-center justify-end gap-3 font-black text-white text-sm uppercase tracking-tight italic">
                  <ShieldCheck size={18} className="text-blue-600" />
                  {currentUser?.name}
                </div>
                <span className="text-[10px] text-zinc-700 uppercase tracking-widest font-black italic opacity-60">STABLE CORE V9.3.0</span>
              </div>
            </div>
          </header>
        )}

        <div className="flex-1 overflow-hidden relative bg-black">
          {activeTab === 'editor' && <Editor userRole={currentUser!.role} onBackToPanel={() => setActiveTab('admin')} />}
          {activeTab === 'glossary' && <Glossary />}
          {activeTab === 'maps' && <Maps />}
          {activeTab === 'manual' && <Manual />}
          {activeTab === 'preferences' && <Preferences user={currentUser!} />}
          {activeTab === 'history' && <History />}
          {activeTab === 'qc' && (
            <TeamApproval 
              team={team} 
              onApprove={(id) => setTeam(team.map(u => u.id === id ? {...u, approved: true} : u))}
              onReject={(id) => setTeam(team.filter(u => u.id !== id))}
            />
          )}
          {activeTab === 'admin' && currentUser?.role === UserRole.ADMIN && (
            <AdminDashboard 
              team={team} 
              onUpdateRole={(id, role) => setTeam(team.map(u => u.id === id ? {...u, role} : u))} 
              onAddMember={(m) => setTeam([...team, { ...m, id: Date.now().toString(), approved: true }])} 
              onDeleteMember={(id) => {
                if(id === 'admin-001') return;
                setTeam(team.filter(u => u.id !== id));
              }}
              onLaunchEditor={() => setActiveTab('editor')}
            />
          )}
        </div>

        <StatusBar 
          adminName={currentUser?.name || 'Administrador'} 
          syncStatus={syncStatus} 
          lastSaveTime={lastSaveTime}
        />
      </main>
      <style>{`
        .text-shadow-glow { text-shadow: 0 0 30px rgba(37, 99, 235, 0.5); }
      `}</style>
    </div>
  );
};

export default App;
