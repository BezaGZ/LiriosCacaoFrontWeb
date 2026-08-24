import { CatalogoEventos, Evento } from './evento.models';

/*
 * ============================================================================
 *  PENDIENTE: CONTENIDO REAL
 * ============================================================================
 *  Todo lo que dice PENDIENTE aqui abajo es relleno para poder ver la pagina
 *  funcionando. Antes de publicar hay que reemplazar, en cada paquete:
 *
 *    - nombre        como se llama el paquete
 *    - precioDesde   precio de partida real (en quetzales)
 *    - capacidad     cuantas personas caben, si incluye lugar
 *    - descripcion   2 o 3 lineas concretas, sin adjetivos de relleno
 *    - incluye       la lista completa: jardin, mobiliario, comida, disco,
 *                    decoracion, letras 3D, mamparas, letreros...
 *    - personalizaciones  que se puede ajustar
 *    - notas         anticipacion para reservar, deposito, etc.
 *
 *  Las imagenes van en public/assets/img/eventos/ (ver el LEEME de esa
 *  carpeta). Mientras no exista la foto, la tarjeta muestra "Foto proximamente"
 *  sola, asi que no se rompe nada.
 *
 *  Lo que mas vende aqui es lo CONCRETO: el numero de personas y la lista de
 *  lo que incluye. "Un solo lugar: jardin, mobiliario, comida y disco" pesa
 *  mas que cualquier frase bonita.
 * ============================================================================
 */

const EVENTOS: Evento[] = [
  {
    // Fotos reales de tres fiestas distintas: Minions, Mario Bros y un 40
    // anos elegante. La galeria mezcla las cuatro celebraciones a proposito:
    // lo que se vende aqui es el RANGO de tematicas, no un montaje concreto.
    id: 'evt_cumpleanos',
    nombre: 'Cumpleaños temáticos',
    slug: 'cumpleanos',
    descripcion: 'Montamos el cumpleaños completo con la temática que elijas: desde Minions o Mario Bros para los niños, hasta montajes elegantes para adultos. Arco de globos, mampara, números iluminados y mobiliario vestido.',
    precioDesde: 0,          // PENDIENTE: precio de partida
    capacidad: 0,            // PENDIENTE: hasta cuántas personas
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
      'Mesas y sillas con mantelería',
      'CONFIRMAR: ¿la vajilla va incluida?',
    ],
    noIncluye: [
      'CONFIRMAR: comida y sonido — ¿se coordinan aparte?',
    ],
    personalizaciones: [
      'Temática a elección (Minions, Mario Bros, elegante para adultos...)',
      'Colores del montaje',
      'PENDIENTE: qué otras temáticas ya tienen armadas',
    ],
    notas: [
      'PENDIENTE: con cuántos días de anticipación se reserva',
    ],
  },
  {
    // Fotos reales: arco iluminado, globos morados y rosados, letras "15"
    // gigantes encendidas, montado en jardin de noche.
    id: 'evt_quinceanos',
    nombre: '15 años',
    slug: 'quinceanos',
    descripcion: 'Arco iluminado con globos en tus colores, letras de 15 gigantes encendidas y montaje completo. Lo armamos en jardín o en salón, y se ve espectacular de noche.',
    precioDesde: 0,          // PENDIENTE
    capacidad: 0,            // PENDIENTE
    imagenUrl: 'assets/img/eventos/quinceanos/1.jpg',
    galeria: [
      'assets/img/eventos/quinceanos/3.jpg',
      'assets/img/eventos/quinceanos/4.jpg',
      'assets/img/eventos/quinceanos/2.jpg',
    ],
    incluye: [
      'Arco iluminado con globos',
      'Letras de 15 iluminadas',
      'CONFIRMAR: mobiliario y mantelería',
    ],
    noIncluye: [
      'CONFIRMAR: comida y sonido',
    ],
    personalizaciones: [
      'Colores de los globos y del montaje',
      'PENDIENTE: qué más se puede ajustar',
    ],
  },
  {
    // Producto NUEVO. Fotos reales: camino de velas, alfombra roja, arco
    // floral iluminado y letrero de neon "Quieres casarte conmigo?".
    id: 'evt_pedida_mano',
    nombre: 'Pedida de mano',
    slug: 'pedida-de-mano',
    descripcion: 'Montaje íntimo para pedir matrimonio: camino de velas, alfombra, arco floral iluminado y letrero de neón. Preparamos todo para que solo tengas que llegar con ella.',
    precioDesde: 0,          // PENDIENTE
    imagenUrl: 'assets/img/eventos/pedida-de-mano/1.jpg',
    galeria: [
      'assets/img/eventos/pedida-de-mano/3.jpg',
      'assets/img/eventos/pedida-de-mano/2.jpg',
    ],
    incluye: [
      'Arco floral iluminado',
      'Camino de velas y alfombra',
      'Letrero de neón',
      'CONFIRMAR: ¿qué más lleva el montaje?',
    ],
    personalizaciones: [
      'Colores de las flores',
      'PENDIENTE: ¿el texto del letrero se puede cambiar?',
    ],
    notas: [
      'PENDIENTE: con cuántos días de anticipación se reserva',
    ],
  },
  {
    // CONFIRMAR: segun la duena, bodas lleva decoracion y mobiliario pero NO
    // sonido ni comida.
    id: 'evt_boda',
    nombre: 'Bodas',
    slug: 'boda',
    descripcion: 'Ambientación completa para la recepción: drapeado, alfombra, mobiliario vestido y señalización. Nos acoplamos al estilo y los colores de la boda.',
    precioDesde: 0,          // PENDIENTE
    capacidad: 0,            // PENDIENTE
    imagenUrl: 'assets/img/eventos/boda/1.jpg',
    galeria: [
      'assets/img/eventos/boda/2.jpg',
      'assets/img/eventos/boda/3.jpg',
      'assets/img/eventos/boda/4.jpg',
    ],
    incluye: [
      'Decoración y drapeado',
      'Mesas y sillas con mantelería',
      'CONFIRMAR: alfombra y cartel de bienvenida',
    ],
    noIncluye: [
      'Comida',
      'Sonido',
    ],
    personalizaciones: [
      'Colores y estilo',
      'PENDIENTE: qué más se puede ajustar',
    ],
  },
  {
    // Datos reales confirmados por la duena.
    id: 'evt_jardin_1',
    nombre: 'Jardín 1',
    slug: 'jardin-1',
    descripcion: 'Jardín para eventos de 100 a 150 personas, con área techada y grama. Incluye mobiliario, cocina, baño y refrigeradores para las bebidas, así que no hay que conseguir nada por aparte.',
    precioDesde: 0,          // PENDIENTE: precio de alquiler
    capacidad: 150,
    imagenUrl: 'assets/img/eventos/jardin-1/1.jpg',
    galeria: [
      'assets/img/eventos/jardin-1/2.jpg',
      'assets/img/eventos/jardin-1/3.jpg',
      'assets/img/eventos/jardin-1/4.jpg',
    ],
    incluye: [
      'Capacidad de 100 a 150 personas',
      'Mobiliario',
      'Cocina',
      'Baño',
      'Refrigeradores para bebidas',
    ],
    personalizaciones: [
      'PENDIENTE: qué se puede ajustar',
    ],
    notas: [
      'PENDIENTE: con cuántos días de anticipación se reserva',
    ],
  },
  {
    id: 'evt_graduacion',
    nombre: 'PENDIENTE: Graduaciones',
    slug: 'graduacion',
    descripcion: 'PENDIENTE: describir el montaje para promociones y grupos. Faltan fotos en assets/img/eventos/graduacion/',
    precioDesde: 0,          // PENDIENTE
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
    descripcion: 'PENDIENTE: describir el segundo jardín y en qué se diferencia del primero. Faltan fotos en assets/img/eventos/jardin-2/',
    precioDesde: 0,          // PENDIENTE
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
    descripcion: 'PENDIENTE: para quien ya tiene el lugar. Mencionar mamparas, letreros y letras 3D. Faltan fotos en assets/img/eventos/mobiliario/',
    precioDesde: 0,          // PENDIENTE
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
