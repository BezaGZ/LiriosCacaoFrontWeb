import { Component } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-homecontact',
  imports: [CommonModule, ButtonModule],
  templateUrl: './homecontact.component.html',
  styleUrl: './homecontact.component.scss'
})
export class HomecontactComponent {
  openWhatsAppContact() {
    window.open('https://wa.me/50247885552?text=Hola%2Ctengo%20una%20respecto%20a%20un%20producto', '_blank');
  }
}
