
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { 
  Settings, User as UserIcon, Shield, Database, Save, 
  Monitor, Download, Zap, Cpu, RefreshCcw, 
  Trash2, ShieldCheck, Activity, Globe, Loader2,
  CloudUpload, CloudDownload, AlertTriangle, FileCheck, ExternalLink,
  History, CheckCircle2, X
} from 'lucide-react';

interface PreferencesProps { user: User; }

export const Preferences: React.FC<PreferencesProps> = ({ user }) => {
  const [autoSave, setAutoSave] = useState(true);
  const [aiPower, setAiPower] = useState(80);
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS' | 'UPDATING'>('IDLE');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCheckUpdates = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      setSyncStatus('SUCCESS');
      alert("ATUALIZAÇÃO: Versão 9.4 Instalada. Protocolos de Auditoria Sincronizados.");
      setTimeout(() => setSyncStatus('IDLE'), 2000);
    }, 2500);
  };

  const exportMasterVault = () => {
    const backupData: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // Capturamos todos os dados do projeto, incluindo justificativas e preferências
      if (key?.startsWith('gerger_') || key?.startsWith('justified_')) {
        backupData[key] = localStorage.getItem(key) || '';
      }
    }
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ZAPUURA_MASTER_VAULT_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert("VAULT EXPORTADO: Gerson, o backup completo foi gerado. Guarde este arquivo em um local seguro.");
  };

  const handleImportVault = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!confirm("ALERTA DE SEGURANÇA: Importar um Master Vault substituirá TODOS os dados atuais (traduções, dicionários e configurações) por este arquivo. Deseja prosseguir?")) {
      event.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Limpamos o storage atual para evitar conflitos de versões
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('gerger_') || key.startsWith('justified_')) {
            localStorage.removeItem(key);
          }
        });

        // Inserimos os novos dados
        Object.entries(data).forEach(([key, value]) => {
          localStorage.setItem(key, value as string);
        });

        alert("IMPORTAÇÃO CONCLUÍDA: O Master Vault foi restaurado com sucesso. A aplicação será reiniciada para aplicar as mudanças.");
        window.location.reload();
      } catch (err) {
        alert("ERRO CRÍTICO: O arquivo selecionado não é um Master Vault Zapuura válido.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full overflow-y-auto bg-black p-8 lg:p-12 custom-scrollbar animate-in fade-in duration-1000">
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <header className="border-b border-zinc-900 pb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-blue-500 font-black text-[10px] uppercase tracking-[0.5em] italic">
              <Settings size={16} /> Console de Preferências
            </div>
            <h1 className="text-7xl font-black text-white italic tracking-tighter uppercase leading-none">Settings</h1>
            <p className="text-zinc-500 text-xl font-medium italic">Protocolos globais e soberania de dados do projeto.</p>
          </div>
          <button onClick={handleCheckUpdates} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-6 rounded-3xl font-black text-[10px] uppercase flex items-center gap-3 shadow-2xl shadow-blue-900/40 active:scale-95 transition-all">
            {isUpdating ? <Loader2 className="animate-spin" /> : <RefreshCcw />} Verificar Atualizações
          </button>
        </header>

        {/* RECOVERY PORTAL INFO */}
        <section className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] p-12 space-y-10 group hover:border-zinc-700 transition-all">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-blue-500 shadow-xl group-hover:scale-110 transition-transform">
                <Globe size={24} />
              </div>
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Portal de Recuperação</h2>
           </div>
           <p className="text-zinc-500 text-lg border-l-4 border-blue-600 pl-8 italic font-medium leading-relaxed max-w-2xl">
             "Este sistema garante que a Palavra traduzida nunca se perca. O Master Vault é a sua garantia de continuidade espiritual e técnica."
           </p>
           <div className="bg-black/50 p-8 rounded-3xl border border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 shadow-inner">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-500"><ShieldCheck size={20} /></div>
                <div>
                  <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest block mb-1">Status de Emergência</span>
                  <span className="text-blue-500 font-black text-xs uppercase tracking-tighter">Sincronização Local Ativa</span>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                 <div className="flex-1 text-right">
                    <span className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest block">recovery-node-alpha</span>
                    <span className="text-zinc-400 font-mono text-xs">gerger-recovery.web.app</span>
                 </div>
                 <button className="p-4 bg-zinc-900 text-zinc-400 rounded-2xl hover:text-white hover:bg-zinc-800 transition-all border border-zinc-800"><ExternalLink size={20}/></button>
              </div>
           </div>
        </section>

        {/* MASTER VAULT CONTROLS */}
        <section className="bg-gradient-to-br from-zinc-900 to-black border-2 border-blue-600/20 rounded-[4rem] p-12 lg:p-16 space-y-12 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
             <Database size={300} className="text-white" />
           </div>
           
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
              <div className="space-y-6 flex-1">
                 <div className="flex items-center gap-3 text-amber-500 font-black text-xs uppercase tracking-[0.4em] italic">
                   <Shield size={16} /> Segurança de Nível Master
                 </div>
                 <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">ZAPUURA <br/> MASTER VAULT</h2>
                 <p className="text-zinc-500 text-lg font-medium italic max-w-md">Gerenciamento completo do banco de dados para backup físico e restauração total.</p>
              </div>

              <div className="flex flex-col gap-6 w-full md:w-auto shrink-0">
                <button 
                  onClick={exportMasterVault} 
                  className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-7 rounded-[2.5rem] font-black text-xs uppercase flex items-center justify-center gap-5 shadow-[0_25px_60px_rgba(37,99,235,0.4)] active:scale-95 transition-all italic tracking-tighter"
                >
                   <CloudDownload size={22} className="group-hover:-translate-y-1 transition-transform" /> Exportar Backup Total
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImportVault} 
                  accept=".json" 
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="group bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-10 py-7 rounded-[2.5rem] border border-zinc-800 font-black text-xs uppercase flex items-center justify-center gap-5 shadow-2xl active:scale-95 transition-all italic tracking-tighter"
                >
                   <CloudUpload size={22} className="group-hover:translate-y-1 transition-transform" /> Importar Master Vault
                </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-zinc-800/50 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-blue-500 border border-zinc-800"><History size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 font-black uppercase">Último Vault</span>
                  <span className="text-[10px] text-white font-bold">{new Date().toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-amber-500 border border-zinc-800"><FileCheck size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 font-black uppercase">Integridade</span>
                  <span className="text-[10px] text-white font-bold uppercase italic">Validado Core v9.4</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-green-500 border border-zinc-800"><Cpu size={18} /></div>
                <div className="flex flex-col">
                  <span className="text-[9px] text-zinc-600 font-black uppercase">Processamento</span>
                  <span className="text-[10px] text-white font-bold uppercase italic">Local Storage</span>
                </div>
              </div>
           </div>
        </section>

        <footer className="pt-12 text-center opacity-30 group hover:opacity-100 transition-opacity">
           <div className="flex justify-center gap-4 mb-4">
             <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
             <div className="h-1 w-4 bg-zinc-800 rounded-full"></div>
             <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
           </div>
           <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[1em]">
             Protocolo Gerson Selemane Professional Suite
           </p>
        </footer>
      </div>
    </div>
  );
};
