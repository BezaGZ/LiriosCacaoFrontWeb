import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgOptimizedImage, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FotoDirective } from '../../shared/directives/foto.directive';
import { RevelarDirective } from '../../shared/directives/revelar.directive';
import { SeoService } from '../../core/seo/seo.service';
import { WhatsappService } from '../../core/whatsapp/whatsapp.service';
import { PortadaPaginaComponent } from '../../shared/components/portada-pagina/portada-pagina.component';
import { CierreComponent } from '../../shared/components/cierre/cierre.component';
import { SERVICIOS, NEGOCIO } from '../../contenido/sitio';

const RUTA = '/servicios';

/**
 * La pagina de eventos.
 *
 * Es un mosaico y casi nada de texto a proposito: lo que vende un montaje es
 * ver uno, no leer la lista de lo que incluye. La explicacion va en el cierre,
 * cuando el visitante ya vio de que se trata.
 */
@Component({
  selector: 'lc-servicios',
  imports: [
    NgOptimizedImage,
    NgTemplateOutlet,
    RouterLink,
    FotoDirective,
    RevelarDirective,
    PortadaPaginaComponent,
    CierreComponent,
  ],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiciosComponent {
  private readonly seo = inject(SeoService);
  private readonly whatsapp = inject(WhatsappService);

  protected readonly c = SERVICIOS;
  protected readonly enlaceWhatsapp = this.whatsapp.porEvento();

  /** Los tres escenarios, cada uno con su enlace de WhatsApp ya armado. */
  protected readonly formatos = this.c.escenarios.formatos.map((f) => ({
    ...f,
    destacado: !!f.etiqueta,
    enlace: this.whatsapp.porFormatoDeEvento(f.titulo, f.capacidad),
  }));

  /**
   * Las teselas, ya resueltas a un solo tipo.
   *
   * En el contenido unas traen ruta y otras ocasion, nunca las dos: si un
   * servicio tiene pagina propia, mandar a WhatsApp se salta la informacion.
   * Aqui se normalizan para que la plantilla no tenga que preguntar por la
   * forma de cada una.
   */
  protected readonly teselas = this.c.mosaico.map((tesela) => ({
    titulo: tesela.titulo,
    texto: tesela.texto,
    foto: tesela.foto,
    ruta: 'ruta' in tesela ? tesela.ruta : undefined,
    enlace: 'ruta' in tesela ? '' : this.whatsapp.porEvento(tesela.ocasion),
  }));

  constructor() {
    this.seo.aplicar({
      titulo: this.c.seo.titulo,
      descripcion: this.c.seo.descripcion,
      ruta: RUTA,
      imagen: this.c.foto.src,
      jsonLd: this.schema(),
    });
  }

  private schema(): Record<string, unknown> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Montaje y producción de eventos',
      provider: { '@type': 'LocalBusiness', name: NEGOCIO.nombre },
      areaServed: { '@type': 'City', name: NEGOCIO.direccion.ciudad },
      url: this.seo.urlAbsoluta(RUTA),
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Eventos',
        itemListElement: this.c.mosaico.map((tesela) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: tesela.titulo },
        })),
      },
    };
  }
}
