import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { API_CONFIG } from './config/api.config';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { MessageService } from 'primeng/api';

const SCJainTheme = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f5f2ff',
      100: '#ede7ff',
      200: '#ddd2ff',
      300: '#c4b0ff',
      400: '#a584f7',
      500: '#7d57d7',
      600: '#633bb8',
      700: '#4f2f95',
      800: '#3b2a7a',
      900: '#2c1f63',
      950: '#1c123f'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),

  
    provideHttpClient(
      withInterceptors([
        loaderInterceptor,
        jwtInterceptor,
        errorInterceptor
      ])
    ),

    // PrimeNG global theme
    providePrimeNG({
      theme: { preset: SCJainTheme }
    }),

    // PrimeNG message service (for Toast, ConfirmDialog, etc.)
    MessageService,

    // API Base URL
    {
      provide: API_CONFIG,
      useValue: 'https://textile-erp-a3abgpceebhbeabb.centralindia-01.azurewebsites.net/api/'
    }
  ]
};
