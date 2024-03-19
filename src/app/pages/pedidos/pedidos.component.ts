import { Component, OnInit } from '@angular/core';
import { PedidoModel } from '../../models/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { Status } from '../../models/status.enum';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  pedidos: PedidoModel[] = [];
  statusEnum = Status;
  filteredPedidos: PedidoModel[] = [];

  constructor(private pedidosService: PedidosService) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos() {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos: PedidoModel[]) => {
        this.pedidos = pedidos;
        this.filteredPedidos = pedidos
          .filter((p) => p.situacao === this.statusEnum.EM_ABERTO)
          .sort((a, b) => {
            const dateA = new Date(a.dataCriacao).getTime();
            const dateB = new Date(b.dataCriacao).getTime();
            return dateB - dateA;
          });
        console.log('Pedidos obtidos com sucesso!');
        console.log(pedidos);
      },
      error: (error) => console.log('Erro ao requisitar os pedidos: ', error),
    });
  }

  filtroPedidos(e: any) {
    this.filteredPedidos = this.pedidos.filter(
      (pedido) => e.target.value === pedido.situacao
    );
  }
}
