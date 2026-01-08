'use client';

import { useCart } from '@/components/Cart/CartProvider';
import CartItem from '@/components/Cart/CartItem';
import type { CartItem as CartItemType } from '@/types/database';

// Datos de prueba
const TEST_ITEM: CartItemType = {
  producto_id: 'test-123',
  cantidad: 2,
  precio_unitario: 89.99,
  nombre: 'Auriculares Bluetooth',
  empresa_nombre: 'TechGadgets',
  empresa_whatsapp: '+5491111111111'
};

export default function TestCartPage() {
  const { addToCart } = useCart();

  const handleAddTest = () => {
    // Simular producto para agregar
    const mockProduct = {
      id: 'test-123',
      nombre: 'Auriculares Bluetooth',
      descripcion: 'Sonido premium',
      precio: 89.99,
      empresa: { nombre: 'TechGadgets', whatsapp_contacto: '+5491111111111' }
    } as any;
    
    addToCart(mockProduct);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Prueba del CartItem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna 1: CartItem standalone */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CartItem Componente Solo</h2>
          <div className="border rounded-lg p-4">
            <CartItem item={TEST_ITEM} />
          </div>
          
          <button 
            onClick={handleAddTest}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Agregar producto de prueba
          </button>
        </div>

        {/* Columna 2: CartDrawer simulado */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Drawer Simulado</h2>
          <div className="border rounded-lg p-4 h-96 overflow-y-auto">
            <div className="space-y-4">
              <CartItem item={TEST_ITEM} />
              <CartItem item={{
                ...TEST_ITEM,
                producto_id: 'test-456',
                nombre: 'Smart Watch',
                precio_unitario: 149.99,
                cantidad: 1
              }} />
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <h3 className="font-semibold mb-2">¿Qué deberías ver?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>✓ Nombre del producto</li>
                <li>✓ Empresa</li>
                <li>✓ Precio unitario</li>
                <li>✓ Botones + y - (en gris claro)</li>
                <li>✓ Cantidad (número en medio)</li>
                <li>✓ Botón "Eliminar" (si cantidad  1)</li>
                <li>✓ Subtotal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}