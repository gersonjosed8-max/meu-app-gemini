
import React, { useState, useEffect } from 'react';
import { ExportHistoryItem } from '../types';
import { History as HistoryIcon, FileText, Calendar, Trash2, CheckCircle, Edit3, XCircle } from 'lucide-react';

export const History: React.FC = () => {
  const [history, setHistory] = useState<ExportHistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('gerger_export_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const deleteRecord = (id: string) => {
    if (confirm("Gerson, confirmar a exclusão deste registro de exportação?")) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem('gerger_export_history', JSON.stringify(newHistory));
    }
  };

  const clearHistory = () => {
    if (confirm("Gerson, deseja limpar todos os registros de exportação da Suite Profissional?")) {
      localStorage.removeItem('gerger_export_history');
      setHistory([]);
    }
  };

  const handleResumeEdit = (chapter: number) => {
    localStorage.setItem('gerger_last_chapter', chapter.toString());
    // Força um recarregamento para que o App.tsx e o Editor reconheçam o novo capítulo
    window.dispatchEvent(new CustomEvent('gerger_navigate_editor', { detail: { chapter } }));
    alert(`Retomando edição do Capítulo ${chapter} na Gerson Professional Suite...`);
    // Nota: A navegação real é tratada via evento ou recarregamento dependendo da estrutura
    window.location.reload(); 
  };

  return (
    <div className="p-8 lg:p-12 h-full flex flex-col bg-zinc-950 animate-in fade-in duration-700 overflow-hidden">
      <header className="flex justify-between items-center mb-10 shrink-0">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 text-white tracking-tighter uppercase italic">
            <HistoryIcon className="text-blue-500" size={36} />
            Histórico da Suite
          </h1>
          <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em] mt-2">Registros de Auditoria Gerson Professional</p>
        </div>
        <button 
          onClick={clearHistory}
          className="text-red-500/50 hover:text-red-500 transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest border border-red-500/10 p-3 rounded-xl hover:bg-red-500/5"
        >
          <Trash2 size={16} /> Limpar Tudo
        </button>
      </header>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-20 space-y-4">
            <FileText size={64} className="text-zinc-700" />
            <p className="text-sm font-black uppercase tracking-[0.5em]">Sem registros de exportação no PC.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-10">
            {history.map((item) => (
              <div key={item.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all group flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center border border-zinc-800 group-hover:bg-blue-600 transition-colors shrink-0">
                    <FileText className="text-zinc-600 group-hover:text-white" size={24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-black text-white italic tracking-tight uppercase group-hover:text-blue-400 transition-colors leading-none mb-1 truncate">
                      {item.fileName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {new Date(item.timestamp).toLocaleString()}</span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-blue-500 border border-zinc-700">Capítulo {item.chapter}</span>
                      <span className="bg-zinc-800 px-2 py-0.5 rounded text-white border border-zinc-700 font-black">{item.format}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleResumeEdit(item.chapter)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    <Edit3 size={14} /> Editar Cap {item.chapter}
                  </button>
                  <button 
                    onClick={() => deleteRecord(item.id)}
                    className="p-3 bg-zinc-950 text-zinc-600 hover:text-red-500 border border-zinc-800 hover:border-red-500/30 rounded-xl transition-all shadow-inner"
                    title="Eliminar registro"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-8 py-6 border-t border-zinc-900 flex justify-between items-center shrink-0">
        <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.8em]">
          Gerger Audit Control - Protocolo Selemane
        </p>
        <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest">
          <CheckCircle size={14} /> Sistema Integro
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #2563eb; }
      `}</style>
    </div>
  );
};
