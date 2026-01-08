// src/components/ProductCard.tsx
'use client';

import type { Producto } from "@/types/database";
import { useCart } from "@/components/Cart/CartProvider";

interface ProductCardProps {
  producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
  const { addToCart } = useCart();

  const getPlaceholderColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-blue-50 to-blue-100",
      "bg-gradient-to-br from-emerald-50 to-emerald-100",
      "bg-gradient-to-br from-purple-50 to-purple-100",
      "bg-gradient-to-br from-amber-50 to-amber-100",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(producto);
    
    const button = e.currentTarget as HTMLButtonElement;
    button.classList.add('bg-green-600');
    button.innerHTML = '✓ Agregado';
    
    setTimeout(() => {
      button.classList.remove('bg-green-600');
      button.innerHTML = 'Agregar';
    }, 1500);
  };

  return (
    <div className="group relative bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      
      {/* Imagen real o placeholder */}
      {producto.imagen_url ? (
        <img
          src={producto.imagen_url}
          alt={producto.nombre}
          className="aspect-square w-full object-cover"
        />
      ) : (
        <div className={`aspect-square ${getPlaceholderColor(producto.nombre)} flex items-center justify-center`}>
          <div className="text-5xl font-light text-gray-300/50">
            {producto.nombre.charAt(0)}
          </div>
        </div>
      )}
      
      {/* Contenido */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {producto.categoria?.nombre || "General"}
          </span>
        </div>
        
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {producto.nombre}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
          {producto.descripcion || "Producto premium"}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-gray-900">
              Bs.{producto.precio.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {producto.empresa?.nombre}
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-gray-800 h-9 px-4 rounded-lg transition-all duration-200"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}