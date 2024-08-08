import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { Status } from '../../shared/models/status.enum';
import { UsuarioResponseDto } from '../../shared/models/dto/usuario-response-dto.model';
import { ClienteDto } from '../../shared/models/dto/cliente-dto.model';
import { LoginService } from '../../services/login.service';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-consulta-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './consulta-pedido.component.html',
  styleUrls: ['./consulta-pedido.component.css'],
  providers: [DatePipe],
})
export class ConsultaPedidoComponent implements OnInit {
  @ViewChild('formConsultaPedido') formConsultaPedido!: NgForm;
  usuario: UsuarioResponseDto = new UsuarioResponseDto();
  cliente: ClienteDto | null = null;
  numeroPedido?: number;
  consultaPedidoSubmetido?: number;
  pedidoEncontrado: boolean | null = null;
  pedido: PedidoDto = new PedidoDto();
  prazoServico: string = '';
  totalItens: number = 0;
  precoTotal: number = 0;
  Status = Status;
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(
    private router: Router,
    private pedidosService: PedidosService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.usuario = this.loginService.getUsuarioLogado();
    this.obterClienteLogado();
  }

  formatSituacao(situacao: string): string {
    return situacao.replace(/_/g, ' ');
  }

  obterClienteLogado(): void {
    this.clienteService
      .consultarPorIdUsuario(this.usuario.idUsuario)
      .subscribe({
        next: (cliente) => {
          this.cliente = cliente;
        },
        error: (err) => {
          this.mensagem = 'Erro ao buscar dados do cliente';
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  consultar() {
    if (this.formConsultaPedido.form.valid && this.numeroPedido) {
      this.consultaPedidoSubmetido = this.numeroPedido;

      if (this.cliente?.idCliente !== undefined) {
        this.pedidosService
          .consultar(this.numeroPedido, this.cliente.idCliente)
          .subscribe({
            next: (pedido: PedidoDto | null) => {
              if (pedido) {
                this.pedido = pedido;
                this.prazoServico =
                  this.datePipe.transform(
                    new Date(this.pedido.orcamento.dataPrazo),
                    'dd/MM/yyyy'
                  ) || '';
                this.totalItens = this.pedido.listaPedidoRoupas.reduce(
                  (total, item) => total + item.quantidade,
                  0
                );
                this.precoTotal = this.pedido.orcamento.valor;
                this.pedidoEncontrado = true;
              } else {
                this.pedidoEncontrado = false;
                console.log('Pedido não encontrado.');
              }
            },
            error: (error) => {
              this.pedidoEncontrado = false;
              console.log('Erro ao requisitar o pedido: ', error);
            },
          });
      } else {
        this.mensagem = 'ID do cliente não disponível.';
        return;
      }
    } else {
      this.pedidoEncontrado = false;
      console.log('Formulário inválido ou código de pedido não fornecido.');
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
