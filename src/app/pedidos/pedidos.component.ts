import { Component, OnInit } from '@angular/core';
import { PedidosModel } from '../models/pedidoModel';
import { PedidosService } from '../services/pedidos.service';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  pedidos: PedidosModel[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos() {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos: PedidosModel[]) => {
        this.pedidos = pedidos;
        console.log('Pedidos obtidos com sucesso!');
      },
      error: (error) => console.log('Erro ao requisitar os pedidos: ', error),
    });
  }
}
