import {
  armarMensajeFlor,
  faltaParaFlor,
  fechaEnPalabras,
  PedidoFlor,
} from './mensaje-flor';

const base: PedidoFlor = {
  ocasion: null,
  arreglo: null,
  fecha: null,
  ciudad: 'Chiquimula',
};

describe('mensaje de floristeria', () => {
  it('no deja armar sin tipo de arreglo', () => {
    expect(faltaParaFlor(base)).toBe('Elija el tipo de arreglo.');
    expect(faltaParaFlor({ ...base, arreglo: 'un ramo' })).toBeNull();
  });

  it('escribe lo minimo con solo el arreglo', () => {
    expect(armarMensajeFlor({ ...base, arreglo: 'un ramo' })).toBe(
      'Hola, quiero pedir un ramo en Chiquimula.',
    );
  });

  // El catalogo dice "Canastas y arreglos"; la frase tiene que decir "una
  // canasta". Sin esto salia "quiero pedir un canastas y arreglos".
  it('usa la forma de frase y no el nombre del catalogo', () => {
    const m = armarMensajeFlor({ ...base, arreglo: 'una canasta' });

    expect(m).toBe('Hola, quiero pedir una canasta en Chiquimula.');
  });

  it('suma la ocasion y la fecha cuando las hay', () => {
    const m = armarMensajeFlor({
      ...base,
      arreglo: 'una canasta',
      ocasion: 'un cumpleaños',
      fecha: '2026-11-25',
    });

    expect(m).toBe(
      'Hola, quiero pedir una canasta para un cumpleaños, ' +
        'para entregar el 25 de noviembre en Chiquimula.',
    );
  });

  it('no inventa lo que no se eligio', () => {
    const m = armarMensajeFlor({ ...base, arreglo: 'un ramo', ocasion: null, fecha: null });

    expect(m).not.toContain('undefined');
    expect(m).not.toContain('null');
    expect(m).not.toContain('para ');
    expect(m).not.toContain('entregar');
  });

  // En Guatemala, seis horas detras de UTC, `new Date("2026-11-25")` devuelve
  // el 24. Una entrega con un dia de diferencia no se nota hasta que las
  // flores llegan tarde.
  it('no corre la fecha un dia hacia atras', () => {
    expect(fechaEnPalabras('2026-01-01')).toBe('1 de enero');
    expect(fechaEnPalabras('2026-11-25')).toBe('25 de noviembre');
    expect(fechaEnPalabras('2026-12-31')).toBe('31 de diciembre');
  });

  it('devuelve la cadena tal cual si no es una fecha', () => {
    expect(fechaEnPalabras('manana')).toBe('manana');
  });
});
