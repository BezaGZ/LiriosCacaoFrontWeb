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

  /** Quita un bloque, si esta. */
  private removeJsonLd(id: string): void {
    const previo = this.doc.getElementById(id);
    if (previo) {
      this.renderer.removeChild(this.doc.head, previo);
    }
  }

  /**
   * Borra los bloques que pertenecen a UNA pagina concreta.
   *
   * LocalBusiness y Organization describen al negocio y viven en todas; estos
   * no. Al navegar dentro del sitio sin recargar, el bloque de la pagina
   * anterior se quedaba en el head: el catalogo de chocofrutas seguia
   * declarado estando ya en /eventos. Cada pagina llama a esto antes de
   * insertar el suyo.
   */
  limpiarJsonLdDePagina(): void {
    ['ld-itemlist', 'ld-eventos'].forEach(id => this.removeJsonLd(id));
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

  /**
   * Datos estructurados de la pagina de eventos.
   *
   * Se usa Service y NO Event: en schema.org un Event es una fiesta concreta
   * con fecha, y esto es el servicio de organizarla. Marcarlo como Event
   * obligaria a inventar un startDate y Google lo descartaria igual.
   *
   * Los jardines si van aparte como EventVenue, que es lo que son, con su
   * capacidad real. Todo en un @graph para que sea un solo script.
   */
  insertEventosSchema(
    celebraciones: { nombre: string; descripcion: string; imagenUrl: string }[],
    lugares: { nombre: string; descripcion: string; imagenUrl: string; capacidad?: number; incluye: string[] }[]
  ): void {
    const negocio = {
      '@type': 'LocalBusiness',
      'name': 'Lirio y Cacao',
      'url': SITIO,
      'telephone': '+502-4582-7110',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Chiquimula',
        'addressRegion': 'Chiquimula',
        'addressCountry': 'GT'
      }
    };

    const servicio = {
      '@type': 'Service',
      '@id': `${SITIO}/eventos#servicio`,
      'name': 'Organización de eventos en Chiquimula',
      'serviceType': 'Organización de eventos',
      'description': 'Organizamos el evento completo en Chiquimula: jardín, mobiliario, decoración, comida, disco y sonido, letras 3D y mamparas. Bodas, 15 años, cumpleaños temáticos y pedidas de mano. Cada servicio se cotiza por separado.',
      'url': `${SITIO}/eventos`,
      'provider': negocio,
      'areaServed': {
        '@type': 'City',
        'name': 'Chiquimula',
        'addressCountry': 'GT'
      },
      'availableChannel': {
        '@type': 'ServiceChannel',
        'serviceUrl': `${SITIO}/eventos`,
        'servicePhone': '+502-4582-7110'
      },
      // Sin precios a proposito: no hay un "desde" honesto, y declarar un
      // precio falso en los datos estructurados es peor que no declarar nada.
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Eventos que organizamos',
        'itemListElement': celebraciones.map(c => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': c.nombre,
            'description': c.descripcion,
            'image': this.urlAbsoluta(c.imagenUrl),
            'provider': { '@id': `${SITIO}/eventos#servicio` }
          }
        }))
      }
    };

    const venues = lugares.map(l => ({
      '@type': 'EventVenue',
      '@id': `${SITIO}/eventos#${l.nombre.toLowerCase().replace(/\s+/g, '-')}`,
      'name': l.nombre,
      'description': l.descripcion,
      'image': this.urlAbsoluta(l.imagenUrl),
      ...(l.capacidad ? { 'maximumAttendeeCapacity': l.capacidad } : {}),
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Chiquimula',
        'addressRegion': 'Chiquimula',
        'addressCountry': 'GT'
      },
      'amenityFeature': l.incluye.map(cosa => ({
        '@type': 'LocationFeatureSpecification',
        'name': cosa,
        'value': true
      }))
    }));

    const migas = {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Inicio', 'item': SITIO },
        { '@type': 'ListItem', 'position': 2, 'name': 'Eventos', 'item': `${SITIO}/eventos` }
      ]
    };

    this.setJsonLd('ld-eventos', {
      '@context': 'https://schema.org',
      '@graph': [servicio, ...venues, migas]
    });
  }

  /** Las rutas del seed son relativas; en JSON-LD tienen que ser absolutas. */
  private urlAbsoluta(ruta: string): string {
    return ruta.startsWith('http') ? ruta : `${SITIO}/${ruta.replace(/^\//, '')}`;
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
