import {Component, inject, Injector, OnInit} from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AppHeaderComponent } from './app-header/app-header.component';
import { getAuth, browserLocalPersistence, onAuthStateChanged, setPersistence, User} from 'firebase/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppHeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FernexusERP_Front';
  usuarioActual: User | null = null;
  private auth = getAuth();
  private router: Router = inject(Router);

  constructor() {
    setPersistence(this.auth, browserLocalPersistence)
      .then(() => {
        console.log('Persistencia configurada correctamente');
      })
      .catch(error => console.error('Error en la persistencia:', error));
  }

  ngOnInit(): void {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.router.navigate(['/main']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
