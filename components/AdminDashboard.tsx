
import React, { useState, useEffect } from 'react';
import { Book, Users, ShieldCheck, Zap, Trash2, Shield, Terminal, Globe, ChevronDown, Activity, Star, UserPlus, CheckCircle2, Edit3, Save } from 'lucide-react';
import { User, UserRole } from '../types';

interface AdminDashboardProps {
  team: User[];
  onUpdateRole: (userId: string, newRole: UserRole) => void;
  onAddMember: (member: { name: string; email: string; role: UserRole }) => void;
  onDeleteMember: (userId: string) => void;
  onLaunchEditor: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ team, onUpdateRole, onAddMember, onDeleteMember, onLaunchEditor }) => {
  const [newMember, setNewMember] = useState({ name: '', email: '', role: UserRole.READER });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditingMetrics, setIsEditingMetrics] = useState(false);
  
  // Project Metrics State
  const [metrics, setMetrics] = useState(() => {
    const saved = localStorage.getItem('gerger_project_metrics');
    return saved ? JSON.parse(saved) : {
      completion: 42,
      chapters: 150,
      verses: 2400,
      consistency: 98.4,
      integrityNote: "Núcleo Linguístico Gerson v9.2 Stable: Termos Protegidos estão 100% íntegros em todos os capítulos salvos."
    };
  });

  useEffect(() => {
    localStorage.setItem('gerger_project_metrics', JSON.stringify(metrics));
  }, [metrics]);

  const handleInvite = () => {
    if (!newMember.name.trim() || !newMember.email.trim()) {
      alert("ERRO: O Administrador Gerson exige Nome e Email para validar o acesso.");
      return;
    }
    onAddMember(newMember);
    setIsSuccess(true);
    setNewMember({ name: '', email: '', role: UserRole.READER });
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="p-8 lg:p-16 max-w-[1600px] mx-auto space-y-16 overflow-y-auto h-full custom-scrollbar bg-black animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row justify-between items-start gap-12 border-b-4 border-blue-600 pb-16">
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-blue-500 font-black text-sm uppercase tracking-[0.6em] italic">
            <Star size={20} fill="currentColor" className="animate-pulse" /> Gerson Professional Suite
          </div>
          <h1 className="text-7xl lg:text-8xl font-black text-white tracking-tighter italic uppercase leading-none">Master Control</h1>
          <p className="text-zinc-600 font-bold text-2xl lg:text-3xl flex items-center gap-6">
            <ShieldCheck className="text-blue-600" size={40} />
            Administrador Master: <span className="text-white font-black italic tracking-tight">Gerson Selemane</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-6 shrink-0 pt-4">
          <button 
            onClick={() => setIsEditingMetrics(!isEditingMetrics)}
            className={`px-8 py-7 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-4 border-2 ${isEditingMetrics ? 'bg-amber-600 text-white border-amber-500' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-600'}`}
          >
            {isEditingMetrics ? <Save size={20} /> : <Edit3 size={20} />} {isEditingMetrics ? 'Salvar Projeto' : 'Editar Projeto'}
          </button>
          <button onClick={onLaunchEditor} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-7 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_25px_70px_rgba(37,99,235,0.45)] active:scale-95 flex items-center gap-6 italic tracking-tighter">
            <Zap size={24} className="animate-bounce" /> Acessar Editor Zapuura
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* STATS 1: PROJECT PROGRESS (EDITABLE) */}
        <div className="bg-[#0c0c0e] p-12 rounded-[4rem] border border-zinc-900 shadow-[0_40px_100px_rgba(0,0,0,0.6)] space-y-10 group hover:border-blue-900/40 transition-all duration-500">
          <div className="flex justify-between items-start">
            <h3 className="text-blue-500 text-[13px] font-black uppercase tracking-[0.5em] flex items-center gap-4 italic">
              <Book size={20} /> Métricas de Projeto
            </h3>
            <Globe size={48} className="text-zinc-900 group-hover:text-blue-900/30 transition-all duration-700 group-hover:rotate-12" />
          </div>
          <div className="space-y-8">
            <div className="bg-black p-8 rounded-[2.5rem] border border-zinc-800 shadow-inner">
              <span className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.3em] block mb-4">Conclusão Zapuura</span>
              <div className="flex items-center gap-6">
                {isEditingMetrics ? (
                  <input 
                    type="number" 
                    value={metrics.completion} 
                    onChange={e => setMetrics({...metrics, completion: Number(e.target.value)})}
                    className="w-24 bg-zinc-900 border border-blue-600 rounded-xl text-4xl font-black text-white p-2 outline-none italic"
                  />
                ) : (
                  <div className="text-6xl font-black text-white italic tracking-tighter leading-none">{metrics.completion}%</div>
                )}
                <div className="flex-1 h-3 bg-zinc-900 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-all duration-1000" style={{ width: `${metrics.completion}%` }}></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-black p-8 rounded-3xl border border-zinc-800 shadow-inner flex flex-col justify-center">
                 <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest block mb-2">Capítulos</span>
                 {isEditingMetrics ? (
                   <input type="number" value={metrics.chapters} onChange={e => setMetrics({...metrics, chapters: Number(e.target.value)})} className="bg-transparent text-3xl font-black text-blue-500 outline-none w-full italic" />
                 ) : (
                   <div className="text-3xl font-black text-blue-500 italic">{metrics.chapters}</div>
                 )}
               </div>
               <div className="bg-black p-8 rounded-3xl border border-zinc-800 shadow-inner flex flex-col justify-center">
                 <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest block mb-2">Versos</span>
                 {isEditingMetrics ? (
                   <input type="number" value={metrics.verses} onChange={e => setMetrics({...metrics, verses: Number(e.target.value)})} className="bg-transparent text-3xl font-black text-blue-500 outline-none w-full italic" />
                 ) : (
                   <div className="text-3xl font-black text-blue-500 italic">{metrics.verses > 999 ? (metrics.verses / 1000).toFixed(1) + 'k' : metrics.verses}</div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* STATS 2: LINGUISTIC INTEGRITY (EDITABLE) */}
        <div className="bg-[#0c0c0e] p-12 rounded-[4rem] border border-zinc-900 shadow-[0_40px_100px_rgba(0,0,0,0.6)] space-y-10 group hover:border-amber-900/40 transition-all duration-500">
           <h3 className="text-amber-500 text-[13px] font-black uppercase tracking-[0.5em] flex items-center gap-4 italic">
            <Activity size={20} /> Integridade Koti
          </h3>
          <div className="space-y-8">
            <div className="bg-black p-10 rounded-[2.5rem] border border-zinc-800 flex items-center justify-between shadow-inner">
               <div>
                  <span className="text-[11px] text-zinc-600 font-black uppercase tracking-widest block mb-2">Consistência</span>
                  {isEditingMetrics ? (
                    <input type="number" step="0.1" value={metrics.consistency} onChange={e => setMetrics({...metrics, consistency: Number(e.target.value)})} className="bg-transparent text-5xl font-black text-white outline-none w-full italic" />
                  ) : (
                    <div className="text-5xl font-black text-white italic tracking-tighter">{metrics.consistency}%</div>
                  )}
               </div>
               <div className="w-20 h-20 rounded-full border-4 border-amber-600/50 flex items-center justify-center text-amber-500 font-black text-base shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                  AUTO
               </div>
            </div>
            {isEditingMetrics ? (
              <textarea 
                value={metrics.integrityNote} 
                onChange={e => setMetrics({...metrics, integrityNote: e.target.value})}
                className="w-full bg-black border border-amber-600/30 p-6 rounded-3xl text-[12px] text-zinc-400 font-medium italic h-24 outline-none resize-none"
              />
            ) : (
              <div className="p-6 bg-amber-600/5 rounded-3xl border border-amber-600/20 text-[12px] text-zinc-500 italic font-bold leading-relaxed">
                {metrics.integrityNote}
              </div>
            )}
          </div>
        </div>

        {/* AUTHORIZED CIRCLE LIST */}
        <div className="bg-[#0c0c0e] p-12 rounded-[4rem] border border-zinc-900 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col group hover:border-blue-900/40 transition-all duration-500">
          <h3 className="text-blue-500 text-[13px] font-black uppercase tracking-[0.5em] mb-10 flex items-center gap-4 italic">
            <Users size={20} /> Círculo Autorizado
          </h3>
          <div className="flex-1 space-y-6 overflow-y-auto max-h-[350px] pr-4 custom-scrollbar">
            {team.map((user) => (
              <div key={user.id} className="flex items-center justify-between bg-black p-6 rounded-[2.5rem] border-l-8 border-blue-600 hover:bg-zinc-900 transition-all shadow-2xl group/item">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black text-base text-white italic shadow-lg">
                    {user.name[0]}
                  </div>
                  <div>
                    <div className="font-black text-white uppercase text-[12px] tracking-tight">{user.name}</div>
                    <div className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em]">{user.role}</div>
                  </div>
                </div>
                {user.id !== 'admin-001' && (
                  <button 
                    onClick={() => onDeleteMember(user.id)}
                    className="text-zinc-800 hover:text-red-500 transition-all p-3 bg-zinc-950 rounded-xl border border-zinc-900 hover:border-red-500/30 opacity-0 group-hover/item:opacity-100"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCESS AUTHORIZATION ENGINE */}
      <div className="bg-[#0c0c0e] p-16 lg:p-24 rounded-[5rem] border-2 border-blue-600/30 shadow-[0_60px_120px_rgba(0,0,0,0.8)] relative overflow-hidden group">
         <div className="absolute -right-60 -bottom-60 opacity-5 group-hover:opacity-10 transition-all duration-1000 scale-110">
            <Shield size={600} className="text-blue-500" />
         </div>
         <div className="relative z-10 flex flex-col items-center mb-16 text-center">
            <div className={`w-28 h-28 bg-blue-600 rounded-[3rem] flex items-center justify-center text-white mb-10 shadow-[0_30px_80px_rgba(37,99,235,0.5)] transition-all duration-500 ${isSuccess ? 'bg-green-600 scale-110' : ''}`}>
               {isSuccess ? <CheckCircle2 size={56} /> : <UserPlus size={56} className="italic" />}
            </div>
            <h3 className="text-white font-black text-6xl uppercase tracking-tighter italic mb-4">Autorizar Nova Entrada</h3>
            <p className="text-zinc-600 font-black uppercase tracking-[0.5em] text-[11px]">Sistema de Gestão de Acesso - Gerson Professional Suite</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end relative z-10 max-w-6xl mx-auto">
            <div className="space-y-4">
              <label className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.4em] ml-4 italic">Nome Completo</label>
              <input 
                placeholder="Ex: Pedro Selemane" 
                className="w-full bg-black border-2 border-zinc-800 rounded-[2rem] p-7 text-white text-base outline-none focus:border-blue-600 transition-all font-black shadow-inner"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.4em] ml-4 italic">Email de Acesso</label>
              <input 
                placeholder="selemane@koti.com" 
                className="w-full bg-black border-2 border-zinc-800 rounded-[2rem] p-7 text-white text-base outline-none focus:border-blue-600 transition-all font-black shadow-inner"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              />
            </div>
            <div className="space-y-4">
              <label className="text-[11px] text-zinc-500 font-black uppercase tracking-[0.4em] ml-4 italic">Nível de Permissão</label>
              <div className="relative">
                <select 
                  className="w-full bg-black border-2 border-zinc-800 rounded-[2rem] p-7 text-white text-base outline-none focus:border-blue-600 appearance-none cursor-pointer uppercase font-black tracking-[0.2em] shadow-inner"
                  value={newMember.role}
                  onChange={(e) => setNewMember({...newMember, role: e.target.value as UserRole})}
                >
                  <option value={UserRole.READER}>Leitor (Acesso Base)</option>
                  <option value={UserRole.TRANSLATOR}>Tradutor Professional</option>
                  <option value={UserRole.REVIEWER}>Revisor Senior</option>
                  <option value={UserRole.CONSULTANT}>Consultor Técnico</option>
                </select>
                <ChevronDown size={24} className="absolute right-8 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none" />
              </div>
            </div>
            <button 
              onClick={handleInvite}
              className="bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-[2.5rem] text-sm uppercase tracking-[0.3em] transition-all shadow-[0_30px_90px_rgba(37,99,235,0.5)] active:scale-95 flex items-center justify-center gap-5 group/btn italic"
            >
              <Shield size={24} className="group-hover/btn:scale-125 transition-transform duration-300" /> AUTORIZAR ACESSO
            </button>
         </div>
      </div>
      
      <footer className="pt-12 text-center">
        <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[1em]">
          Gerger.ge Security Audit Control | Gerson Jose Selemane
        </p>
      </footer>
    </div>
  );
};
