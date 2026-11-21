/**
 * La costura de la migracion.
 *
 * Este archivo es el motivo por el que pasar a backend o a Excel no va a ser
 * una reescritura: la aplicacion nunca importa `CATALOGO` directamente, pide
 * `FuenteCatalogo`. El dia que exista el backend se cambia UN proveedor en
 * `app.config.ts` y no se toca una sola pantalla.
 *
 * Es asincrono desde hoy aunque los datos esten quemados y la respuesta sea
 * inmediata. Si fuera sincrono ahora, el dia del backend habria que volver
 * asincrona cada pantalla que lo usa, y ese es justo el trabajo que esta
 * costura existe para evitar.
 */

import { Injectable, InjectionToken } from '@angular/core';
import { Catalogo } from './catalogo.models';
import { CATALOGO } from './catalogo.datos';

/** Lo unico que la aplicacion conoce. De donde salgan los datos es su problema. */
export interface FuenteCatalogo {
  obtener(): Promise<Catalogo>;
}

export const FUENTE_CATALOGO = new InjectionToken<FuenteCatalogo>('FUENTE_CATALOGO');

/**
 * Hoy: los datos de `catalogo.datos.ts`, sin red.
 *
 * Guarda la promesa para no rehacer el trabajo en cada pantalla, igual que
 * hara la version con backend cuando le toque cachear.
 */
@Injectable({ providedIn: 'root' })
export class FuenteCatalogoQuemada implements FuenteCatalogo {
  private readonly cache = Promise.resolve(CATALOGO);

  obtener(): Promise<Catalogo> {
    return this.cache;
  }
}

/*
 * Manana, cuando exista el backend o el Excel publicado como JSON, esto es
 * TODO lo que hay que escribir. El resto de la aplicacion no se entera.
 *
 * @Injectable({ providedIn: 'root' })
 * export class FuenteCatalogoHttp implements FuenteCatalogo {
 *   private readonly http = inject(HttpClient);
 *   private cache: Promise<Catalogo> | null = null;
 *
 *   obtener(): Promise<Catalogo> {
 *     this.cache ??= firstValueFrom(this.http.get<Catalogo>('/api/catalogo'));
 *     return this.cache;
 *   }
 * }
 *
 * Y en app.config.ts:
 *   { provide: FUENTE_CATALOGO, useExisting: FuenteCatalogoHttp }
 */

/** El proveedor de hoy. Va en los `providers` de app.config.ts. */
export const PROVEEDOR_CATALOGO_QUEMADO = {
  provide: FUENTE_CATALOGO,
  useExisting: FuenteCatalogoQuemada,
};
