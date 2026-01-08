'use client';

import { useCart } from './CartProvider';
import CartItem from './CartItem';
import { useState, useEffect } from 'react';
import WhatsAppCheckout from './WhatsAppCheckout';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(price);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full sm:max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Tu Carrito</h2>
            <p className="text-sm text-gray-500">
              {cart.items.length} productos
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto drawer-scrollbar px-4 py-4">
          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-gray-500">El carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map(item => (
                <CartItem key={item.producto_id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.items.length > 0 && (
          <div className="border-t bg-gray-50 p-4 flex-shrink-0">
            <div className="mb-4 bg-white p-4 rounded-lg border">
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold">
                  {formatPrice(cart.total)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={clearCart}
                className="w-full py-2 border rounded-lg"
              >
                Vaciar carrito
              </button>

              <WhatsAppCheckout onClose={onClose} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
