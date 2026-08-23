import { Injectable, Inject, Renderer2, RendererFactory2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/** Dominio canonico del sitio. Sin barra final. */
export const SITIO = 'https://www.liriosycacao.com';

/**
 * Servicio de SEO tecnico: canonical y datos estructurados JSON-LD.
 *
 * IMPORTANTE: nada aqui puede depender del navegador.
 * El sitio se prerenderiza, y el HTML prerenderizado es justo lo que lee
 * el crawler de Google. Antes este servicio hacia `return` temprano si no
 * estaba en el navegador, con lo cual el JSON-LD no llegaba nunca a quien
 * tenia que leerlo. Por eso se usa DOCUMENT y Renderer2, que funcionan
 * igual en el servidor y en el navegador.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private renderer: Renderer2;

  constructor(
    rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private doc: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // ---------------------------------------------------------------- canonical

  /**
   * Fija la URL canonica de la pagina actual.
   *
   * Antes el canonical estaba escrito a mano en index.html apuntando al home,
   * asi que /productos y /sobrenosotros le decian a Google "en realidad soy
   * la portada" y podian quedar fuera del indice.
   *
   * @param ruta ruta absoluta del sitio, p.ej. '/productos?category=flor'
   */
  setCanonical(ruta: string): void {
    const href = `${SITIO}${ruta === '/' ? '/' : ruta}`;
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'rel', 'canonical');
      this.renderer.appendChild(this.doc.head, link);
    }

    this.renderer.setAttribute(link, 'href', href);
    this.setMetaPropiedad('og:url', href);
  }

  /** og:url debe acompanar al canonical, si no las previsualizaciones mienten. */
  private setMetaPropiedad(propiedad: string, contenido: string): void {
    let meta = this.doc.head.querySelector<HTMLMetaElement>(`meta[property="${propiedad}"]`);
    if (!meta) {
      meta = this.renderer.createElement('meta');
      this.renderer.setAttribute(meta, 'property', propiedad);
      this.renderer.appendChild(this.doc.head, meta);
    }
    this.renderer.setAttribute(meta, 'content', contenido);
  }

  // ------------------------------------------------------------------ JSON-LD

  /**
   * Inserta (o reemplaza) un bloque JSON-LD.
   *
   * Cada bloque lleva un id propio: el servidor ya dejo el script en el HTML,
   * y al hidratar el navegador volveria a insertarlo. Con el id se reemplaza
   * en vez de duplicarse.
   */
  private setJsonLd(id: string, datos: object): void {
    const previo = this.doc.getElementById(id);
    if (previo) {
      this.renderer.removeChild(this.doc.head, previo);
    }

    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'application/ld+json');
    this.renderer.setAttribute(script, 'id', id);
    script.text = JSON.stringify(datos);
    this.renderer.appendChild(this.doc.head, script);
  }

  insertLocalBusinessSchema(): void {
    this.setJsonLd('ld-localbusiness', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Lirio y Cacao',
      'description': 'Chocofrutas artesanales en Chiquimula: chocofresas, chocobananos, choco uvas. Florería con ramos de rosas, girasoles y fresas cubiertas de chocolate. Helados artesanales. Detalles para cumpleaños, bodas y 15 años. Entrega a domicilio.',
      'image': `${SITIO}/assets/img/logo.png`,
      'logo': `${SITIO}/assets/img/logo.png`,
      'url': SITIO,
      'telephone': '+502-4582-7110',
      'priceRange': '$$',
      'servesCuisine': 'Postres, Dulces, Chocolate',
      'paymentAccepted': 'Efectivo, Tarjeta, Transferencia',
      'currenciesAccepted': 'GTQ',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '2a Avenida & 5a Calle',
        'addressLocality': 'Chiquimula',
        'addressRegion': 'Chiquimula',
        'postalCode': '20001',
        'addressCountry': 'GT'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': 14.79906,
        'longitude': -89.5510
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          'opens': '09:00',
          'closes': '18:00'
        }
      ],
      'sameAs': [
        'https://www.facebook.com/Liriosycacao',
        'https://www.instagram.com/lirios_ycacao'
      ],
      'keywords': 'chocofrutas chiquimula, chocofresas, chocobananos, choco uvas, florería chiquimula, ramo de rosas, ramo de girasoles, helados artesanales, cumpleaños, bodas, 15 años, entrega domicilio'
    });
  }

  insertOrganizationSchema(): void {
    this.setJsonLd('ld-organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Lirio y Cacao',
      'url': SITIO,
      'logo': `${SITIO}/assets/img/logo.png`,
      'contactPoint': {
        '@type': 'ContactPoint',
        'telephone': '+502-4582-7110',
        'contactType': 'customer service',
        'areaServed': 'GT',
        'availableLanguage': 'Spanish'
      },
      'sameAs': [
        'https://www.facebook.com/Liriosycacao',
        'https://www.instagram.com/lirios_ycacao'
      ]
    });
  }

  /** Catalogo de productos de una categoria, como ItemList. */
  insertItemListSchema(nombre: string, productos: { title: string; price: number }[]): void {
    this.setJsonLd('ld-itemlist', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': nombre,
      'numberOfItems': productos.length,
      'itemListElement': productos.map((p, i) => ({
        '@type': 'ListItem',
        'position': i + 1,
        'item': {
          '@type': 'Product',
          'name': p.title,
          'brand': { '@type': 'Brand', 'name': 'Lirio y Cacao' },
          'offers': {
            '@type': 'Offer',
            'price': p.price,
            'priceCurrency': 'GTQ',
            'availability': 'https://schema.org/InStock'
          }
        }
      }))
    });
  }
}
