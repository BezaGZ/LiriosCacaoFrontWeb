import { DOCUMENT } from '@angular/common';
import { Injectable, RendererFactory2, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { NEGOCIO } from '../../contenido/sitio';

export interface DatosSeo {
  /** Lo que sale en la pestaña y en el resultado de Google. */
  readonly titulo: string;
  /** El párrafo bajo el título en los resultados. Entre 120 y 160 caracteres. */
  readonly descripcion: string;
  /** Ruta sin dominio, empezando con barra: '/floristeria'. */
  readonly ruta: string;
  /** Imagen para las previsualizaciones al compartir, relativa a la raíz. */
  readonly imagen?: string;
  /** Datos estructurados de schema.org, si la página los lleva. */
  readonly jsonLd?: Record<string, unknown>;
}

/**
 * SEO técnico de la landing.
 *
 * Corre también en el servidor, que es lo que importa: cuando Google pide la
 * página, el título, la descripción y el canonical ya vienen en el HTML. Si
 * esto solo corriera en el navegador, el buscador vería la página vacía.
 *
 * El canonical se arma SIEMPRE desde el dominio del sitio, nunca desde dónde
 * está corriendo. Así, si la misma página se sirve en otro dominio, sigue
 * diciendo cuál es la buena.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly doc = inject(DOCUMENT);
  private readonly titulo = inject(Title);
  private readonly meta = inject(Meta);
  private readonly render = inject(RendererFactory2).createRenderer(null, null);

  private static readonly ID_JSONLD = 'lc-jsonld';

  aplicar(datos: DatosSeo): void {
    const url = this.urlAbsoluta(datos.ruta);

    this.titulo.setTitle(datos.titulo);
    this.meta.updateTag({ name: 'description', content: datos.descripcion });

    this.canonical(url);
    this.social(datos, url);
    this.datosEstructurados(datos.jsonLd);
  }

  /** `/floristeria` → `https://www.liriosycacao.com/floristeria` */
  urlAbsoluta(ruta: string): string {
    const limpia = ruta === '/' ? '' : ruta.replace(/\/+$/, '');
    return `${NEGOCIO.sitio}${limpia.startsWith('/') || limpia === '' ? limpia : `/${limpia}`}`;
  }

  private canonical(url: string): void {
    const cabeza = this.doc.head;
    let etiqueta = cabeza.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!etiqueta) {
      etiqueta = this.render.createElement('link') as HTMLLinkElement;
      this.render.setAttribute(etiqueta, 'rel', 'canonical');
      this.render.appendChild(cabeza, etiqueta);
    }

    this.render.setAttribute(etiqueta, 'href', url);
  }

  private social(datos: DatosSeo, url: string): void {
    const imagen = datos.imagen ? this.urlAbsoluta(`/${datos.imagen}`) : undefined;

    // og:url debe acompañar al canonical: si no, las previsualizaciones de
    // WhatsApp y Facebook apuntan a otra parte que la que Google indexa.
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: NEGOCIO.nombre });
    this.meta.updateTag({ property: 'og:locale', content: 'es_GT' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:title', content: datos.titulo });
    this.meta.updateTag({ property: 'og:description', content: datos.descripcion });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });

    if (imagen) {
      this.meta.updateTag({ property: 'og:image', content: imagen });
    } else {
      this.meta.removeTag('property="og:image"');
    }
  }

  private datosEstructurados(datos?: Record<string, unknown>): void {
    // Siempre se quita el anterior primero: al navegar entre páginas, dos
    // bloques de datos estructurados contradiciéndose es peor que ninguno.
    const previo = this.doc.getElementById(SeoService.ID_JSONLD);
    if (previo) this.render.removeChild(previo.parentNode, previo);

    if (!datos) return;

    const script = this.render.createElement('script') as HTMLScriptElement;
    this.render.setAttribute(script, 'type', 'application/ld+json');
    this.render.setAttribute(script, 'id', SeoService.ID_JSONLD);
    this.render.setProperty(script, 'textContent', JSON.stringify(datos));
    this.render.appendChild(this.doc.head, script);
  }
}
