import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {ApplicationConfig, Injector, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../../env/environment';
import {HTTP_INTERCEPTORS, HttpClient, HttpHandler, provideHttpClient} from '@angular/common/http';
import {DEFAULT_TIMEOUT, TimeoutInterceptor} from '../services/timeout';


const firebaseApp = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: 'FirebaseApp', useValue: firebaseApp },
    { provide: 'Auth', useFactory: () => getAuth(firebaseApp) },
    {provide: HttpClient, useClass: HttpClient},
    {provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true},
    {provide: DEFAULT_TIMEOUT, useValue: 30000},
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
