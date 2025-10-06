import {Component, inject} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {filter} from 'rxjs';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LiriosCacaoFrontend';
  private readonly router = inject(Router);

  constructor() {
    // --- PASO 2: Escucha los eventos de navegación del router de Angular ---
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {

      // --- PASO 3: Envía un evento 'page_view' a Google Analytics ---
      gtag('config', 'G-2JPZ2292XP', {
        'page_path': event.urlAfterRedirects
      });
    });
  }
}
