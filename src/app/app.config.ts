import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'


import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IDFAngularModule } from '@farsiman/idf-angular';
import { BrowserModule } from '@angular/platform-browser';
import { environments } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
  //   BrowserModule,
     IDFAngularModule.forRoot(environments.auth_config)
   ),
  ]
};
