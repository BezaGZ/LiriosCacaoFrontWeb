export type ProductCategory = 'chocofruta' | 'helado' | 'flor' | 'evento';

export interface ProductCardVM {
  id: string;
  category: ProductCategory;
  title: string;
  price: number;
  customizable?: boolean;
  data?: any;
  imageUrls: {
    base: string;
    topping?: string;
  };
}
