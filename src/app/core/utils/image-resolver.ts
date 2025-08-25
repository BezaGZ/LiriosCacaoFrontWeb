// src/utils/image-resolver.ts
export const IMG_BASE = 'assets/img';

// Chocofrutas: assets/img/chocos/<fruta>/<color>.png
export function imgChocofruta(frutaSlug: string, chocolateSlug: string) {
  return `${IMG_BASE}/chocos/${frutaSlug}/${chocolateSlug}.png`;
}

// Helado paleta: assets/img/helados/paleta/<sabor>.png
export function imgHeladoPaleta(saborSlug: string) {
  return `${IMG_BASE}/helados/paleta/${saborSlug}.png`;
}

// Opcional: fallback si una imagen no existe
export function withFallback(src: string, fallback = `${IMG_BASE}/placeholder.png`) {
  return {
    src,
    onError: (e: Event) => ((e.target as HTMLImageElement).src = fallback),
  };
}
