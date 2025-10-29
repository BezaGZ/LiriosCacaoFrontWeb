import { Component, Renderer2, ViewChild, Inject, PLATFORM_ID } from '@angular/core'; // <-- 1. Modifica imports
import { CommonModule, isPlatformBrowser } from '@angular/common'; // <-- 1. Modifica imports
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from '../app.topbar/app.topbar';
import { AppFooter } from '../app.footer/app.footer';
import { LayoutService } from '../../service/layout.service';
import { ToastModule } from 'primeng/toast';
import { CartConfirmationService } from '@features/cart/cart-confirmation.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, AppTopbar, RouterModule, AppFooter, ToastModule, ButtonModule],
  templateUrl: './app.layout.html',
})
export class AppLayout {
  overlayMenuOpenSubscription: Subscription;
  readonly cartConfirmation: CartConfirmationService;
  menuOutsideClickListener: any;

  @ViewChild(AppTopbar) appTopBar!: AppTopbar;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router,
    private cartConfirmationService: CartConfirmationService,
    // --- 2. Inyecta PLATFORM_ID ---
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cartConfirmation = this.cartConfirmationService;
    // --- 3. Protege toda la lógica que depende del navegador ---
    if (isPlatformBrowser(this.platformId)) {
      this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
        if (!this.menuOutsideClickListener) {
          // El 'renderer' que escucha clics en 'document' solo debe existir en el navegador
          this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
            if (this.isOutsideClicked(event)) {
              this.hideMenu();
            }
          });
        }

        if (this.layoutService.layoutState().staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      });
    } else {
      // En el servidor, creamos una suscripción vacía para evitar errores
      this.overlayMenuOpenSubscription = Subscription.EMPTY;
    }

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.hideMenu();
    });
  }

  // --- 4. Protege los métodos que manipulan el DOM ---
  blockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (document.body.classList) {
        document.body.classList.add('blocked-scroll');
      } else {
        document.body.className += ' blocked-scroll';
      }
    }
  }

  unblockBodyScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (document.body.classList) {
        document.body.classList.remove('blocked-scroll');
      } else {
        document.body.className = document.body.className.replace(
          new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'),
          ' '
        );
      }
    }
  }

  get containerClass() {
    return {
      'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
      'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.layoutState().staticMenuDesktopInactive &&
        this.layoutService.layoutConfig().menuMode === 'static',
      'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
      'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive,
    };
  }


  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }

  // --- 5. Protege el método que lee el DOM ---
  isOutsideClicked(event: MouseEvent): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const sidebarEl = document.querySelector('.layout-sidebar');
      const topbarEl = document.querySelector('.layout-menu-button');
      const configuratorEl = document.querySelector('.layout-config-menu');
      const profileMenuEl = document.querySelector('.layout-topbar-menu');
      const eventTarget = event.target as Node;

      return !(
        sidebarEl?.contains(eventTarget) ||
        topbarEl?.contains(eventTarget) ||
        configuratorEl?.contains(eventTarget) ||
        profileMenuEl?.contains(eventTarget)
      );
    }

    return false;
  }

  hideMenu() {
    this.layoutService.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    this.layoutService.closeAllMenus();

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }
    this.unblockBodyScroll();
  }
}

