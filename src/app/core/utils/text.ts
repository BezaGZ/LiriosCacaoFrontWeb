/**
 * Normaliza texto para comparaciones: minúsculas y sin acentos,
 * conservando los espacios para poder buscar por palabras sueltas.
 * "Chocopiña" y "chocopina" quedan iguales.
 */
export function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/** Parte un término de búsqueda en palabras normalizadas. */
export function searchTerms(s: string): string[] {
  return normalizeText(s).split(/\s+/).filter(Boolean);
}

/** true si el texto contiene TODAS las palabras del término de búsqueda. */
export function matchesSearch(texto: string, termino: string): boolean {
  const terms = searchTerms(termino);
  if (!terms.length) return true;
  const objetivo = normalizeText(texto);
  return terms.every(t => objetivo.includes(t));
}
