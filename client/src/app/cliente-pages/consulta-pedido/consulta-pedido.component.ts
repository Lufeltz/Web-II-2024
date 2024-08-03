import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { Pedido } from '../../shared/models/pedido.model';

@Component({
  selector: 'app-consulta-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './consulta-pedido.component.html',
  styleUrls: ['./consulta-pedido.component.css'],
})
export class ConsultaPedidoComponent implements OnInit {
  @ViewChild('formConsultaPedido') formConsultaPedido!: NgForm;

  consultaPedido?: number;
  consultaPedidoSubmetido?: number;
  pedidoEncontrado: boolean | null = null;
  pedido: Pedido = new Pedido();
  prazoServico: string = '';
  totalItens: number = 0;
  precoTotal: number = 0;

  constructor(private router: Router, private pedidosService: PedidosService) {}

  ngOnInit(): void {}

  consultar() {
    if (this.formConsultaPedido.form.valid && this.consultaPedido) {
      this.consultaPedidoSubmetido = this.consultaPedido;
  
      this.pedidosService.getPedidoByCodigo(this.consultaPedido.toString())
        .subscribe({
          next: (pedidos: Pedido[]) => {
            // Filtra o pedido correspondente ao número fornecido
            const pedidoEncontrado = pedidos.find(
              (pedido) => pedido.numeroPedido === Number(this.consultaPedido)
            );
  
            if (pedidoEncontrado) {
              this.pedido = pedidoEncontrado;
  
              if (this.pedido.listaPedidoRoupa.length === 0) {
                this.pedidoEncontrado = false;
                console.log('Nenhum item de roupa encontrado no pedido.');
                return;
              }
  
              const dataPedidoTimestamp = new Date(this.pedido.dataPedido).getTime();
              const prazoMinutos = this.pedido.orcamento
                ? new Date(this.pedido.orcamento.dataPrazo).getTime() - dataPedidoTimestamp
                : 0;
  
              this.calcularPrazo(dataPedidoTimestamp, prazoMinutos);
              this.calcularQuantidadeTotal();
              this.calcularPrecoTotal();
              this.pedidoEncontrado = true;
              console.log('Pedido encontrado com sucesso: ', this.pedido);
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
      this.pedidoEncontrado = false;
      console.log('Formulário inválido ou código de pedido não fornecido.');
    }
  }
  
  calcularPrazo(dataCriacaoTimestamp: number, prazoMilliseconds: number) {
    const dataCriacaoDate = new Date(dataCriacaoTimestamp);
    let dataConclusaoTimestamp = dataCriacaoDate.getTime() + prazoMilliseconds;
    let dataConclusaoDate = new Date(dataConclusaoTimestamp);

    // Ajustar o prazo para evitar finais de semana
    while (
      dataConclusaoDate.getDay() === 6 ||
      dataConclusaoDate.getDay() === 0
    ) {
      dataConclusaoTimestamp += 24 * 60 * 60 * 1000;
      dataConclusaoDate = new Date(dataConclusaoTimestamp);
    }

    this.prazoServico = dataConclusaoDate.toLocaleDateString('pt-BR');
  }

  calcularQuantidadeTotal() {
    this.totalItens = this.pedido.listaPedidoRoupa.length;
  }

  calcularPrecoTotal() {
    this.precoTotal = 0;
    for (const item of this.pedido.listaPedidoRoupa) {
      const preco =
        typeof item.roupa.preco === 'string'
          ? parseFloat(item.roupa.preco)
          : item.roupa.preco;
      this.precoTotal += preco;
    }
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
