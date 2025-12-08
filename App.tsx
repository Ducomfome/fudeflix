
import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoRow from './components/VideoRow';
import { CATEGORIES, TELEGRAM_LINK } from './constants';
import { ArrowUpRight, Play, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Timer de 15 segundos para mostrar o modal
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleRedirect = () => {
    window.open(TELEGRAM_LINK, '_blank');
  };

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

      {/* MODAL 15 Segundos */}
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

            <h2 className="text-2xl font-bold text-white mb-2">Está esperando o quê?</h2>
            <p className="text-gray-300 mb-6">
              Você já está aqui há 15 segundos! O melhor conteúdo exclusivo está a um clique de distância.
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