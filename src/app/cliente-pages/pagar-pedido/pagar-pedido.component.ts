import { Component, Input } from '@angular/core';
import { PedidoModel } from '../../models/pedido.model';
import { Status } from '../../models/status.enum';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pagar-pedido',
  templateUrl: './pagar-pedido.component.html',
  styleUrls: ['./pagar-pedido.component.css']
})

export class PagarPedidoComponent {
  @Input() pedido?: PedidoModel;


  pagarPedido() {
    if (this.pedido?.situacao === 'AGUARDANDO PAGAMENTO') {
      this.pedido.situacao = Status.PAGO; // Alterar o estado do pedido para PAGO
          console.log('Pedido pago com sucesso!');
    } else {
      console.warn('Este pedido não está aguardando pagamento.');
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