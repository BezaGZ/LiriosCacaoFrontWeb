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
    this.titleService.setTitle('Sobre Nosotros - Chocofrutas, Florería y Helados en Chiquimula | Lirio & Cacao');

    this.metaService.updateTag({
      name: 'description',
      content: 'Conoce Lirio & Cacao, tu tienda de chocofrutas artesanales, florería y helados en Chiquimula. Especialistas en chocofresas, chocobananos, ramos de rosas y detalles para cumpleaños, bodas y 15 años. ¡Visítanos o contáctanos!'
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
