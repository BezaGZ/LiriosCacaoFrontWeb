import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { SeoService } from '../../core/seo/seo.service';
import { WhatsappService } from '../../core/whatsapp/whatsapp.service';
import { FotoDirective } from '../../shared/directives/foto.directive';
import { RevelarDirective } from '../../shared/directives/revelar.directive';
import { PortadaPaginaComponent } from '../../shared/components/portada-pagina/portada-pagina.component';
import { TiraDatosComponent } from '../../shared/components/tira-datos/tira-datos.component';
import { ConsultaJardinComponent } from './consulta/consulta.component';
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
    ConsultaJardinComponent,
  ],
  templateUrl: './jardin.component.html',
  styleUrl: './jardin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JardinComponent {
  private readonly seo = inject(SeoService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = JARDIN;

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
  /**
   * El jardin como lugar, con SU direccion y no la de la sede.
   *
   * Hasta antes de esto publicaba la calle de la floristeria, que esta a dos
   * kilometros: para una busqueda de salones eso es decirle a Google que el
   * salon queda en la tienda de flores. Va el nombre con el que existe en el
   * mapa, las coordenadas y el enlace a la ficha, que es lo que permite
   * emparejar esta pagina con ese lugar.
   */
  private schema(): Record<string, unknown> {
    const d = NEGOCIO.direccion;
    const j = NEGOCIO.jardin;

    return {
      '@context': 'https://schema.org',
      '@type': 'EventVenue',
      name: j.nombre,
      description: this.c.seo.descripcion,
      url: this.seo.urlAbsoluta(RUTA),
      image: this.seo.urlAbsoluta(`/${this.c.foto.src}`),
      telephone: `+${NEGOCIO.whatsapp}`,
      maximumAttendeeCapacity: 150,
      hasMap: j.mapa,
      geo: {
        '@type': 'GeoCoordinates',
        latitude: j.geo.lat,
        longitude: j.geo.lng,
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: j.plusCode,
        addressLocality: j.ciudad,
        addressRegion: d.region,
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
