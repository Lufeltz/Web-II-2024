import { Component, OnInit } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Status } from '../../shared/models/status.enum';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { Router } from '@angular/router';
import { UsuarioResponseDto } from '../../shared/models/dto/usuario-response-dto.model';
import { LoginService } from '../../services/login.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalPagamentoComponent } from './modal-pagamento/modal-pagamento.component';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css',
})
export class PedidosComponent implements OnInit {
  usuario: UsuarioResponseDto = new UsuarioResponseDto();
  pedidos: PedidoDto[] = [];
  orderedPedidos: PedidoDto[] = [];
  pedidosArePresent: boolean | any = null;
  statusEnum = Status;
  startDate: Date = new Date();
  endDate: Date = new Date();
  opcaoSelecionada: string = 'EM_ABERTO';
  status = Status;
  pedido!: PedidoDto;
  usuarioLogado!: UsuarioResponseDto;
  pedidoParaPagar!: PedidoDto;

  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(
    private pedidosService: PedidosService,
    private router: Router,
    private loginService: LoginService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.usuario = this.loginService.getUsuarioLogado();
    this.filtroPedidos(this.opcaoSelecionada);
  }

  formatSituacao(situacao: string): string {
    return situacao.replace(/_/g, ' ');
  }

  // Função para determinar a classe do botão
  getButtonClass(situacao: Status): string {
    switch (situacao) {
      case this.statusEnum.EM_ABERTO:
        return 'btn btn-dark'; // Cor para "Recolher"
      case this.statusEnum.AGUARDANDO_PAGAMENTO:
        return 'btn btn-dark'; // Cor para "Confirmar Lavagem"
      default:
        return 'btn btn-dark'; // Cor padrão
    }
  }

  // Função para determinar o rótulo do botão
  getButtonLabel(situacao: Status): string | null {
    switch (situacao) {
      case this.statusEnum.EM_ABERTO:
        return 'Cancelar';
      case this.statusEnum.AGUARDANDO_PAGAMENTO:
        return 'Pagar';
      default:
        return null; // Rótulo padrão
    }
  }

  // Função para executar a ação correta
  handleAction(pedido: PedidoDto): void {
    switch (pedido.situacao) {
      case this.statusEnum.AGUARDANDO_PAGAMENTO:
        this.pagarPedido(pedido);
        break;
      case this.statusEnum.EM_ABERTO:
        this.cancelarPedido(pedido);
        break;
      default:
        break;
    }
  }

  listaPedidos(idUsuario: number): PedidoDto[] {
    this.pedidosService.listarPorIdUsuario(idUsuario).subscribe({
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
            (b, a) => a.dataPedido.getTime() - b.dataPedido.getTime()
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
    return this.pedidos;
  }

  filtroPedidos(opcaoSelecionada: string) {
    this.usuarioLogado = this.loginService.getUsuarioLogado();
    this.opcaoSelecionada = opcaoSelecionada;

    this.pedidosService
      .listarPorIdUsuario(this.usuarioLogado.idUsuario)
      .subscribe({
        next: (data: PedidoDto[] | null) => {
          if (data == null) {
            this.pedidos = [];
            this.orderedPedidos = [];
            this.pedidosArePresent = false;
          } else {
            // Filtra os pedidos pela situação selecionada
            this.pedidos = data.filter(
              (pedido) => pedido.situacao === this.opcaoSelecionada
            );

            // Converte os campos de data para objetos Date
            this.pedidos = this.pedidos.map((pedido) => ({
              ...pedido,
              dataPedido: new Date(pedido.dataPedido),
              orcamento: {
                ...pedido.orcamento,
                dataPrazo: new Date(pedido.orcamento.dataPrazo),
              },
            }));

            // Ordena os pedidos pela data do pedido de forma decrescente
            this.pedidos.sort(
              (a, b) => b.dataPedido.getTime() - a.dataPedido.getTime()
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

  formatDate(date: any): string {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

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

  formatDatePlus(date: any): string {
    // Verifica se o parâmetro 'date' é um objeto Date válido
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

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

  cancelarPedido(pedido: PedidoDto): void {
    pedido.situacao = this.status.CANCELADO;
    this.pedidosService
      .atualizarPorCliente(pedido.numeroPedido, pedido)
      .subscribe({
        next: () => {
          // Atualiza a lista com base na opção selecionada
          this.filtroPedidos(this.opcaoSelecionada);
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  pagarPedido(pedido: PedidoDto): void {
    pedido.situacao = this.status.PAGO;
    this.pedidosService
      .atualizarPorCliente(pedido.numeroPedido, pedido)
      .subscribe({
        next: () => {
          // Atualiza a lista com base na opção selecionada
          this.filtroPedidos(this.opcaoSelecionada);
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  // MODAL

  pagar(pedidoParaPagar: PedidoDto) {
    this.pedidoParaPagar = pedidoParaPagar;
    const modalRef = this.modalService.open(ModalPagamentoComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.pedidoParaPagar = this.pedidoParaPagar; // Corrigido
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.pagamentoConcluido.subscribe(() => {
      this.filtroPedidos(this.opcaoSelecionada);
      modalRef.close();
    });
  }
}
