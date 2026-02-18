
import React from 'react';
import { 
  FileText, Download, Printer, FileDown, X, 
  CheckCircle, Save, FileType, Globe, Share2, 
  ExternalLink, FileCode, Layout
} from 'lucide-react';
import { ExportHistoryItem } from '../types';

interface SaveAsModuleProps {
  onClose: () => void;
  kotiText: string;
  chapter: number;
}

export const SaveAsModule: React.FC<SaveAsModuleProps> = ({ onClose, kotiText, chapter }) => {
  
  const saveToHistory = (fileName: string, format: string) => {
    const history: ExportHistoryItem[] = JSON.parse(localStorage.getItem('gerger_export_history') || '[]');
    const newItem: ExportHistoryItem = {
      id: Date.now().toString(),
      fileName,
      format,
      timestamp: Date.now(),
      chapter: chapter,
      status: 'SUCCESS'
    };
    localStorage.setItem('gerger_export_history', JSON.stringify([newItem, ...history]));
  };

  const handleExportWord = () => {
    const fileName = `Zapuura_Salmo_${chapter}_${new Date().toISOString().slice(0,10)}.doc`;
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                    <head><meta charset='utf-8'><title>Zapuura Export</title>
                    <style>body { font-family: 'Times New Roman', serif; }</style></head><body>`;
    const footer = "</body></html>";
    const content = `
      <h1 style="text-align:center; text-transform:uppercase;">Zapuura (Ekoti)</h1>
      <h2 style="text-align:center;">Salmo ${chapter}</h2>
      <hr/>
      <p style="font-size:14pt; line-height:1.5;">
        <b style="color:#2563eb; margin-right:10px;">1</b> ${kotiText}
      </p>
      <p style="font-size:8pt; margin-top:50px; color:#666; font-style:italic; text-align:center;">
        Gerado via GERGER.GE Professional Suite - Tradutor: Gerson Selemane
      </p>
    `;
    
    const blob = new Blob([header + content + footer], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    saveToHistory(fileName, 'WORD');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>GERGER.GE - Salmo ${chapter}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 50px; color: #000; line-height: 1.6; }
            .header { border-bottom: 2px solid #2563eb; margin-bottom: 40px; padding-bottom: 20px; }
            .title { font-size: 28px; font-weight: 900; font-style: italic; color: #2563eb; margin: 0; }
            .subtitle { font-size: 10px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 2px; }
            .chapter-title { font-size: 42px; font-weight: 900; margin: 40px 0; text-align: center; font-style: italic; }
            .content { font-size: 18px; white-space: pre-wrap; margin-bottom: 60px; }
            .verse-num { color: #2563eb; font-weight: 900; margin-right: 15px; font-size: 14px; border: 1px solid #2563eb; padding: 2px 6px; borderRadius: 4px; vertical-align: middle; }
            .footer { border-top: 1px solid #eee; padding-top: 20px; font-size: 9px; text-align: center; color: #999; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">GERGER.GE</h1>
            <span class="subtitle">Zapuura Bible Project • Professional Export</span>
          </div>
          <h2 class="chapter-title">Salmo ${chapter}</h2>
          <div class="content">
            <span class="verse-num">1</span>${kotiText}
          </div>
          <div class="footer">
            Tradução por Gerson Jose Selemane • Sincronizado via Zapuura Core Engine v9.4
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      saveToHistory(`Impressão_Salmo_${chapter}`, 'PDF/PRINT');
    }, 500);
  };

  const handleExportUSFM = () => {
    const content = `\\id PSA Zapuura\n\\c ${chapter}\n\\v 1 ${kotiText}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Salmo_${chapter}_Zapuura.usfm`;
    link.click();
    saveToHistory(`Salmo_${chapter}_Zapuura.usfm`, 'USFM');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e] border-2 border-zinc-800 w-full max-w-4xl rounded-[4rem] shadow-[0_0_150px_rgba(37,99,235,0.2)] overflow-hidden relative">
        
        {/* HEADER MODAL */}
        <div className="p-10 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-900/40">
              <Layout size={32} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Central de Exportação</h2>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.4em] mt-2 italic">Gerson Selemane Professional Suite v9.4</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-zinc-800 text-zinc-500 hover:text-white rounded-2xl transition-all">
            <X size={28} />
          </button>
        </div>

        <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* FORMATOS DE ARQUIVO */}
          <div className="space-y-6">
            <h3 className="text-blue-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <FileType size={16} /> Formatos Digitais
            </h3>
            
            <button 
              onClick={handleExportWord}
              className="w-full flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-blue-600 hover:bg-blue-600/5 transition-all group"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="p-4 bg-blue-600/10 text-blue-500 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FileText size={24} />
                </div>
                <div>
                  <span className="text-white font-black uppercase text-sm italic">Microsoft Word</span>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Exportação .DOC Editável</p>
                </div>
              </div>
              <Download className="text-zinc-800 group-hover:text-blue-600" size={20} />
            </button>

            <button 
              onClick={handleExportUSFM}
              className="w-full flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-amber-600 hover:bg-amber-600/5 transition-all group"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="p-4 bg-amber-600/10 text-amber-500 rounded-2xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                  <FileCode size={24} />
                </div>
                <div>
                  <span className="text-white font-black uppercase text-sm italic">Padrão USFM</span>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Compatível com Paratext</p>
                </div>
              </div>
              <Download className="text-zinc-800 group-hover:text-amber-600" size={20} />
            </button>
          </div>

          {/* IMPRESSÃO E PDF */}
          <div className="space-y-6">
            <h3 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
              <Printer size={16} /> Documentação Física
            </h3>
            
            <button 
              onClick={handlePrint}
              className="w-full flex items-center justify-between p-8 bg-zinc-900 border border-zinc-800 rounded-[2.5rem] hover:border-green-600 hover:bg-green-600/5 transition-all group"
            >
              <div className="flex items-center gap-5 text-left">
                <div className="p-4 bg-green-600/10 text-green-500 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-all">
                  <FileDown size={24} />
                </div>
                <div>
                  <span className="text-white font-black uppercase text-sm italic">PDF & Impressão</span>
                  <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">Layout Profissional A4</p>
                </div>
              </div>
              <Printer className="text-zinc-800 group-hover:text-green-600" size={20} />
            </button>

            <div className="p-8 bg-blue-600/5 border border-blue-600/20 rounded-[2.5rem] flex flex-col items-center text-center space-y-4">
              <Globe className="text-blue-500" size={32} />
              <p className="text-zinc-500 text-[11px] font-medium leading-relaxed italic">
                Gerson, utilize o PDF para distribuir as revisões semanais à equipe de Angoche. O layout foi otimizado para máxima legibilidade.
              </p>
            </div>
          </div>

        </div>

        <div className="p-8 bg-black/40 border-t border-zinc-900 flex justify-center items-center gap-4">
          <CheckCircle size={14} className="text-green-500" />
          <span className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.5em]">Protocolo de Exportação Validado • Gerson Jose Selemane</span>
        </div>
      </div>
    </div>
  );
};
