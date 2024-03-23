import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      CommonModule,
      RouterOutlet,
      LoginComponent,
      CadastroComponent,
      PedidosComponent,
      PedidoComponent,
      ConsultaPedidoComponent,
      PageNotFoundComponent,
    ]
})

export class AppComponent {
  title = 'LOL';
}
