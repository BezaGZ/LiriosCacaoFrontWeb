import { Injectable, Inject, PLATFORM_ID, Renderer2, RendererFactory2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private renderer: Renderer2;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  /**
   * Inserta JSON-LD Schema.org para LocalBusiness
   */
  insertLocalBusinessSchema(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Solo ejecutar en el navegador
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Lirio y Cacao',
      'description': 'Chocofrutas artesanales en Chiquimula: chocofresas, chocobananos, choco uvas. Florería con ramos de rosas, girasoles y fresas cubiertas de chocolate. Helados artesanales. Detalles para cumpleaños, bodas y 15 años. Entrega a domicilio.',
      'image': 'https://www.liriosycacao.com/assets/img/logo.png',
      'logo': 'https://www.liriosycacao.com/assets/img/logo.png',
      'url': 'https://www.liriosycacao.com',
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
    this.renderer.appendChild(document.head, script);
  }

  /**
   * Inserta JSON-LD Schema.org para Organization
   */
  insertOrganizationSchema(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Lirio y Cacao',
      'url': 'https://www.liriosycacao.com',
      'logo': 'https://www.liriosycacao.com/assets/img/logo.png',
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
    this.renderer.appendChild(document.head, script);
  }

  /**
   * Inserta JSON-LD Schema.org para Product
   */
  insertProductSchema(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
  }): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const script = this.renderer.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'description': product.description,
      'image': product.image,
      'category': product.category,
      'brand': {
        '@type': 'Brand',
        'name': 'Lirio y Cacao'
      },
      'offers': {
        '@type': 'Offer',
        'price': product.price,
        'priceCurrency': 'GTQ',
        'availability': 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': 'Lirio y Cacao'
        }
      }
    });
    this.renderer.appendChild(document.head, script);
  }

  /**
   * Limpia todos los scripts JSON-LD del head
   */
  clearJsonLdScripts(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    scripts.forEach(script => script.remove());
  }
}
