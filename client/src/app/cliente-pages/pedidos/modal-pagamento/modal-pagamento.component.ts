import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidoDto } from '../../../shared/models/dto/pedido-dto.model';
import { Router } from '@angular/router';
import { PedidosService } from '../../../services/pedidos.service';
import { Status } from '../../../shared/models/status.enum';
import { PedidoRoupaDto } from '../../../shared/models/dto/pedido-roupa-dto.model';

@Component({
  selector: 'app-modal-pagamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-pagamento.component.html',
  styleUrl: './modal-pagamento.component.css',
})
export class ModalPagamentoComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() pagamentoConcluido = new EventEmitter<void>();
  @Input() pedidoParaPagar!: PedidoDto;
  status = Status;
  pedido: PedidoDto[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {}

  pagar(pedido: PedidoDto): void {
    this.mensagem = '';
    this.mensagem_detalhes = '';
    pedido.situacao = this.status.PAGO;
    this.pedidosService
      .atualizarPorCliente(pedido.numeroPedido, pedido)
      .subscribe({
        complete: () => {
          this.pagamentoConcluido.emit();
          this.router.navigate(['/pedidos']);
        },
        error: (err) => {
          this.mensagem = `Erro pagar pedido ${this.pedidoParaPagar.numeroPedido} - ${this.pedidoParaPagar.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }

  totalItens(listaPedidoRoupas: PedidoRoupaDto[]): number {
    return listaPedidoRoupas.reduce((total, pedidoRoupa) => {
      return total + pedidoRoupa.quantidade;
    }, 0);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  formatarData(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year} ${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;

    return formattedDate;
  }

  formatarDataSemTime(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;

    return formattedDate;
  }
}
