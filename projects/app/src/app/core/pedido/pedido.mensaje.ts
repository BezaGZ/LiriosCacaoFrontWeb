import { CartItem } from '@features/cart/cart.models';
import { DatosEntrega } from './pedido.datos';

/**
 * El mensaje de WhatsApp que se manda al cerrar el pedido.
 *
 * Vive aparte de la pantalla por dos razones: se puede probar sin montar
 * Angular, y lo que se le muestra al cliente antes de enviar sale de la misma
 * funcion que lo que se envia. Antes el mensaje se armaba dentro del
 * componente y no habia forma de ver si coincidia.
 *
 * El detalle del armado (chocolate, toppings, doble) viaja dentro del titulo
 * del item desde `catalogo.carrito.ts`, asi que aqui no hay que volver a
 * recorrer la configuracion ni conocer el dominio.
 */

const q = (n: number) => `Q${n.toFixed(2)}`;

export interface ResumenPedido {
  readonly items: readonly CartItem[];
  readonly subtotal: number;
  readonly envio: number;
  readonly total: number;
  readonly datos: DatosEntrega;
}

export function armarMensaje(r: ResumenPedido, ahora = new Date()): string {
  const fecha = ahora.toLocaleDateString('es-GT');
  const hora = ahora.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit' });

  const cabecera = [
    '*Pedido nuevo*',
    `${fecha} · ${hora}`,
  ].join('\n');

  const productos = r.items.length
    ? r.items
        .map((i, n) => [
          `*${n + 1}. ${i.title}*`,
          `   ${i.qty} × ${q(i.unitPrice)} = ${q(i.unitPrice * i.qty)}`,
        ].join('\n'))
        .join('\n')
    : '— Sin productos —';

  const cuentas = [
    `Subtotal: ${q(r.subtotal)}`,
    ...(r.envio > 0 ? [`Envío: ${q(r.envio)}`] : []),
    `*Total: ${q(r.total)}*`,
  ].join('\n');

  const d = r.datos;
  const cuando = d.momento === 'hoy' ? 'Hoy' : 'Mañana';
  const detalles = [
    d.nombre.trim() ? `A nombre de: ${d.nombre.trim()}` : '',
    `Entrega: ${d.entrega === 'domicilio' ? 'A domicilio' : 'Recoger en el local'}`,
    d.entrega === 'domicilio' && d.direccion.trim() ? `Dirección: ${d.direccion.trim()}` : '',
    `Para: ${cuando}`,
    `Pago: ${d.pago === 'efectivo' ? 'Efectivo' : 'Tarjeta'}`,
    d.pago === 'efectivo' && d.cambio !== null && Number.isFinite(d.cambio)
      ? `Cambio con: ${q(d.cambio)}`
      : '',
  ].filter(Boolean).join('\n');

  return [cabecera, `*Productos*\n${productos}`, cuentas, `*Entrega*\n${detalles}`].join('\n\n');
}

/** Lo que falta para poder enviar, dicho para el cliente. */
export function faltaPara(r: ResumenPedido): string | null {
  if (!r.items.length) return 'Agregue algo al pedido antes de enviarlo.';
  if (!r.datos.nombre.trim()) return 'Falta su nombre.';
  if (r.datos.entrega === 'domicilio' && !r.datos.direccion.trim()) {
    return 'Falta la dirección de entrega.';
  }
  return null;
}
