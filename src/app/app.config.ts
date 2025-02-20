import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../../env/environment';

const firebaseApp = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: 'FirebaseApp', useValue: firebaseApp },
    { provide: 'Auth', useFactory: () => getAuth(firebaseApp) },
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
