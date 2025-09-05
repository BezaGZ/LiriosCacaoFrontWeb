import { Fruta, Chocolate, Topping } from '../../../../../core/domain/chocofruta/chocofruta.models';

export interface FeaturedPreset {
  id: string;
  titulo: string;
  fruta: Fruta;
  chocolate: Chocolate;
  toppings: Topping[];
  dobleChocolate?: boolean;
  cantidad?: number;
  imageOverride?: string;
}
