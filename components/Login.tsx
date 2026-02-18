
import React, { useState } from 'react';
import { User } from '../types';
import { Mail, Lock, ShieldCheck, UserPlus, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  team: User[];
}

export const Login: React.FC<LoginProps> = ({ onLogin, team }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [requestData, setRequestData] = useState({ name: '', email: '', message: '' });
  const [requestSent, setRequestSent] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const authorizedUser = team.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!authorizedUser) {
      setError('ACESSO NEGADO: E-MAIL NÃO CONSTA NO CÍRCULO AUTORIZADO.');
      return;
    }

    if (!authorizedUser.approved) {
      setError('ACESSO BLOQUEADO: AGUARDANDO APROVAÇÃO DO ADMINISTRADOR GERSON.');
      return;
    }

    if (password === "200719") {
      onLogin(authorizedUser);
    } else {
      setError('ACESSO NEGADO: SENHA ADMINISTRATIVA INCORRETA.');
    }
  };

  const handleRequestAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio e instrução de e-mail direto
    const subject = encodeURIComponent(`Solicitação de Acesso ao Projeto Zapuura - ${requestData.name}`);
    const body = encodeURIComponent(`Olá Gerson,\n\nGostaria de solicitar acesso ao tradutor GERGER.GE.\n\nNome: ${requestData.name}\nE-mail: ${requestData.email}\nMotivo: ${requestData.message}`);
    
    // Abre o cliente de e-mail do usuário
    window.location.href = `mailto:gersonjosed8@gmail.com?subject=${subject}&body=${body}`;
    
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
      setIsRequestingAccess(false);
      setRequestData({ name: '', email: '', message: '' });
    }, 4000);
  };

  if (isRequestingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#000] p-6 font-sans">
        <div className="w-full max-w-md bg-[#0a0a0b] rounded-[3rem] border-2 border-zinc-800 shadow-[0_0_80px_rgba(37,99,235,0.1)] overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-10 border-b border-zinc-900 bg-zinc-900/20">
            <button 
              onClick={() => setIsRequestingAccess(false)}
              className="flex items-center gap-2 text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> Voltar ao Login
            </button>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                <UserPlus size={32} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Solicitar Acesso</h2>
                <p className="text-[10px] text-zinc-500 font-black tracking-[0.2em] uppercase mt-1 italic">Protocolo Gerson Selemane</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleRequestAccess} className="p-10 space-y-6">
            {requestSent ? (
              <div className="py-12 flex flex-col items-center text-center space-y-4 animate-in fade-in duration-500">
                <CheckCircle2 size={64} className="text-green-500 mb-2" />
                <h3 className="text-xl font-black text-white uppercase italic">E-mail de Pedido Aberto!</h3>
                <p className="text-zinc-500 text-xs font-medium leading-relaxed italic">
                  O seu cliente de e-mail foi aberto para enviar o pedido diretamente para <span className="text-blue-500 font-bold">gersonjosed8@gmail.com</span>. Aguarde a validação oficial.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4 italic">Nome Completo</label>
                    <input
                      required
                      type="text"
                      value={requestData.name}
                      onChange={(e) => setRequestData({...requestData, name: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-blue-600 transition-all font-bold"
                      placeholder="Ex: João Selemane"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4 italic">Seu E-mail Profissional</label>
                    <input
                      required
                      type="email"
                      value={requestData.email}
                      onChange={(e) => setRequestData({...requestData, email: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-blue-600 transition-all font-bold"
                      placeholder="seu-email@exemplo.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-4 italic">Finalidade de Uso</label>
                    <textarea
                      required
                      value={requestData.message}
                      onChange={(e) => setRequestData({...requestData, message: e.target.value})}
                      className="w-full bg-black border border-zinc-800 rounded-2xl py-5 px-6 text-white text-sm focus:outline-none focus:border-blue-600 transition-all font-medium italic h-28 resize-none"
                      placeholder="Por que deseja participar do projeto Zapuura?"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-6 rounded-[2rem] text-[11px] tracking-[0.3em] transition-all uppercase shadow-2xl active:scale-95 flex items-center justify-center gap-3 italic"
                >
                  <Send size={18} /> Enviar Pedido ao Gerson
                </button>
              </>
            )}
          </form>
          <div className="p-6 text-center bg-black/40 border-t border-zinc-900">
             <p className="text-[8px] text-zinc-600 font-black uppercase tracking-widest">Os pedidos são analisados manualmente pelo Administrador Master</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#000] p-6 font-sans">
      <div className="w-full max-w-sm bg-[#0a0a0b] rounded-[3rem] border-2 border-blue-600/50 shadow-[0_0_80px_rgba(37,99,235,0.25)] overflow-hidden animate-in fade-in zoom-in-95 duration-700">
        <div className="p-12 text-center border-b border-[#1a1a1b] bg-gradient-to-b from-blue-900/10 to-transparent">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-900/40 animate-bounce-slow">
              <ShieldCheck size={48} className="text-white" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-[#2563eb] italic tracking-tighter mb-2 italic">GERGER.GE</h1>
          <p className="text-[10px] text-zinc-600 font-black tracking-[0.4em] uppercase">ZAPUURA PROJECT GATEWAY</p>
        </div>

        <form onSubmit={handleLogin} className="p-10 space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-14 pr-4 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-all placeholder:text-zinc-800 font-bold"
                placeholder="seu-email@exemplo.com"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-700" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-2xl py-5 pl-14 pr-4 text-white text-sm focus:outline-none focus:border-[#2563eb] transition-all placeholder:text-zinc-800 font-bold"
                placeholder="••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563eb] hover:bg-[#3b82f6] text-white font-black py-6 rounded-[2rem] text-[11px] tracking-[0.3em] transition-all uppercase shadow-2xl active:scale-95 italic"
          >
            ENTRAR NO PROJETO
          </button>
        </form>
        
        <div className="px-10 pb-10">
          <button 
            onClick={() => setIsRequestingAccess(true)}
            className="w-full py-4 border border-zinc-800 rounded-2xl text-[9px] font-black text-zinc-500 hover:text-white hover:border-zinc-700 uppercase tracking-[0.2em] transition-all group"
          >
            Primeira vez aqui? <span className="text-blue-500 group-hover:text-blue-400">Solicitar Acesso</span>
          </button>
        </div>

        <div className="p-6 text-center bg-black/40 border-t border-zinc-900">
           <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest">Acesso restrito a membros validados por Gerson Selemane</p>
        </div>
      </div>
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow { animation: bounce-slow 4s infinite ease-in-out; }
      `}</style>
    </div>
  );
};
