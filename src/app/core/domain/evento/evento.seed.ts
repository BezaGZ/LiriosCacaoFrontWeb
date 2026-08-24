import { CatalogoEventos, Evento } from './evento.models';

/*
 * ============================================================================
 *  COMO SE COBRA UN EVENTO AQUI
 * ============================================================================
 *  Esto NO son paquetes cerrados. Segun la duena, en un montaje a medida se
 *  puede incluir practicamente todo -- vajilla, comida, sonido, decoracion --
 *  pero cada cosa tiene su propio precio y se cotiza por separado.
 *
 *  Por eso:
 *
 *    - modalidad: 'a-medida'   en las celebraciones. La lista `incluye` se
 *                              titula "Podemos incluir" y el dialogo aclara
 *                              que cada servicio se cotiza aparte.
 *
 *    - modalidad: 'alquiler'   solo en los jardines, que si tienen un precio
 *                              propio. Ahi `incluye` es lo que viene en ese
 *                              precio; la decoracion va por aparte.
 *
 *    - precioDesde             se omite en las celebraciones. No hay un
 *                              "desde" honesto cuando el precio depende de
 *                              cuanto se arme.
 *
 *    - anticipacion            depende del tamano del evento, asi que no se
 *                              promete un numero de dias.
 *
 *  IMPORTANTE: nada de PENDIENTE ni CONFIRMAR en los textos. Estas listas se
 *  imprimen tal cual en el dialogo que ve el cliente. (El dialogo ademas
 *  filtra esas lineas por si acaso, pero no hay que depender de eso.)
 *
 *  Las imagenes van en public/assets/img/eventos/ (ver el LEEME de esa
 *  carpeta). Un paquete sin fotos ni datos lleva `borrador: true` y no se
 *  publica.
 * ============================================================================
 */

const EVENTOS: Evento[] = [
  {
    // Fotos reales de cuatro fiestas distintas: Minions, Mario Bros, un 40
    // anos elegante y un montaje en azul. La galeria las mezcla a proposito:
    // lo que se vende aqui es el RANGO de tematicas, no un montaje concreto.
    id: 'evt_cumpleanos',
    nombre: 'Cumpleaños temáticos',
    slug: 'cumpleanos',
    tipo: 'celebracion',
    modalidad: 'a-medida',
    descripcion: 'Montamos el cumpleaños con la temática que elijas: desde Minions o Mario Bros para los niños, hasta montajes elegantes para adultos. Vos decidís hasta dónde llega — solo la decoración, o el evento completo con comida y sonido.',
    imagenUrl: 'assets/img/eventos/cumpleanos/1.jpg',
    galeria: [
      'assets/img/eventos/cumpletematico1/1.jpg',   // Minions
      'assets/img/eventos/cumpletematico2/3.jpg',   // Mario Bros
      'assets/img/eventos/cumpletematico3/3.jpg',   // 40 años elegante
      'assets/img/eventos/cumpleanos/2.jpg',
      'assets/img/eventos/cumpletematico1/3.jpg',
      'assets/img/eventos/cumpletematico2/1.jpg',
      'assets/img/eventos/cumpletematico3/4.jpg',
      'assets/img/eventos/cumpleanos/4.jpg',
    ],
    incluye: [
      'Decoración temática completa',
      'Arco de globos',
      'Mampara y números o letras iluminadas',
      'Mobiliario y mantelería',
      'Vajilla',
      'Comida',
      'Disco y sonido',
    ],
    personalizaciones: [
      'Cualquier temática: Minions, Mario Bros, elegante para adultos...',
      'Colores del montaje',
      'Para niños o para adultos',
    ],
    notas: [
      'El tiempo con el que hay que reservar depende del tamaño del evento: escribinos con tu fecha y te decimos.',
    ],
  },
  {
    // Fotos reales: arco iluminado, globos morados y rosados, letras "15"
    // gigantes encendidas, montado en jardin de noche.
    id: 'evt_quinceanos',
    nombre: '15 años',
    slug: 'quinceanos',
    tipo: 'celebracion',
    modalidad: 'a-medida',
    descripcion: 'Arco iluminado con globos en tus colores, letras de 15 gigantes encendidas y montaje completo. Lo armamos en jardín o en salón, y se ve espectacular de noche.',
    imagenUrl: 'assets/img/eventos/quinceanos/1.jpg',
    galeria: [
      'assets/img/eventos/quinceanos/3.jpg',
      'assets/img/eventos/quinceanos/4.jpg',
      'assets/img/eventos/quinceanos/2.jpg',
    ],
    incluye: [
      'Arco iluminado con globos',
      'Letras de 15 iluminadas',
      'Decoración y montaje completo',
      'Mobiliario y mantelería',
      'Vajilla',
      'Comida',
      'Disco y sonido',
    ],
    personalizaciones: [
      'Colores de los globos y del montaje',
      'Se monta en jardín o en salón',
    ],
    notas: [
      'El tiempo con el que hay que reservar depende del tamaño del evento: escribinos con tu fecha y te decimos.',
    ],
  },
  {
    // Fotos reales: camino de velas, alfombra roja, arco floral iluminado y
    // letrero de neon.
    id: 'evt_pedida_mano',
    nombre: 'Pedida de mano',
    slug: 'pedida-de-mano',
    tipo: 'celebracion',
    modalidad: 'a-medida',
    descripcion: 'Montaje íntimo para pedir matrimonio: camino de velas, alfombra, arco floral iluminado y letrero de neón. Preparamos todo para que solo tengas que llegar con ella.',
    imagenUrl: 'assets/img/eventos/pedida-de-mano/1.jpg',
    galeria: [
      'assets/img/eventos/pedida-de-mano/3.jpg',
      'assets/img/eventos/pedida-de-mano/2.jpg',
    ],
    incluye: [
      'Arco floral iluminado',
      'Camino de velas y alfombra',
      'Letrero de neón',
      'Mobiliario',
    ],
    personalizaciones: [
      'Colores de las flores',
      'El montaje se adapta al lugar que elijas',
    ],
    notas: [
      'El tiempo con el que hay que reservar depende del tamaño del montaje: escribinos con tu fecha y te decimos.',
    ],
  },
  {
    id: 'evt_boda',
    nombre: 'Bodas',
    slug: 'boda',
    tipo: 'celebracion',
    modalidad: 'a-medida',
    descripcion: 'Ambientación completa para la recepción: drapeado, alfombra, cartel de bienvenida y mobiliario vestido. Nos acoplamos al estilo y los colores de la boda, y podemos agregar todo lo que quieran.',
    imagenUrl: 'assets/img/eventos/boda/1.jpg',
    galeria: [
      'assets/img/eventos/boda/2.jpg',
      'assets/img/eventos/boda/3.jpg',
      'assets/img/eventos/boda/4.jpg',
    ],
    incluye: [
      'Decoración y drapeado',
      'Alfombra y cartel de bienvenida',
      'Mobiliario y mantelería',
      'Vajilla',
      'Comida',
      'Disco y sonido',
      'Letras 3D y letreros',
    ],
    personalizaciones: [
      'Colores y estilo de la boda',
      'Se puede agregar todo lo que quieran',
    ],
    notas: [
      'El tiempo con el que hay que reservar depende del tamaño del evento: escribinos con tu fecha y te decimos.',
    ],
  },
  {
    // El unico con precio propio: el jardin se alquila. La decoracion no va
    // dentro de ese precio.
    id: 'evt_jardin_1',
    nombre: 'Jardín 1',
    slug: 'jardin-1',
    tipo: 'lugar',
    modalidad: 'alquiler',
    descripcion: 'Jardín para eventos de 100 a 150 personas, con área techada y grama. El alquiler ya trae mobiliario, cocina, baño y refrigeradores para las bebidas, así que no hay que conseguir nada por aparte.',
    capacidad: 150,
    imagenUrl: 'assets/img/eventos/jardin-1/1.jpg',
    galeria: [
      'assets/img/eventos/jardin-1/2.jpg',
      'assets/img/eventos/jardin-1/3.jpg',
      'assets/img/eventos/jardin-1/4.jpg',
    ],
    incluye: [
      // La capacidad ya sale en su propia seccion del dialogo, no se repite.
      'Mobiliario',
      'Cocina',
      'Baño',
      'Refrigeradores para bebidas',
    ],
    personalizaciones: [
      'Decoración y montaje a la medida, cotizado aparte del alquiler',
    ],
    notas: [
      'Sujeto a disponibilidad: escribinos con tu fecha y la revisamos.',
      'El jardín tiene su propio precio de alquiler; la decoración va por aparte.',
    ],
  },
  {
    id: 'evt_graduacion',
    nombre: 'PENDIENTE: Graduaciones',
    slug: 'graduacion',
    modalidad: 'a-medida',
    tipo: 'celebracion',
    borrador: true,     // faltan fotos y datos
    descripcion: 'PENDIENTE: describir el montaje para promociones y grupos. Faltan fotos en assets/img/eventos/graduacion/',
    capacidad: 0,            // PENDIENTE
    imagenUrl: 'assets/img/eventos/graduacion/1.jpg',
    galeria: [
      'assets/img/eventos/graduacion/2.jpg',
      'assets/img/eventos/graduacion/3.jpg',
      'assets/img/eventos/graduacion/4.jpg',
    ],
    incluye: ['PENDIENTE: completar la lista'],
    personalizaciones: ['PENDIENTE: completar la lista'],
  },
  {
    id: 'evt_jardin_2',
    nombre: 'PENDIENTE: Jardín 2',
    slug: 'jardin-2',
    modalidad: 'alquiler',
    tipo: 'lugar',
    borrador: true,     // faltan fotos y datos
    descripcion: 'PENDIENTE: describir el segundo jardín y en qué se diferencia del primero. Faltan fotos en assets/img/eventos/jardin-2/',
    capacidad: 0,            // PENDIENTE
    imagenUrl: 'assets/img/eventos/jardin-2/1.jpg',
    galeria: [
      'assets/img/eventos/jardin-2/2.jpg',
      'assets/img/eventos/jardin-2/3.jpg',
      'assets/img/eventos/jardin-2/4.jpg',
    ],
    incluye: ['PENDIENTE: completar la lista'],
    personalizaciones: ['PENDIENTE: completar la lista'],
  },
  {
    id: 'evt_mobiliario',
    nombre: 'PENDIENTE: Mobiliario y decoración',
    slug: 'mobiliario',
    modalidad: 'a-medida',
    tipo: 'servicio',
    borrador: true,     // faltan fotos y datos
    descripcion: 'PENDIENTE: para quien ya tiene el lugar. Mencionar mamparas, letreros y letras 3D. Faltan fotos en assets/img/eventos/mobiliario/',
    imagenUrl: 'assets/img/eventos/mobiliario/1.jpg',
    galeria: [
      'assets/img/eventos/mobiliario/2.jpg',
      'assets/img/eventos/mobiliario/3.jpg',
    ],
    incluye: ['PENDIENTE: completar la lista'],
    personalizaciones: ['PENDIENTE: completar la lista'],
  },
];

export const EVENTOS_SEED: CatalogoEventos = {
  eventos: EVENTOS,
};

/**
 * Los paquetes que si se ensenan al publico.
 *
 * Todo lo que este en borrador (sin fotos ni datos reales) se queda fuera:
 * es preferible una pagina corta y completa que una larga con huecos.
 */
export const EVENTOS_PUBLICADOS: Evento[] = EVENTOS.filter(e => !e.borrador);

/** Los publicados de un tipo, en el orden del seed. */
export function eventosPorTipo(tipo: Evento['tipo']): Evento[] {
  return EVENTOS_PUBLICADOS.filter(e => e.tipo === tipo);
}
