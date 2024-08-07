import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PedidosService } from '../../services/pedidos.service';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { Status } from '../../shared/models/status.enum';

@Component({
  selector: 'app-consulta-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './consulta-pedido.component.html',
  styleUrls: ['./consulta-pedido.component.css'],
  providers: [DatePipe]
})
export class ConsultaPedidoComponent implements OnInit {
  @ViewChild('formConsultaPedido') formConsultaPedido!: NgForm;

  numeroPedido?: number;
  consultaPedidoSubmetido?: number;
  pedidoEncontrado: boolean | null = null;
  pedido: PedidoDto = new PedidoDto();
  prazoServico: string = '';
  totalItens: number = 0;
  precoTotal: number = 0;
  Status = Status;

  constructor(private router: Router, private pedidosService: PedidosService, private datePipe: DatePipe) {}

  ngOnInit(): void {}

  consultar() {
    if (this.formConsultaPedido.form.valid && this.numeroPedido) {
      this.consultaPedidoSubmetido = this.numeroPedido;
  
      this.pedidosService.consultar(this.numeroPedido).subscribe({
        next: (pedido: PedidoDto | null) => {
          if (pedido) {
            this.pedido = pedido;
            this.prazoServico = this.datePipe.transform(new Date(this.pedido.orcamento.dataPrazo), 'dd/MM/yyyy') || '';
            this.totalItens = this.pedido.listaPedidoRoupas.reduce((total, item) => total + item.quantidade, 0);
            this.precoTotal = this.pedido.orcamento.valor;
            this.pedidoEncontrado = true;
          } else {
            this.pedidoEncontrado = false;
            console.log('Pedido não encontrado.');
          }
        },
        error: (error) => {
          this.pedidoEncontrado = false;
          console.log('Erro ao requisitar o pedido: ', error);
        }
      });
    } else {
      this.pedidoEncontrado = false;
      console.log('Formulário inválido ou código de pedido não fornecido.');
    }
  }
  
  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
