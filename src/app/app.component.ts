import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';


declare let gtag: Function;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  private readonly router = inject(Router);

  constructor(

    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      this.router.events.pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {

        gtag('config', 'G-62TQQY5JLX', {
          'page_path': event.urlAfterRedirects
        });
      });
    }
  }
}
