/**
 * Datos de contacto del negocio.
 *
 * IMPORTANTE: wa.me exige el número en formato internacional completo
 * (código de país + número, sin "+", sin espacios y sin guiones).
 * Si se omite el 502, WhatsApp responde "el número no es válido".
 */

/** Código de país de Guatemala. */
export const CODIGO_PAIS = '502';

/** Número local, tal como se le muestra al cliente. */
export const WHATSAPP_LOCAL = '4582-7110';

/** Número en el formato que exige wa.me. */
export const WHATSAPP_E164 = `${CODIGO_PAIS}${WHATSAPP_LOCAL.replace(/\D/g, '')}`;

/**
 * Construye un enlace de WhatsApp, con mensaje prellenado opcional.
 * Usar siempre esta función en lugar de escribir la URL a mano.
 */
export function whatsAppUrl(mensaje?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** Abre WhatsApp en una pestaña nueva de forma segura. */
export function abrirWhatsApp(mensaje?: string): void {
  window.open(whatsAppUrl(mensaje), '_blank', 'noopener');
}
