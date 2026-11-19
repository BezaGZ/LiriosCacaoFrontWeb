import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PortadaComponent } from './secciones/portada/portada.component';
import { DeclaracionComponent } from './secciones/declaracion/declaracion.component';
import { IncluimosComponent } from './secciones/incluimos/incluimos.component';
import { AppBandaComponent } from './secciones/app/app.component';
import { BandaComponent } from '../../shared/components/banda/banda.component';
import { SeoService } from '../../core/seo/seo.service';
import {
  FLORISTERIA,
  JARDIN,
  NEGOCIO,
  PORTADA,
  SERVICIOS,
} from '../../contenido/sitio';

/**
 * La portada del sitio.
 *
 * A proposito no tiene plantilla propia mas alla de una lista de secciones:
 * cada franja de la pagina es su propio componente, asi reordenarlas es mover
 * una linea y ninguna seccion sabe de las demas.
 */
@Component({
  selector: 'lc-inicio',
  imports: [
    PortadaComponent,
    DeclaracionComponent,
    BandaComponent,
    IncluimosComponent,
    AppBandaComponent,
  ],
  templateUrl: './inicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioComponent {
  private readonly seo = inject(SeoService);

  protected readonly floristeria = FLORISTERIA.banda;
  protected readonly eventos = SERVICIOS.banda;
  protected readonly jardin = JARDIN.banda;

  constructor() {
    this.seo.aplicar({
      titulo: 'Lirios y Cacao — Flores, chocofrutas y eventos en Chiquimula',
      descripcion:
        'Arreglos florales, chocofrutas y helados artesanales, y la ' +
        'producción completa de su evento con jardín propio. Chiquimula, ' +
        'Guatemala.',
      ruta: '/',
      imagen: PORTADA.foto.escritorio,
      jsonLd: this.schema(),
    });
  }

  private schema(): Record<string, unknown> {
    const d = NEGOCIO.direccion;

    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: NEGOCIO.nombre,
      description: NEGOCIO.descripcion,
      url: NEGOCIO.sitio,
      telephone: `+${NEGOCIO.whatsapp}`,
      foundingDate: String(NEGOCIO.desde),
      address: {
        '@type': 'PostalAddress',
        streetAddress: d.calle,
        addressLocality: d.ciudad,
        addressRegion: d.region,
        postalCode: d.codigoPostal,
        addressCountry: d.pais,
      },
      areaServed: { '@type': 'City', name: d.ciudad },
    };
  }
}
