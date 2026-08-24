import { ProductData } from './product-data';

export type ProductCategory = 'chocofruta' | 'helado' | 'flor' | 'evento';

export interface ProductCardVM {
  id: string;
  category: ProductCategory;
  title: string;
  price: number;
  customizable?: boolean;
  data: ProductData;
  imageUrls: {
    base: string;
    topping?: string;
  };
}
