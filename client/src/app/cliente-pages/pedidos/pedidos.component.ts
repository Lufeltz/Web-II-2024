import { Component, OnInit } from '@angular/core';
import { Pedido } from '../../shared/models/pedido.model';
import { PedidosService } from '../../services/pedidos.service';
import { Status } from '../../shared/models/status.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPagamentoComponent } from './modal-pagamento/modal-pagamento.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  statusEnum = Status;
  filteredPedidos: Pedido[] = [];

  constructor(private pedidosService: PedidosService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadPedidos();
  }

  loadPedidos() {
    this.pedidosService.getPedidos().subscribe({
      next: (pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        this.filteredPedidos = pedidos
          .filter((p) => p.situacao === this.statusEnum.EM_ABERTO)
          .sort((a, b) => {
            const dateA = new Date(a.dataPedido).getTime();
            const dateB = new Date(b.dataPedido).getTime();
            return dateB - dateA;
          });
      },
      error: (error) => console.log('Erro ao requisitar os pedidos: ', error),
    });
  }

  filtroPedidos(e: any) {
    this.filteredPedidos = this.pedidos.filter(
      (pedido) => e.target.value === pedido.situacao
    );
  }

  abrirModal(usuario: Pedido) {
    const modalRef = this.modalService.open(ModalPagamentoComponent);
    modalRef.componentInstance.usuario = usuario;
  }
}
