import { Component, Input } from '@angular/core';
import { Pedido } from '../../shared/models/pedido.model';
import { Status } from '../../shared/models/status.enum';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pagar-pedido',
  templateUrl: './pagar-pedido.component.html',
  styleUrls: ['./pagar-pedido.component.css']
})

export class PagarPedidoComponent {
  @Input() pedido?: Pedido;


  pagarPedido() {
    if (this.pedido) {
      if (this.pedido.situacao === Status.AGUARDANDO_PAGAMENTO) {
        this.pedido.situacao = Status.PAGO;
        console.log('Pedido pago com sucesso!');
      } else {
        console.warn('Este pedido não está aguardando pagamento.');
      }
    } 
  }
}

@NgModule({
    declarations: [PagarPedidoComponent],
    imports: [
      CommonModule,
      FormsModule
    ],
    exports: [PagarPedidoComponent] // Se necessário
  })
  export class PagarPedidoModule { }  