
import React, { useState } from 'react';
import { Laptop, Download, ChevronDown, CheckCircle, Save } from 'lucide-react';
import { ExportHistoryItem } from '../types';

export const SaveAsModule: React.FC = () => {
  const [saveFormat, setSaveFormat] = useState("USFM");

  const saveToHistory = (fileName: string, format: string) => {
    const history: ExportHistoryItem[] = JSON.parse(localStorage.getItem('gerger_export_history') || '[]');
    const newItem: ExportHistoryItem = {
      id: Date.now().toString(),
      fileName,
      format,
      timestamp: Date.now(),
      chapter: Number(localStorage.getItem('gerger_last_chapter')) || 1,
      status: 'SUCCESS'
    };
    localStorage.setItem('gerger_export_history', JSON.stringify([newItem, ...history]));
  };

  const handleSaveAs = async (format: string) => {
    const chapter = localStorage.getItem('gerger_last_chapter') || "1";
    const fileName = `Zapuura_Cap${chapter}_${new Date().toISOString().slice(0,10)}.${format.toLowerCase()}`;
    const kotiText = localStorage.getItem(`gerger_zapuura_${chapter}`) || "Sem conteúdo";
    const content = `GERGER.GE – Gerson Professional Suite\nProjeto: Zapuura (Ekoti)\nCapítulo: ${chapter}\n\n${kotiText}`;

    if ('showSaveFilePicker' in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: `${format} File`,
            accept: { 'text/plain': [`.${format.toLowerCase()}`] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        saveToHistory(fileName, format);
        alert("Salvo com sucesso no local selecionado!");
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error("Erro ao salvar:", err);
          fallbackDownload(content, fileName, format);
        }
      }
    } else {
      fallbackDownload(content, fileName, format);
    }
  };

  const fallbackDownload = (content: string, fileName: string, format: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    saveToHistory(fileName, format);
    alert(`Download iniciado: ${fileName}`);
  };

  return (
    <div className="bg-zinc-950 p-10 mt-auto shrink-0 animate-in slide-in-from-bottom-4 duration-700 border-t border-zinc-900">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-900/40">
            <Save size={28} />
          </div>
          <div>
            <h3 className="text-xl font-black uppercase tracking-widest text-white italic">
              Gerson Professional Suite
            </h3>
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">Módulo de Exportação Direta para o PC</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <select 
              className="appearance-none w-full bg-zinc-900 border border-zinc-800 text-xs pl-6 pr-12 py-5 rounded-2xl uppercase font-black outline-none focus:border-blue-600 transition-all text-zinc-300 cursor-pointer shadow-inner"
              value={saveFormat}
              onChange={(e) => setSaveFormat(e.target.value)}
            >
              <option value="USFM">Padrão USFM</option>
              <option value="TXT">Texto Limpo (.txt)</option>
              <option value="DOCX">Microsoft Word (.docx)</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          </div>
          
          <button 
            onClick={() => handleSaveAs(saveFormat)}
            className="bg-blue-600 hover:bg-blue-500 px-10 py-5 rounded-2xl font-black text-sm uppercase transition-all flex items-center gap-3 shadow-2xl shadow-blue-900/40 active:scale-95 text-white italic tracking-tighter"
          >
            <Download size={20} /> Salvar Como...
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div className="text-[9px] font-black text-zinc-500 uppercase mb-2 tracking-widest">Segurança de Arquivo</div>
          <p className="text-xs text-zinc-400 font-medium leading-relaxed italic">
            O sistema Gerson Professional utiliza a API nativa do explorador para garantir que o arquivo seja gravado exatamente onde você desejar.
          </p>
        </div>
        <div className="bg-blue-900/10 p-6 rounded-2xl border border-blue-900/20 flex items-center justify-center text-center">
           <div className="flex flex-col items-center">
             <Laptop className="text-blue-500 mb-2" size={24} />
             <span className="text-[10px] text-blue-400 font-black uppercase tracking-widest">Sincronização com Computador Local Ativa</span>
           </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-3 mt-8 text-[9px] text-zinc-700 font-black uppercase tracking-[0.5em]">
        <CheckCircle size={12} className="text-green-600" />
        Zapuura Core v9.2 - Protocolo de Gerson Selemane
      </div>
    </div>
  );
};
