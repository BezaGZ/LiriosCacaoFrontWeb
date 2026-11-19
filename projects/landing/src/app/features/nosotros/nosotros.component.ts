import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SeoService } from '../../core/seo/seo.service';
import { WhatsappService } from '../../core/whatsapp/whatsapp.service';
import { RevelarDirective } from '../../shared/directives/revelar.directive';
import { PortadaPaginaComponent } from '../../shared/components/portada-pagina/portada-pagina.component';
import { CierreComponent } from '../../shared/components/cierre/cierre.component';
import { NOSOTROS, NEGOCIO } from '../../contenido/sitio';

const RUTA = '/nosotros';

/**
 * Quienes somos.
 *
 * Es la unica pagina del sitio que es prosa de corrido, y esta bien que lo
 * sea: nadie llega aqui a comparar precios, llega a saber con quien esta
 * tratando. Por eso no lleva rejillas ni tarjetas, solo texto en una columna
 * angosta.
 */
@Component({
  selector: 'lc-nosotros',
  imports: [RevelarDirective, PortadaPaginaComponent, CierreComponent],
  templateUrl: './nosotros.component.html',
  styleUrl: './nosotros.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NosotrosComponent {
  private readonly seo = inject(SeoService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = NOSOTROS;
  protected readonly enlaceWhatsapp = this.whatsapp.enlace(
    'Hola, quisiera hacer una consulta.',
  );

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
   * AboutPage apuntando al negocio. No repite la direccion ni el telefono:
   * eso ya lo declara la portada como LocalBusiness, y decirlo dos veces con
   * dos tipos distintos no suma, confunde.
   */
  private schema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: this.c.seo.titulo,
      description: this.c.seo.descripcion,
      url: this.seo.urlAbsoluta(RUTA),
      mainEntity: {
        '@type': 'LocalBusiness',
        name: NEGOCIO.nombre,
        url: NEGOCIO.sitio,
        foundingDate: String(NEGOCIO.desde),
      },
    };
  }
}
