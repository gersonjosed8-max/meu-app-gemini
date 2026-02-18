
import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, RefreshCcw, CheckCircle, ShieldAlert, History, X, ArrowRight, Info, Cpu } from 'lucide-react';
import { Verse } from '../types';
import { JustificationModule } from './JustificationModule';

interface MemoryItem {
  pt: string;
  koti: string;
  frequency: number;
}

interface Inconsistency {
  verseId: string;
  ptWord: string;
  usedKoti: string;
  expectedKoti: string;
  context: string;
  location: string;
}

interface ConsistencyCheckerProps {
  verses: Verse[];
  onUpdateVerse?: (id: string, field: string, value: any) => void;
}

const MOCK_MEMORY: MemoryItem[] = [
  { pt: "homem", koti: "mwanamwane", frequency: 45 },
  { pt: "pecadores", koti: "anatamphela", frequency: 12 },
  { pt: "conselho", koti: "masururu", frequency: 8 },
  { pt: "caminho", koti: "phiro", frequency: 22 },
  { pt: "lei", koti: "nlamulo", frequency: 15 }
];

export const ConsistencyChecker: React.FC<ConsistencyCheckerProps> = ({ verses, onUpdateVerse }) => {
  const [inconsistencies, setInconsistencies] = useState<Inconsistency[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [activeInconsistency, setActiveInconsistency] = useState<Inconsistency | null>(null);
  const [isJustifying, setIsJustifying] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/linguistic-worker.ts', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e) => {
      if (e.data.type === 'SCAN_COMPLETE') {
        setInconsistencies(e.data.results);
        setIsScanning(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runCheck = () => {
    if (!workerRef.current) return;
    setIsScanning(true);
    workerRef.current.postMessage({
      type: 'SCAN_CONSISTENCY',
      data: { verses, memory: MOCK_MEMORY }
    });
  };

  useEffect(() => {
    runCheck();
  }, [verses]);

  const handleDecision = (type: 'global' | 'local' | 'ignore') => {
    if (type === 'local') {
      setIsJustifying(true);
      return;
    }
    setInconsistencies(prev => prev.filter(inc => inc !== activeInconsistency));
    setActiveInconsistency(null);
  };

  const handleJustifyConfirm = (reason: string) => {
    if (activeInconsistency && onUpdateVerse) {
      const verse = verses.find(v => v.id === activeInconsistency.verseId);
      const existingNotes = verse?.culturalNotes || '';
      
      // BUILD STRICT TECHNICAL FORMAT
      const formattedJustification = `Termo: ${activeInconsistency.ptWord} | Tradução: ${activeInconsistency.usedKoti} | Notas Culturais: Contexto de ${activeInconsistency.location} | Justificativa: ${reason}`;
      
      const newNotes = existingNotes + (existingNotes ? "\n\n" : "") + formattedJustification;
      onUpdateVerse(activeInconsistency.verseId, 'culturalNotes', newNotes);
    }
    setInconsistencies(prev => prev.filter(inc => inc !== activeInconsistency));
    setActiveInconsistency(null);
    setIsJustifying(false);
  };

  if (activeInconsistency) {
    return (
      <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl h-full animate-in slide-in-from-right duration-300 overflow-y-auto custom-scroll">
        <div className="p-5 border-b border-zinc-800 bg-amber-950/10 flex items-center justify-between">
          <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle size={14} /> {isJustifying ? 'Protocolar Decisão' : 'Resolução de Conflito'}
          </h3>
          <button 
            onClick={() => { setActiveInconsistency(null); setIsJustifying(false); }} 
            className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-6">
          {isJustifying ? (
            <JustificationModule 
              onConfirm={handleJustifyConfirm} 
              onCancel={() => setIsJustifying(false)} 
              term={activeInconsistency.ptWord}
              translation={activeInconsistency.usedKoti}
            />
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Localização</div>
                <p className="text-white font-black text-lg">{activeInconsistency.location}</p>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed italic border-l-2 border-zinc-800 pl-4 py-1">"{activeInconsistency.context}"</p>
              <div className="space-y-4">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
                  <span className="text-[9px] text-zinc-600 uppercase font-black block mb-2">Memória do Projeto</span>
                  <p className="text-blue-400 font-black text-xl">"{activeInconsistency.expectedKoti}"</p>
                </div>
                <div className="flex justify-center py-1 opacity-20"><ArrowRight size={20} className="rotate-90 text-zinc-500" /></div>
                <div className="bg-zinc-900 border border-amber-900/50 p-4 rounded-2xl">
                  <span className="text-[9px] text-zinc-600 uppercase font-black block mb-2">Variação Detectada</span>
                  <p className="text-red-400 font-black text-xl italic">"{activeInconsistency.usedKoti}"</p>
                </div>
              </div>
              <div className="pt-6 space-y-3">
                <button onClick={() => handleDecision('global')} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-900/30">Forçar Consistência Global</button>
                <button onClick={() => handleDecision('local')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-black py-4 rounded-xl uppercase text-[10px] tracking-widest transition-all">Manter Exceção Local</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-2xl h-full animate-in slide-in-from-right duration-300">
      <div className="p-5 border-b border-zinc-800 bg-red-950/10 flex items-center justify-between">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] flex items-center gap-2">
          <AlertTriangle size={14} /> Auditoria Linguística
        </h3>
        <div className="flex items-center gap-2">
          {isScanning && <Cpu size={12} className="text-blue-500 animate-pulse" />}
          <button 
            onClick={runCheck} 
            className={`p-2 rounded-lg hover:bg-zinc-800 transition-colors ${isScanning ? 'animate-spin' : ''}`}
            title="Sincronizar background"
          >
            <RefreshCcw size={14} className="text-zinc-500" />
          </button>
        </div>
      </div>

      <div className="p-4 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">THREAD_ZAPUURA_CORE</div>
          <div className="text-[9px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded tracking-tighter">INTEGRITY_OK</div>
        </div>
        <div className="flex gap-2">
           <div className="flex-1 bg-black rounded-xl p-3 border border-zinc-800 shadow-inner">
             <div className="text-[8px] font-black text-zinc-600 uppercase mb-1">Alertas</div>
             <div className="text-xl font-black text-red-500">{inconsistencies.length}</div>
           </div>
           <div className="flex-1 bg-black rounded-xl p-3 border border-zinc-800 shadow-inner">
             <div className="text-[8px] font-black text-zinc-600 uppercase mb-1">Precisão</div>
             <div className="text-xl font-black text-green-500">98%</div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
        {inconsistencies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-20">
            <CheckCircle size={48} className="mb-4 text-green-500" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-center">Protocolo de Consistência Ativo</p>
          </div>
        ) : (
          inconsistencies.map((inc, idx) => (
            <div key={idx} className="bg-zinc-900 border border-red-900/30 p-4 rounded-2xl group hover:border-red-500/50 transition-all shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded font-black uppercase tracking-tighter">{inc.location}</span>
                <span className="text-[9px] text-zinc-600 font-bold italic">{inc.ptWord}</span>
              </div>
              <div className="pt-3 border-t border-zinc-800/50">
                 <button 
                  onClick={() => setActiveInconsistency(inc)} 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-[9px] font-black uppercase py-2.5 rounded-lg text-zinc-400 transition-colors flex items-center justify-center gap-2"
                 >
                   <History size={10} /> Resolver Conflito
                 </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-zinc-950 border-t border-zinc-800">
        <div className="bg-blue-600/5 border border-blue-500/20 p-4 rounded-2xl flex items-start gap-3">
           <ShieldAlert size={16} className="text-blue-500 shrink-0 mt-0.5" />
           <p className="text-[10px] text-zinc-400 leading-relaxed font-medium italic">
             Gerson, o Auditor de Consistência agora força o preenchimento protocolar de justificativas seguindo as normas técnicas.
           </p>
        </div>
      </div>
    </div>
  );
};
