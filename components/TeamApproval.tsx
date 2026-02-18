
import React from 'react';
import { User, UserRole } from '../types';
import { Check, X, Shield, UserPlus, Clock, Search, Activity, Heart } from 'lucide-react';

interface TeamApprovalProps {
  team: User[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const TeamApproval: React.FC<TeamApprovalProps> = ({ team, onApprove, onReject }) => {
  const pendingUsers = team.filter(u => !u.approved);
  const activeUsers = team.filter(u => u.approved);

  return (
    <div className="h-full overflow-y-auto bg-black p-8 lg:p-12 custom-scrollbar animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-zinc-800 pb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-red-500 font-black text-xs uppercase tracking-[0.5em]">
              <Activity size={16} /> Quality Control Gate
            </div>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Team Approval</h1>
            <p className="text-zinc-500 font-bold text-xl">Monitor registrations and project contributions.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-3xl flex flex-col items-center">
              <span className="text-3xl font-black text-white">{pendingUsers.length}</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Pending</span>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-3xl flex flex-col items-center">
              <span className="text-3xl font-black text-blue-500">{activeUsers.length}</span>
              <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Active</span>
            </div>
          </div>
        </header>

        {/* PENDING APPROVALS */}
        <section className="space-y-6">
          <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.4em] flex items-center gap-3">
            <UserPlus size={16} className="text-blue-500" /> Solicitas de Acesso Pendentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingUsers.length === 0 ? (
              <div className="col-span-full py-16 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center text-zinc-700">
                <Clock size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-black uppercase tracking-widest">Nenhuma solicitação pendente</p>
              </div>
            ) : (
              pendingUsers.map(user => (
                <div key={user.id} className="bg-zinc-950 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-blue-500/50 transition-all shadow-xl">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center font-black text-2xl text-zinc-500">
                      {user.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{user.name}</h3>
                      <p className="text-zinc-500 text-xs font-bold">{user.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                        Tier: {user.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onReject(user.id)}
                      className="p-4 bg-zinc-900 hover:bg-red-500 text-zinc-600 hover:text-white rounded-2xl transition-all"
                    >
                      <X size={20} />
                    </button>
                    <button 
                      onClick={() => onApprove(user.id)}
                      className="p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-900/40 transition-all"
                    >
                      <Check size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* QUALITY CONTROL STATS */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Shield size={200} className="text-white" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Linguistic Performance</h2>
              <p className="text-zinc-500 text-lg leading-relaxed max-w-xl">
                Acompanhe a precisão de cada membro da equipe. O sistema monitora a adesão ao glossário de Angoche e o uso correto dos termos sagrados.
              </p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="bg-black/50 p-4 px-6 rounded-2xl border border-zinc-800">
                   <div className="text-xs text-zinc-600 font-black uppercase mb-1">Global Score</div>
                   <div className="text-2xl font-black text-green-500">96.8%</div>
                 </div>
                 <div className="bg-black/50 p-4 px-6 rounded-2xl border border-zinc-800">
                   <div className="text-xs text-zinc-600 font-black uppercase mb-1">Consistency</div>
                   <div className="text-2xl font-black text-blue-500">HIGH</div>
                 </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 space-y-4">
              {activeUsers.slice(0, 3).map((user, i) => (
                <div key={user.id} className="bg-black p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black">{user.name[0]}</div>
                    <span className="text-xs font-bold text-zinc-300">{user.name}</span>
                  </div>
                  <div className="text-blue-500 font-black text-xs">{98 - i * 2}%</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="pt-12 border-t border-zinc-900 flex flex-col items-center gap-4 text-center">
           <Heart className="text-blue-600" size={24} />
           <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">
             GERGER TEAM AUDIT CORE | ANGOCE PRIDE
           </p>
        </footer>
      </div>
    </div>
  );
};
