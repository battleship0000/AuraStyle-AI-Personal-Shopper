
import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon, MicrophoneIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import { ChatMessage, Product, CartItem } from './types';
import { getChatResponse, extractProductSuggestions } from './geminiService';
import { MOCK_PRODUCTS } from './constants';

interface AIChatPanelProps {
  onSuggestProduct: (product: Product) => void;
  cart: CartItem[];
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({ onSuggestProduct, cart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Welcome back. I'm Aura. I can help you find products, explain specs, or curate your next lifestyle upgrade. What's on your mind?",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend, timestamp: new Date() }]);
    setInput('');
    setIsLoading(true);

    const responseText = await getChatResponse(textToSend, messages, cart);
    const suggestedIds = await extractProductSuggestions(responseText);
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: responseText,
      timestamp: new Date(),
      suggestedProducts: suggestedIds
    }]);
    setIsLoading(false);
  };

  const prompts = ["Show me premium audio", "Trending in Home decor", "What's in my cart?"];

  return (
    <div className="fixed bottom-10 right-10 z-[120]">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-20 h-20 bg-slate-900 text-white rounded-[32px] flex items-center justify-center shadow-2xl hover:bg-indigo-600 transition-all hover:scale-110 active:scale-95 group relative"
        >
          <SparklesIcon className="w-10 h-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center animate-bounce border-4 border-[#fafbff]">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-[90vw] sm:w-[450px] h-[750px] bg-white rounded-[48px] shadow-3xl border border-slate-100 flex flex-col overflow-hidden animate-slide-in-up">
          <div className="bg-slate-900 p-8 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center shadow-inner">
                <SparklesIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Aura Intelligence</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-indigo-300 uppercase tracking-widest font-black">Context Aware</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="bg-white/10 p-3 rounded-2xl hover:bg-white/20 transition-colors">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[#f8f9fc]">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-[28px] text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {m.content}
                </div>
                
                {m.suggestedProducts && m.suggestedProducts.length > 0 && (
                  <div className="mt-4 flex gap-3 overflow-x-auto pb-4 w-full snap-x">
                    {m.suggestedProducts.map(id => {
                      const prod = MOCK_PRODUCTS.find(p => p.id === id);
                      if (!prod) return null;
                      return (
                        <div key={id} onClick={() => onSuggestProduct(prod)} className="min-w-[160px] bg-white border border-slate-100 p-4 rounded-[32px] shadow-lg cursor-pointer hover:-translate-y-2 transition-all group snap-center">
                          <img src={prod.image} className="w-full h-24 object-cover rounded-2xl mb-3 group-hover:scale-110 transition-transform" alt="" />
                          <p className="text-xs font-black text-slate-900 truncate mb-1">{prod.name}</p>
                          <p className="text-xs text-indigo-600 font-black">${prod.price}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 p-5 bg-white rounded-full border border-slate-100 w-24 shadow-sm justify-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="p-8 bg-white border-t border-slate-100">
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
              {prompts.map(p => (
                <button 
                  key={p} 
                  onClick={() => handleSend(p)}
                  className="whitespace-nowrap px-4 py-2 bg-slate-50 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100"
                >
                  {p}
                </button>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Ask Aura anything..."
                  className="w-full bg-slate-50 border-none rounded-[24px] pl-6 pr-14 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-300 font-medium"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-slate-900 text-white rounded-[18px] hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-lg"
                >
                  <PaperAirplaneIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatPanel;
