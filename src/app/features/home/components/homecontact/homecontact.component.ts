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
  abrirFacebook()  { window.open('https://www.facebook.com/Liriosycacao', '_blank'); }
  abrirInstagram() { window.open('https://www.instagram.com/lirios_ycacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank'); }
  abrirWhatsapp()  { window.open('https://wa.me/45827110', '_blank'); }
}
