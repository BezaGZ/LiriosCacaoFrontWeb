import { ProductData } from './product-data';

// 'paquete' entra porque el carrito tambien guarda paquetes, que se venden
// por cantidad y no por unidad.
export type ProductCategory = 'chocofruta' | 'helado' | 'bebida' | 'paquete';

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
