'use client';

import { useState } from 'react';
import { useCart } from './CartProvider';
import { generateWhatsAppMessage, groupItemsByEmpresa } from '@/lib/whatsapp';

interface WhatsAppCheckoutProps {
  onClose?: () => void;
}

export default function WhatsAppCheckout({ onClose }: WhatsAppCheckoutProps) {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Agrupar productos por empresa
  const groupedItems = groupItemsByEmpresa(cart.items);

  const handleWhatsAppRedirect = () => {
    if (cart.items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Para la primera empresa (podemos expandir para múltiples después)
      const firstEmpresa = Array.from(groupedItems.keys())[0];
      const [empresaNombre, empresaWhatsApp] = firstEmpresa.split('|');
      const empresaItems = groupedItems.get(firstEmpresa)!;

      const { url } = generateWhatsAppMessage(
        empresaItems,
        empresaNombre,
        empresaWhatsApp
      );

      // Abrir WhatsApp en nueva pestaña
      window.open(url, '_blank');
      
      setSuccess(true);
      
      // Limpiar carrito después de 2 segundos
      setTimeout(() => {
        clearCart();
        if (onClose) onClose();
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar pedido');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewMessage = () => {
    if (cart.items.length === 0) {
      setError('El carrito está vacío');
      return;
    }

    try {
      const firstEmpresa = Array.from(groupedItems.keys())[0];
      const [empresaNombre, empresaWhatsApp] = firstEmpresa.split('|');
      const empresaItems = groupedItems.get(firstEmpresa)!;

      const { message } = generateWhatsAppMessage(
        empresaItems,
        empresaNombre,
        empresaWhatsApp
      );

      // Mostrar mensaje en alerta (podría ser un modal mejor)
      alert('VISTA PREVIA DEL MENSAJE:\n\n' + message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar vista previa');
    }
  };

  if (success) {
    return (
      <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
        <div className="text-green-600 mb-3">
          <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          ¡Pedido generado con éxito!
        </h3>
        <p className="text-green-700 mb-4">
          Se ha abierto WhatsApp con tu pedido estructurado.
          El carrito se ha vaciado automáticamente.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Continuar comprando
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen de empresas */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">
          Resumen del pedido
        </h4>
        
        <div className="space-y-3">
          {Array.from(groupedItems.entries()).map(([empresaKey, items]) => {
            const [empresaNombre, empresaWhatsApp] = empresaKey.split('|');
            const totalEmpresa = items.reduce((sum, item) => 
              sum + (item.precio_unitario * item.cantidad), 0
            );
            
            return (
              <div key={empresaKey} className="bg-white rounded border p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">{empresaNombre}</div>
                    <div className="text-sm text-gray-500">{empresaWhatsApp}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">${totalEmpresa.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">{items.length} productos</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600">
                  {items.map(item => `${item.cantidad}x ${item.nombre}`).join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Cómo funciona
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Se enviará un mensaje estructurado por WhatsApp</li>
          <li>• Cada empresa recibirá su pedido por separado</li>
          <li>• Coordinarás envío y pago directamente con el vendedor</li>
          <li>• El carrito se vaciará automáticamente</li>
        </ul>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Botones de acción */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handlePreviewMessage}
          disabled={isProcessing || cart.items.length === 0}
          className="w-full py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver vista previa del mensaje
        </button>

        <button
          onClick={handleWhatsAppRedirect}
          disabled={isProcessing || cart.items.length === 0}
          className="w-full py-3 px-4 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.888 15.965c-.188.545-.938.997-1.538 1.129-.418.089-.964.159-2.765-.304-2.297-.596-3.965-2.176-5.084-3.955-.825-1.317-1.294-2.826-1.294-4.435 0-1.698.879-3.086 2.313-3.386.577-.124 1.24-.016 1.708.339.457.348.684.86.684 1.508 0 .496-.109.955-.317 1.376-.208.421-.475.793-.791 1.114-.207.209-.317.457-.242.694.075.238.297.992.646 1.66.349.669.646 1.129.918 1.447.272.318.545.446.803.446.198 0 .397-.075.595-.238.198-.173.793-.694 1.24-1.114.446-.421.793-.347 1.089-.198.297.149 1.878 1.067 2.202 1.26.324.193.54.287.619.421.08.133.08.769-.107 1.314z"/>
              </svg>
              Completar pedido por WhatsApp
            </>
          )}
        </button>

        {cart.items.length > 0 && (
          <div className="text-center text-xs text-gray-500 pt-2">
            Total a enviar: <span className="font-bold">${cart.total.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}