import { SeleccionChocofruta } from '../../data/chocofruta.logic';

export type CartItemKind = 'chocofruta';

export interface CartItem {
  id: string;
  kind: CartItemKind;
  title: string;
  imageUrl: string;
  unitPrice: number;
  qty: number;
  data: {
    chocofruta?: SeleccionChocofruta;
  };
}
