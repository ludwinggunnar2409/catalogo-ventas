// src/lib/whatsapp.ts
import type { CartItem } from '@/types/database';

/**
 * Genera una *solicitud* de pedido para WhatsApp
 * (nunca una venta cerrada)
 */
export function generateWhatsAppMessage(
  items: CartItem[],
  empresaNombre: string,
  empresaWhatsApp: string
): { message: string; url: string } {
  
  // Filtrar por empresa
  const itemsGrouped = items.filter(
    item => 
      item.empresa_nombre === empresaNombre && 
      item.empresa_whatsapp === empresaWhatsApp
  );
  
  if (itemsGrouped.length === 0) {
    throw new Error('No hay productos para esta empresa');
  }

  // Totales
  const total = itemsGrouped.reduce(
    (sum, item) => sum + item.precio_unitario * item.cantidad,
    0
  );
  const totalItems = itemsGrouped.reduce((sum, item) => sum + item.cantidad, 0);

  // Fecha y hora
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const hora = now.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Cuerpo del mensaje
  let message = `🛒 *Hola, quisiera hacer un pedido*\n`;
  message += `📅 ${fecha} ${hora}\n`;
  message += `📋 Referencia: ${Date.now().toString().slice(-6)}\n\n`;
  message += `📦 *PRODUCTOS:*\n\n`;

  itemsGrouped.forEach((item, idx) => {
    const subtotal = item.precio_unitario * item.cantidad;
    message += `${idx + 1}. *${item.nombre}*\n`;
    message += `   Cantidad: ${item.cantidad}\n`;
    message += `   Precio unitario: Bs.${item.precio_unitario.toFixed(2)}\n`;
    message += `   Subtotal: Bs.${subtotal.toFixed(2)}\n\n`;
  });

  message += `💰 *RESUMEN:*\n\n`;
  message += `Total de productos: ${totalItems}\n`;
  message += `Importe estimado: *Bs.${total.toFixed(2)}*\n\n`;
  message += `⚠️ *IMPORTANTE:*\n`;
  message += `• Los precios y disponibilidad están sujetos a confirmación\n`;
  message += `• Este mensaje es una *solicitud de pedido*, no una venta final\n`;
  message += `• El precio definitivo será confirmado por WhatsApp antes del pago\n\n`;
  message += `✅ *¿Podrías confirmarme precios y disponibilidad, por favor?*`;


  // URL limpia (sin espacios)
  const cleanWhatsApp = empresaWhatsApp.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${cleanWhatsApp}?text=${encodedMessage}`;

  return { message, url };
}

/**
 * Agrupa items del carrito por empresa
 */
export function groupItemsByEmpresa(items: CartItem[]): Map<string, CartItem[]> {
  const grouped = new Map<string, CartItem[]>();
  
  items.forEach(item => {
    const key = `${item.empresa_nombre}|${item.empresa_whatsapp}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(item);
  });
  
  return grouped;
}