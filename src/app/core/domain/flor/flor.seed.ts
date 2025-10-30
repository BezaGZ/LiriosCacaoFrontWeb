import { CatalogoFlores, Flor } from './flor.models';

const FLORES: Flor[] = [
  {
    id: 'flor_cajita_rosal',
    nombre: 'Cajita rosal',
    slug: 'cajita-rosal',
    descripcion: 'Exclusiva presentación con rosa de chocolate rellena de bombones Hershey\'s, Milky Way, Kisses y Reese\'s, acompañada de cuatro fresas cubiertas en chocolate premium, mazo de madera y tarjeta personalizada. Un obsequio sofisticado que combina elegancia, detalle y exquisitez.',
    precio: 200.00,
    imagenUrl: 'assets/img/flores/cajitarosal.PNG',
    incluye: [
      'Caja de color blanco, café o negro',
      'Sabor a elección blanco o negro',
      'Tarjeta de dedicatoria'
    ],
    personalizaciones: [
      'Personalización de color de rosa',
      'Tarjeta con dedicatoria personalizada'
    ],
    notas: [
      'Puede añadirse globo burbuja personalizado, rosa o girasol'
    ]
  },
  {
    id: 'flor_cajita_fresita',
    nombre: 'Cajita fresita',
    slug: 'cajita-fresita',
    descripcion: 'Caja con 14 fresas cubiertas en chocolate premium, color a elección, decoradas con mini marshmallows y tarjeta personalizada. Un detalle elegante, dulce y hecho a tu gusto.',
    precio: 150.00,
    imagenUrl: 'assets/img/flores/cajitafresita.PNG',
    incluye: [
      'Caja de color blanco o café',
      'Sabor de a elección blanco o negro',
      'Tarjeta de dedicatoria'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores',
      'Tarjeta con dedicatoria personalizada',
      'Color de fresas 1 o 2 colores'
    ],
    notas: [
      'Puede añadirse globo burbuja personalizado, rosa o girasol'
    ]
  },
  {
    id: 'flor_mini_bouquet_delicado',
    nombre: 'Mini Bouquet delicado',
    slug: 'mini-bouquet-delicado',
    descripcion: 'Delicado bouquet con girasoles y flores de acento envuelto en papel coreano premium. Un detalle luminoso, elegante y lleno de vida.',
    precio: 130.00,
    imagenUrl: 'assets/img/flores/minibouquetdelicado.PNG',
    incluye: [
      'Follaje a juego con el color',
      'Girasoles',
      'Tarjeta de dedicatoria',
      'Envoltura coreana'
    ],
    personalizaciones: [
      'Personalización de 1 color de follaje y envoltura',
      'Tarjeta con dedicatoria personalizada'
    ]
  },
  {
    id: 'flor_bouquet_buena_alegria',
    nombre: 'Bouquet buena alegría',
    slug: 'bouquet-buena-alegria',
    descripcion: 'Arreglo con girasoles y rosas amarillas en base roja, acompañado de globo personalizado. Un diseño lleno de alegría, color y celebración.',
    precio: 350.00,
    imagenUrl: 'assets/img/flores/bouquetbuenaalegria.PNG',
    incluye: [
      'Rosas de exportación',
      'Follaje a juego con el color',
      'Girasoles',
      'Tarjeta de dedicatoria',
      'Globo burbuja'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores',
      'Color de caja y rosas',
      'Tarjeta con dedicatoria personalizada',
      'Globo personalizado'
    ]
  },
  {
    id: 'flor_bouquet_rosal_ferrero',
    nombre: 'Bouquet rosal Ferrero',
    slug: 'bouquet-rosal-ferrero',
    descripcion: 'Elegante bouquet con rosas en tonos rosa y crema, acompañado de chocolates Ferrero Rocher, envuelto en papel premium con detalles dorados. Un regalo que combina belleza y dulzura en perfecta armonía.',
    precio: 1100.00,
    imagenUrl: 'assets/img/flores/bouquetrosalferrero.PNG',
    incluye: [
      'Rosas de exportación',
      'Ferrero Rocher',
      'Tarjeta con dedicatoria',
      'Envoltura coreana premium'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores',
      'Color de envoltura y listón',
      'Tarjeta con dedicatoria personalizada'
    ]
  },
  {
    id: 'flor_bouquet_girasol_floral',
    nombre: 'Bouquet girasol floral',
    slug: 'bouquet-girasol-floral',
    descripcion: 'Bouquet con girasoles y rosas rosadas, envuelto en papel coreano premium y decorado con listón rojo. Color, alegría y elegancia en un solo detalle.',
    precio: 450.00,
    imagenUrl: 'assets/img/flores/bouquetgirasolfloral.PNG',
    incluye: [
      'Rosas de exportación',
      'Follaje a juego con el color',
      'Girasoles',
      'Envoltorio coreano premium'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores',
      'Color de envoltura y listón',
      'Tarjeta con dedicatoria personalizada'
    ]
  },
  {
    id: 'flor_globo_aerostatico',
    nombre: 'Arreglo globo aerostático',
    slug: 'globo-aerostatico',
    descripcion: 'Elegante diseño con rosas y flores en tonos a elección, acompañado de follaje natural y un globo decorativo con mensaje corto personalizado. Presentado en una base de porcelana premium, este arreglo transmite alegría, celebración, y estilo en cada detalle.',
    precio: 375.00,
    imagenUrl: 'assets/img/flores/globoaerostatico.PNG',
    incluye: [
      'Rosas de exportación',
      'Follaje a juego con el color',
      'Flores a juego',
      'Globo',
      'Base premium'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores',
      'Globo personalizado',
      'Tarjeta con dedicatoria personalizada'
    ]
  },
  {
    id: 'flor_bouquet_20_fresas',
    nombre: 'Bouquet de 20 Fresas con Chocolate Premium',
    slug: 'bouquet-20-fresas',
    descripcion: 'Ramo elaborado con 20 fresas frescas bañadas en chocolate premium. Un diseño artesanal con follaje tipo llovizna y envoltura en papel coreano premium, ideal para expresar amor, gratitud o celebración.',
    precio: 210.00,
    imagenUrl: 'assets/img/flores/bouquetveintefresasconchocolatepremium.PNG',
    incluye: [
      '[20] Fresas frescas cubiertas en chocolate premium',
      'Opción de chocolate blanco o oscuro',
      'Follaje tipo llovizna natural',
      'Envoltura en papel coreano premium a elección',
      'Tarjeta de dedicatoria'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores (en chocolate blanco)',
      'Estilo de envoltura y tipo de listón',
      'Tarjeta con dedicatoria personalizada'
    ]
  },
  {
    id: 'flor_bouquet_32_fresas',
    nombre: 'Bouquet de 32 Fresas con Chocolate Premium',
    slug: 'bouquet-32-fresas',
    descripcion: 'Ramo elaborado con 32 fresas frescas bañadas en chocolate premium. Un diseño artesanal con follaje tipo nube y envoltura en papel coreano premium, ideal para expresar amor, gratitud o celebración.',
    precio: 300.00,
    imagenUrl: 'assets/img/flores/bouquettreintaydosfresasconchocolatepremium.PNG',
    incluye: [
      '[32] Fresas frescas cubiertas en chocolate premium',
      'Opción de chocolate blanco o oscuro',
      'Follaje tipo nube natural',
      'Envoltura en papel coreano premium a elección',
      'Tarjeta de dedicatoria'
    ],
    personalizaciones: [
      'Personalización de 1 o 2 colores (en chocolate blanco)',
      'Estilo de envoltura y tipo de listón',
      'Tarjeta con dedicatoria personalizada'
    ]
  }
];

export const FLORES_SEED: CatalogoFlores = {
  flores: FLORES
};
