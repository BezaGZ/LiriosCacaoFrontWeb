import { Component, inject, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { SeoService } from '@core/services/seo.service';

declare let gtag: Function;

const GA_ID = 'G-62TQQY5JLX';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    // Datos estructurados del negocio: se insertan una sola vez y valen para
    // todo el sitio, asi cada pagina prerenderizada los lleva. Antes vivian en
    // el componente Home, con lo cual /productos y /sobrenosotros no los tenian.
    this.seo.insertLocalBusinessSchema();
    this.seo.insertOrganizationSchema();

    // El canonical se actualiza en CADA navegacion, tambien durante el
    // prerender. No va dentro de isPlatformBrowser a proposito: si no corre en
    // el servidor, el HTML que lee Google se queda con el canonical del home.
    this.actualizarCanonical();
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => {
        this.actualizarCanonical();
        this.registrarPagina(e.urlAfterRedirects);
      });
  }

  /**
   * Construye la URL canonica a partir de la ruta actual.
   *
   * Solo se conserva el parametro `category`, porque cada categoria es una
   * pagina propia y esta en el sitemap. `search` y cualquier parametro de
   * campana se descartan: no deben generar URLs indexables distintas.
   */
  private actualizarCanonical(): void {
    const arbol = this.router.parseUrl(this.router.url);
    const ruta = '/' + (arbol.root.children['primary']?.segments ?? [])
      .map(s => s.path)
      .join('/');

    const categoria = arbol.queryParams['category'];
    this.seo.setCanonical(categoria ? `${ruta}?category=${categoria}` : ruta);
  }

  private registrarPagina(url: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // Un bloqueador de anuncios impide que cargue gtag.js. Sin esta guarda,
    // cada navegacion lanzaba "gtag is not defined".
    if (typeof gtag !== 'function') return;
    gtag('config', GA_ID, { page_path: url });
  }
}
