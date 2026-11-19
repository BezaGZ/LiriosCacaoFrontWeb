/**
 * Para qué se regala.
 *
 * Nadie busca "bouquet girasol floral": busca "algo para el cumpleaños de mi
 * mamá". Por eso la floristería se entra por ocasión y no por nombre de
 * producto.
 *
 * Esta lista es MÁS larga que la de la app, y no es descuido. Allá cada
 * ocasión filtra un catálogo, así que una sin productos devuelve una
 * cuadrícula vacía que se lee como "no tienen nada". Aquí cada ocasión es un
 * mensaje de WhatsApp ya escrito: no hay nada que pueda salir vacío, así que
 * sí entran Día del Padre y condolencias.
 */
export interface Ocasion {
  readonly id: string;
  readonly etiqueta: string;
  /** Cómo se escribe en el mensaje de WhatsApp. */
  readonly enMensaje: string;
  /** Texto de la fecha, solo si cae un día fijo del calendario. */
  readonly fecha?: string;
  /** Mes 1-12 y día, para poder calcular cuánto falta. */
  readonly mes?: number;
  readonly dia?: number;
}

export const OCASIONES: readonly Ocasion[] = [
  { id: 'cumpleanos', etiqueta: 'Cumpleaños', enMensaje: 'un cumpleaños' },
  { id: 'aniversario', etiqueta: 'Aniversario', enMensaje: 'un aniversario' },
  {
    id: 'carino',
    etiqueta: 'Día del Cariño',
    enMensaje: 'el Día del Cariño',
    fecha: '14 de febrero',
    mes: 2,
    dia: 14,
  },
  {
    id: 'madre',
    etiqueta: 'Día de la Madre',
    enMensaje: 'el Día de la Madre',
    fecha: '10 de mayo',
    mes: 5,
    dia: 10,
  },
  {
    id: 'amarillas',
    etiqueta: 'Flores amarillas',
    enMensaje: 'el día de las flores amarillas',
    fecha: '21 de septiembre',
    mes: 9,
    dia: 21,
  },
  {
    id: 'hombre',
    etiqueta: 'Día del Hombre',
    enMensaje: 'el Día del Hombre',
    fecha: '19 de noviembre',
    mes: 11,
    dia: 19,
  },
  {
    id: 'padre',
    etiqueta: 'Día del Padre',
    enMensaje: 'el Día del Padre',
    // En Guatemala es día fijo, no el tercer domingo como en otros países.
    fecha: '17 de junio',
    mes: 6,
    dia: 17,
  },
  { id: 'graduacion', etiqueta: 'Graduación', enMensaje: 'una graduación' },
  { id: 'condolencias', etiqueta: 'Condolencias', enMensaje: 'condolencias' },
  { id: 'porque-si', etiqueta: 'Solo porque sí', enMensaje: 'un detalle' },
];

/**
 * Qué ocasión del calendario viene en camino, si hay alguna.
 *
 * Recibe la fecha como parámetro en vez de llamar a new Date() adentro para
 * que se pueda probar: sin eso habría que esperar al 10 de mayo para saber si
 * funciona.
 *
 * Ojo con las fechas: se construyen con new Date(año, mes, día), que es hora
 * LOCAL. Usar cadenas ISO las interpreta como UTC y en Guatemala (UTC-6) el
 * día se corre uno hacia atrás.
 */
export function ocasionDeTemporada(hoy: Date, diasAntes = 21): Ocasion | null {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  let masCercana: Ocasion | null = null;
  let menorEspera = Infinity;

  for (const ocasion of OCASIONES) {
    if (!ocasion.mes || !ocasion.dia) continue;

    const faltan = diasPara(inicioHoy, ocasion);
    if (faltan < 0 || faltan > diasAntes) continue;

    // Si dos caen dentro de la ventana, manda la más próxima.
    if (faltan < menorEspera) {
      menorEspera = faltan;
      masCercana = ocasion;
    }
  }

  return masCercana;
}

/** Cuántos días faltan para una ocasión, contando desde hoy. */
export function diasPara(hoy: Date, ocasion: Ocasion): number {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const dia = new Date(inicioHoy.getFullYear(), (ocasion.mes ?? 1) - 1, ocasion.dia ?? 1);
  return Math.round((dia.getTime() - inicioHoy.getTime()) / 86_400_000);
}

/**
 * El aviso completo, ya redactado.
 *
 * Va junto y no en pedazos porque el día de la ocasión cambia la frase entera:
 * "Hoy es el Día del Cariño", no "Es hoy para el Día del Cariño".
 *
 * Usa `enMensaje`, que ya trae el artículo correcto. Sin eso saldría
 * "Hoy es el Flores amarillas".
 */
export function avisoDeTemporada(dias: number, ocasion: Ocasion): string {
  if (dias <= 0) return `Hoy es ${ocasion.enMensaje}`;
  if (dias === 1) return `Falta 1 día para ${ocasion.enMensaje}`;
  return `Faltan ${dias} días para ${ocasion.enMensaje}`;
}
