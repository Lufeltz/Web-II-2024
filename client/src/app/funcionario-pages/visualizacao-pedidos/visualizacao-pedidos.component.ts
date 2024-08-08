import { Component, OnInit, ViewChild } from '@angular/core';
import { Status } from '../../shared/models/status.enum';
import { PedidosService } from '../../services/pedidos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';

@Component({
  selector: 'app-visualizacao-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './visualizacao-pedidos.component.html',
  styleUrl: './visualizacao-pedidos.component.css',
})
export class VisualizacaoPedidosComponent implements OnInit {
  pedidos: PedidoDto[] = [];
  orderedPedidos: PedidoDto[] = [];
  pedidosArePresent: boolean | any = null;
  statusEnum = Status;
  startDate: Date = new Date();
  endDate: Date = new Date();
  opcaoSelecionada: string = '';
  status = Status;
  pedido!: PedidoDto;

  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.listaPedidos();
  }

// BUTTONS

formatSituacao(situacao: string): string {
  return situacao.replace(/_/g, ' ');
}

// Função para determinar a classe do botão
getButtonClass(situacao: Status): string {
  switch (situacao) {
    case this.statusEnum.EM_ABERTO:
      return 'btn btn-dark'; // Cor para "Recolher"
    case this.statusEnum.RECOLHIDO:
      return 'btn btn-dark'; // Cor para "Confirmar Lavagem"
    case this.statusEnum.PAGO:
      return 'btn btn-dark'; // Cor para "Finalizar Pedido"
    default:
      return 'btn btn-dark'; // Cor padrão
  }
}

// Função para determinar o rótulo do botão
getButtonLabel(situacao: Status): string | null {
  switch (situacao) {
    case this.statusEnum.EM_ABERTO:
      return 'Recolher';
    case this.statusEnum.RECOLHIDO:
      return 'Confirmar Lavagem';
    case this.statusEnum.PAGO:
      return 'Finalizar Pedido';
    default:
      return null; // Rótulo padrão
  }
}

// Função para executar a ação correta
handleAction(pedido: PedidoDto): void {
  switch (pedido.situacao) {
    case this.statusEnum.EM_ABERTO:
      this.recolherPedido(pedido);
      break;
    case this.statusEnum.RECOLHIDO:
      this.confirmarLavagem(pedido);
      break;
    case this.statusEnum.PAGO:
      this.finalizarPedido(pedido);
      break;
    default:
      console.log('Nenhuma ação disponível');
      break;
  }
}

// BUTTONS



  listaPedidos(): void {
    this.pedidosService.getAllPedidosDto().subscribe({
      next: (data: PedidoDto[] | null) => {
        if (data == null || data.length === 0) {
          this.pedidos = [];
          this.orderedPedidos = [];
          this.pedidosArePresent = false;
        } else {
          // Converte os campos de data para objetos Date
          this.pedidos = data.map((pedido) => ({
            ...pedido,
            dataPedido: new Date(pedido.dataPedido),
            orcamento: {
              ...pedido.orcamento,
              dataPrazo: new Date(pedido.orcamento.dataPrazo),
            },
          }));

          // Ordena os pedidos pela data do pedido
          this.pedidos.sort(
            (a, b) => a.dataPedido.getTime() - b.dataPedido.getTime()
          );

          // Define os pedidos ordenados
          this.orderedPedidos = [...this.pedidos];
          this.pedidosArePresent = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de pedidos';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
        this.pedidosArePresent = false;
      },
    });
  }

  filtroPedidos(opcaoSelecionada: string) {
    this.opcaoSelecionada = opcaoSelecionada;
    switch (opcaoSelecionada) {
      case 'PEDIDOS DE HOJE':
        const hoje = new Date(2024, 5, 10); // teste
        // const hoje = new Date();
        const inicioHoje = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate(),
          0,
          0,
          0
        );
        const fimHoje = new Date(
          hoje.getFullYear(),
          hoje.getMonth(),
          hoje.getDate(),
          23,
          59,
          59
        );

        this.orderedPedidos = this.pedidos.filter((pedido) => {
          const dataPedido = new Date(pedido.dataPedido);
          return dataPedido >= inicioHoje && dataPedido <= fimHoje;
        });

        console.log('Pedidos filtrados:', this.orderedPedidos);
        break;

      case 'PEDIDOS POR DATA':
        if (this.startDate && this.endDate) {
          // Verifica se startDate e endDate são strings e converte para Date
          const startDateObject =
            typeof this.startDate === 'string'
              ? new Date(this.startDate)
              : this.startDate;
          const endDateObject =
            typeof this.endDate === 'string'
              ? new Date(this.endDate)
              : this.endDate;

          if (
            startDateObject instanceof Date &&
            !isNaN(startDateObject.getTime()) &&
            endDateObject instanceof Date &&
            !isNaN(endDateObject.getTime())
          ) {
            const inicio = new Date(
              startDateObject.getFullYear(),
              startDateObject.getMonth(),
              startDateObject.getDate(),
              0,
              0,
              0
            );
            // Adiciona um dia à data final e define para o início do próximo dia
            const fim = new Date(
              endDateObject.getFullYear(),
              endDateObject.getMonth(),
              endDateObject.getDate() + 1,
              0,
              0,
              0
            );

            this.orderedPedidos = this.pedidos.filter((pedido) => {
              const dataPedido = new Date(pedido.dataPedido);
              return dataPedido >= inicio && dataPedido < fim;
            });
          } else {
            console.log('Datas inválidas.');
          }
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
    // Obtém os componentes da data
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Formata a data como dd/mm/yyyy hh:mm
    const formattedDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year} ${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;

    return formattedDate;
  }

  formatDatePlus(date: Date): string {
    // Obtém os componentes da data
    const day = date.getDate() + 1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Formata a data como dd/mm/yyyy hh:mm
    const formattedDate = `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year} ${hours < 10 ? '0' + hours : hours}:${
      minutes < 10 ? '0' + minutes : minutes
    }`;

    return formattedDate;
  }

  recolherPedido(pedido: PedidoDto): void {
    pedido.situacao = this.status.RECOLHIDO;
    this.pedidosService
      .atualizarPorFuncionario(pedido.numeroPedido, pedido)
      .subscribe({
        next: (pedido: PedidoDto | null) => {
          this.router.navigate(['/visualizacao-pedidos']);
          this.listaPedidos();
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${this.pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }
  confirmarLavagem(pedido: PedidoDto) {
    pedido.situacao = this.status.AGUARDANDO_PAGAMENTO;
    this.pedidosService
      .atualizarPorFuncionario(pedido.numeroPedido, pedido)
      .subscribe({
        next: (pedido: PedidoDto | null) => {
          this.router.navigate(['/visualizacao-pedidos']);
          this.listaPedidos();
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${this.pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  finalizarPedido(pedido: PedidoDto) {
    pedido.situacao = this.status.FINALIZADO;
    this.pedidosService
      .atualizarPorFuncionario(pedido.numeroPedido, pedido)
      .subscribe({
        next: (pedido: PedidoDto | null) => {
          this.router.navigate(['/visualizacao-pedidos']);
          this.listaPedidos();
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }
}
