
import React from 'react';
import { 
  Book, Shield, Zap, Sparkles, Database, FileText, CheckCircle, 
  Info, Lightbulb, Search, BookOpen, Bookmark, CloudLightning, 
  LifeBuoy, Globe, SpellCheck, BrainCircuit, AlertTriangle, 
  ShieldCheck, Layout, Edit3, Quote, UserCheck, Smartphone, Settings,
  AlignLeft, Columns, Layers, ShieldAlert, Key, Lock, Terminal
} from 'lucide-react';

export const Manual: React.FC = () => {
  const sections = [
    {
      title: "1. Protocolo de Acesso & Segurança",
      icon: Lock,
      color: "text-red-500",
      content: "O GERGER.GE é uma ferramenta restrita. Novos usuários devem solicitar acesso através do Portal de Entrada. As solicitações são enviadas diretamente para o Administrador Gerson (gersonjosed8@gmail.com) para validação protocolar e atribuição de nível de permissão (Tradutor, Revisor ou Consultor)."
    },
    {
      title: "2. Ecossistema Quad-Pane Sync",
      icon: Layers,
      color: "text-blue-500",
      content: "A interface v9.4 permite a operação simultânea de 4 colunas: Almeida ARA (Fidelidade Formal), Versão Fácil de Ler (Fluidez Conceitual), Hebraico Interlinear (Exegese Original) e Editor Zapuura (Produção em Ekoti). Utilize os seletores rápidos no header para ocultar ou exibir painéis conforme a fase da tradução."
    },
    {
      title: "3. Tradução Interlinear & Glossas",
      icon: AlignLeft,
      color: "text-amber-500",
      content: "O painel original exibe o texto Hebraico (para Salmos) com glossas verticais. Clique no botão 'GLOSSAS' para alternar entre a tradução literal palavra-por-palavra e o texto puro. Termos sagrados como 'Mbwana' e 'Nnyizinku' são pré-identificados para garantir o peso teológico."
    },
    {
      title: "4. Auditoria de Integridade (Zapuura Core)",
      icon: ShieldAlert,
      color: "text-purple-500",
      content: "O motor de consistência monitora o texto em tempo real. Se uma palavra chave for traduzida de forma inconsistente entre versículos ou capítulos, o sistema bloqueará a gravação automática até que uma 'Justificativa Técnica' seja protocolada no Módulo de Justificação."
    },
    {
      title: "5. Soberania de Dados: Master Vault",
      icon: Database,
      color: "text-blue-600",
      content: "A segurança dos dados é local e soberana. Na aba 'Preferências', você pode exportar o 'Master Vault', um arquivo JSON contendo toda a base do projeto. Em caso de troca de máquina, basta importar este Vault para restaurar o estado exato de todo o projeto Zapuura."
    },
    {
      title: "6. Glossário & Vínculos Técnicos",
      icon: Book,
      color: "text-green-500",
      content: "O dicionário core permite 'travar' termos específicos. Uma vez vinculado, o sistema sugerirá automaticamente o termo Koti correto sempre que a palavra fonte em Português for detectada, mantendo o dialeto de Angoche puro e profissional."
    }
  ];

  return (
    <div className="h-full overflow-y-auto bg-[#020203] p-8 lg:p-20 custom-scrollbar animate-in fade-in duration-1000">
      <div className="max-w-5xl mx-auto">
        <header className="mb-24 border-b border-zinc-900 pb-16 relative">
          <div className="absolute -top-10 -left-10 text-blue-600/10 font-black text-[12rem] select-none pointer-events-none italic">
            ZAPUURA
          </div>
          <div className="flex items-center gap-4 text-blue-500 font-black text-[10px] uppercase tracking-[0.6em] mb-8 italic relative z-10">
            <ShieldCheck size={18} /> Gerson Selemane Professional Suite • v9.4 Stable
          </div>
          <h1 className="text-7xl lg:text-9xl font-black text-white italic tracking-tighter uppercase mb-10 leading-[0.8] relative z-10">
            Manual de <br/> Operação
          </h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 border-l-4 border-blue-600 pl-10 py-4 relative z-10">
            <p className="text-zinc-500 text-xl font-medium leading-relaxed italic max-w-2xl">
              Diretrizes operacionais para a suite de tradução bíblica GERGER.GE. Focada em precisão exegética, consistência terminológica e soberania de dados.
            </p>
            <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-3 rounded-2xl border border-zinc-800">
              <Terminal size={18} className="text-blue-500" />
              <span className="text-[10px] text-white font-black uppercase tracking-widest">Build 9.4.0_Stable</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-20">
          {sections.map((section, idx) => (
            <div key={idx} className="group relative">
              <div className="absolute -left-16 top-0 text-zinc-900 font-black text-7xl select-none opacity-20 group-hover:opacity-40 transition-opacity italic">
                {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>
              <div className="flex flex-col md:flex-row gap-10 items-start relative z-10">
                <div className={`p-6 bg-zinc-900 rounded-[2.5rem] ${section.color} group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-500 shadow-2xl border border-zinc-800/50`}>
                  <section.icon size={36} />
                </div>
                <div className="space-y-6 flex-1">
                  <h3 className="text-4xl font-black text-zinc-100 uppercase italic tracking-tighter group-hover:text-blue-500 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-zinc-400 text-xl leading-[1.8] font-medium italic pr-12 group-hover:text-zinc-300 transition-colors">
                    {section.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CITAÇÃO FINAL DO GERSON */}
        <div className="mt-40 p-24 bg-gradient-to-br from-zinc-900 via-black to-blue-900/10 rounded-[6rem] border-2 border-blue-600/10 text-center relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <div className="relative z-10">
            <Sparkles className="mx-auto text-blue-600 mb-10 animate-pulse" size={80} />
            <h4 className="text-white font-black text-5xl uppercase tracking-widest mb-8 italic">Excelência em Cada Verso</h4>
            <p className="text-zinc-400 text-2xl max-w-3xl mx-auto leading-relaxed italic font-medium">
              "Esta suite foi desenvolvida para que o tradutor Gerson Selemane tenha o controle total da integridade da mensagem divina em Ekoti. A tecnologia serve à Palavra."
            </p>
            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-zinc-800"></div>
              <span className="text-[11px] text-zinc-600 font-black uppercase tracking-[0.6em]">Protocolo de Qualidade Selemane</span>
              <div className="h-px w-12 bg-zinc-800"></div>
            </div>
          </div>
        </div>

        <footer className="mt-40 pt-16 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 pb-32">
          <div className="flex flex-col items-center md:items-start">
             <div className="text-[12px] font-black uppercase tracking-[0.5em] text-blue-500 italic mb-2">
              GERGER.GE • Quad-Pane Suite
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700">
              © 2025 ZAPUURA BIBLE PROJECT • ANGOCHE, MOZAMBIQUE
            </div>
          </div>
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-green-500" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Sincronia Total</span>
            </div>
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-blue-500" />
              <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">v9.4.0 Optimized</span>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
};
