import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PedidosService } from '../../services/pedidos.service';
import { PedidoModel } from '../../models/pedido.model';
import { Status } from '../../models/status.enum';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
    private pedidosEmAberto : PedidoModel[] = [];
    private listaVazia : boolean = false;

    constructor(private pedidosService : PedidosService){

    }

    ngOnInit(): void {
      this.listaPedidosEmAberto();
    }

    listaPedidosEmAberto(): void {
      this.pedidosService.getPedidos().subscribe((pedidos : PedidoModel[]) => {
        for(let i=0; i<pedidos.length; i++){
          if(pedidos[i].situacao == Status.EM_ABERTO){
            this.pedidosEmAberto.push(pedidos[i]);
          }
        }
        if(this.pedidosEmAberto.length > 0){
            this.pedidosEmAberto.sort((a, b) => new Date(a.dataCriacao).getTime() - new Date(b.dataCriacao).getTime());
        } else {
          this.listaVazia = true;
        }
      });
    }

    get listaPedidos() : PedidoModel[] {
      return this.pedidosEmAberto;
    }

    get exibeLista() : boolean{
      return this.listaVazia;
    }
}
