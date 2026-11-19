import { TestBed } from '@angular/core/testing';

import { WhatsappService } from './whatsapp.service';
import { NEGOCIO } from '../../contenido/sitio';

describe('WhatsappService', () => {
  let servicio: WhatsappService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    servicio = TestBed.inject(WhatsappService);
  });

  it('arma el enlace contra el número del negocio', () => {
    expect(servicio.enlace('hola')).toContain(`https://wa.me/${NEGOCIO.whatsapp}?text=`);
  });

  it('escapa el mensaje, incluidas tildes y signos', () => {
    const url = servicio.enlace('¿Cuánto cuesta el ramo?');

    expect(url).not.toContain(' ');
    expect(url).not.toContain('¿');
    // Y se puede recuperar entero del otro lado.
    const texto = decodeURIComponent(url.split('?text=')[1]);
    expect(texto).toBe('¿Cuánto cuesta el ramo?');
  });

  it('nombra el arreglo en el mensaje', () => {
    const texto = decodeURIComponent(
      servicio.porArreglo('Primavera').split('?text=')[1],
    );

    // Que llegue con contexto es el punto: un "me interesa" pelado vale menos.
    expect(texto).toContain('Primavera');
  });

  it('nombra la ocasión del evento cuando se le da una, y no inventa cuando no', () => {
    const con = decodeURIComponent(servicio.porEvento('quince años').split('?text=')[1]);
    const sin = decodeURIComponent(servicio.porEvento().split('?text=')[1]);

    expect(con).toContain('para quince años');
    expect(sin).toContain('cotizar un evento.');
    expect(sin).not.toContain('undefined');
  });
});
