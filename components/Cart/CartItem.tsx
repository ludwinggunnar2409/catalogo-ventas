'use client';

import { useCart } from './CartProvider';
import type { CartItem as CartItemType } from '@/types/database';
import { useState } from 'react';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const [isDeleting, setIsDeleting] = useState(false);

  const subtotal = item.precio_unitario * item.cantidad;

  const handleDecrease = () => {
    if (item.cantidad > 1) {
      updateQuantity(item.producto_id, item.cantidad - 1);
    } else {
      setIsDeleting(true);
    }
  };

  return (
    <div
      className={`relative rounded-lg border p-3 transition ${
        isDeleting ? 'bg-red-50 border-red-200' : 'bg-white'
      }`}
    >
      {/* Overlay eliminar */}
      {isDeleting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-50/95 rounded-lg">
          <div className="bg-white p-3 rounded-md border shadow text-center w-full max-w-xs">
            <p className="text-sm font-medium mb-3">¿Eliminar este producto?</p>
            <div className="flex gap-2">
              <button
                onClick={() => removeFromCart(item.producto_id)}
                className="flex-1 bg-red-600 text-white text-xs py-2 rounded-md"
              >
                Sí
              </button>
              <button
                onClick={() => setIsDeleting(false)}
                className="flex-1 border text-xs py-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex justify-between gap-3">
        {/* Info */}
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.nombre}
          </p>
          <p className="text-xs text-gray-500">{item.empresa_nombre}</p>

          <p className="text-xs text-gray-600 mt-1">
            ${item.precio_unitario.toFixed(2)} c/u
          </p>
        </div>

        {/* Subtotal */}
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">
            ${subtotal.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">Subtotal</p>
        </div>
      </div>

      {/* Controles */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="h-7 w-7 rounded border text-xs hover:bg-gray-100"
          >
            −
          </button>

          <span className="text-xs w-5 text-center font-medium">
            {item.cantidad}
          </span>

          <button
            onClick={() => updateQuantity(item.producto_id, item.cantidad + 1)}
            className="h-7 w-7 rounded border text-xs hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <button
          onClick={() => setIsDeleting(true)}
          className="text-xs text-red-600 hover:underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
