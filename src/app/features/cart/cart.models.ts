import { SeleccionChocofruta } from '@core/domain/chocofruta/chocofruta.logic';


import { ProductCategory } from '@core/ui-models/product-card.vm';

// 1. Ahora el tipo de item del carrito puede ser CUALQUIER categoría de producto.
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
  // 2. Hacemos que 'data' sea genérico para guardar datos de cualquier producto.
  data: any;
}
