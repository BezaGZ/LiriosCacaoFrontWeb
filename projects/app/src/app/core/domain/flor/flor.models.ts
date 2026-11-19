import { Id } from '../base.models';

/**
 * Para que se regala. Es lo que ordena la pagina /floristeria.
 *
 * Nadie busca "bouquet girasol floral": busca "algo para el cumpleanos de mi
 * mama". Por eso el catalogo de flores se entra por ocasion y no por nombre
 * de producto.
 *
 * Las que son un dia fijo del calendario llevan su fecha en OCASIONES. Esas
 * son las que mas valen: el 10 de mayo y el 14 de febrero concentran mas
 * venta que meses enteros, y sin una pagina donde aterrizar esa busqueda no
 * hay donde recibir ese trafico.
 */
export type Ocasion =
  | 'cumpleanos'
  | 'aniversario'
  | 'carino'      // 14 de febrero
  | 'madre'       // 10 de mayo
  | 'amarillas'   // 21 de septiembre
  | 'graduacion'
  | 'porque-si';

export interface OcasionInfo {
  id: Ocasion;
  etiqueta: string;
  /** Texto para mostrar, solo si la ocasion es un dia fijo del calendario. */
  fecha?: string;
  /** Mes 1-12 y dia, para poder calcular cuanto falta. */
  mes?: number;
  dia?: number;
}

/*
 * NO esta el Dia del Padre (17 de junio), y no es un olvido.
 *
 * Ninguno de los arreglos actuales se lee como regalo para papa: todo es
 * girasoles, rosas y fresas. Poner el filtro devolveria cero resultados, y
 * una cuadricula vacia se lee como "no tienen nada". Lo mismo con
 * condolencias: el catalogo entero es color y celebracion.
 *
 * Las dos son oportunidades de producto, no filtros que falten.
 */
export const OCASIONES: OcasionInfo[] = [
  { id: 'cumpleanos',  etiqueta: 'Cumpleaños' },
  { id: 'aniversario', etiqueta: 'Aniversario' },
  { id: 'carino',    etiqueta: 'Día del Cariño',   fecha: '14 de febrero',   mes: 2, dia: 14 },
  { id: 'madre',     etiqueta: 'Día de la Madre',  fecha: '10 de mayo',      mes: 5, dia: 10 },
  { id: 'amarillas', etiqueta: 'Flores amarillas', fecha: '21 de septiembre', mes: 9, dia: 21 },
  { id: 'graduacion',  etiqueta: 'Graduación' },
  { id: 'porque-si',   etiqueta: 'Solo porque sí' },
];

/**
 * Familia de producto. Separa la floristeria clasica de lo que de verdad
 * diferencia al negocio: las fresas con chocolate, que una floristeria normal
 * de Chiquimula no tiene.
 */
export type FamiliaFlor = 'flor' | 'fresas' | 'pasteleria';

export interface Flor {
  id: Id;
  nombre: string;
  slug: string;
  familia: FamiliaFlor;
  ocasiones: Ocasion[];
  descripcion: string;
  precio: number;
  imagenUrl: string;
  incluye: string[];
  personalizaciones: string[];
  notas?: string[];
  /** true mientras falten foto o precio reales: no se muestra al publico. */
  borrador?: boolean;
}

export interface CatalogoFlores {
  flores: Flor[];
}


/**
 * Que ocasion del calendario esta cerca, si hay alguna.
 *
 * Recibe la fecha como parametro en vez de llamar a new Date() adentro para
 * que se pueda probar: sin eso habria que esperar al 10 de mayo para saber
 * si funciona.
 *
 * Ojo con las fechas: se construyen con new Date(anio, mes, dia), que es hora
 * LOCAL. Usar cadenas ISO las interpreta como UTC y en Guatemala (UTC-6) el
 * dia se corre uno hacia atras.
 *
 * @param hoy       fecha actual
 * @param diasAntes con cuanta anticipacion empieza a avisar
 */
export function ocasionDeTemporada(hoy: Date, diasAntes = 21): OcasionInfo | null {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());

  for (const ocasion of OCASIONES) {
    if (!ocasion.mes || !ocasion.dia) continue;

    const dia = new Date(inicioHoy.getFullYear(), ocasion.mes - 1, ocasion.dia);
    const faltan = Math.round((dia.getTime() - inicioHoy.getTime()) / 86_400_000);

    if (faltan >= 0 && faltan <= diasAntes) {
      return ocasion;
    }
  }

  return null;
}

/** Cuantos dias faltan para una ocasion, contando desde hoy. */
export function diasPara(hoy: Date, ocasion: OcasionInfo): number {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const dia = new Date(inicioHoy.getFullYear(), (ocasion.mes ?? 1) - 1, ocasion.dia ?? 1);
  return Math.round((dia.getTime() - inicioHoy.getTime()) / 86_400_000);
}
