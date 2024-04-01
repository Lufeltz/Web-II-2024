import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  @ViewChild('formLogin') formLogin!: NgForm;
  emailUser?: string;
  passwordUser?: string;
  loginUser: Login = new Login();
  loginError: boolean = false;

  constructor(
    private router: Router, 
    private loginService: LoginService) {}

  login() {
    if (this.formLogin.form.valid && this.emailUser && this.passwordUser) {
      this.loginService.login(this.emailUser, this.passwordUser).subscribe({
        next: (login: Login[]) => {
          this.loginUser = login[0];
          if(this.loginUser) {
            switch (this.loginUser.permissao) {
              case 'cliente':
                this.router.navigate(['pedidos']);
                break;
              case 'funcionario':
                this.router.navigate(['manutencao-roupa']);
                
                break;
              default:
                this.loginError = true;
                break;
            }
            console.log('Login realizado com sucesso: ', this.loginUser);
          } else {
            this.loginError = true;
          }
        },
        error: (error) => {
          this.loginError = true;
          console.log('Erro ao realizar login: ', error);
        }
      });
    }
  }

  clearLoginError() {
    this.loginError = false;
  }

}