import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';
import firebase from 'firebase/compat';


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
  provider = firebase.auth.EmailAuthProvider()

  constructor() {
    this.formularioLogin = new FormGroup(
      {
        correoUsuario: new FormControl('', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")]),
        contraUsuario: new FormControl('', [Validators.required])
      }
    );
  }

  test(){
    this.provider.signInWithEmailAndPassword(
      this.formularioLogin.controls['correoUsuario'].value,
      this.formularioLogin.controls['contraUsuario'].value
    ).catch(function(error: Error){
      let errCode = error.;
    })
  }
}
