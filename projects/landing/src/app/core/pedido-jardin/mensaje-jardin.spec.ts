import { armarMensajeJardin, faltaParaJardin, ConsultaJardin } from './mensaje-jardin';

const base: ConsultaJardin = { fecha: null, celebracion: null, invitados: null };

describe('mensaje del jardin', () => {
  it('exige la fecha: sin ella no hay nada que consultar', () => {
    expect(faltaParaJardin(base)).toBe('Elija una fecha tentativa.');
    expect(faltaParaJardin({ ...base, fecha: '2026-12-19' })).toBeNull();
  });

  it('escribe lo minimo con solo la fecha', () => {
    expect(armarMensajeJardin({ ...base, fecha: '2026-12-19' })).toBe(
      'Hola, quiero consultar la disponibilidad del jardín el 19 de diciembre.',
    );
  });

  it('suma la celebracion y los invitados cuando los hay', () => {
    const m = armarMensajeJardin({
      fecha: '2026-12-19',
      celebracion: 'una boda',
      invitados: 'De 50 a 100 personas',
    });

    expect(m).toBe(
      'Hola, quiero consultar la disponibilidad del jardín para una boda ' +
        'el 19 de diciembre, para de 50 a 100 personas.',
    );
  });

  it('no inventa lo que no se eligio', () => {
    const m = armarMensajeJardin({ ...base, fecha: '2026-12-19' });

    expect(m).not.toContain('undefined');
    expect(m).not.toContain('null');
    expect(m).not.toContain('personas');
  });
});
