import {routes} from './app.routes';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import {provideRouter} from '@angular/router';
import {MessageService} from 'primeng/api';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: Aura,
      },

    }),
    provideRouter(routes),
    MessageService, provideClientHydration(withEventReplay())

  ]};
