export const IMG_BASE = 'assets/img';

/**
 * Imagen que se muestra cuando un producto todavia no tiene foto.
 * Es una tarjeta de marca que dice "Foto proximamente", no un icono de error:
 * el cliente debe poder seguir comprando aunque falte la foto.
 */
export const IMG_PLACEHOLDER = `${IMG_BASE}/proximamente.png`;


export function toToken(s: string): string {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '');
}


export function imgHeladoPaleta(saborSlug: string) {
  return `${IMG_BASE}/helados/paleta/${saborSlug}.png`;
}


/**
 * Construye rutas para un sistema de imágenes por capas.
 * Devuelve una imagen base y una imagen de topping separadas.
 */
export function buildLayeredImagePaths(frutaNombre: string, chocolateNombre: string, toppingPrincipalNombre?: string) {
  const frutaToken = toToken(frutaNombre);
  const chocolateToken = toToken(chocolateNombre);

  // 1. Construye la ruta de la imagen base (fruta + chocolate)
  // ej: assets/img/chocos/pina/chocopinatradicional.png
  const baseImage = `${IMG_BASE}/chocos/${frutaToken}/choco${frutaToken}${chocolateToken}.png`;

  let toppingImage = '';
  // 2. Si hay un topping, construye su ruta
  if (toppingPrincipalNombre) {
    const toppingToken = toToken(toppingPrincipalNombre);
    // ej: assets/img/chocos/pina/toppings/pinaangelitos.png
    toppingImage = `${IMG_BASE}/chocos/${frutaToken}/toppings/${frutaToken}${toppingToken}.png`;
  }

  const fallback = IMG_PLACEHOLDER;

  return { baseImage, toppingImage, fallback };
}
