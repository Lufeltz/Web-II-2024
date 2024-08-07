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
          // console.log(this.pedidos);
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.pedidos;
  }

  // listaPedidosEmAberto(): void {
  //   this.pedidosService.getPedidos().subscribe((pedidos : Pedido[]) => {
  //     for(let i=0; i<pedidos.length; i++){
  //       if(pedidos[i].situacao == Status.EM_ABERTO){
  //         this.pedidosEmAberto.push(pedidos[i]);
  //       }
  //     }
  //     if(this.pedidosEmAberto.length > 0){
  //         this.pedidosEmAberto.sort((a, b) => new Date(a.dataPedido).getTime() - new Date(b.dataPedido).getTime());
  //     } else {
  //       this.listaVazia = true;
  //     }
  //   });
  // }

  // recolherPedido(pedido: PedidoDto) {
  //   pedido.situacao = Status.RECOLHIDO;
  //   this.router.navigate(['/visualizacao-pedidos']);
  // }

  // get listaPedidos() : Pedido[] {
  //   return this.pedidosEmAberto;
  // }

  get exibeLista(): boolean {
    return this.listaVazia;
  }
}
