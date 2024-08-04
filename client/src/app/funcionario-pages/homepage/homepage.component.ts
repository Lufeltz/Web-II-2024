import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos.service';
import { Status } from '../../shared/models/status.enum';
import { Router } from '@angular/router';
import { Pedido } from '../../shared/models/pedido.model';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
    private pedidosEmAberto : Pedido[] = [];
    private listaVazia : boolean = false;

    constructor(
      private pedidosService : PedidosService,
      private router: Router
    ){

    }
    

    ngOnInit(): void {
      this.listaPedidosEmAberto();
    }

    listaPedidosEmAberto(): void {
      this.pedidosService.getPedidos().subscribe((pedidos : Pedido[]) => {
        for(let i=0; i<pedidos.length; i++){
          if(pedidos[i].situacao.tipoSituacao == Status.EM_ABERTO){
            this.pedidosEmAberto.push(pedidos[i]);
          }
        }
        if(this.pedidosEmAberto.length > 0){
            this.pedidosEmAberto.sort((a, b) => new Date(a.dataPedido).getTime() - new Date(b.dataPedido).getTime());
        } else {
          this.listaVazia = true;
        }
      });
    }

    recolherPedido(pedido: Pedido) {
      pedido.situacao.tipoSituacao = Status.RECOLHIDO;
      this.router.navigate(['/visualizacao-pedidos']);
    }

    get listaPedidos() : Pedido[] {
      return this.pedidosEmAberto;
    }

    get exibeLista() : boolean{
      return this.listaVazia;
    }
}
