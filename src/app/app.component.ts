import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './pages/login';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ConsultaPedidoComponent } from './pages/consulta-pedido';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    LoginComponent, 
    PedidosComponent,
    ConsultaPedidoComponent, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'LOL';
}
