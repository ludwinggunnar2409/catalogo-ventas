'use client';

import { useState, useEffect } from 'react';
import { useCart } from './CartProvider';
import CartDrawer from './CartDrawer';

export default function CartButton() {
  const { getItemCount } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Solo en cliente
  useEffect(() => {
    setIsClient(true);
    setItemCount(getItemCount());
  }, [getItemCount]);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="relative inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <span>Carrito</span>
        
        {isClient && itemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {isClient && (
        <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      )}
    </>
  );
}