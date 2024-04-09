import { Component, OnInit, ViewChild } from '@angular/core';
import { PedidoModel } from '../../models/pedido.model';
import { Status } from '../../models/status.enum';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-visualizacao-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizacao-pedidos.component.html',
  styleUrl: './visualizacao-pedidos.component.css'
})
export class VisualizacaoPedidosComponent implements OnInit {
  pedidos: PedidoModel[] = [];
  orderedPedidos: PedidoModel[] = [];
  pedidosArePresent: boolean | any = null;
  statusEnum = Status;
  startDate?: Date;
  endDate?: Date;
  opcaoSelecionada: string = '';

  constructor(private pedidoService: PedidosService) {}

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos() {
    this.pedidoService.getPedidos().subscribe({
      next: (pedidos: PedidoModel[]) => {
        this.pedidos = pedidos;
        this.orderedPedidos = pedidos
          .filter((p) => p.situacao === this.statusEnum.EM_ABERTO)
          .sort((a, b) => a.dataCriacao.getTime() - b.dataCriacao.getTime());
        this.pedidosArePresent = true;
        console.log('Pedidos obtidos com sucesso!');
        console.log(pedidos);
      },
      error: (error) => console.log('Erro requisitando os pedidos: ', error),
    });

    if (this.pedidos.length === 0) {
      this.pedidosArePresent = false;
    }
  }

  filtroPedidos(opcaoSelecionada: string) {
    this.opcaoSelecionada = opcaoSelecionada; // corrected assignment
    switch (opcaoSelecionada) {
      case 'PEDIDOS DE HOJE':
        const hoje = new Date();
        const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
        const fimHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() + 1);
        this.orderedPedidos = this.pedidos.filter(pedido => pedido.dataCriacao >= inicioHoje && pedido.dataCriacao < fimHoje);
        break;
      case 'PEDIDOS POR DATA':
        if (this.startDate && this.endDate) {
          const inicio = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
          const fim = new Date(this.endDate.getFullYear(), this.endDate.getMonth(), this.endDate.getDate() + 1);
          this.orderedPedidos = this.pedidos.filter(pedido => pedido.dataCriacao >= inicio && pedido.dataCriacao < fim);
        } else {
          console.log('Por favor, selecione as datas de início e fim.');
        }
        break;
      default:
        this.orderedPedidos = this.pedidos.slice();
        break;
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    const formattedDate = `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    
    return formattedDate;
  }

  getStatusColor(status: Status): string {
    switch (status){
      case Status.EM_ABERTO:
        return 'amarelo';
      case Status.REJEITADO:
      case Status.CANCELADO:
        return 'vermelho';
      case Status.RECOLHIDO:
        return 'cinza';
      case Status.AGUARDANDO_PAGAMENTO:
        return 'azul';
      case Status.PAGO:
        return 'laranja';
      case Status.FINALIZADO:
        return 'verde';
      default:
        return 'roxo';
    }
  }
}

