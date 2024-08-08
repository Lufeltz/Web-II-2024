import { Component } from '@angular/core';
import { PedidosService } from '../../services/pedidos.service';
import { Status } from '../../shared/models/status.enum';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { UsuarioResponseDto } from '../../shared/models/dto/usuario-response-dto.model';

@Component({
  selector: 'app-homepage-cliente',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage-cliente.component.html',
  styleUrl: './homepage-cliente.component.css'
})
export class HomepageClienteComponent {
  usuario: UsuarioResponseDto = new UsuarioResponseDto();
  private listaVazia: boolean = false;
  status = Status;
  pedidos: PedidoDto[] = [];
  pedido!: PedidoDto;
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private pedidosService: PedidosService, private router: Router, private loginService: LoginService) {}

  ngOnInit(): void {
    this.usuario = this.loginService.getUsuarioLogado();
    this.listaPedidos(this.usuario.idUsuario);
  }

  cancelarPedido(pedido: PedidoDto): void {
    pedido.situacao = this.status.CANCELADO;
    this.pedidosService.atualizarPorCliente(pedido.numeroPedido, pedido)
      .subscribe({
        next: (pedido: PedidoDto | null) => {
          this.router.navigate(['/homepage-cliente']);
          this.listaPedidos(this.usuario.idUsuario);
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${this.pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  formatSituacao(situacao: string): string {
    return situacao.replace(/_/g, ' ');
  }

  listaPedidos(idUsuario: number): PedidoDto[] {
    this.pedidosService.listarPorIdUsuario(idUsuario).subscribe({
      next: (data: PedidoDto[] | null) => {
        if (data == null) {
          this.pedidos = [];
        } else {
          this.pedidos = data.filter(
            (pedido) => pedido.situacao == Status.EM_ABERTO
          );
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.pedidos;
  }

  get exibeLista(): boolean {
    return this.listaVazia;
  }

}
