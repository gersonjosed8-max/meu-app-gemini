
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { UserRole, GlossaryTerm, TranslationSegment, InterlinearWord } from '../types';
import { 
  X, Plus, ArrowRight, Sparkles, Trash2, Moon, Sun, ZoomIn, ZoomOut, 
  CheckCircle2, Database, SpellCheck, Briefcase, Book, Type, AlertTriangle,
  Quote, Edit3, ShieldCheck, Info, Layout, GripVertical, Save, Brain, Zap, Copy,
  Columns, Layers, AlignLeft, BookOpen, Settings2
} from 'lucide-react';
import { SaveAsModule } from './SaveAsModule';
import { WordLinker } from './WordLinker';
import { JustificationModule } from './JustificationModule';

interface EditorProps {
  userRole: UserRole;
  onBackToPanel: () => void;
}

const PSALM_23_INTERLINEAR: InterlinearWord[] = [
  { original: "מִזְמֹ֥ור", gloss: "salmo", morphology: "N-ms" },
  { original: "לְדָוִ֑ד", gloss: "de Davi", morphology: "P-ld" },
  { original: "יְהוָ֥ה", gloss: "Mbwana (Senhor)", morphology: "N-P" },
  { original: "רֹ֝עִ֗י", gloss: "pastor meu", morphology: "V-p" },
  { original: "לֹ֣א", gloss: "não", morphology: "Adv" },
  { original: "אֶחְסָֽר", gloss: "faltará (nada)", morphology: "V-f" }
];

export const Editor: React.FC<EditorProps> = ({ userRole, onBackToPanel }) => {
  const [chapter, setChapter] = useState(() => Number(localStorage.getItem('gerger_last_chapter')) || 1);
  const [zoom, setZoom] = useState(() => Number(localStorage.getItem('gerger_zoom')) || 18);
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('gerger_font_family') || "'Times New Roman', Times, serif");
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('gerger_theme') === 'dark');
  const [showSaveAs, setShowSaveAs] = useState(false);
  const [showFullGlossary, setShowFullGlossary] = useState(false);
  const [showProfSuite, setShowProfSuite] = useState(true);
  const [interlinearEnabled, setInterlinearEnabled] = useState(true);
  
  // Quad-Pane Visibility States
  const [showAlmeida, setShowAlmeida] = useState(true);
  const [showEasyRead, setShowEasyRead] = useState(true);
  const [showOriginal, setShowOriginal] = useState(true);
  
  // Resizing Widths
  const [almeidaWidth, setAlmeidaWidth] = useState(() => Number(localStorage.getItem('gerger_almeida_w')) || 280);
  const [easyReadWidth, setEasyReadWidth] = useState(() => Number(localStorage.getItem('gerger_easy_w')) || 280);
  const [originalWidth, setOriginalWidth] = useState(() => Number(localStorage.getItem('gerger_orig_w')) || 350);
  
  const resizingRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Content State
  const defaultKoti = chapter === 23 ? "Mbwana ti nshuki aka; Nnyizinku hakhuna etthu enittela okihala." : "";
  const [kotiText, setKotiText] = useState(() => localStorage.getItem(`gerger_zapuura_${chapter}`) || defaultKoti);
  const [almeidaText, setAlmeidaText] = useState(() => localStorage.getItem(`gerger_almeida_${chapter}`) || "O Senhor é o meu pastor; nada me faltará.");
  const [easyReadText, setEasyReadText] = useState(() => localStorage.getItem(`gerger_easyread_${chapter}`) || "O Senhor é o meu pastor. Tenho tudo o que preciso.");
  
  const [dictionary, setDictionary] = useState<GlossaryTerm[]>(() => {
    const saved = localStorage.getItem('gerger_dictionary');
    return saved ? JSON.parse(saved) : [];
  });

  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`gerger_zapuura_${chapter}`, kotiText);
      localStorage.setItem(`gerger_almeida_${chapter}`, almeidaText);
      localStorage.setItem(`gerger_easyread_${chapter}`, easyReadText);
      localStorage.setItem('gerger_theme', isDarkMode ? 'dark' : 'light');
      localStorage.setItem('gerger_zoom', zoom.toString());
      localStorage.setItem('gerger_last_chapter', chapter.toString());
      localStorage.setItem('gerger_almeida_w', almeidaWidth.toString());
      localStorage.setItem('gerger_easy_w', easyReadWidth.toString());
      localStorage.setItem('gerger_orig_w', originalWidth.toString());
      window.dispatchEvent(new CustomEvent('gerger_save_trigger'));
    }, 800);
    return () => clearTimeout(timer);
  }, [kotiText, almeidaText, easyReadText, chapter, isDarkMode, zoom, almeidaWidth, easyReadWidth, originalWidth]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current) return;
    
    if (resizingRef.current === 'almeida') {
      const newWidth = e.clientX - 288; // Sidebar width
      if (newWidth > 100 && newWidth < 500) setAlmeidaWidth(newWidth);
    } else if (resizingRef.current === 'easy') {
      const offset = 288 + (showAlmeida ? almeidaWidth : 0) + 10;
      const newWidth = e.clientX - offset;
      if (newWidth > 100 && newWidth < 500) setEasyReadWidth(newWidth);
    } else if (resizingRef.current === 'original') {
      const suiteWidth = showProfSuite ? 350 : 0;
      const newWidth = window.innerWidth - e.clientX - suiteWidth;
      if (newWidth > 150 && newWidth < 600) setOriginalWidth(newWidth);
    }
  }, [showAlmeida, almeidaWidth, showProfSuite]);

  const stopResizing = useCallback(() => {
    resizingRef.current = null;
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [handleMouseMove, stopResizing]);

  const startResizing = (type: string) => {
    resizingRef.current = type;
    document.body.style.cursor = 'col-resize';
  };

  const insertPunctuation = (char: string) => {
    if (!editorRef.current) return;
    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    setKotiText(kotiText.substring(0, start) + char + kotiText.substring(end));
    setTimeout(() => {
      editorRef.current?.focus();
      editorRef.current?.setSelectionRange(start + char.length, start + char.length);
    }, 0);
  };

  return (
    <div className={`h-full flex flex-col overflow-hidden transition-all duration-700 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#f1f5f9]'}`}>
      
      {/* EXPORT MODAL OVERLAY */}
      {showSaveAs && (
        <SaveAsModule 
          onClose={() => setShowSaveAs(false)} 
          kotiText={kotiText} 
          chapter={chapter} 
        />
      )}

      {/* PROFESSIONAL MULTI-TOGGLE HEADER */}
      <div className={`shrink-0 border-b z-50 shadow-2xl ${isDarkMode ? 'bg-black border-zinc-900' : 'bg-white border-zinc-200'}`}>
        <div className={`h-11 border-b flex items-center px-8 justify-between ${isDarkMode ? 'bg-[#0a0a0b] border-zinc-900' : 'bg-blue-600 text-white'}`}>
           <div className="flex items-center gap-6">
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:scale-110 transition-transform">
                {isDarkMode ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-white" />}
                <span>{isDarkMode ? 'Dia' : 'Noite'}</span>
              </button>
              <div className="h-4 w-px bg-white/10"></div>
              <div className="flex items-center gap-2">
                 <button onClick={() => setShowAlmeida(!showAlmeida)} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${showAlmeida ? 'bg-blue-500 text-white' : 'bg-white/10 text-white/50'}`}>Almeida</button>
                 <button onClick={() => setShowEasyRead(!showEasyRead)} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${showEasyRead ? 'bg-green-600 text-white' : 'bg-white/10 text-white/50'}`}>V. Fácil</button>
                 <button onClick={() => setShowOriginal(!showOriginal)} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${showOriginal ? 'bg-amber-600 text-white' : 'bg-white/10 text-white/50'}`}>Original</button>
              </div>
           </div>
           <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 text-[10px] text-blue-500 font-black uppercase tracking-tighter">
               <Layers size={14} /> Quad-Pane Sync Engine
             </div>
             <button onClick={() => setShowFullGlossary(true)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:underline text-zinc-400">
                <Database size={14} /> Glossário Core
             </button>
           </div>
        </div>

        <header className="h-16 px-10 flex items-center justify-between">
           <div className="flex items-center gap-10">
              <div className="flex flex-col">
                 <h1 className={`text-xl font-black italic tracking-tighter leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GERGER.GE</h1>
                 <span className="text-[7px] text-blue-500 font-bold uppercase tracking-[0.4em]">Bible Translator Suite • Gerson Jose</span>
              </div>
              
              <div className="flex items-center gap-1 bg-black/5 dark:bg-zinc-900/50 p-1 rounded-xl">
                 <button onClick={() => setZoom(Math.max(12, zoom - 1))} className="p-2 text-zinc-500 hover:text-blue-500 transition-colors"><ZoomOut size={16}/></button>
                 <span className="text-[10px] font-black w-8 text-center text-zinc-400">{zoom}px</span>
                 <button onClick={() => setZoom(Math.min(48, zoom + 1))} className="p-2 text-zinc-500 hover:text-blue-500 transition-colors"><ZoomIn size={16}/></button>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <select value={chapter} onChange={e => setChapter(Number(e.target.value))} className="bg-zinc-900 hover:bg-zinc-800 text-white font-black text-xs px-6 h-10 rounded-xl outline-none shadow-xl transition-colors cursor-pointer border border-zinc-800">
                 {Array.from({length: 150}, (_, i) => <option key={i+1} value={i+1}>Salmo {i+1}</option>)}
              </select>
              <button 
                onClick={() => setShowSaveAs(true)} 
                className={`px-6 h-10 rounded-xl font-black text-[9px] uppercase shadow-xl transition-all ${isDarkMode ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white border border-zinc-200 text-zinc-900 hover:bg-blue-600 hover:text-white'}`}
              >
                Exportar
              </button>
              <button onClick={() => setShowProfSuite(!showProfSuite)} className={`p-2.5 rounded-xl transition-all ${showProfSuite ? 'bg-amber-600 text-white shadow-lg' : 'bg-zinc-800 text-amber-500'}`}>
                <Settings2 size={18} />
              </button>
           </div>
        </header>
      </div>

      {/* ÁREA DE TRABALHO MULTI-PANE */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        
        {/* COLUNA 1: ALMEIDA (EDITÁVEL) */}
        {showAlmeida && (
          <>
            <div style={{ width: `${almeidaWidth}px` }} className="flex flex-col shrink-0 p-4 bg-zinc-50 dark:bg-zinc-900/10 border-r border-zinc-800/10 animate-in slide-in-from-left duration-300">
               <div className={`flex-1 border rounded-[2rem] p-6 overflow-hidden flex flex-col shadow-inner ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <div className="text-[8px] font-black text-blue-500 uppercase mb-4 tracking-widest flex items-center justify-between border-b border-zinc-800/10 pb-2 shrink-0">
                     <span className="flex items-center gap-2"><Book size={12} /> Almeida</span>
                     <span className="opacity-40">ARA</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <span className="bg-blue-500 text-white font-black px-1 py-0.5 rounded text-[9px] h-fit shrink-0 mt-1">1</span>
                    <textarea 
                      value={almeidaText}
                      onChange={e => setAlmeidaText(e.target.value)}
                      className="w-full h-full bg-transparent outline-none resize-none text-xs leading-relaxed text-zinc-500 font-medium italic custom-scrollbar"
                      spellCheck="false"
                      placeholder="Referência Almeida..."
                    />
                  </div>
               </div>
            </div>
            <div onMouseDown={() => startResizing('almeida')} className="w-1 relative cursor-col-resize group z-30 hover:bg-blue-600 transition-colors flex items-center justify-center">
              <div className="h-4 w-px bg-zinc-800 rounded-full group-hover:bg-white"></div>
            </div>
          </>
        )}

        {/* COLUNA 2: VERSÃO FÁCIL (EDITÁVEL) */}
        {showEasyRead && (
          <>
            <div style={{ width: `${easyReadWidth}px` }} className="flex flex-col shrink-0 p-4 bg-zinc-50 dark:bg-zinc-900/10 border-r border-zinc-800/10 animate-in fade-in duration-300">
               <div className={`flex-1 border rounded-[2rem] p-6 overflow-hidden flex flex-col shadow-inner ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <div className="text-[8px] font-black text-green-500 uppercase mb-4 tracking-widest flex items-center justify-between border-b border-zinc-800/10 pb-2 shrink-0">
                     <span className="flex items-center gap-2"><BookOpen size={12} /> Versão Fácil</span>
                     <span className="opacity-40">VFL</span>
                  </div>
                  <div className="flex-1 flex gap-2">
                    <span className="bg-green-600 text-white font-black px-1 py-0.5 rounded text-[9px] h-fit shrink-0 mt-1">1</span>
                    <textarea 
                      value={easyReadText}
                      onChange={e => setEasyReadText(e.target.value)}
                      className="w-full h-full bg-transparent outline-none resize-none text-xs leading-relaxed text-zinc-500 font-medium italic custom-scrollbar"
                      spellCheck="false"
                      placeholder="Referência Fácil..."
                    />
                  </div>
               </div>
            </div>
            <div onMouseDown={() => startResizing('easy')} className="w-1 relative cursor-col-resize group z-30 hover:bg-green-600 transition-colors flex items-center justify-center">
              <div className="h-4 w-px bg-zinc-800 rounded-full group-hover:bg-white"></div>
            </div>
          </>
        )}

        {/* COLUNA CENTRAL: EDITOR PRINCIPAL (ZAPUURA) */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar items-center bg-zinc-100 dark:bg-black py-10 px-6 shadow-inner relative z-10">
           <div 
             className={`w-full max-w-[210mm] min-h-[297mm] h-fit p-[20mm] shadow-[0_40px_100px_rgba(0,0,0,0.3)] transition-all duration-300 relative border ${isDarkMode ? 'bg-[#0a0a0b] border-zinc-800 text-white' : 'bg-white border-zinc-300 text-black'}`}
             style={{ fontFamily }}
           >
              <div className="mb-10 border-b border-zinc-800/10 pb-3 flex justify-between items-end opacity-30">
                 <span className="text-[8px] font-black uppercase tracking-widest italic">Zapuura Core • Gerson Jose Selemane</span>
                 <span className="text-[10px] font-black italic tracking-tighter">Salmo {chapter}</span>
              </div>

              <div className="flex items-start gap-4 mb-6 group">
                <span className="bg-blue-600 text-white font-black px-2 py-1 rounded-lg text-xs mt-3 shadow-lg group-hover:scale-110 transition-transform">1</span>
                <textarea 
                  ref={editorRef}
                  value={kotiText}
                  onChange={e => setKotiText(e.target.value)}
                  className={`flex-1 bg-transparent outline-none resize-none leading-[2] transition-all duration-300 min-h-[700px]`}
                  style={{ fontSize: `${zoom}px` }}
                  spellCheck="false"
                  placeholder="Inicie a tradução Zapuura..."
                />
              </div>
           </div>
        </div>

        {/* COLUNA 3: HEBRAICO INTERLINEAR */}
        {showOriginal && (
          <>
            <div onMouseDown={() => startResizing('original')} className="w-1 relative cursor-col-resize group z-30 hover:bg-amber-600 transition-colors flex items-center justify-center">
              <div className="h-4 w-px bg-zinc-800 rounded-full group-hover:bg-white"></div>
            </div>
            <div style={{ width: `${originalWidth}px` }} className="flex flex-col shrink-0 p-4 bg-zinc-50 dark:bg-zinc-900/10 border-l border-zinc-800/10 animate-in slide-in-from-right duration-300">
               <div className={`flex-1 border rounded-[2rem] p-6 overflow-y-auto custom-scrollbar shadow-inner ${isDarkMode ? 'bg-zinc-900/30 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                  <div className="text-[8px] font-black text-amber-500 uppercase mb-6 tracking-widest flex items-center justify-between border-b border-zinc-800/10 pb-2 shrink-0">
                     <span className="flex items-center gap-2"><AlignLeft size={12} /> HEB INTERLINEAR</span>
                     <button onClick={() => setInterlinearEnabled(!interlinearEnabled)} className={`px-2 py-0.5 rounded text-[7px] border transition-all ${interlinearEnabled ? 'bg-amber-600 text-white border-amber-500' : 'bg-transparent text-zinc-500 border-zinc-800'}`}>GLOSSAS</button>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-8 dir-rtl" dir="rtl">
                    <span className="bg-amber-400 text-black font-black px-1.5 py-0.5 rounded text-[10px] ml-4 h-fit">1</span>
                    {PSALM_23_INTERLINEAR.map((word, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                        <span className="text-2xl font-medium text-white group-hover:text-blue-500 transition-colors font-serif">{word.original}</span>
                        {interlinearEnabled && (
                          <span className="text-[9px] text-amber-500 font-bold italic tracking-tighter text-center max-w-[80px] leading-tight">{word.gloss}</span>
                        )}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </>
        )}

        {/* SIDEBAR: PROFESSIONAL SUITE */}
        {showProfSuite && (
          <div className="w-[350px] shrink-0 border-l flex flex-col bg-zinc-950 border-zinc-900 z-40 animate-in slide-in-from-right duration-300 shadow-2xl">
             <div className="p-6 bg-amber-600/10 border-b border-amber-600/20 flex justify-between items-center shrink-0">
                <h3 className="text-amber-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Briefcase size={14} /> Professional Suite
                </h3>
                <button onClick={() => setShowProfSuite(false)} className="text-amber-600 hover:text-white transition-colors"><X size={18}/></button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <div className="space-y-4">
                   <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-2"><Quote size={14} /> Pontuação Koti</div>
                   <div className="grid grid-cols-5 gap-2">
                      {['«', '»', '—', '(', ')', ':', ';', '!', '?', '...'].map(char => (
                        <button key={char} onClick={() => insertPunctuation(char)} className="h-10 bg-zinc-900 border border-zinc-800 rounded-lg text-white font-bold hover:bg-blue-600 transition-all text-xs active:scale-95">{char}</button>
                      ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-zinc-900">
                   <WordLinker terms={dictionary} onAddTerm={(pt, koti) => setDictionary([...dictionary, {pt, koti, term: koti}])} />
                </div>
                
                <div className="pt-4 border-t border-zinc-900">
                  <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Brain size={14} /> Core Intelligence</div>
                  <div className="bg-blue-600/5 p-4 rounded-2xl border border-blue-600/20 text-[10px] text-zinc-500 leading-relaxed italic">
                    Gerson, o sistema está monitorando a consistência dos termos <b>Mbwana</b> e <b>Nnyizinku</b> em tempo real.
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <footer className={`h-10 border-t flex items-center justify-between px-10 z-[100] text-[9px] font-black uppercase tracking-widest shrink-0 ${isDarkMode ? 'bg-black border-zinc-900 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400'}`}>
         <div className="flex items-center gap-10">
            <div className="flex items-center gap-2 text-green-500"><CheckCircle2 size={14} /> Sincronizado</div>
            <div className="italic text-blue-500">Quad-Pane Engine v9.4 Stable • Gerson Jose Selemane</div>
         </div>
         <div className="opacity-50">Zapuura Bible Project • Angoche Pride</div>
      </footer>
      <style>{`
        .dir-rtl { direction: rtl; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </div>
  );
};
