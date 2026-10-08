
import React, { useState } from 'react';
import { ShoppingCartIcon, MagnifyingGlassIcon, SparklesIcon, MicrophoneIcon } from '@heroicons/react/24/outline';
import { CartItem } from './types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
  onJoinAura: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart, onSearch, searchQuery, onJoinAura }) => {
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onSearch(transcript);
      };
      recognition.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200 hover:rotate-6 transition-transform">
          A
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">AuraStyle</span>
      </div>

      <div className="flex-1 max-w-xl mx-4 sm:mx-8 relative group">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type="text"
          placeholder="Search products, styles, trends..."
          className="w-full bg-slate-100 border-none rounded-full pl-10 pr-12 py-2 focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
        />
        <button 
          onClick={startVoiceSearch}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-all ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-indigo-600'}`}
          title="Voice search"
        >
          <MicrophoneIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={onOpenCart}
          className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ShoppingCartIcon className="w-6 h-6" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>
        <button 
          onClick={onJoinAura}
          className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-600 transition-all group shadow-lg shadow-slate-200"
        >
          <SparklesIcon className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          Join Aura+
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
