// ---------------------------------------------------------------------------
//  Los textos del sitio, en un solo lugar y tipados.
//
//  Estan aqui y no en las plantillas para que cambiar una frase no obligue a
//  abrir un componente, y para que se pueda revisar la redaccion de corrido.
// ---------------------------------------------------------------------------

export interface Enlace {
  readonly texto: string;
  readonly ruta: string;
  /** Enlace a otro dominio: se trata distinto en la plantilla. */
  readonly externo?: boolean;
}

export const NEGOCIO = {
  nombre: 'Lirios y Cacao',
  desde: 2020,
  ciudad: 'Chiquimula, Guatemala',
  descripcion:
    'Flores, chocofrutas, helados y eventos en Chiquimula, Guatemala.',
  /** Numero de WhatsApp en formato internacional, solo digitos. */
  whatsapp: '50245827110',
  telefono: '4582-7110',
  direccion: {
    calle: '5a Calle y 2a Avenida',
    ciudad: 'Chiquimula',
    region: 'Chiquimula',
    codigoPostal: '20001',
    pais: 'GT',
  },
  app: 'https://app.liriosycacao.com',
  sitio: 'https://www.liriosycacao.com',
} as const;

export const NAVEGACION: readonly Enlace[] = [
  { texto: 'Inicio', ruta: '/' },
  { texto: 'Servicios', ruta: '/servicios' },
  { texto: 'Floristería', ruta: '/floristeria' },
  { texto: 'Jardín', ruta: '/jardin' },
  { texto: 'Nosotros', ruta: '/nosotros' },
];

export const REDES: readonly Enlace[] = [
  { texto: 'WhatsApp', ruta: '#', externo: true },
  { texto: 'Instagram', ruta: '#', externo: true },
  { texto: 'Facebook', ruta: '#', externo: true },
];

export const PORTADA = {
  kicker: NEGOCIO.ciudad,
  titulo: 'Flores, mesa y celebración',
  entrada:
    'Arreglos florales, chocofrutas y helados artesanales, y la producción ' +
    'completa de su evento — con jardín propio.',
  accionPrincipal: { texto: 'Cotizar mi evento', ruta: '/servicios' },
  accionSecundaria: { texto: 'Pedir chocofrutas y helados', ruta: NEGOCIO.app, externo: true },
  foto: {
    escritorio: 'assets/fotos/mesa-montada-noche.jpg',
    movil: 'assets/fotos/pedida-de-mano.jpg',
    alt: 'Mesa de evento montada de noche, con flores, velas y luces colgantes',
    altMovil: 'Pedida de mano montada de noche: arco blanco con neón, flores y velas',
  },
} as const;

export const DECLARACION = {
  kicker: `Desde ${NEGOCIO.desde}`,
  frase:
    'Hacemos el detalle de un martes cualquiera y también la fiesta que se ' +
    'recuerda por años.',
  nota:
    'Cada servicio se cotiza por separado y se acopla a lo que usted ' +
    'necesite. No manejamos paquetes cerrados.',
} as const;

export const FLORISTERIA = {
  /** La franja que aparece en la portada. */
  banda: {
    kicker: 'Floristería',
    titulo: 'Un ramo dice lo que cuesta decir',
    parrafos: [
      'Ramos, canastas y arreglos florales para toda ocasión, armados el ' +
        'mismo día. Todos llevan tarjeta con su dedicatoria escrita a mano.',
      'Entrega a domicilio en Chiquimula o recoge en el local. Reserve con ' +
        'uno o dos días según el tamaño del arreglo.',
    ],
    enlace: { texto: 'Ver arreglos — desde Q100', ruta: '/floristeria' },
    foto: {
      src: 'assets/fotos/ramo-mesa-madera.jpg',
      alt: 'Ramo envuelto en papel kraft sobre una mesa de madera, junto a una taza y una tarjeta',
    },
  },

  /** La página completa en /floristeria. */
  pagina: {
    kicker: 'Floristería',
    // Directo y sin adorno a propósito: así es como la gente lo escribe en
    // Google, y es de lejos la búsqueda que más visitas trae al sitio.
    titulo: 'Floristería en Chiquimula',
    miga: 'Floristería',
    // Una sola idea. Antes repetía la entrega y la anticipación, que ya están
    // en la tira de arriba, y el párrafo se leía como un volante.
    entrada:
      'Armamos su arreglo el mismo día, con flor fresca, y se lo llevamos a ' +
      'domicilio. Todos llevan tarjeta con su dedicatoria escrita a mano.',
    foto: {
      src: 'assets/fotos/canasta-flores.jpg',
      alt: 'Canasta de flores variadas con listón rosado sobre una mesa de mármol',
    },
    queHacemos: [
      {
        titulo: 'Ramos',
        texto: 'Rosas, girasoles y flores de temporada, envueltos a mano.',
      },
      {
        titulo: 'Canastas y arreglos',
        texto: 'Para la casa, la oficina o para llevar al hospital.',
      },
      {
        titulo: 'Bouquets de fresas',
        texto: 'Fresas cubiertas de chocolate, armadas como un ramo.',
      },
      {
        titulo: 'Pasteles de fresa',
        texto: 'Torre de fresas con chocolate y letrero personalizado.',
      },
      {
        titulo: 'Tarjeta de dedicatoria',
        texto: 'Escrita a mano y incluida en todos los arreglos.',
        // No es algo que se venda aparte, así que no entra como producto en
        // los datos estructurados: ahí solo va lo que de verdad se cotiza.
        esProducto: false,
      },
    ],
    // Las cuatro preguntas que alguien hace antes de escribir. El título es la
    // respuesta; el detalle, el matiz. Van en la tira pegada a la portada.
    detalles: [
      { icono: 'precio', titulo: 'Desde Q100', detalle: 'Ramos, canastas y arreglos' },
      { icono: 'entrega', titulo: 'Entrega a domicilio', detalle: 'En Chiquimula' },
      { icono: 'calendario', titulo: 'Uno a dos días', detalle: 'De anticipación' },
      { icono: 'pago', titulo: 'Efectivo o tarjeta', detalle: 'Las dos formas de pago' },
    ],
    /**
     * Los arreglos del catálogo, SIN precio.
     *
     * Un precio escrito en la página que más tráfico recibe es un precio que
     * hay que mantener; el único número del que respondemos es el "desde
     * Q100" de la tira, y lo demás se cotiza al escribir.
     *
     * Son recortes con fondo transparente: van sueltos sobre el fondo, sin
     * recuadro, porque encerrarlos les dibuja un borde que la foto no tiene.
     */
    arreglos: [
      {
        titulo: 'Bouquet girasol',
        foto: {
          src: 'assets/fotos/arreglo-girasol.png',
          alt: 'Bouquet de girasoles y rosas envuelto en papel',
        },
      },
      {
        titulo: 'Bouquet de fresas',
        foto: {
          src: 'assets/fotos/arreglo-fresas.png',
          alt: 'Bouquet de fresas cubiertas de chocolate',
        },
      },
      {
        titulo: 'Buena alegría',
        foto: {
          src: 'assets/fotos/arreglo-alegria.png',
          alt: 'Arreglo de flores amarillas con globo personalizado',
        },
      },
      {
        titulo: 'Cajita rosal',
        foto: {
          src: 'assets/fotos/arreglo-cajita.png',
          alt: 'Cajita con rosa de tela y fresas con chocolate',
        },
      },
    ],
    arreglosTitulo: 'Algunos de nuestros arreglos',
    arreglosNota:
      'Estos son del catálogo. Armamos también a la medida, con lo que haya ' +
      'fresco ese día.',
    cierre: {
      titulo: '¿Para cuándo lo necesita?',
      parrafos: [
        'Escríbanos qué ocasión es y para qué día. Le mandamos opciones con ' +
          'precio el mismo día.',
      ],
      boton: 'Escribir por WhatsApp',
    },
    seo: {
      titulo: 'Floristería y arreglos florales en Chiquimula | Lirios y Cacao',
      descripcion:
        'Floristería en Chiquimula: ramos, canastas y arreglos florales para ' +
        'toda ocasión, con tarjeta de dedicatoria y entrega a domicilio. ' +
        'Desde Q100.',
    },
  },
} as const;

export const PIE = {
  titulo: 'Servicios',
  /**
   * Lista propia, no la navegacion recortada: el pie habla de lo que vendemos,
   * con los nombres del negocio. "Eventos" dice mas que "Servicios".
   */
  enlaces: [
    { texto: 'Floristería', ruta: '/floristeria' },
    { texto: 'Eventos', ruta: '/servicios' },
    { texto: 'Jardín', ruta: '/jardin' },
    { texto: 'Nosotros', ruta: '/nosotros' },
  ] as readonly Enlace[],
  creditoTexto: 'Hecho por',
  creditoMarca: 'Kaxbe',
  creditoRuta: '#',
} as const;

export const SERVICIOS = {
  /** La franja de eventos en la portada. */
  banda: {
    kicker: 'Eventos',
    titulo: 'Montamos todo, de principio a fin',
    parrafos: [
      'Pedidas de mano, quince años, bodas y cumpleaños temáticos. Arcos, ' +
        'letras iluminadas, neón, mobiliario, vajilla, flores, comida y sonido.',
      'Nada es un paquete cerrado: se arma con lo que usted quiera incluir, ' +
        'y cada cosa lleva su precio aparte.',
    ],
    enlace: { texto: 'Ver eventos y cotizar', ruta: '/servicios' },
    foto: {
      src: 'assets/fotos/pedida-de-mano.jpg',
      alt: 'Pedida de mano montada de noche: arco con neón, flores y velas',
    },
  },

  kicker: 'Servicios',
  titulo: 'Todo lo que montamos',
  miga: 'Servicios',
  foto: {
    src: 'assets/fotos/quince-anos-arcos.jpg',
    alt: 'Montaje de quince años con arcos de neón, globos y letras iluminadas',
  },
  /**
   * El mosaico es la página entera: aquí no se explica, se enseña.
   *
   * Cada tesela lleva o una ruta interna, cuando hay una página que cuenta
   * más, o una ocasión con la que se arma el mensaje de WhatsApp. Nunca las
   * dos: si hay página propia, mandar a WhatsApp se salta la información.
   */
  mosaico: [
    {
      titulo: 'Bodas',
      texto: 'De la ceremonia al último baile',
      ocasion: 'una boda',
      foto: {
        src: 'assets/fotos/mesa-montada-noche.jpg',
        alt: 'Mesa de boda montada de noche, con mantelería blanca y velas',
      },
    },
    {
      titulo: 'Quince años',
      texto: 'Arcos, globos, letras y pista',
      ocasion: 'unos quince años',
      foto: {
        src: 'assets/fotos/quince-anos-arcos.jpg',
        alt: 'Montaje de quince años con arcos de neón y letras iluminadas',
      },
    },
    {
      titulo: 'Pedidas de mano',
      texto: 'Montaje íntimo, con velas y neón',
      ocasion: 'una pedida de mano',
      foto: {
        src: 'assets/fotos/pedida-de-mano.jpg',
        alt: 'Pedida de mano con arco de neón y camino de velas',
      },
    },
    {
      titulo: 'Pasteles y postres',
      texto: 'Pasteles de fresa y mesas de dulces',
      ocasion: 'una mesa de postres',
      foto: {
        src: 'assets/fotos/pastel-fresas-chocolate.jpg',
        alt: 'Pastel de fresas cubiertas de chocolate con letrero personalizado',
      },
    },
    {
      titulo: 'Nuestro jardín',
      texto: 'Techado y grama, hasta 150 personas',
      ruta: '/jardin',
      foto: {
        src: 'assets/fotos/jardin-patio-techado.jpg',
        alt: 'Patio techado con herrería decorativa y la grama del jardín al fondo',
      },
    },
    {
      titulo: 'Flores y detalles',
      texto: 'Ramos, cajitas y fresas con chocolate',
      ruta: '/floristeria',
      foto: {
        src: 'assets/fotos/canasta-flores.jpg',
        alt: 'Canasta de flores variadas con listón rosado',
      },
    },
  ],
  cierre: {
    kicker: '¿Ya tiene fecha?',
    titulo: 'Cuéntenos qué celebra y le armamos la cotización',
    parrafos: [
      'Cada celebración se arma de cero con lo que usted quiera incluir: ' +
        'nada viene en paquete cerrado, y cada servicio lleva su precio por ' +
        'separado.',
      'Escríbanos con la fecha y cuántas personas. Le respondemos el mismo ' +
        'día con lo que cuesta cada parte.',
    ],
    boton: 'Escribir por WhatsApp',
  },
  seo: {
    titulo: 'Bodas, quince años y eventos en Chiquimula | Lirios y Cacao',
    descripcion:
      'Montaje de bodas, quince años, pedidas de mano y mesas de postres en ' +
      'Chiquimula, con jardín propio para hasta 150 personas.',
  },
} as const;

export const JARDIN = {
  /** La franja del jardín en la portada. */
  banda: {
    kicker: 'El jardín',
    titulo: 'El lugar ya es nuestro, así que el precio no se infla',
    parrafos: [
      'El alquiler incluye mobiliario, cocina, baños y refrigeradores. La ' +
        'decoración se cotiza aparte, y puede ser nuestra o suya.',
    ],
    datos: [
      { rotulo: 'Personas', valor: 'Hasta 150' },
      { rotulo: 'Si llueve', valor: 'Techo' },
      { rotulo: 'Incluido', valor: 'Cocina' },
    ],
    enlace: { texto: 'Consultar disponibilidad', ruta: '/jardin' },
    foto: {
      src: 'assets/fotos/jardin-grama-luces.jpg',
      alt: 'La grama del jardín mirando hacia el área techada, con luces colgantes',
      enfoque: 'center 38%',
    },
  },

  kicker: 'El jardín',
  titulo: 'Un jardín propio en Chiquimula',
  miga: 'Jardín',
  foto: {
    src: 'assets/fotos/jardin-patio-techado.jpg',
    alt: 'Patio techado con herrería decorativa, abierto hacia la grama del jardín',
    // Centrada, la franja de la portada se queda con la lámina del techo.
    enfoque: 'center 80%',
  },
  /**
   * Va sola y más grande porque es la única que enseña QUÉ RECIBE el cliente;
   * las demás enseñan cómo es el lugar vacío.
   */
  destacada: {
    src: 'assets/fotos/jardin-montado-atardecer.jpg',
    alt:
      'El jardín montado al atardecer: mesa vestida de blanco para ocho, ' +
      'arco de globos y luces encendidas',
    pie: 'Montado para ocho, con el arco y las luces encendidas',
  },
  galeria: [
    {
      src: 'assets/fotos/jardin-grama-luces.jpg',
      alt: 'La grama del jardín mirando hacia el área techada, con luces colgantes',
      pie: 'La grama, y las luces ya instaladas',
    },
    {
      src: 'assets/fotos/jardin-rancho-teja.jpg',
      alt: 'Rancho con techo de teja al fondo del jardín',
      pie: 'El rancho de teja, al otro extremo',
    },
  ],
  datos: [
    { icono: 'personas', titulo: 'Hasta 150', detalle: 'Personas en el jardín completo' },
    { icono: 'techo', titulo: 'Techado', detalle: 'Si llueve, la fiesta sigue' },
    { icono: 'calendario', titulo: 'Disponibilidad', detalle: 'Se la confirmamos hoy' },
  ],
  incluye: {
    kicker: 'Sin alquilar nada aparte',
    titulo: 'El alquiler incluye',
    cosas: [
      {
        icono: 'mobiliario',
        titulo: 'Mobiliario',
        texto: 'Mesas y sillas, con su mantelería puesta.',
      },
      {
        icono: 'cocina',
        titulo: 'Cocina equipada',
        texto: 'Para que quien lleve la comida trabaje en el lugar.',
      },
      {
        icono: 'banos',
        titulo: 'Baños',
        texto: 'Dentro del mismo jardín, no hay que salir.',
      },
      {
        icono: 'frio',
        titulo: 'Refrigeradores',
        texto: 'Para las bebidas, sin alquilar aparte.',
      },
      {
        icono: 'techo',
        titulo: 'Techo con herrería',
        texto: 'El patio cubierto, por si el día se pone lluvioso.',
      },
    ],
    nota:
      'La decoración se cotiza aparte y puede ser nuestra o suya. Si es ' +
      'nuestra, se arma con lo que usted elija: arcos, neón, letras ' +
      'iluminadas y flores.',
  },
  cierre: {
    kicker: 'Disponibilidad',
    titulo: 'Díganos la fecha y le confirmamos si está libre',
    parrafos: [
      'El jardín es nuestro, no lo subcontratamos: por eso el precio no ' +
        'lleva el recargo de un intermediario, y la disponibilidad se la ' +
        'confirmamos el mismo día.',
      'Con la fecha y cuántas personas son, le decimos cuánto sale el alquiler.',
    ],
    boton: 'Consultar por WhatsApp',
  },
  seo: {
    titulo: 'Jardín para eventos en Chiquimula | Lirios y Cacao',
    descripcion:
      'Jardín propio en Chiquimula para hasta 150 personas, con patio ' +
      'techado, mobiliario, cocina equipada y baños incluidos en el alquiler.',
  },
} as const;

/**
 * Lo que entra en un evento sin que haya que alquilarlo afuera.
 *
 * Va en la portada y no en la pagina de eventos porque es el argumento que
 * decide: quien compara dos presupuestos esta comparando cuantas cosas tiene
 * que conseguir por su cuenta.
 */
export const INCLUIMOS = {
  cosas: [
    {
      icono: 'techo',
      titulo: 'Jardín propio',
      texto: 'Techado y grama, hasta 150 personas. No lo alquilamos: es nuestro.',
    },
    {
      icono: 'decoracion',
      titulo: 'Decoración',
      texto: 'Arcos, neón, letras iluminadas y flores. Todo es equipo nuestro.',
    },
    {
      icono: 'mesa',
      titulo: 'Mesa puesta',
      texto: 'Mobiliario, vajilla, mantelería, y cocina y baños equipados.',
    },
    {
      icono: 'sonido',
      titulo: 'Comida y sonido',
      texto: 'Lo coordinamos nosotros. Cada cosa lleva su precio aparte.',
    },
  ],
  enlace: { texto: 'Ver todo lo que incluimos', ruta: '/servicios' },
} as const;

/** La franja que manda a la tienda en línea. */
export const APP = {
  kicker: 'Chocofrutas y helados',
  titulo: 'Lo de todos los días se pide en línea',
  texto:
    'Catálogo, carrito y entrega a domicilio. Los eventos y las flores se ' +
    'cotizan aquí; lo demás se pide allá.',
  // El boton dice la accion, no la direccion: quien lo lee en el telefono no
  // esta memorizando un dominio, esta decidiendo si toca o no.
  boton: 'Ir a la aplicación',
  url: 'https://app.liriosycacao.com',
} as const;
