import { Component, inject, Inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {Router, RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../../service/layout.service';
import { MenuModule } from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MenubarModule } from 'primeng/menubar';
import {DialogModule} from 'primeng/dialog';
// import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    MenuModule,
    ButtonModule,
    DividerModule,
    MenubarModule,
    DialogModule
  ],
  templateUrl: './app.topbar.html',
})
export class AppTopbar {
  readonly router = inject(Router);

  cartItemCount = 3;

  mostrarCantidadCarrito(): string {
    return this.cartItemCount > 99 ? '99+' : this.cartItemCount.toString();
  }

  irInicio() {
    this.router.navigate(['/']);
  }

  animate(event: Event) {
    const el = event.currentTarget as HTMLElement;
    el.classList.add('animate-bounce');
    setTimeout(() => el.classList.remove('animate-bounce'), 500);
  }
}
