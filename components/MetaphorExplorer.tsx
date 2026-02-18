
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Lightbulb, Search, Plus, 
  Trash2, Edit2, X, Save, ShieldCheck, Bookmark,
  CloudLightning, Waves, Mountain, Sun
} from 'lucide-react';
import { Metaphor } from '../types';

const INITIAL_METAPHORS: Metaphor[] = [
  {
    id: 'm1',
    title: 'O Senhor é o meu Pastor',
    psalmReference: 'Salmo 23:1',
    literalMeaning: 'Um pastor guiando ovelhas para pastos e águas.',
    symbolicMeaning: 'Cuidado total de Deus, provisão e proteção constante mesmo em perigo.',
    kotiEquivalent: 'Mbwana ti nshuki aka - Reflete a liderança protetora na cultura de Angoche.',
    category: 'Cotidiano'
  },
  {
    id: 'm2',
    title: 'Lâmpada para os meus pés',
    psalmReference: 'Salmo 119:105',
    literalMeaning: 'Uma pequena tocha iluminando o caminho imediato na escuridão.',
    symbolicMeaning: 'A Palavra de Deus como guia prático para decisões diárias e direção moral.',
    kotiEquivalent: 'Nthala ya makhuluni aka - Orientação espiritual em tempos de incerteza.',
    category: 'Cotidiano'
  },
  {
    id: 'm3',
    title: 'À sombra das tuas asas',
    psalmReference: 'Salmo 17:8',
    literalMeaning: 'Uma ave protegendo seus filhotes sob as asas.',
    symbolicMeaning: 'Proteção íntima, refúgio contra inimigos e conforto sob a soberania divina.',
    kotiEquivalent: 'Munthushini mwa maphapha anyu - Segurança absoluta no Nnyizinku.',
    category: 'Natureza'
  }
];

export const MetaphorExplorer: React.FC = () => {
  const [metaphors, setMetaphors] = useState<Metaphor[]>(() => {
    const saved = localStorage.getItem('gerger_metaphors');
    return saved ? JSON.parse(saved) : INITIAL_METAPHORS;
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Metaphor>>({
    title: '',
    psalmReference: '',
    literalMeaning: '',
    symbolicMeaning: '',
    kotiEquivalent: '',
    category: 'Natureza'
  });

  useEffect(() => {
    localStorage.setItem('gerger_metaphors', JSON.stringify(metaphors));
  }, [metaphors]);

  const filtered = metaphors.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.psalmReference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.psalmReference) return;

    if (editingId) {
      setMetaphors(metaphors.map(m => m.id === editingId ? { ...m, ...formData as Metaphor } : m));
    } else {
      const newM: Metaphor = {
        id: Date.now().toString(),
        ...formData as Metaphor
      };
      setMetaphors([newM, ...metaphors]);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const deleteMetaphor = (id: string) => {
    if (confirm("Gerson, deseja remover este estudo de metáfora?")) {
      setMetaphors(metaphors.filter(m => m.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden animate-in fade-in duration-700">
      <header className="p-8 lg:p-12 border-b border-zinc-900 shrink-0">
        <div className="flex justify-between items-end mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber-500 font-black text-xs uppercase tracking-[0.5em] italic">
              <Sparkles size={16} /> Estudo Simbólico Zapuura
            </div>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Pasta de Metáforas</h1>
            <p className="text-zinc-500 text-lg font-medium max-w-xl italic">
              Análise profunda dos símbolos dos Salmos e sua equivalência cultural em Ekoti.
            </p>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({ category: 'Natureza' }); setIsModalOpen(true); }}
            className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-4"
          >
            <Plus size={20} /> Nova Metáfora
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
          <input 
            type="text" 
            placeholder="Pesquisar por símbolo ou referência..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-[2rem] py-5 pl-16 pr-8 text-white focus:outline-none focus:border-amber-600 transition-all font-bold italic shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 pb-12">
          {filtered.map(m => (
            <div key={m.id} className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-10 group hover:border-amber-600/50 transition-all duration-500 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-5 text-white group-hover:opacity-10 transition-opacity">
                <Lightbulb size={180} />
              </div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3 bg-amber-600/10 text-amber-500 px-4 py-1.5 rounded-full border border-amber-600/20 text-[9px] font-black uppercase tracking-widest">
                  <Bookmark size={12} /> {m.category}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(m.id); setFormData(m); setIsModalOpen(true); }} className="p-2.5 bg-zinc-800 hover:bg-amber-600 rounded-xl text-white transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => deleteMetaphor(m.id)} className="p-2.5 bg-zinc-800 hover:bg-red-600 rounded-xl text-white transition-all"><Trash2 size={16} /></button>
                </div>
              </div>

              <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none group-hover:text-amber-500 transition-colors">{m.title}</h3>
              <div className="text-amber-600 font-black text-xs uppercase tracking-widest mb-8 flex items-center gap-2">
                <BookOpen size={14} /> {m.psalmReference}
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block">Significado Literal</span>
                  <p className="text-zinc-400 text-xs italic leading-relaxed">{m.literalMeaning}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block">Profundidade Espiritual</span>
                  <p className="text-white text-sm font-bold italic leading-relaxed">"{m.symbolicMeaning}"</p>
                </div>
                <div className="pt-6 border-t border-zinc-800 mt-4">
                  <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block mb-2 italic">Equivalência Koti (Zapuura)</span>
                  <p className="text-lg font-black text-white uppercase italic tracking-tighter">{m.kotiEquivalent}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-[500] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[3.5rem] shadow-2xl p-12 relative overflow-hidden">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-zinc-600 hover:text-white transition-all p-3 bg-zinc-800 rounded-2xl"><X size={24} /></button>
            <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2 leading-none">{editingId ? 'Refinar Estudo' : 'Novo Estudo'}</h2>
            <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-[10px] mb-12 italic">Módulo de Auditoria Simbólica Gerson Selemane</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Metáfora / Símbolo</label>
                  <input required placeholder="Ex: O Escudo" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-amber-600 transition-all shadow-inner" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Referência Bíblica</label>
                  <input required placeholder="Ex: Salmo 18:2" className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-amber-600 transition-all shadow-inner" value={formData.psalmReference} onChange={e => setFormData({...formData, psalmReference: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Categoria Arquetípica</label>
                <select className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white font-bold outline-none focus:border-amber-600 appearance-none cursor-pointer uppercase tracking-widest text-xs" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})}>
                  <option value="Natureza">Natureza</option>
                  <option value="Realeza">Realeza / Poder</option>
                  <option value="Guerra">Guerra / Conflito</option>
                  <option value="Cotidiano">Cotidiano / Vida</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Sentido Literal</label>
                  <textarea className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-amber-600 transition-all h-24 resize-none shadow-inner italic" value={formData.literalMeaning} onChange={e => setFormData({...formData, literalMeaning: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-4">Significado Teológico</label>
                  <textarea className="w-full bg-black border border-zinc-800 p-5 rounded-2xl text-white text-xs font-bold outline-none focus:border-amber-600 transition-all h-24 resize-none shadow-inner italic" value={formData.symbolicMeaning} onChange={e => setFormData({...formData, symbolicMeaning: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-4 italic">Equivalente Koti (Cultura de Angoche)</label>
                <input placeholder="Como esta metáfora soa em Zapuura?" className="w-full bg-black border-2 border-amber-900/30 p-6 rounded-[2rem] text-white text-lg italic outline-none focus:border-amber-500 transition-all font-black shadow-inner shadow-amber-900/20" value={formData.kotiEquivalent} onChange={e => setFormData({...formData, kotiEquivalent: e.target.value})} />
              </div>

              <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-7 rounded-[2.5rem] text-xs uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 shadow-amber-900/40 italic">
                <Save size={20} /> Guardar Estudo Metafórico
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
