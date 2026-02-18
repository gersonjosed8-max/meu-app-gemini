
import React, { useState, useEffect } from 'react';
import { GlossaryTerm } from '../types';
import { Plus, Search, BookOpen, Trash2, Edit2, ExternalLink, ShieldCheck, Lock, X, Save, CheckCircle2 } from 'lucide-react';

const INITIAL_MOCK: GlossaryTerm[] = [
  { id: 'koti-101', pt: 'Deus', koti: 'Nnyizinku', term: 'Nnyizinku', definition: 'Nome sagrado para Deus em Ekoti. Autorização: OBRIGATÓRIO.', originalWord: 'Deus / Elohim' },
  { id: 'koti-102', pt: 'Senhor', koti: 'Mbwana', term: 'Mbwana', definition: 'Título de autoridade suprema para o Senhor. Autorização: OBRIGATÓRIO.', originalWord: 'Senhor / Adonai' },
  { id: 'koti-103', pt: 'Salmos', koti: 'Zapuura', term: 'Zapuura', definition: 'Título usado para o Livro de Salmos em Ekoti.', originalWord: 'Salmos / Tehillim' },
];

export const Glossary: React.FC = () => {
  const [terms, setTerms] = useState<GlossaryTerm[]>(() => {
    const saved = localStorage.getItem('gerger_dictionary');
    if (saved) return JSON.parse(saved);
    return INITIAL_MOCK;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ pt: '', koti: '', definition: '', originalWord: '' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('gerger_dictionary', JSON.stringify(terms));
  }, [terms]);

  const filteredTerms = terms.filter(t => 
    (t.pt || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.koti || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.definition || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ pt: '', koti: '', definition: '', originalWord: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (term: GlossaryTerm) => {
    setEditingId(term.id || null);
    setFormData({ 
      pt: term.pt || '', 
      koti: term.koti || '', 
      definition: term.definition || '', 
      originalWord: term.originalWord || '' 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pt || !formData.koti) return;
    
    if (editingId) {
      setTerms(terms.map(t => t.id === editingId ? {
        ...t,
        pt: formData.pt,
        koti: formData.koti,
        term: formData.koti,
        definition: formData.definition,
        originalWord: formData.originalWord || formData.pt
      } : t));
    } else {
      const newId = Date.now().toString();
      const newTerm: GlossaryTerm = {
        id: newId,
        pt: formData.pt,
        koti: formData.koti,
        term: formData.koti,
        definition: formData.definition,
        originalWord: formData.originalWord || formData.pt
      };
      setTerms([newTerm, ...terms]);
      
      // Feedback Visual: Highlight Card & Toast
      setLastAddedId(newId);
      setShowSuccessToast(true);
      
      // Remove feedbacks após tempo determinado
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3000);
      
      setTimeout(() => {
        setLastAddedId(null);
      }, 4000);
    }
    
    setIsModalOpen(false);
    setFormData({ pt: '', koti: '', definition: '', originalWord: '' });
  };

  const deleteTerm = (id: string) => {
    if (confirm("Gerson, deseja ELIMINAR permanentemente esta palavra do núcleo linguístico?")) {
      setTerms(terms.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-8 h-full flex flex-col bg-zinc-950 animate-in fade-in duration-500 overflow-hidden relative">
      
      {/* GLOBAL SUCCESS TOAST */}
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[3000] animate-in slide-in-from-top-12 duration-500">
          <div className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] shadow-[0_30px_60px_rgba(37,99,235,0.4)] border border-blue-500 flex items-center gap-5">
            <div className="bg-white/20 p-2 rounded-full animate-bounce">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest italic leading-none">Termo Validado</span>
              <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Sincronizado com Zapuura Core</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-10 shrink-0">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 text-white tracking-tighter uppercase italic">
            <BookOpen className="text-blue-500" size={36} />
            Glossário de Tradução
          </h1>
          <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.5em] mt-2 opacity-60">Núcleo Linguístico • Angoche Professional</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleOpenAdd}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl flex items-center gap-4 font-black shadow-2xl shadow-blue-900/40 transition-all active:scale-95 uppercase text-xs tracking-widest italic"
          >
            <Plus size={20} /> Adicionar Termo
          </button>
        </div>
      </div>

      <div className="relative mb-10 shrink-0">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={24} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar termo no core..."
          className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl py-6 pl-16 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-inner placeholder:text-zinc-800 font-bold text-lg"
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTerms.map((term, index) => {
            const isLocked = term.koti === 'Nnyizinku' || term.koti === 'Mbwana';
            const isJustAdded = term.id === lastAddedId;
            
            return (
              <div 
                key={term.id} 
                className={`group relative bg-zinc-900/40 border-2 rounded-[3rem] p-10 transition-all duration-700 hover:bg-zinc-900/60 animate-in fade-in slide-in-from-bottom-6 ${
                  isJustAdded 
                    ? 'border-blue-500 bg-blue-500/5 shadow-[0_0_50px_rgba(37,99,235,0.2)] scale-[1.02]' 
                    : isLocked ? 'border-zinc-800 border-l-blue-600' : 'border-zinc-800'
                }`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* SUBTLE CHECKMARK POPUP ON ADDED */}
                {isJustAdded && (
                  <div className="absolute -top-4 -right-4 bg-blue-600 text-white p-3 rounded-full shadow-2xl animate-in zoom-in-50 duration-500 spin-in-90">
                    <CheckCircle2 size={24} />
                  </div>
                )}

                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-3 mb-2">
                       <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase truncate leading-none group-hover:text-blue-400 transition-colors">
                        {term.koti}
                       </h3>
                       {isLocked && <Lock size={16} className="text-blue-500 animate-pulse shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-black/50 text-blue-500 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-900/20">
                        {term.pt}
                      </span>
                      {isJustAdded && (
                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-tighter animate-pulse">Novo Registro</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleOpenEdit(term)}
                      className="p-3 bg-zinc-950 hover:bg-blue-600 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl"
                    >
                      <Edit2 size={16} />
                    </button>
                    {!isLocked && (
                      <button 
                        onClick={() => deleteTerm(term.id!)}
                        className="p-3 bg-zinc-950 hover:bg-red-600 rounded-xl text-zinc-500 hover:text-white transition-all shadow-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-zinc-500 text-sm leading-relaxed mb-8 font-medium italic line-clamp-2">
                  {term.definition || "Sem nota técnica registrada."}
                </p>

                <div className="pt-6 border-t border-zinc-800/50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-blue-600 animate-pulse' : 'bg-zinc-700'}`}></div>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest font-black italic">
                      {isLocked ? 'AUTORIZAÇÃO MASTER' : 'Vínculo Regional'}
                    </span>
                  </div>
                  <button className="text-[10px] text-blue-500 flex items-center gap-2 hover:underline font-black uppercase tracking-widest transition-all">
                    Visualizar <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[5000] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-xl rounded-[4rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] p-12 relative overflow-hidden">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-all p-3 bg-zinc-950 rounded-2xl"
            >
              <X size={28} />
            </button>
            <div className="mb-12">
              <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">
                {editingId ? 'Editar Termo' : 'Novo Registro'}
              </h2>
              <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] italic">Linguistic Core v9.4 • Gerson Selemane</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 italic">Fonte (Português)</label>
                  <input 
                    required 
                    placeholder="Ex: Redenção" 
                    className="w-full bg-black border border-zinc-800 p-6 rounded-3xl text-white font-bold outline-none focus:border-blue-600 transition-all shadow-inner text-lg" 
                    value={formData.pt} 
                    onChange={e => setFormData({...formData, pt: e.target.value})} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-4 italic">Alvo (Ekoti)</label>
                  <input 
                    required 
                    placeholder="Ex: Woopoliwa" 
                    className="w-full bg-black border-2 border-zinc-800 p-6 rounded-3xl text-white font-black outline-none focus:border-blue-600 transition-all shadow-inner text-2xl uppercase italic" 
                    value={formData.koti} 
                    onChange={e => setFormData({...formData, koti: e.target.value})} 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4 italic">Contexto Exegético</label>
                  <textarea 
                    placeholder="Notas sobre a escolha terminológica..." 
                    className="w-full bg-black border border-zinc-800 p-6 rounded-3xl text-white font-medium outline-none focus:border-blue-600 transition-all h-36 resize-none shadow-inner text-sm italic leading-relaxed" 
                    value={formData.definition} 
                    onChange={e => setFormData({...formData, definition: e.target.value})} 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-7 rounded-[2.5rem] text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 shadow-blue-900/40 italic"
              >
                <Save size={20} /> {editingId ? 'Atualizar Core' : 'Protocolar Termo'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};
