import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Login } from '../../shared/models/login.model';
import { NumericoDirective } from '../../shared/directives/numerico.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NumericoDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  @ViewChild('formLogin') formLogin!: NgForm;
  login: Login = new Login();
  loading: boolean = false;
  message!: string;

  ngOnInit(): void {
    if (this.loginService.usuarioLogado) {
      this.router.navigate(['/login']);
    } else {
      this.route.queryParams.subscribe((params) => {
        this.message = params['error'];
      });
    }
  }

  logar(): void {
    this.loading = true;
    if (this.formLogin.form.valid) {
      this.loginService.login(this.login).subscribe((usu) => {
        if (usu != null) {
          this.loginService.usuarioLogado = usu;
          this.loading = false;
          if(usu.perfil == "FUNCIONARIO"){
            this.router.navigate(['/homepage']);
          }
          else if (usu.perfil == "CLIENTE"){
            this.router.navigate(['/pedidos']);
          }else {
            this.router.navigate(['/login'])
          }
        } else {
          this.message = 'Usuário/Senha inválidos.';
        }
      });
    }
    this.loading = false;
  }

  emailUser?: string;
  passwordUser?: string;
  loginUser: Login = new Login();
  loginError: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ===============================[NEW]===============================
  // login: Login = new Login();
  // loading: boolean = false;
  // message!: string;

  // logar(): void {
  //   this.loading = true;

  //   if (this.formLogin.form.valid) {
  //     this.loginService.login(this.login).subscribe({
  //       next: (usu) => {
  //         if (usu != null) {
  //           // this.loginService.usuarioLogado = usu;
  //           this.loading = false;
  //           this.router.navigate(['/home']);
  //         } else {
  //           this.loading = false;
  //           this.message = 'Usuário/Senha inválidos.';
  //         }
  //       },
  //       error: (err) => {
  //         this.loading = false;
  //         this.message = `Erro efetuando login: ${err.message}`;
  //       },
  //     });
  //   }
  //   else {
  //     this.loading = false;
  //   }
  // }

  // ngOnInit(): void {
  //   if (this.loginService.usuarioLogado) {
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.route.queryParams.subscribe((params) => {
  //       this.message = params['error'];
  //     });
  //   }
  // }

  // ===============================[NEW]===============================

  // remover esse depois que arrumar o de cima
  // login() {
  //   if (this.formLogin.form.valid && this.emailUser && this.passwordUser) {
  //     this.loginService.login(this.emailUser, this.passwordUser).subscribe({
  //       next: (login: Login[]) => {
  //         this.loginUser = login[0];
  //         if(this.loginUser) {
  //           switch (this.loginUser.permissao) {
  //             case 'cliente':
  //               this.router.navigate(['pedidos']);
  //               break;
  //             case 'funcionario':
  //               this.router.navigate(['manutencao-roupa']);

  //               break;
  //             default:
  //               this.loginError = true;
  //               break;
  //           }
  //           console.log('Login realizado com sucesso: ', this.loginUser);
  //         } else {
  //           this.loginError = true;
  //         }
  //       },
  //       error: (error) => {
  //         this.loginError = true;
  //         console.log('Erro ao realizar login: ', error);
  //       }
  //     });
  //   }
  // }

  clearLoginError() {
    this.loginError = false;
  }
}
