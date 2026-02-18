
import React, { useState, useRef } from 'react';
import { 
  MapPin, ZoomIn, ZoomOut, Layers, ImageIcon, ChevronRight, 
  X, GripVertical, BookOpen, Map as MapIcon, Maximize2, Globe, Eye
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

const HISTORICAL_REGIONS: MapRegion[] = [
  { 
    id: 'egito', 
    name: 'Antigo Egito', 
    coords: 'M150,450 Q200,500 250,450 T300,550 L100,550 Z', 
    color: 'rgba(59, 130, 246, 0.2)', 
    description: 'A terra do Nilo. Local de cativeiro e da grande libertação narrada por Moisés.',
    imageUrl: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&q=80&w=1200'
  },
  { 
    id: 'canaan', 
    name: 'Canaã / Judá', 
    coords: 'M380,300 Q400,280 420,300 T440,350 L360,350 Z', 
    color: 'rgba(34, 197, 94, 0.2)', 
    description: 'A Terra Prometida, centro do reinado de Davi e cenário principal dos Salmos.',
    imageUrl: 'https://images.unsplash.com/photo-1548135039-35d1f044bf69?auto=format&fit=crop&q=80&w=1200'
  }
];

const MAP_POINTS: MapPoint[] = [
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
    id: 'hebron',
    name: 'Hebrom',
    x: 395,
    y: 360,
    color: '#f59e0b',
    type: 'city',
    description: 'Cidade onde Davi foi ungido rei sobre Judá e reinou por sete anos.',
    psalmContext: 'Salmo 18:50: "Ele dá grandes vitórias ao seu rei e usa de benignidade para com o seu ungido, para com Davi."',
    historicalNote: 'Um dos locais de sepultamento dos patriarcas mais antigos de Israel.',
    imageUrl: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'adullam',
    name: 'Caverna de Adulão',
    x: 380,
    y: 340,
    color: '#a78bfa',
    type: 'cave',
    description: 'Esconderijo estratégico onde Davi reuniu seu exército de "homens em aperto".',
    psalmContext: 'Salmo 142 (Título): "Oração de Davi quando estava na caverna."',
    historicalNote: 'Reflete o isolamento e a dependência total de Davi em Deus durante as provações.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'rio-jordao',
    name: 'Rio Jordão',
    x: 435,
    y: 310,
    color: '#3b82f6',
    type: 'nature',
    description: 'O rio sagrado, fronteira espiritual e palco de milagres de travessia.',
    psalmContext: 'Salmo 42:6: "Lembro-me de ti desde a terra do Jordão, e desde os montes de Hermom."',
    historicalNote: 'Suas águas simbolizam transição e renovação teológica.',
    imageUrl: 'https://images.unsplash.com/photo-1552554602-998dfc381710?auto=format&fit=crop&q=80&w=1200'
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

type MapLayer = 'political' | 'topographic' | 'points';

export const Maps: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  const [selectedData, setSelectedData] = useState<MapPoint | MapRegion | null>(null);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('points');
  const [splitWidth, setSplitWidth] = useState(60); 
  const [fullscreenImg, setFullscreenImg] = useState<string | null>(null);
  const isResizing = useRef(false);

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
      
      {/* LIGHTBOX DE IMAGENS */}
      {fullscreenImg && (
        <div 
          className="fixed inset-0 z-[999] bg-black/98 flex items-center justify-center p-4 backdrop-blur-3xl animate-in zoom-in-95 duration-500"
          onClick={() => setFullscreenImg(null)}
        >
          <button className="absolute top-10 right-10 p-4 bg-white/10 hover:bg-red-500 rounded-full text-white transition-all shadow-2xl">
            <X size={32} />
          </button>
          <img 
            src={fullscreenImg} 
            alt="Localização Bíblica" 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-3xl shadow-[0_0_150px_rgba(37,99,235,0.4)] border border-white/10" 
          />
        </div>
      )}

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
        {/* VIEWPORT DO MAPA (SVG) */}
        <div 
          className="relative bg-black flex items-center justify-center overflow-hidden border-r border-zinc-900"
          style={{ width: `${splitWidth}%` }}
        >
          {activeLayer === 'topographic' && (
             <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/topography.png')]"></div>
          )}

          <div 
            className="relative transition-transform duration-700 ease-out cursor-grab active:cursor-grabbing" 
            style={{ transform: `scale(${zoom})` }}
          >
            <svg width="1200" height="800" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              <rect width="1200" height="800" fill="#030303" />
              <path 
                d="M100,700 L200,600 L350,550 L400,400 L420,200 L600,100 L900,150 L1100,300 L1150,600 L1000,750 Z" 
                fill={activeLayer === 'political' ? '#0a0a0b' : '#050505'} 
                stroke="#1e293b" 
                strokeWidth="2" 
              />
              
              {MAP_POINTS.map(point => {
                const isSelected = selectedData?.id === point.id;
                return (
                  <g 
                    key={point.id} 
                    className="cursor-pointer transition-all duration-300 hover:opacity-100"
                    onClick={() => setSelectedData(point)}
                  >
                    <circle 
                      cx={point.x} 
                      cy={point.y} 
                      r={isSelected ? 12 : 8} 
                      fill={point.color} 
                      className={isSelected ? "animate-pulse" : ""} 
                    />
                    <text 
                      x={point.x + 15} 
                      y={point.y + 5} 
                      fill={isSelected ? point.color : '#4b5563'} 
                      className={`text-[12px] font-black uppercase tracking-tighter italic transition-colors`}
                    >
                      {point.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* DIVISOR DE REDIMENSIONAMENTO */}
        <div 
          onMouseDown={() => { isResizing.current = true; document.addEventListener('mousemove', handleMouseMove); document.addEventListener('mouseup', handleMouseUp); }}
          className="w-1.5 bg-zinc-900 hover:bg-blue-600 cursor-col-resize flex items-center justify-center transition-colors group relative z-50"
        >
          <div className="h-10 w-full flex items-center justify-center text-zinc-700 group-hover:text-white">
            <GripVertical size={16} />
          </div>
        </div>

        {/* PAINEL DE DETALHES CONTEXTUAIS */}
        <div 
          className="bg-zinc-950 flex flex-col overflow-y-auto custom-scrollbar p-10"
          style={{ width: `${100 - splitWidth}%` }}
        >
          {selectedData ? (
            <div className="animate-in slide-in-from-right duration-500 space-y-10">
              <button 
                onClick={() => setSelectedData(null)}
                className="flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <ChevronRight size={14} className="rotate-180" /> Fechar Detalhes
              </button>
              
              <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 relative group cursor-zoom-in" onClick={() => setFullscreenImg(selectedData.imageUrl)}>
                <img src={selectedData.imageUrl} alt={selectedData.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                <div className="absolute bottom-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={20} />
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-4 leading-none">{selectedData.name}</h3>
                  <div className="h-1.5 w-20 bg-blue-600 rounded-full"></div>
                </div>

                <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-zinc-800 italic text-zinc-400 text-base leading-relaxed font-medium shadow-inner">
                  {selectedData.description}
                </div>

                {(selectedData as MapPoint).psalmContext && (
                  <div className="bg-blue-600/10 p-8 rounded-[2.5rem] border border-blue-600/20 shadow-lg">
                    <BookOpen size={28} className="text-blue-500 mb-6" />
                    <p className="text-white font-black text-xl italic leading-relaxed tracking-tight">
                      "{(selectedData as MapPoint).psalmContext}"
                    </p>
                  </div>
                )}

                {(selectedData as MapPoint).historicalNote && (
                  <div className="bg-zinc-900 p-8 rounded-[2rem] border border-zinc-800 border-l-4 border-l-amber-600">
                    <h4 className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-3 italic">Arqueologia Bíblica</h4>
                    <p className="text-zinc-400 text-sm italic leading-relaxed">{(selectedData as MapPoint).historicalNote}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-10 text-center opacity-30 group grayscale hover:grayscale-0 transition-all duration-700">
              <div className="w-32 h-32 bg-zinc-900 rounded-[3rem] flex items-center justify-center text-zinc-700 mb-8 border border-zinc-800 shadow-2xl group-hover:rotate-6 transition-transform">
                <ImageIcon size={64} />
              </div>
              <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Galeria Contextual Zapuura</h4>
              <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest max-w-xs leading-relaxed">
                Clique nos pontos pulsantes do mapa para visualizar imagens arqueológicas e referências específicas aos Salmos.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
      `}</style>
    </div>
  );
};
