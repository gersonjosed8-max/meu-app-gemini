
import React from 'react';
import { ShieldCheck, Cloud, CloudOff, RefreshCcw, Clock, HardDrive } from 'lucide-react';

interface StatusBarProps {
  adminName: string;
  syncStatus: 'Sincronizado' | 'Modo Offline' | 'Gravando...';
  lastSaveTime: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ adminName, syncStatus, lastSaveTime }) => {
  const isOnline = navigator.onLine;

  return (
    <footer className="h-10 bg-[#050505] border-t border-zinc-900 px-6 flex items-center justify-between z-[100] shrink-0 select-none text-[9px] font-black uppercase tracking-[0.2em]">
      <div className="flex items-center gap-8">
        {/* Administrator Info */}
        <div className="flex items-center gap-2.5 text-zinc-500 border-r border-zinc-800 pr-8">
          <ShieldCheck size={14} className="text-blue-600" />
          <span className="text-zinc-600">Admin Master:</span>
          <span className="text-zinc-300 italic">{adminName}</span>
        </div>

        {/* Sync Status */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {syncStatus === 'Gravando...' ? (
              <RefreshCcw size={12} className="text-amber-500 animate-spin" />
            ) : isOnline ? (
              <Cloud size={12} className="text-blue-500" />
            ) : (
              <CloudOff size={12} className="text-zinc-700" />
            )}
            <span className={syncStatus === 'Gravando...' ? 'text-amber-500' : 'text-zinc-500'}>
              {syncStatus}
            </span>
            {isOnline && syncStatus === 'Sincronizado' && (
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse ml-1"></div>
            )}
          </div>

          <div className="flex items-center gap-2 text-zinc-500 border-l border-zinc-800 pl-6">
            <HardDrive size={12} className="text-zinc-700" />
            <span>Local DB: <span className="text-blue-500">Active</span></span>
          </div>
        </div>
      </div>

      {/* Time and Project Engine */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-zinc-600">
          <Clock size={12} />
          <span>Última Gravação:</span>
          <span className="text-zinc-300 font-mono tracking-tighter">{lastSaveTime}</span>
        </div>
        
        <div className="h-4 w-px bg-zinc-800"></div>

        <div className="flex items-center gap-2 text-zinc-800 italic">
          Zapuura Engine v9.2.0 • Angoche Pride
        </div>
      </div>
    </footer>
  );
};
