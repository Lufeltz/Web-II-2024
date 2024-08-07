import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';
import { ManutencaoRoupasComponent } from './funcionario-pages/manutencao-roupas';
import { NavbarComponent } from './components/navbar';
import { RelatorioReceitasComponent } from './funcionario-pages/relatorio-receitas';
import { HomepageClienteComponent } from './cliente-pages/homepage-cliente';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      //angular
      CommonModule,
      RouterOutlet,

      //auth
      LoginComponent,
      CadastroComponent,

      //cliente-pages
      HomepageClienteComponent,
      PedidosComponent,
      PedidoComponent,
      ConsultaPedidoComponent,

      //funcionario-pages
      ManutencaoRoupasComponent,
      RelatorioReceitasComponent,

      //components
      PageNotFoundComponent,
      NavbarComponent,
    ]
})

export class AppComponent {
  title = 'LOL';
  showNavbar: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !['/login', '/cadastro'].includes(event.url);
      }
    });
  }

}
