export type ProductCategory = 'chocofruta' | 'helado' | 'flor' | 'evento';

export interface ProductCardVM {
  // --- Datos Esenciales para la Tarjeta ---
  id: string;                 // Identificador único (ej: 'chocofruta-fresa-tradicional-oreo')
  category: ProductCategory;  // Para poder filtrar (ej: 'chocofruta')
  title: string;              // Título que se muestra en la card (ej: "Chocofresa con Oreo")
  imageUrl: string;           // URL de la imagen principal
  price: number;              // Precio a mostrar

  // --- Datos Opcionales y para Lógica ---
  customizable?: boolean;     // ¿Esta card abre un dialog de personalización?
  data?: any;                 // "Payload" con los datos originales (la fruta, el chocolate, etc.)
}
