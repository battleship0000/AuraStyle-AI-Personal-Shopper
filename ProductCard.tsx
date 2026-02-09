
import React from 'react';
import { Product } from '../types';
import { StarIcon, PlusIcon } from '@heroicons/react/24/solid';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  return (
    <div className="group bg-white rounded-3xl p-4 border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-50 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-slate-700 shadow-sm border border-slate-100">
            {product.category}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <StarIcon className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-semibold text-slate-500">{product.rating}</span>
        </div>
        <h3 className="text-slate-900 font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{product.description}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-2xl font-black text-slate-900">${product.price.toFixed(2)}</span>
          {product.stock < 10 && (
            <p className="text-[10px] text-orange-500 font-bold uppercase tracking-wider mt-1">
              Only {product.stock} left
            </p>
          )}
        </div>
        <button 
          onClick={() => onAddToCart(product)}
          className="bg-slate-900 text-white p-3 rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          title="Add to cart"
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
