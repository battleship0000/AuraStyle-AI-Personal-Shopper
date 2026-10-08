
import React from 'react';
import { XMarkIcon, ShoppingBagIcon, HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid, StarIcon } from '@heroicons/react/24/solid';
import { Product } from './types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, isFavorite, onToggleFavorite }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl animate-float flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute top-6 right-6 z-10 p-2 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 transition-colors">
          <XMarkIcon className="w-6 h-6 text-slate-900" />
        </button>

        <div className="w-full md:w-1/2 bg-slate-50 relative h-64 md:h-auto">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          <button 
            onClick={() => onToggleFavorite(product.id)}
            className="absolute bottom-6 left-6 p-4 bg-white rounded-2xl shadow-lg hover:scale-110 transition-transform active:scale-95"
          >
            {isFavorite ? <HeartIconSolid className="w-6 h-6 text-red-500" /> : <HeartIcon className="w-6 h-6 text-slate-400" />}
          </button>
        </div>

        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-bold text-slate-700">{product.rating}</span>
            </div>
          </div>

          <h2 className="text-4xl font-black text-slate-900 mb-4 leading-tight">{product.name}</h2>
          <p className="text-slate-500 text-lg leading-relaxed mb-8">{product.description}</p>

          <div className="space-y-6 mb-10">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-500 font-medium">Availability</span>
              <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {product.stock > 0 ? `${product.stock} Units in Stock` : 'Out of Stock'}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {product.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-auto sticky bottom-0 bg-white py-4 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Price</span>
              <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
            </div>
            <button 
              onClick={() => { onAddToCart(product); onClose(); }}
              className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
            >
              <ShoppingBagIcon className="w-6 h-6" />
              Add to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
