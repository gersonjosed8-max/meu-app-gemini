
import React, { useState } from 'react';
import { Link as LinkIcon, Plus, Trash2, ArrowRight, Database } from 'lucide-react';
import { GlossaryTerm } from '../types';

interface WordLinkerProps {
  terms: GlossaryTerm[];
  onAddTerm: (pt: string, koti: string) => void;
}

export const WordLinker: React.FC<WordLinkerProps> = ({ terms, onAddTerm }) => {
  const [newPt, setNewPt] = useState('');
  const [newKoti, setNewKoti] = useState('');

  const addLink = () => {
    if (newPt.trim() && newKoti.trim()) {
      onAddTerm(newPt.trim(), newKoti.trim());
      setNewPt('');
      setNewKoti('');
    }
  };

  return (
    <div className="flex flex-col bg-transparent">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
           <LinkIcon size={14} /> Vincular no Dicionário
        </label>
        <div className="space-y-3">
          <input 
            value={newPt}
            onChange={(e) => setNewPt(e.target.value)}
            placeholder="Português..." 
            className="w-full bg-black border border-zinc-800 p-4 text-xs text-white rounded-xl outline-none focus:border-amber-600 font-bold"
          />
          <input 
            value={newKoti}
            onChange={(e) => setNewKoti(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
            placeholder="Ekoti..." 
            className="w-full bg-black border border-zinc-800 p-4 text-xs text-white rounded-xl outline-none focus:border-amber-600 font-black uppercase italic"
          />
        </div>
        <button 
          onClick={addLink}
          className="w-full bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-black py-4 rounded-xl transition-all uppercase tracking-widest shadow-lg flex items-center justify-center gap-3"
        >
          <Plus size={16} /> Gravar Vínculo
        </button>
      </div>

      <div className="mt-8 space-y-3">
        <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest flex items-center gap-2">
           <Database size={12} /> Últimos Registros
        </div>
        {terms.slice().reverse().slice(0, 5).map((item, index) => (
          <div key={index} className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-xl flex justify-between items-center group">
            <div className="flex flex-col">
              <span className="text-zinc-600 font-black text-[8px] uppercase">{item.pt}</span>
              <span className="text-blue-500 font-black uppercase text-[11px] italic leading-none">{item.koti}</span>
            </div>
            <LinkIcon size={12} className="text-zinc-800 group-hover:text-blue-600 transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};
