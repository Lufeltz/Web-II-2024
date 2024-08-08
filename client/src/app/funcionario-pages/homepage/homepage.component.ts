import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos.service';
import { Router } from '@angular/router';
import { Pedido } from '../../shared/models/pedido.model';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { Status } from '../../shared/models/status.enum';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent implements OnInit {
  private pedidosEmAberto: Pedido[] = [];
  private listaVazia: boolean = false;
  status = Status;

  pedidos: PedidoDto[] = [];
  pedido!: PedidoDto;
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private pedidosService: PedidosService, private router: Router) {}

  ngOnInit(): void {
    this.listaPedidos();
  }

  formatSituacao(situacao: string): string {
    return situacao.replace(/_/g, ' ');
  }

  recolherPedido(pedido: PedidoDto): void {
    pedido.situacao = this.status.RECOLHIDO;
    this.pedidosService
      .atualizarPorFuncionario(pedido.numeroPedido, pedido)
      .subscribe({
        next: (pedido: PedidoDto | null) => {
          this.router.navigate(['/homepage']);
          this.listaPedidos();
        },
        error: (err) => {
          this.mensagem = `Erro atualizando pedido ${this.pedido.numeroPedido}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  listaPedidos(): PedidoDto[] {
    this.pedidosService.getAllPedidosDto().subscribe({
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
