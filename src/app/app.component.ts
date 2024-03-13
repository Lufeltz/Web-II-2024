import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PedidosComponent } from './pedidos/pedidos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PedidosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'LOL';
}
