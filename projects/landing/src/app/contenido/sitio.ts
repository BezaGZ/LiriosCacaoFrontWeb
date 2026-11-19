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
  whatsapp: '502PENDIENTE',
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
