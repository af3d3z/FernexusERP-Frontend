import {Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class authGuardGuard implements CanActivate {
  private auth = getAuth();

  constructor(private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          resolve(true); // Usuario autenticado, puede acceder
        } else {
          this.router.navigate(['/login']); // Redirigir si no está autenticado
          resolve(false);
        }
      });
    });
  }
}
