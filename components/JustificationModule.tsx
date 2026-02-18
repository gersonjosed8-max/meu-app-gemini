
import React, { useState } from 'react';
import { CheckCircle, ShieldAlert, AlertTriangle } from 'lucide-react';

interface JustificationModuleProps {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  term?: string;
  translation?: string;
}

export const JustificationModule: React.FC<JustificationModuleProps> = ({ 
  onConfirm, 
  onCancel,
  term,
  translation
}) => {
  const [reason, setReason] = useState("");

  const handleKeepDifferent = () => {
    if (reason.length < 10) {
      alert("Gerson, você precisa descrever o motivo técnico desta variação para os protocolos da Suite (mínimo 10 caracteres).");
      return;
    }
    onConfirm(reason);
  };

  return (
    <div className="bg-zinc-900 border-2 border-red-500/50 p-10 rounded-[3rem] shadow-[0_0_120px_rgba(239,68,68,0.3)] animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 bg-red-600/20 rounded-2xl text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div>
           <h3 className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">
             Variação de Consistência
           </h3>
           <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Protocolo de Justificação Obrigatória</p>
        </div>
      </div>
      
      <div className="mb-8 p-6 bg-black/50 rounded-2xl border border-zinc-800">
        <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mb-2">Conflito Detectado para</div>
        <div className="text-xl text-zinc-300 font-black italic">
          <span className="text-zinc-600">"{term}"</span> ➔ <span className="text-blue-500">"{translation}"</span>
        </div>
      </div>

      <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-medium italic">
        Gerson, descreva por que esta variação é necessária neste contexto específico (Ex: ênfase poética, dialeto de Angoche, contexto cultural).
      </p>

      <textarea 
        className="w-full bg-black border border-zinc-800 p-6 text-white text-sm rounded-3xl outline-none focus:border-blue-500 mb-6 h-40 resize-none shadow-inner placeholder:text-zinc-800 transition-all font-medium italic leading-relaxed"
        placeholder="Descreva o motivo técnico aqui..."
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />

      <div className="flex flex-col gap-3">
        <button 
          onClick={handleKeepDifferent}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl text-[11px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95"
        >
          <CheckCircle size={18} /> Validar Justificativa e Continuar
        </button>
        <button 
          onClick={onCancel}
          className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest transition-all"
        >
          Voltar e Corrigir Palavra
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-center gap-3 opacity-30">
        <ShieldAlert size={14} className="text-blue-500" />
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">Zapuura Core v9.3 Engine</span>
      </div>
    </div>
  );
};
