import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

import { SeoService } from '../../core/seo/seo.service';
import { WhatsappService } from '../../core/whatsapp/whatsapp.service';
import { FotoDirective } from '../../shared/directives/foto.directive';
import { RevelarDirective } from '../../shared/directives/revelar.directive';
import { PortadaPaginaComponent } from '../../shared/components/portada-pagina/portada-pagina.component';
import { TiraDatosComponent } from '../../shared/components/tira-datos/tira-datos.component';
import { CierreComponent } from '../../shared/components/cierre/cierre.component';
import { OcasionesComponent } from './ocasiones/ocasiones.component';
import { FLORISTERIA, NEGOCIO } from '../../contenido/sitio';

const RUTA = '/floristeria';

/**
 * La página de floristería.
 *
 * Es la página que más importa para búsquedas: de los clics que llegan al
 * sitio desde Google, la enorme mayoría vienen de "floristería chiquimula",
 * "flores chiquimula" y "arreglos florales chiquimula". Por eso el titular es
 * directo y sin adorno — lo poético vive en la portada, no aquí.
 */
@Component({
  selector: 'lc-floristeria',
  imports: [
    NgOptimizedImage,
    FotoDirective,
    RevelarDirective,
    PortadaPaginaComponent,
    TiraDatosComponent,
    OcasionesComponent,
    CierreComponent,
  ],
  templateUrl: './floristeria.component.html',
  styleUrl: './floristeria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FloristeriaComponent {
  private readonly seo = inject(SeoService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = FLORISTERIA.pagina;
  protected readonly enlaceWhatsapp = this.whatsapp.porFlores();

  /** El mensaje ya trae el nombre del arreglo: no hay nada que descifrar. */
  protected porArreglo(nombre: string): string {
    return this.whatsapp.porArreglo(nombre);
  }

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
   * schema.org/Florist. Es lo que le dice a Google que esto no es una página
   * cualquiera que menciona flores, sino una floristería con dirección en
   * Chiquimula.
   */
  private schema(): Record<string, unknown> {
    const d = NEGOCIO.direccion;

    return {
      '@context': 'https://schema.org',
      '@type': 'Florist',
      name: NEGOCIO.nombre,
      description: this.c.seo.descripcion,
      url: this.seo.urlAbsoluta(RUTA),
      image: this.seo.urlAbsoluta(`/${this.c.foto.src}`),
      telephone: `+${NEGOCIO.whatsapp}`,
      priceRange: 'Q100+',
      address: {
        '@type': 'PostalAddress',
        streetAddress: d.calle,
        addressLocality: d.ciudad,
        addressRegion: d.region,
        postalCode: d.codigoPostal,
        addressCountry: d.pais,
      },
      areaServed: { '@type': 'City', name: d.ciudad },
      makesOffer: this.c.queHacemos
        .filter((item) => ('esProducto' in item ? item.esProducto : true))
        .map((item) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Product', name: item.titulo },
        })),
    };
  }
}
