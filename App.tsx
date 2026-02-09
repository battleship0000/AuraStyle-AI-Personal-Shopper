
import React, { useState, useMemo, useEffect } from 'react';
import { MOCK_PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AIChatPanel from './components/AIChatPanel';
import ProductModal from './components/ProductModal';
import { CheckCircleIcon, SparklesIcon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const categories = ['All', 'Electronics', 'Home', 'Fashion', 'Lifestyle'];

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('aura_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('aura_favs');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'info'} | null>(null);
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    localStorage.setItem('aura_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('aura_favs', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setNotification({ message: `Added to collection`, type: 'success' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#fafbff] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 relative">
      {/* Dynamic Background Aura */}
      <div className="fixed top-0 right-0 -z-10 w-[800px] h-[800px] bg-indigo-100/30 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-purple-100/20 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      {notification && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] animate-bounce pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur text-white px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 border border-white/20">
            {notification.type === 'success' ? <CheckCircleIcon className="w-5 h-5 text-emerald-400" /> : <SparklesIcon className="w-5 h-5 text-indigo-400" />}
            <span className="text-sm font-bold tracking-tight">{notification.message}</span>
          </div>
        </div>
      )}

      {isMembershipModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl" onClick={() => setIsMembershipModalOpen(false)} />
          <div className="relative bg-white rounded-[50px] p-10 max-w-xl w-full shadow-2xl animate-float border border-slate-100">
            <button onClick={() => setIsMembershipModalOpen(false)} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors">
              <XMarkIcon className="w-6 h-6 text-slate-400" />
            </button>
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200">
              <SparklesIcon className="w-10 h-10" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-3">Elevate your Aura.</h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Join the inner circle. Aura+ members receive global priority shipping, concierge styling, and secret collection access.
            </p>
            <button 
              onClick={() => { setIsMembershipModalOpen(false); setNotification({ message: "Welcome to Aura+ Premium", type: 'success' }); }}
              className="w-full bg-slate-900 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group"
            >
              Start 14-Day Journey <span className="ml-2 group-hover:translate-x-2 transition-transform inline-block">→</span>
            </button>
          </div>
        </div>
      )}

      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
        onJoinAura={() => setIsMembershipModalOpen(true)}
      />

      <main className="container mx-auto px-6 pt-12 pb-24">
        <header className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest mb-6">
                <SparklesIcon className="w-4 h-4" />
                Next-Gen Retail Experience
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-8">
                Curating the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient">Future of Self.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-xl leading-relaxed">
                Step into a boutique where every piece is chosen by intelligence, and every interaction feels human.
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest ml-4">Mood Filter</span>
              <div className="flex gap-2 bg-white/50 backdrop-blur p-2 rounded-[28px] border border-slate-100 shadow-xl shadow-slate-200/50">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-[20px] text-sm font-bold transition-all ${
                      activeCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
              <ProductCard 
                product={product} 
                onAddToCart={(e) => { e.stopPropagation(); addToCart(product); }} 
              />
            </div>
          ))}
        </section>

        {filteredProducts.length === 0 && (
          <div className="py-40 text-center animate-pulse">
            <MagnifyingGlassIcon className="w-20 h-20 text-slate-200 mx-auto mb-6" />
            <h2 className="text-3xl font-black text-slate-900 mb-2">The catalog is quiet...</h2>
            <p className="text-slate-500">Try a different vibe or search query.</p>
          </div>
        )}
      </main>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart}
        onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))}
        onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))}
        onClearCart={() => setCart([])}
      />

      <ProductModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      <AIChatPanel onSuggestProduct={(p) => setSelectedProduct(p)} cart={cart} />
    </div>
  );
};

export default App;
