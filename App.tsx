
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoRow from './components/VideoRow';
import { CATEGORIES, TELEGRAM_LINK } from './constants';
import { ArrowUpRight, Play, AlertCircle, MoreHorizontal, Globe, Share } from 'lucide-react';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isTikTok, setIsTikTok] = useState(false);

  const handleRedirect = () => {
    window.open(TELEGRAM_LINK, '_blank');
  };

  useEffect(() => {
    // 0. Detectar Navegador do TikTok
    const ua = navigator.userAgent.toLowerCase();
    // Verifica strings comuns do navegador interno do TikTok
    if (ua.includes('tiktok') || ua.includes('bytedance')) {
      setIsTikTok(true);
      // Não executamos o resto da lógica se for TikTok, pois mostraremos apenas o tutorial
      return; 
    }

    // Timer de 15 segundos para mostrar o modal
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 15000);

    // 1. Exit Intent: Detecta quando o mouse sai da janela (vai para a barra de abas)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        // Tenta abrir o Telegram
        handleRedirect();
        // Garante que o modal apareça caso o popup blocker bloqueie o redirect
        setShowModal(true);
      }
    };

    // 2. Before Unload: Mostra confirmação nativa se tentar fechar
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // A mensagem personalizada é ignorada pela maioria dos navegadores modernos, 
      // mas a atribuição ativa a caixa de diálogo padrão.
      e.returnValue = ''; 
    };

    // 3. Bloqueio de Inspeção (Anti-Developer Tools)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault(); // Desativa botão direito
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bloqueia F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Bloqueia Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C', 'i', 'j', 'c'].includes(e.key)) {
        e.preventDefault();
      }
      // Bloqueia Ctrl+U (Ver Código Fonte)
      if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
        e.preventDefault();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // TELA DE TUTORIAL PARA TIKTOK
  if (isTikTok) {
    return (
      <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Setas animadas apontando para o canto superior direito (onde ficam os 3 pontos) */}
        <div className="absolute top-4 right-4 animate-bounce text-[#E50914]">
          <ArrowUpRight className="w-12 h-12 stroke-[3]" />
        </div>

        <div className="bg-[#1f1f1f] p-8 rounded-2xl border-2 border-[#E50914] shadow-[0_0_30px_rgba(229,9,20,0.3)] max-w-sm w-full">
          <AlertCircle className="w-16 h-16 text-[#E50914] mx-auto mb-6" />
          
          <h1 className="text-2xl font-black mb-4 uppercase leading-tight">
            Navegador Bloqueado!
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 font-medium">
            O TikTok não permite abrir este conteúdo exclusivo por aqui.
          </p>

          <div className="space-y-4 text-left bg-black/30 p-4 rounded-lg mb-8">
            <div className="flex items-center gap-3">
              <span className="bg-[#E50914] w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">1</span>
              <p className="text-sm">Clique nos <strong className="text-white">3 pontinhos</strong> ou em <strong className="text-white">Compartilhar</strong> no topo da tela.</p>
              <MoreHorizontal className="w-5 h-5 text-gray-400 shrink-0" />
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#E50914] w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm shrink-0">2</span>
              <p className="text-sm">Selecione a opção <strong className="text-white">Abrir no Navegador</strong> (Chrome ou Safari).</p>
              <Globe className="w-5 h-5 text-gray-400 shrink-0" />
            </div>
          </div>

          <p className="text-xs text-gray-500 font-mono">
            Aguardando abertura no navegador externo...
          </p>
        </div>
      </div>
    );
  }

  // APP NORMAL (CHROME/SAFARI/ETC)
  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans overflow-x-hidden selection:bg-[#E50914] selection:text-white pb-20">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Slight overlap with hero to mimic Netflix layout */}
        <div className="relative z-10 -mt-20 md:-mt-32 space-y-4">
          {CATEGORIES.map((category, index) => (
            <VideoRow 
              key={index} 
              title={category.title} 
              items={category.items} 
            />
          ))}
        </div>
      </main>

      {/* Footer / Disclaimer */}
      <footer className="px-4 md:px-12 py-12 mt-12 text-gray-500 text-sm text-center">
        <div 
          onClick={handleRedirect}
          className="cursor-pointer hover:underline text-[#E50914] flex items-center justify-center gap-1 mb-8"
        >
          <span>Acessar Canal Oficial</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
        <p>© 2024 FODE-FLIX. Todos os direitos reservados.</p>
      </footer>

      {/* MODAL 15 Segundos / Exit Intent */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181818] border border-gray-700 rounded-lg p-6 max-w-md w-full shadow-2xl relative text-center">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="flex justify-center mb-4">
               <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-[#E50914]" />
               </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">JÁ VAI SAIR? 😈</h2>
            <p className="text-gray-300 mb-6">
              Não perca a chance! O conteúdo exclusivo VIP está disponível apenas por tempo limitado.
            </p>

            <button 
              onClick={handleRedirect}
              className="w-full bg-[#E50914] hover:bg-[#b2070f] text-white font-bold py-3 px-4 rounded flex items-center justify-center gap-2 transition-transform hover:scale-105"
            >
              <Play className="w-5 h-5 fill-current" />
              VER CONTEÚDO AGORA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
