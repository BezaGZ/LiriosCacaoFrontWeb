import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Servicio {
  titulo: string;
  descripcion: string;
  /** Lo concreto: es el dato que convence, no el adjetivo. */
  dato: string;
  imagenUrl: string;
  /** alt real: estas fotos comunican, no son decoracion. */
  alt: string;
  ruta: string;
  enlace: string;
}

/**
 * Las tres cosas que hace el negocio, con foto.
 *
 * Existe porque el sitio no decia en ningun lado lo que el negocio ES. La
 * portada saltaba directo a las categorias -- cuatro tarjetas de texto que
 * sirven para navegar, no para explicar -- y alguien que caia aqui no tenia
 * como saber que ademas de chocofrutas se organizan eventos completos con
 * jardin propio.
 *
 * Va en ese orden a proposito: es una escalera. De un ramo de Q130 al evento
 * entero, y al final el jardin, que es lo unico que la competencia no tiene.
 */
@Component({
  selector: 'app-homeservicios',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './homeservicios.component.html',
  styleUrl: './homeservicios.component.scss',
})
export class HomeserviciosComponent {
  readonly servicios: Servicio[] = [
    {
      titulo: 'Arreglos florales',
      descripcion: 'Ramos, cajitas y bouquets de fresas cubiertas de chocolate. Vos elegís los colores y la dedicatoria.',
      dato: 'Desde Q130',
      imagenUrl: 'assets/img/flores/bouquetgirasolfloral.PNG',
      alt: 'Bouquet de girasoles y rosas rosadas con envoltura coreana',
      ruta: '/floristeria',
      enlace: 'Ver arreglos',
    },
    {
      titulo: 'Eventos completos',
      descripcion: 'Cumpleaños temáticos, 15 años, bodas y pedidas de mano. Mobiliario, decoración, comida y sonido.',
      dato: 'Nos acoplamos a lo que necesites',
      imagenUrl: 'assets/img/eventos/boda/1.jpg',
      alt: 'Recepción de boda con techo drapeado en tela blanca y alfombra roja',
      ruta: '/eventos',
      enlace: 'Ver eventos',
    },
    {
      titulo: 'Nuestros jardines',
      descripcion: 'Lugar propio para tu celebración, con mobiliario, cocina, baño y refrigeradores incluidos.',
      dato: 'Hasta 150 personas',
      // La 4 y no la 1: la 1 es el patio empedrado vacio, la mas floja de las
      // cuatro. Esta tiene grama, luces colgantes y cielo, y ademas ya viene
      // horizontal, asi que entra en el 4/3 sin perder nada al recortar.
      imagenUrl: 'assets/img/eventos/jardin-1/4.jpg',
      alt: 'Jardín para eventos con grama, luces colgantes y área techada',
      ruta: '/eventos',
      enlace: 'Ver jardines',
    },
  ];
}
