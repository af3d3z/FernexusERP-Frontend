import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

@Component({
  selector: 'app-formulario-login',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './formulario-login.component.html',
  styleUrl: './formulario-login.component.scss'
})
export class FormularioLoginComponent {
  formularioLogin: FormGroup;

  // Configuración de Firebase
  private firebaseConfig = {
    apiKey: 'AIzaSyAm2K4ppMnv19aidqlRlAhpGd8DJLBGBM0',
    authDomain: 'fernexus-login.firebaseapp.com',
    projectId: 'fernexus-login',
    storageBucket: 'fernexus-login.firebasestorage.app',
    messagingSenderId: '859853882851',
    appId: '1:859853882851:web:418efbda287616f9c20cd6',
  };

  constructor() {
    const app = initializeApp(this.firebaseConfig);

    this.formularioLogin = new FormGroup(
      {
        correoUsuario: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]),
        contraUsuario: new FormControl('', [Validators.required])
      }
    );
  }

  test(){
    const auth = getAuth();
    const email = this.formularioLogin.controls['correoUsuario'].value;
    const password = this.formularioLogin.controls['contraUsuario'].value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Logged in successfully:', userCredential);
      })
      .catch((error) => {
        console.error('Error logging in:', error.message);
      });
  }
}
