import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';
import { ManutencaoRoupasComponent } from './funcionario-pages/manutencao-roupas';
import { PagarPedidoComponent } from './cliente-pages/pagar-pedido';

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
      PedidosComponent,
      PedidoComponent,
      ConsultaPedidoComponent,

      //funcionario-pages
      ManutencaoRoupasComponent,

      //components
      PageNotFoundComponent,
    ]
})

export class AppComponent {
  title = 'LOL';
}
