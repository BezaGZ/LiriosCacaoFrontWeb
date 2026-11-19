import {routes} from './app.routes';
import { ApplicationConfig, isDevMode, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeEsGt from '@angular/common/locales/es-GT';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';

/**
 * Sin esto Angular usa el formato de Estados Unidos: los precios salian como
 * "GTQ7" en las tarjetas mientras el carrito mostraba "Q7.00", o sea el mismo
 * precio escrito de dos formas distintas en la misma compra.
 *
 * El locale es-GT trae simbolo "Q" pegado al numero y punto decimal (Q7.00).
 * Debe registrarse antes de que arranque la app, y este archivo lo importan
 * tanto el navegador (main.ts) como el servidor (app.config.server.ts).
 */
registerLocaleData(localeEsGt);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es-GT' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'GTQ' },
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: { // <-- AÑADE ESTE OBJETO 'options'
          darkMode: 'light' // <-- AÑADE ESTA LÍNEA PARA FORZAR EL MODO CLARO
        }
      },

    }),
    provideRouter(routes),
    MessageService, provideClientHydration(withEventReplay()), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })

  ]};
