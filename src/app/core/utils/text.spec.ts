import { normalizeText, searchTerms, matchesSearch } from './text';

/*
 * La busqueda estuvo rota: comparaba el titulo en minusculas contra el termino
 * SIN normalizar, asi que escribir "Fresa" con mayuscula no encontraba nada.
 */

describe('Busqueda de productos', () => {

  it('quita acentos y pasa a minusculas', () => {
    expect(normalizeText('ChocoPiña')).toBe('chocopina');
    expect(normalizeText('  Melocotón  ')).toBe('melocoton');
  });

  it('encuentra sin importar las mayusculas', () => {
    expect(matchesSearch('ChocoFresa con Tradicional', 'Fresa')).toBe(true);
    expect(matchesSearch('ChocoFresa con Tradicional', 'FRESA')).toBe(true);
  });

  it('encuentra con y sin acento', () => {
    expect(matchesSearch('ChocoPiña con Blanco', 'piña')).toBe(true);
    expect(matchesSearch('ChocoPiña con Blanco', 'pina')).toBe(true);
    expect(matchesSearch('ChocoPiña con Blanco', 'PIÑA')).toBe(true);
  });

  it('exige TODAS las palabras, en cualquier orden', () => {
    const titulo = 'ChocoFresa con Tradicional + Galleta oreo';
    expect(matchesSearch(titulo, 'fresa oreo')).toBe(true);
    expect(matchesSearch(titulo, 'oreo fresa')).toBe(true);
    expect(matchesSearch(titulo, 'fresa mango')).toBe(false);
  });

  it('lo que no existe no aparece', () => {
    expect(matchesSearch('ChocoFresa con Tradicional', 'mango')).toBe(false);
  });

  it('una busqueda vacia devuelve todo', () => {
    expect(matchesSearch('lo que sea', '')).toBe(true);
    expect(matchesSearch('lo que sea', '    ')).toBe(true);
  });

  it('parte el termino en palabras y descarta los espacios de mas', () => {
    expect(searchTerms('  fresa   oreo ')).toEqual(['fresa', 'oreo']);
    expect(searchTerms('   ')).toEqual([]);
  });
});
