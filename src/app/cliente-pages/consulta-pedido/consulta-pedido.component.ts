import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PedidoModel } from '../../models/pedido.model';
import { PedidosService } from '../../services/pedidos.service';

@Component({
  selector: 'app-consulta-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule ],
  templateUrl: './consulta-pedido.component.html',
  styleUrl: './consulta-pedido.component.css'
})

export class ConsultaPedidoComponent implements OnInit {
  @ViewChild('formConsultaPedido') formConsultaPedido!: NgForm;

  consultaPedido: number = 0;
  consultaPedidoSubmetido?: number;
  pedidoEncontrado: boolean | null = null;
  pedido: PedidoModel = new PedidoModel();
  prazoServico: string = '';
  totalItens: number = 0;
  precoTotal: number = 0;

  constructor(private router: Router, private pedidosService: PedidosService) {}

  ngOnInit(): void {
  }

  consultar() {
    if (this.formConsultaPedido.form.valid) {
      this.consultaPedidoSubmetido = this.consultaPedido;
      this.pedidosService.getPedidoByCodigo(this.consultaPedido.toString()).subscribe({
        next: (pedidos: PedidoModel[]) => {
          this.pedido = pedidos[0];
          this.calcularPrazo(this.pedido.dataCriacao.toString(), this.pedido.prazoServico);
          this.calcularQuantidadeTotal();
          this.calcularPrecoTotal();
          this.pedidoEncontrado = true;
          console.log('Pedido encontrado com sucesso!');
        },
        error: (error) => {
          this.pedidoEncontrado = false;
          console.log('Erro ao requisitar o pedido: ', error);
        }
      });
    }
    if (this.pedido.roupas.length === 0) {
      this.pedidoEncontrado = false;
    }
  }

  calcularPrazo(dataCriacao: string, prazoMinutos: number) {
    const dataCriacaoDate = new Date(dataCriacao);
    const prazoMilliseconds = prazoMinutos * 60000;
    let dataConclusaoTimestamp = dataCriacaoDate.getTime() + prazoMilliseconds;
    let dataConclusaoDate = new Date(dataConclusaoTimestamp);
    while (dataConclusaoDate.getDay() === 6 || dataConclusaoDate.getDay() === 0) {
      dataConclusaoTimestamp += 24 * 60 * 60 * 1000;
      dataConclusaoDate = new Date(dataConclusaoTimestamp);
    }
    this.prazoServico = dataConclusaoDate.toLocaleDateString('pt-BR');
  }

  calcularQuantidadeTotal() {
    this.totalItens = this.pedido.roupas.length;
  }

  calcularPrecoTotal() {
    this.precoTotal = 0;
    for (const item of this.pedido.roupas) {
      const preco = typeof item.preco === 'string' ? parseFloat(item.preco) : item.preco;
      this.precoTotal += preco;
    }
  }

  voltar() {
    this.router.navigate(['/']);
  }

}
