
import React, { useState } from 'react';
import { XMarkIcon, TrashIcon, MinusSmallIcon, PlusSmallIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove, onClearCart }) => {
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setCheckoutStatus('processing');
    setTimeout(() => {
      setCheckoutStatus('success');
      setTimeout(() => {
        onClearCart();
        setCheckoutStatus('idle');
        onClose();
      }, 3000);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col animate-slide-in overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <XMarkIcon className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {checkoutStatus === 'success' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-float">
            <div className="w-24 h-24 bg-emerald-100 rounded-[32px] flex items-center justify-center mb-8">
              <CheckCircleIcon className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4">Order Confirmed!</h3>
            <p className="text-slate-500 leading-relaxed mb-8">
              Your curated lifestyle items are being prepared for shipment. You'll receive a confirmation email shortly.
            </p>
            <div className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
              Order ID: #AUR-{Math.floor(Math.random() * 900000 + 100000)}
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <ShoppingCartIcon className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500">Your cart is feeling light.</p>
                  <button 
                    onClick={onClose}
                    className="text-indigo-600 font-bold hover:underline"
                  >
                    Go find something amazing
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-slate-500 text-sm mb-2">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button 
                              onClick={() => onUpdateQuantity(item.id, -1)}
                              className="p-1 hover:text-indigo-600"
                            >
                              <MinusSmallIcon className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, 1)}
                              className="p-1 hover:text-indigo-600"
                            >
                              <PlusSmallIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button 
                            onClick={() => onRemove(item.id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right font-bold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-slate-900">${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  disabled={checkoutStatus === 'processing'}
                  className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:bg-slate-400"
                >
                  {checkoutStatus === 'processing' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying Payment...
                    </>
                  ) : (
                    'Checkout Now'
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

export default CartDrawer;
