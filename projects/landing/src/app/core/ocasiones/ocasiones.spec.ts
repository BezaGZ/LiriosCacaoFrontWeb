import {
  OCASIONES,
  avisoDeTemporada,
  diasPara,
  ocasionDeTemporada,
} from './ocasiones';

/** Fecha en hora local, como la construye el código de producción. */
const fecha = (a: number, m: number, d: number) => new Date(a, m - 1, d);

describe('ocasiones', () => {
  it('toda ocasión con mes lleva día, y al revés', () => {
    for (const o of OCASIONES) {
      expect(!!o.mes).withContext(`${o.id}: mes y día van juntos`).toBe(!!o.dia);
      // Si tiene fecha fija, tiene que decirla en palabras.
      expect(!!o.mes).withContext(`${o.id}: fecha en palabras`).toBe(!!o.fecha);
    }
  });

  it('cada ocasión tiene su forma para el mensaje', () => {
    for (const o of OCASIONES) {
      expect(o.enMensaje.length).withContext(o.id).toBeGreaterThan(0);
    }
  });

  describe('ocasionDeTemporada', () => {
    it('avisa dentro de la ventana de anticipación', () => {
      // 25 de abril: faltan 15 días para el 10 de mayo.
      expect(ocasionDeTemporada(fecha(2026, 4, 25))?.id).toBe('madre');
    });

    it('no avisa si todavía falta demasiado', () => {
      // 1 de abril: 39 días, fuera de la ventana de 21.
      expect(ocasionDeTemporada(fecha(2026, 4, 1))).toBeNull();
    });

    it('avisa el mismo día', () => {
      expect(ocasionDeTemporada(fecha(2026, 5, 10))?.id).toBe('madre');
    });

    it('deja de avisar al día siguiente', () => {
      expect(ocasionDeTemporada(fecha(2026, 5, 11))).toBeNull();
    });

    it('cuando dos caen en la ventana, manda la más próxima', () => {
      // 1 de noviembre con ventana amplia: el 19 de noviembre está más cerca
      // que cualquier otra que pudiera entrar.
      expect(ocasionDeTemporada(fecha(2026, 11, 1), 60)?.id).toBe('hombre');
    });

    it('respeta una ventana personalizada', () => {
      expect(ocasionDeTemporada(fecha(2026, 4, 25), 10)).toBeNull();
      expect(ocasionDeTemporada(fecha(2026, 4, 25), 30)?.id).toBe('madre');
    });
  });

  describe('diasPara', () => {
    it('cuenta bien aunque la hora del día sea distinta', () => {
      const madre = OCASIONES.find((o) => o.id === 'madre')!;
      const temprano = new Date(2026, 4, 1, 0, 1);
      const tarde = new Date(2026, 4, 1, 23, 59);

      // Si no se normalizara a medianoche, estas dos darían números distintos.
      expect(diasPara(temprano, madre)).toBe(9);
      expect(diasPara(tarde, madre)).toBe(9);
    });
  });

  describe('avisoDeTemporada', () => {
    const madre = OCASIONES.find((o) => o.id === 'madre')!;
    const amarillas = OCASIONES.find((o) => o.id === 'amarillas')!;

    it('concuerda en singular y plural', () => {
      expect(avisoDeTemporada(9, madre)).toBe('Faltan 9 días para el Día de la Madre');
      expect(avisoDeTemporada(1, madre)).toBe('Falta 1 día para el Día de la Madre');
    });

    it('cambia la frase entera el día de la ocasión', () => {
      // No "Es hoy para el Día de la Madre", que no se dice así.
      expect(avisoDeTemporada(0, madre)).toBe('Hoy es el Día de la Madre');
    });

    it('respeta el artículo de cada ocasión', () => {
      // Sin esto saldría "Hoy es el Flores amarillas".
      expect(avisoDeTemporada(0, amarillas)).toBe(
        'Hoy es el día de las flores amarillas',
      );
    });
  });
});
