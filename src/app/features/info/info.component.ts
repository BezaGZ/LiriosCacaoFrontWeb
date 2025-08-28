import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {GoogleMapsModule} from '@angular/google-maps';
import {CardModule} from 'primeng/card';
import {Button, ButtonModule} from 'primeng/button';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule,
    GoogleMapsModule,
    CardModule, ButtonModule ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  abrirGoogleMaps() {

    window.open('https://maps.app.goo.gl/h1suD9xCUgU5LmKs7', '_blank');
  }

  abrirWaze() {
    window.open('https://waze.com/ul?ll=14.79906,-89.55100&navigate=yes', '_blank');
  }

  abrirFacebook() {
    window.open('https://www.facebook.com/DulcesMomentosChiqui', '_blank');
  }
  abrirInstagram() {
    window.open('https://www.instagram.com/lirios_ycacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank');
  }
  abrirWhatsapp() {
    window.open('https://wa.me/45827110', '_blank');
  }
}
