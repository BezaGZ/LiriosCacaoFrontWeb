import { ProductCategory } from '@core/ui-models/product-card.vm';

// El tipo de item del carrito puede ser CUALQUIER categoría de producto.
export type CartItemKind = ProductCategory;

export interface CartItem {
  id: string;
  kind: CartItemKind;
  title: string;
  qty: number;
  unitPrice: number;
  imageUrls: {
    base: string;
    topping?: string;
  };
  // 'data' es genérico para guardar la selección de cualquier producto.
  data: any;
  /**
   * Huella de la configuración exacta del item.
   * Dos items solo se fusionan si su huella coincide, de modo que
   * "ChocoFresa con Oreo" y "ChocoFresa con Oreo + doble chocolate"
   * son líneas distintas aunque compartan el título.
   */
  configKey: string;
}

/** Datos que necesita el carrito para crear un item nuevo. */
export type NewCartItem = Omit<CartItem, 'id' | 'configKey'>;

function idsOrdenados(lista: any[] | undefined): string {
  if (!lista?.length) return '';
  return lista
    .map(x => String(x?.id ?? ''))
    .sort()
    .join('+');
}

/**
 * Construye la huella de configuración de un item.
 * Incluye el precio unitario como red de seguridad: dos items con
 * distinto precio nunca deben fusionarse, pase lo que pase.
 */
export function buildConfigKey(item: NewCartItem): string {
  const partes: string[] = [item.kind, item.unitPrice.toFixed(2)];

  const cf = item.data?.chocofruta;
  const helado = item.data?.helado;

  if (cf) {
    partes.push(
      `fruta:${cf.fruta?.id ?? ''}`,
      `choc:${cf.chocolate?.id ?? ''}`,
      `tops:${idsOrdenados(cf.toppings)}`,
      `doble:${cf.dobleChocolate ? 1 : 0}`,
      `lineas:${cf.lineasChocolateSlug ?? ''}`
    );
  } else if (helado) {
    partes.push(
      `sabor:${helado.sabor?.id ?? ''}`,
      `choc:${helado.chocolate?.id ?? ''}`,
      `tops:${idsOrdenados(helado.toppings)}`,
      `extra:${helado.chocolateExtra ? 1 : 0}`,
      `lineas:${helado.lineasChocolateSlug ?? ''}`
    );
  } else {
    // Flores, eventos y cualquier producto no personalizable.
    partes.push(`titulo:${item.title}`);
  }

  return partes.join('|');
}
