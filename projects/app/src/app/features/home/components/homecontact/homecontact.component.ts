import { Component } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {CommonModule} from '@angular/common';
import {WHATSAPP_LOCAL, whatsAppUrl, abrirWhatsApp} from '@core/config/contacto.config';

@Component({
  selector: 'app-homecontact',
  imports: [CommonModule, ButtonModule],
  templateUrl: './homecontact.component.html',
})
export class HomecontactComponent {
  readonly whatsappUrl = whatsAppUrl();
  readonly whatsappLocal = WHATSAPP_LOCAL;

  abrirFacebook()  { window.open('https://www.facebook.com/Liriosycacao', '_blank', 'noopener'); }
  abrirInstagram() { window.open('https://www.instagram.com/lirios_ycacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank', 'noopener'); }
  abrirWhatsapp()  { abrirWhatsApp(); }
}
