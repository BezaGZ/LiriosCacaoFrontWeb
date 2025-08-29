import { Component } from '@angular/core';
import {Button, ButtonModule} from 'primeng/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-homewelcome',
  imports: [
    ButtonModule
  ],
  templateUrl: './homewelcome.component.html',
  styleUrl: './homewelcome.component.scss'
})
export class HomewelcomeComponent {
  constructor(private router: Router) {}

  irSobreNosotros() {
    this.router.navigate(['/sobrenosotros']);
  }
}
