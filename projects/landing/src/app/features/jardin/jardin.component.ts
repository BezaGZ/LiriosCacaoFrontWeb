import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { SeoService } from '../../core/seo/seo.service';
import { WhatsappService } from '../../core/whatsapp/whatsapp.service';
import { FotoDirective } from '../../shared/directives/foto.directive';
import { RevelarDirective } from '../../shared/directives/revelar.directive';
import { PortadaPaginaComponent } from '../../shared/components/portada-pagina/portada-pagina.component';
import { TiraDatosComponent } from '../../shared/components/tira-datos/tira-datos.component';
import { CierreComponent } from '../../shared/components/cierre/cierre.component';
import { JARDIN, NEGOCIO } from '../../contenido/sitio';

const RUTA = '/jardin';

/**
 * La pagina del jardin.
 *
 * El argumento de venta no es el lugar, es que el lugar es NUESTRO: no hay
 * intermediario que recargue el precio ni que tarde dias en confirmar una
 * fecha. Por eso eso es lo que dice el cierre.
 */
@Component({
  selector: 'lc-jardin',
  imports: [
    NgOptimizedImage,
    FotoDirective,
    RevelarDirective,
    PortadaPaginaComponent,
    TiraDatosComponent,
    CierreComponent,
  ],
  templateUrl: './jardin.component.html',
  styleUrl: './jardin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JardinComponent {
  private readonly seo = inject(SeoService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = JARDIN;
  protected readonly enlaceWhatsapp = this.whatsapp.porJardin();

  constructor() {
    this.seo.aplicar({
      titulo: this.c.seo.titulo,
      descripcion: this.c.seo.descripcion,
      ruta: RUTA,
      imagen: this.c.foto.src,
      jsonLd: this.schema(),
    });
  }

  /**
   * schema.org/EventVenue. Es el tipo que entiende Google para un lugar donde
   * se celebran eventos, y el que permite declarar el aforo.
   */
  private schema(): Record<string, unknown> {
    const d = NEGOCIO.direccion;

    return {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: `Jardín de ${NEGOCIO.nombre}`,
      description: this.c.seo.descripcion,
      url: this.seo.urlAbsoluta(RUTA),
      image: this.seo.urlAbsoluta(`/${this.c.foto.src}`),
      telephone: `+${NEGOCIO.whatsapp}`,
      maximumAttendeeCapacity: 150,
      address: {
        '@type': 'PostalAddress',
        streetAddress: d.calle,
        addressLocality: d.ciudad,
        addressRegion: d.region,
        postalCode: d.codigoPostal,
        addressCountry: d.pais,
      },
      amenityFeature: this.c.incluye.cosas.map((cosa) => ({
        '@type': 'LocationFeatureSpecification',
        name: cosa.titulo,
        value: true,
      })),
    };
  }
}
