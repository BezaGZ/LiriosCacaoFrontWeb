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
    enlace: { texto: 'Ver arreglos — desde Q130', ruta: '/floristeria' },
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
    entrada:
      'Ramos, canastas y arreglos florales para toda ocasión. Armamos el ' +
      'mismo día con lo que hay fresco en el mercado, y entregamos a ' +
      'domicilio en Chiquimula.',
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
        titulo: 'Tarjeta de dedicatoria',
        texto: 'Escrita a mano y incluida en todos los arreglos.',
        // No es algo que se venda aparte, así que no entra como producto en
        // los datos estructurados: ahí solo va lo que de verdad se cotiza.
        esProducto: false,
      },
    ],
    detalles: [
      { rotulo: 'Desde', valor: 'Q130' },
      { rotulo: 'Entrega', valor: 'A domicilio en Chiquimula' },
      { rotulo: 'Anticipación', valor: 'De uno a dos días' },
      { rotulo: 'Pago', valor: 'Efectivo o tarjeta' },
    ],
    cierre: {
      titulo: '¿Para cuándo lo necesita?',
      texto:
        'Escríbanos qué ocasión es y para qué día. Le mandamos opciones con ' +
        'precio el mismo día.',
      boton: 'Escribir por WhatsApp',
    },
    seo: {
      titulo: 'Floristería y arreglos florales en Chiquimula | Lirios y Cacao',
      descripcion:
        'Floristería en Chiquimula: ramos, canastas y arreglos florales para ' +
        'toda ocasión, con tarjeta de dedicatoria y entrega a domicilio. ' +
        'Desde Q130.',
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
