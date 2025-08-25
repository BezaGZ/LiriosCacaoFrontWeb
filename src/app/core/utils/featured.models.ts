import { Fruta, Chocolate, Topping } from '../../data/models';

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
