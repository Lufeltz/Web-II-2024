import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-consulta-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule ],
  templateUrl: './consulta-pedido.component.html',
  styleUrl: './consulta-pedido.component.css'
})
export class ConsultaPedidoComponent {
  @ViewChild('formConsultaPedido') formConsultaPedido!: NgForm;

  consultaPedido?: String;
  consultaPedidoSubmetido?: String;
  pedidoEncontrado: boolean | null = null;

  //PEDIDO MODEL
  codigoPedido?: string;
  situacaoPedido?: string;
  prazo?: String;
  descricaoRoupa?: string[];
  precoRoupa?: number[];
  precoTotal?: number;
  totalItens?: number;

  mapPedido: Map<any, any> = new Map();

  constructor(private router: Router) {
    this.totalItens = 0;
    this.precoTotal = 0;
  }

  consultar() {
    if (this.formConsultaPedido.form.valid) {
      this.consultaPedidoSubmetido = this.consultaPedido;

      
      this.mapPedido.set('codigoPedido', "123456789");
      this.mapPedido.set('situacaoPedido', "EM ABERTO");
      this.mapPedido.set('prazo', '20/03/2024');
      this.mapPedido.set('descricaoRoupa', ['Camisa', 'Calça', 'Vestido', 'Saia', 'Blusa', 'Shorts', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Blusa', 'Shorts', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Blusa', 'Shorts', 'Camisa', 'Calça', 'Vestido', 'Saia', 'Blusa', 'Shorts']);
      this.mapPedido.set('precoRoupa', [15.30, 10.80, 14, 23.20, 30.10, 7.65, 15.30, 10.80, 14, 23.20, 30.10, 7.65, 15.30, 10.80, 14, 23.20, 30.10, 7.65, 15.30, 10.80, 14, 23.20, 30.10, 7.65]);

      this.codigoPedido = this.mapPedido.get('codigoPedido');
      this.situacaoPedido = this.mapPedido.get('situacaoPedido');
      this.prazo = this.mapPedido.get('prazo');
      this.descricaoRoupa = this.mapPedido.get('descricaoRoupa');
      this.precoRoupa = this.mapPedido.get('precoRoupa');

      this.totalItens = this.mapPedido.get('descricaoRoupa').length;
      for (let i = 0; i < this.mapPedido.get('precoRoupa').length; i++) {
        this.precoTotal += this.mapPedido.get('precoRoupa')[i];
      }


      this.pedidoEncontrado = true;
      //this.pedidoEncontrado = false;
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }

}
