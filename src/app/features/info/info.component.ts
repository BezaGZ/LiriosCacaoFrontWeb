import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {

  // Inyectamos los servicios de SEO ---
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);

  // ngOnInit para establecer el título y la descripción ---
  ngOnInit(): void {
    this.titleService.setTitle('Nuestra Historia y Ubicación en Chiquimula | Lirio & Cacao');

    this.metaService.updateTag({
      name: 'description',
      content: 'Descubre la historia detrás de Lirio & Cacao. Somos un emprendimiento en Chiquimula dedicado a crear detalles únicos. ¡Visítanos o contáctanos para tu próximo evento!'
    });
  }

  abrirGoogleMaps() {
    window.open('https://maps.app.goo.gl/h1suD9xCUgU5LmKs7', '_blank');
  }

  abrirWaze() {
    window.open('https://waze.com/ul?ll=14.79906,-89.55100&navigate=yes', '_blank');
  }

  abrirFacebook() {
    window.open('https://www.facebook.com/Liriosycacao', '_blank');
  }

  abrirInstagram() {
    window.open('https://www.instagram.com/lirios_ycacao?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', '_blank');
  }

  abrirWhatsapp() {
    window.open('https://wa.me/45827110', '_blank');
  }
}
