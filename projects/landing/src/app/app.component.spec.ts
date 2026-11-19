import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('monta la estructura de la pagina', () => {
    const fijo = TestBed.createComponent(AppComponent);
    fijo.detectChanges();
    const raiz: HTMLElement = fijo.nativeElement;

    expect(raiz.querySelector('lc-encabezado')).withContext('encabezado').toBeTruthy();
    expect(raiz.querySelector('main#contenido')).withContext('contenido').toBeTruthy();
    expect(raiz.querySelector('lc-pie')).withContext('pie').toBeTruthy();
  });

  it('ofrece saltar al contenido antes que cualquier otro enlace', () => {
    const fijo = TestBed.createComponent(AppComponent);
    fijo.detectChanges();
    const primero = (fijo.nativeElement as HTMLElement).querySelector('a');

    // Quien navega con teclado debe poder brincarse el menu en cada pagina.
    expect(primero?.getAttribute('href')).toBe('#contenido');
  });
});
