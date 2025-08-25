export const IMG_BASE = 'assets/img';

export function imgChocofruta(frutaSlug: string, chocolateSlug: string) {
  return `${IMG_BASE}/chocos/${frutaSlug}/${chocolateSlug}.png`;
}

export function toToken(s: string): string {
  return s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '');
}

/**
 * assets/img/chocos/<fruta>/
 *   - choco<fruta><chocolate>.png
 *   - choco<fruta><chocolate><topping>.png
 * fallback: assets/img/nophoto.jpg
 */
export function buildChocoImagePaths(frutaNombre: string, chocolateNombre: string, toppingPrincipal?: string) {
  const fruta = toToken(frutaNombre);
  const choc  = toToken(chocolateNombre);
  const top   = toppingPrincipal ? toToken(toppingPrincipal) : '';

  const baseDir    = `${IMG_BASE}/chocos/${fruta}`;
  const withoutTop = `${baseDir}/choco${fruta}${choc}.png`;
  const withTop    = top ? `${baseDir}/choco${fruta}${choc}${top}.png` : '';
  const fallback   = `${IMG_BASE}/nophoto.png`;

  return { withTop, withoutTop, fallback };
}

export function imgHeladoPaleta(saborSlug: string) {
  return `${IMG_BASE}/helados/paleta/${saborSlug}.png`;
}


