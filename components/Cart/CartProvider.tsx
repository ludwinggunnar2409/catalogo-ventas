'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Producto, CartItem, CartState, CartContextType } from '@/types/database';

const CartContext = createContext<CartContextType | undefined>(undefined);

// Clave para LocalStorage
const CART_STORAGE_KEY = 'marketcat_cart_v1';

// Función para cargar del LocalStorage (SOLO CLIENTE)
const loadCartFromStorage = (): CartState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0, cantidadTotal: 0 };
  }
  
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error al cargar carrito:', error);
  }
  
  return { items: [], total: 0, cantidadTotal: 0 };
};

// Función para guardar en LocalStorage (SOLO CLIENTE)
const saveCartToStorage = (cart: CartState) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error al guardar carrito:', error);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [], total: 0, cantidadTotal: 0 });
  const [isInitialized, setIsInitialized] = useState(false);

  // Cargar solo en el cliente
  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    setCart(loadedCart);
    setIsInitialized(true);
  }, []);

  // Sincronizar con LocalStorage
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cart);
    }
  }, [cart, isInitialized]);

  // Calcular totales
  const calculateTotals = (items: CartItem[]): { total: number; cantidadTotal: number } => {
    const total = items.reduce((sum, item) => sum + (item.precio_unitario * item.cantidad), 0);
    const cantidadTotal = items.reduce((sum, item) => sum + item.cantidad, 0);
    return { total, cantidadTotal };
  };

  // Agregar al carrito
  const addToCart = (producto: Producto) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        item => item.producto_id === producto.id
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Si ya existe, aumentar cantidad
        newItems = [...prevCart.items];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          cantidad: newItems[existingItemIndex].cantidad + 1
        };
      } else {
        // Si no existe, agregar nuevo item
        const newItem: CartItem = {
          producto_id: producto.id,
          cantidad: 1,
          precio_unitario: producto.precio,
          nombre: producto.nombre,
          empresa_nombre: producto.empresa?.nombre || '',
          empresa_whatsapp: producto.empresa?.whatsapp_contacto || ''
        };
        newItems = [...prevCart.items, newItem];
      }

      const { total, cantidadTotal } = calculateTotals(newItems);
      
      return {
        items: newItems,
        total,
        cantidadTotal
      };
    });
  };

  // Eliminar del carrito
  const removeFromCart = (productoId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.producto_id !== productoId);
      const { total, cantidadTotal } = calculateTotals(newItems);
      
      return {
        items: newItems,
        total,
        cantidadTotal
      };
    });
  };

  // Actualizar cantidad
  const updateQuantity = (productoId: string, cantidad: number) => {
    if (cantidad < 1) {
      removeFromCart(productoId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.producto_id === productoId 
          ? { ...item, cantidad }
          : item
      );
      
      const { total, cantidadTotal } = calculateTotals(newItems);
      
      return {
        items: newItems,
        total,
        cantidadTotal
      };
    });
  };

  // Vaciar carrito
  const clearCart = () => {
    setCart({ items: [], total: 0, cantidadTotal: 0 });
  };

  // Obtener cantidad de items
  const getItemCount = () => cart.cantidadTotal;

  // Obtener precio total
  const getTotalPrice = () => cart.total;

  // Si no está inicializado, mostrar estado vacío (para SSR)
  if (!isInitialized) {
    return (
      <CartContext.Provider
        value={{
          cart: { items: [], total: 0, cantidadTotal: 0 },
          addToCart: () => {},
          removeFromCart: () => {},
          updateQuantity: () => {},
          clearCart: () => {},
          getItemCount: () => 0,
          getTotalPrice: () => 0
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemCount,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Hook personalizado para usar el carrito
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }
  return context;
}