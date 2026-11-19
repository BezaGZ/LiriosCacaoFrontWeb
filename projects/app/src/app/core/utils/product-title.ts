import { CHOCOFRUTA_SEED } from '@core/domain';

/**
 * Construcción de títulos de producto.
 *
 * Vive en un solo lugar a propósito: el título se arma en la tarjeta del
 * catálogo, en el diálogo de personalización y en los destacados del home.
 * Si cada uno lo arma por su cuenta terminan describiendo el mismo producto
 * de forma distinta.
 *
 * IMPORTANTE: el título debe reflejar TODA opción que cambie el precio.
 * Si no, el cliente ve dos líneas idénticas en el carrito a distinto precio.
 */

interface ToppingBasico { id: string; nombre: string; }

interface SeleccionChocofrutaTitulo {
  fruta: { nombre: string };
  chocolate: { nombre: string };
  toppings?: ToppingBasico[];
  dobleChocolate?: boolean;
  lineasChocolateSlug?: string | null;
}

interface SeleccionHeladoTitulo {
  sabor: { nombre: string };
  chocolate?: { nombre: string } | null;
  toppings?: ToppingBasico[];
  chocolateExtra?: boolean;
  lineasChocolateSlug?: string | null;
}

/** "Líneas de chocolate" muestra además el sabor elegido para las líneas. */
export function nombreTopping(t: ToppingBasico, lineasChocolateSlug?: string | null): string {
  if (t.id === 'top_lineaschocolate' && lineasChocolateSlug) {
    const choc = CHOCOFRUTA_SEED.chocolates.find(c => c.colorSlug === lineasChocolateSlug);
    return choc ? `Líneas de chocolate ${choc.nombre}` : t.nombre;
  }
  return t.nombre;
}

export function nombresToppings(
  toppings: ToppingBasico[] | undefined,
  lineasChocolateSlug?: string | null
): string[] {
  return (toppings ?? []).map(t => nombreTopping(t, lineasChocolateSlug));
}

export function tituloChocofruta(sel: SeleccionChocofrutaTitulo): string {
  let titulo = `Choco${sel.fruta.nombre} con ${sel.chocolate.nombre}`;

  const tops = nombresToppings(sel.toppings, sel.lineasChocolateSlug);
  if (tops.length) titulo += ` + ${tops.join(', ')}`;

  if (sel.dobleChocolate) titulo += ' (doble chocolate)';

  return titulo;
}

export function tituloHelado(sel: SeleccionHeladoTitulo): string {
  let titulo = `Paleta de ${sel.sabor.nombre}`;

  if (sel.chocolate) titulo += ` c/${sel.chocolate.nombre}`;

  const tops = nombresToppings(sel.toppings, sel.lineasChocolateSlug);
  if (tops.length) titulo += ` + ${tops.join(', ')}`;

  if (sel.chocolateExtra) titulo += ' (chocolate extra)';

  return titulo;
}
