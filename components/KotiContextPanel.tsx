
import React from 'react';

interface KotiContextPanelProps {
  activeVerse: string;
  culturalNotes: string;
  onNotesChange: (notes: string) => void;
}

const KOTI_DICTIONARY = [
  { source: "Deus", target: "Nnyizinku", note: "Nome Sagrado em Ekoti (LOCKED)" },
  { source: "Senhor", target: "Mbwana", note: "Título de Autoridade/Soberania (LOCKED)" },
  { source: "Salmos", target: "Zapuura", note: "Zapuura – Livro de Cânticos" }
];

export const KotiContextPanel: React.FC<KotiContextPanelProps> = ({ 
  activeVerse, 
  culturalNotes, 
  onNotesChange 
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-8 bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-2">
        <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="text-sm">📖</span> Verse {activeVerse} - Koti Context
        </h4>
      </div>

      {/* Sugestões Automáticas do Glossário Atualizado */}
      <div className="flex flex-wrap gap-2 mb-2">
        {KOTI_DICTIONARY.map((item, index) => (
          <div key={index} className="bg-blue-900/20 border border-blue-500/30 px-3 py-1.5 rounded-full cursor-help group relative transition-all hover:bg-blue-900/40">
            <span className="text-[9px] font-black text-blue-300 uppercase tracking-tight">{item.source}: </span>
            <span className="text-[10px] text-white font-black">{item.target}</span>
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 bg-black/90 backdrop-blur-md p-3 rounded-xl text-[10px] text-zinc-300 shadow-2xl border border-zinc-700 z-50 animate-in fade-in zoom-in-95 duration-200">
              <div className="font-bold text-blue-400 mb-1 uppercase tracking-tighter">Linguistic Note:</div>
              {item.note}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45 border-r border-b border-zinc-700"></div>
            </div>
          </div>
        ))}
      </div>

      {/* CAMPO DE NOTAS CULTURAIS */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Notas Culturais e Linguísticas (Ekoti):</label>
        <textarea 
          className="w-full bg-zinc-950/50 border border-zinc-800 p-4 rounded-2xl text-sm text-zinc-300 focus:bg-blue-600/5 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none h-28 italic transition-all shadow-inner placeholder:text-zinc-800"
          placeholder="Ex: Usei 'Nnyizinku' aqui porque o contexto de Zapuura enfatiza a criação..."
          value={culturalNotes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
        <div className="flex justify-end mt-1">
          <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-[0.2em]">Salvo no Projeto GERGER.GE</span>
        </div>
      </div>
    </div>
  );
};
