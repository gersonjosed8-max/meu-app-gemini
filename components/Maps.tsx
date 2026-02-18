
import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, ZoomIn, ZoomOut, Layers, ImageIcon, ChevronRight, 
  X, GripVertical, BookOpen, Map as MapIcon, Maximize2, Globe, Eye, Edit3, Save
} from 'lucide-react';

interface MapRegion {
  id: string;
  name: string;
  coords: string;
  color: string;
  description: string;
  imageUrl: string;
}

interface MapPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  type: 'city' | 'holy' | 'nature' | 'figure' | 'enemy' | 'cave';
  description: string;
  imageUrl: string;
  psalmContext?: string;
  historicalNote?: string;
}

const INITIAL_POINTS: MapPoint[] = [
  {
    id: 'jerusalem-siao',
    name: 'Monte Sião (Jerusalém)',
    x: 410,
    y: 330,
    color: '#fbbf24',
    type: 'holy',
    description: 'O monte sagrado onde Davi estabeleceu sua fortaleza e o centro do culto israelita.',
    psalmContext: 'Salmo 2:6: "Eu, porém, ungi o meu Rei sobre o meu santo monte de Sião."',
    historicalNote: 'Sião tornou-se a "Cidade de Davi" após sua conquista aos jebuseus.',
    imageUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'en-gedi',
    name: 'Oásis de En-Gedi',
    x: 425,
    y: 380,
    color: '#34d399',
    type: 'nature',
    description: 'Refúgio de Davi nas cavernas selvagens enquanto fugia da perseguição de Saul.',
    psalmContext: 'Salmo 63:1: "Ó Deus, tu és o meu Deus... a minha alma tem sede de ti, em terra árida e cansada."',
    historicalNote: 'Famoso por suas águas frescas em meio ao deserto da Judéia.',
    imageUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'monte-hermom',
    name: 'Monte Hermom',
    x: 440,
    y: 260,
    color: '#60a5fa',
    type: 'nature',
    description: 'O pico mais alto, cujas neves derretem para alimentar as fontes de Israel.',
    psalmContext: 'Salmo 133:3: "Como o orvalho do Hermom, que desce sobre os montes de Sião."',
    historicalNote: 'Símbolo de unidade e benção que desce do alto sobre o povo.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'
  }
];

export const Maps: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [activeLayer, setActiveLayer] = useState<'political' | 'topographic' | 'points'>('points');
  const [splitWidth, setSplitWidth] = useState(60); 
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const isResizing = useRef(false);

  // Editable Content State
  const [points, setPoints] = useState<MapPoint[]>(() => {
    const saved = localStorage.getItem('gerger_map_points');
    return saved ? JSON.parse(saved) : INITIAL_POINTS;
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditingContext, setIsEditingContext] = useState(false);

  const selectedData = points.find(p => p.id === selectedId);

  useEffect(() => {
    localStorage.setItem('gerger_map_points', JSON.stringify(points));
  }, [points]);

  const updateSelectedPoint = (field: keyof MapPoint, value: string) => {
    if (!selectedId) return;
    setPoints(points.map(p => p.id === selectedId ? { ...p, [field]: value } : p));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const offsetLeft = document.getElementById('maps-container')?.getBoundingClientRect().left || 0;
    const containerWidth = document.getElementById('maps-container')?.clientWidth || 1;
    const newWidth = ((e.clientX - offsetLeft) / containerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) setSplitWidth(newWidth);
  };

  const handleMouseUp = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  return (
    <div id="maps-container" className="h-full flex flex-col bg-[#050505] relative overflow-hidden animate-in fade-in duration-1000 select-none font-sans">
      
      {/* HEADER DO MAPA */}
      <div className="h-20 bg-zinc-950 border-b border-zinc-900 px-10 flex items-center justify-between z-50 shrink-0 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-xl shadow-blue-900/40">
            <MapIcon size={20} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Arqueologia dos Salmos</h2>
            <p className="text-[8px] text-zinc-600 font-black uppercase tracking-[0.4em]">Zapuura Core Context Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/50 p-1 rounded-[2rem] border border-zinc-800 shadow-inner">
          <button onClick={() => setActiveLayer('political')} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === 'political' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Político</button>
          <button onClick={() => setActiveLayer('topographic')} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === 'topographic' ? 'bg-amber-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Topográfico</button>
          <button onClick={() => setActiveLayer('points')} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${activeLayer === 'points' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Pontos Bíblicos</button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(Math.min(5, zoom + 0.5))} className="p-2 bg-zinc-900 text-zinc-400 hover:text-blue-500 rounded-lg border border-zinc-800 transition-all"><ZoomIn size={18}/></button>
          <button onClick={() => setZoom(Math.max(1, zoom - 0.5))} className="p-2 bg-zinc-900 text-zinc-400 hover:text-blue-500 rounded-lg border border-zinc-800 transition-all"><ZoomOut size={18}/></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <div className="relative bg-black flex items-center justify-center overflow-hidden border-r border-zinc-900" style={{ width: `${splitWidth}%` }}>
          <div className="relative transition-transform duration-700 ease-out" style={{ transform: `scale(${zoom})` }}>
            <svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" className="drop-shadow-2xl">
              <rect width="1200" height="800" fill="#030303" />
              <path d="M100,700 L200,600 L350,550 L400,400 L420,200 L600,100 L900,150 L1100,300 L1150,600 L1000,750 Z" fill={activeLayer === 'political' ? '#0a0a0b' : '#050505'} stroke="#1e293b" strokeWidth="2" />
              {points.map(point => (
                <g key={point.id} className="cursor-pointer" onClick={() => setSelectedId(point.id)}>
                  <circle cx={point.x} cy={point.y} r={selectedId === point.id ? 12 : 8} fill={point.color} className={selectedId === point.id ? "animate-pulse" : ""} />
                  <text x={point.x + 15} y={point.y + 5} fill={selectedId === point.id ? point.color : '#4b5563'} className="text-[12px] font-black uppercase italic tracking-tighter">
                    {point.name}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div onMouseDown={() => { isResizing.current = true; document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); }} className="w-1.5 bg-zinc-900 hover:bg-blue-600 cursor-col-resize flex items-center justify-center transition-colors group relative z-50">
          <GripVertical size={16} className="text-zinc-700 group-hover:text-white" />
        </div>

        <div className="bg-zinc-950 flex flex-col overflow-y-auto custom-scrollbar p-10" style={{ width: `${100 - splitWidth}%` }}>
          {selectedData ? (
            <div className="animate-in slide-in-from-right duration-500 space-y-10">
              <div className="flex justify-between items-center">
                <button onClick={() => {setSelectedId(null); setIsEditingContext(false);}} className="text-zinc-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <ChevronRight size={14} className="rotate-180" /> Fechar
                </button>
                <button onClick={() => setIsEditingContext(!isEditingContext)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isEditingContext ? 'bg-amber-600 text-white' : 'bg-zinc-900 text-zinc-500 hover:text-white'}`}>
                  {isEditingContext ? <Save size={14} /> : <Edit3 size={14} />} {isEditingContext ? 'Salvar' : 'Editar'}
                </button>
              </div>
              
              <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative group cursor-zoom-in" onClick={() => setFullscreenImg(selectedData.imageUrl)}>
                <img src={selectedData.imageUrl} alt={selectedData.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>

              <div className="space-y-8">
                <div>
                  {isEditingContext ? (
                    <input value={selectedData.name} onChange={e => updateSelectedPoint('name', e.target.value)} className="bg-transparent text-5xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none outline-none border-b border-blue-600 w-full" />
                  ) : (
                    <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">{selectedData.name}</h3>
                  )}
                  <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
                </div>

                {isEditingContext ? (
                  <textarea value={selectedData.description} onChange={e => updateSelectedPoint('description', e.target.value)} className="w-full bg-zinc-900 p-8 rounded-[2.5rem] italic text-zinc-400 text-base leading-relaxed font-medium outline-none border border-amber-600/30 h-40 resize-none" />
                ) : (
                  <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 italic text-zinc-400 text-base leading-relaxed font-medium shadow-inner">
                    {selectedData.description}
                  </div>
                )}

                <div className="bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-600/20 shadow-lg">
                  <BookOpen size={28} className="text-blue-500 mb-6" />
                  {isEditingContext ? (
                    <textarea value={selectedData.psalmContext} onChange={e => updateSelectedPoint('psalmContext', e.target.value)} className="w-full bg-transparent text-white font-black text-xl italic leading-relaxed tracking-tight outline-none h-24 resize-none border-b border-blue-500/30" />
                  ) : (
                    <p className="text-white font-black text-xl italic leading-relaxed tracking-tight">"{selectedData.psalmContext}"</p>
                  )}
                </div>

                <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 border-l-4 border-l-amber-600">
                  <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-3 italic">Arqueologia Bíblica</h4>
                  {isEditingContext ? (
                    <textarea value={selectedData.historicalNote} onChange={e => updateSelectedPoint('historicalNote', e.target.value)} className="w-full bg-transparent text-zinc-400 text-sm italic leading-relaxed outline-none h-24 resize-none" />
                  ) : (
                    <p className="text-zinc-400 text-sm italic leading-relaxed">{selectedData.historicalNote}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-30 group grayscale hover:grayscale-0 transition-all duration-700">
              <Globe size={64} className="mb-8 text-zinc-700" />
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Galeria Contextual</h4>
              <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest max-w-xs leading-relaxed">Selecione um ponto arqueológico no mapa para visualizar e editar seu contexto histórico.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
