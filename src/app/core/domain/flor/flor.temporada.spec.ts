import { OCASIONES, diasPara, ocasionDeTemporada } from './flor.models';

/**
 * La banda de temporada no se puede probar "esperando al 10 de mayo", por eso
 * ocasionDeTemporada recibe la fecha en vez de llamar a new Date() adentro.
 */
describe('ocasionDeTemporada', () => {
  const madre = OCASIONES.find(o => o.id === 'madre')!;

  it('no avisa nada fuera de temporada', () => {
    // 24 de agosto: la fecha mas cercana (21 sep) esta a 28 dias
    expect(ocasionDeTemporada(new Date(2026, 7, 24))).toBeNull();
  });

  it('avisa dentro de la ventana de anticipacion', () => {
    // 25 de abril: faltan 15 dias para el 10 de mayo
    expect(ocasionDeTemporada(new Date(2026, 3, 25))?.id).toBe('madre');
  });

  it('avisa el dia mismo', () => {
    expect(ocasionDeTemporada(new Date(2026, 4, 10))?.id).toBe('madre');
  });

  it('deja de avisar el dia despues', () => {
    expect(ocasionDeTemporada(new Date(2026, 4, 11))).toBeNull();
  });

  it('respeta el limite exacto de la ventana', () => {
    // 21 dias antes entra; 22 ya no
    expect(ocasionDeTemporada(new Date(2026, 3, 19))?.id).toBe('madre');
    expect(ocasionDeTemporada(new Date(2026, 3, 18))).toBeNull();
  });

  it('cuenta bien los dias que faltan', () => {
    expect(diasPara(new Date(2026, 4, 1), madre)).toBe(9);
    expect(diasPara(new Date(2026, 4, 10), madre)).toBe(0);
  });

  it('no se corre un dia por la zona horaria', () => {
    // El bug clasico: construir la fecha desde una cadena ISO la toma como
    // UTC y en Guatemala (UTC-6) el dia se va al anterior.
    const finDelDia = new Date(2026, 4, 10, 23, 30);
    expect(ocasionDeTemporada(finDelDia)?.id).toBe('madre');
    expect(diasPara(finDelDia, madre)).toBe(0);
  });
});
