import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  @ViewChild('formLogin') formLogin!: NgForm;
  loginEmail?: string;
  loginPassword?: string;

  constructor() {

  }

  login() {
    if (this.formLogin.form.valid) {

    }
  }

}