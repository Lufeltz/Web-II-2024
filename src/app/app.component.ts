import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login';
import { CadastroComponent } from './pages/cadastro';
import { PedidosComponent } from './pages/pedidos';
import { PedidoComponent } from './pages/pedido';
import { ConsultaPedidoComponent } from './pages/consulta-pedido';
import { PageNotFoundComponent } from './pages/page-not-found';

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
