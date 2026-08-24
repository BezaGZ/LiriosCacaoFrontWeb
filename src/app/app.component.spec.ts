import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

/*
 * Esta prueba venia generada por el CLI y comprobaba `app.title`, una
 * propiedad que este componente nunca tuvo: fallaba al compilar y bloqueaba
 * TODA la suite. Se reemplaza por algo que si dice la verdad.
 *
 * AppComponent inserta los datos estructurados y mantiene el canonical, asi
 * que lo que importa aqui es que arranque sin reventar.
 */
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('se crea', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('arranca sin lanzar errores', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
