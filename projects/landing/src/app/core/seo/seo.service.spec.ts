import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { SeoService } from './seo.service';
import { NEGOCIO } from '../../contenido/sitio';

describe('SeoService', () => {
  let seo: SeoService;
  let doc: Document;

  function canonical(): string | null {
    return doc.head
      .querySelector<HTMLLinkElement>('link[rel="canonical"]')
      ?.getAttribute('href') ?? null;
  }

  function jsonLd(): Record<string, unknown> | null {
    const nodo = doc.getElementById('lc-jsonld');
    return nodo ? JSON.parse(nodo.textContent ?? '{}') : null;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    seo = TestBed.inject(SeoService);
    doc = TestBed.inject(DOCUMENT);
    doc.getElementById('lc-jsonld')?.remove();
    doc.head.querySelector('link[rel="canonical"]')?.remove();
  });

  it('arma el canonical contra el dominio del sitio, no contra donde corre', () => {
    seo.aplicar({ titulo: 'T', descripcion: 'D', ruta: '/floristeria' });

    expect(canonical()).toBe(`${NEGOCIO.sitio}/floristeria`);
  });

  it('la raíz no queda con barra de más', () => {
    seo.aplicar({ titulo: 'T', descripcion: 'D', ruta: '/' });

    expect(canonical()).toBe(NEGOCIO.sitio);
  });

  it('og:url acompaña al canonical', () => {
    seo.aplicar({ titulo: 'T', descripcion: 'D', ruta: '/floristeria' });

    const og = doc.head
      .querySelector<HTMLMetaElement>('meta[property="og:url"]')
      ?.getAttribute('content');

    // Si no coinciden, lo que comparte WhatsApp apunta a otra parte que lo que
    // Google indexa.
    expect(og).toBe(canonical());
  });

  it('reemplaza los datos estructurados en vez de acumularlos', () => {
    seo.aplicar({ titulo: 'A', descripcion: 'D', ruta: '/', jsonLd: { '@type': 'Uno' } });
    seo.aplicar({ titulo: 'B', descripcion: 'D', ruta: '/x', jsonLd: { '@type': 'Dos' } });

    expect(doc.querySelectorAll('#lc-jsonld').length).toBe(1);
    expect(jsonLd()?.['@type']).toBe('Dos');
  });

  it('quita los datos estructurados al navegar a una página que no lleva', () => {
    seo.aplicar({ titulo: 'A', descripcion: 'D', ruta: '/', jsonLd: { '@type': 'Uno' } });
    seo.aplicar({ titulo: 'B', descripcion: 'D', ruta: '/x' });

    // Dos bloques contradiciéndose es peor que ninguno.
    expect(jsonLd()).toBeNull();
  });

  it('actualiza título y descripción', () => {
    seo.aplicar({ titulo: 'Floristería en Chiquimula', descripcion: 'Ramos y arreglos.', ruta: '/f' });

    expect(doc.title).toBe('Floristería en Chiquimula');
    expect(
      doc.head.querySelector<HTMLMetaElement>('meta[name="description"]')?.content,
    ).toBe('Ramos y arreglos.');
  });
});
