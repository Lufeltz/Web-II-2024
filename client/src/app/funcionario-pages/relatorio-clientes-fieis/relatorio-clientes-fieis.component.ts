import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { PedidosService } from '../../services/pedidos.service';
import autoTable from 'jspdf-autotable';
import { ClienteService } from '../../services/cliente.service';
import { Observable, forkJoin } from 'rxjs';
import { Pedido } from '../../shared/models/pedido.model';
import { ClienteFiel } from '../../shared/models/cliente-fiel.model';

@Component({
  selector: 'app-relatorio-clientes-fieis',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-clientes-fieis.component.html',
  styleUrls: ['./relatorio-clientes-fieis.component.css'],
})
export class RelatorioClientesFieisComponent implements OnInit {
  currentDate: string;
  formRelatorioClientesFieis: FormGroup;
  periodo: string = '';
  criterio: string = '';
  relatorioClientesFieis: ClienteFiel[] = [];
  relatorioClientesGerado: boolean | null = null;
  pedidos!: Pedido[];
  diasTotais!: number;
  clienteTotal!: number;
  clientePedidos: { [id: number]: ClienteFiel } = {};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private pedidosService: PedidosService,
    private clienteService: ClienteService
  ) {
    this.currentDate = new Date().toISOString().slice(0, 10);
    console.log(this.currentDate);
    this.formRelatorioClientesFieis = this.formBuilder.group({
      dataInicial: [''],
      dataFinal: [''],
      periodo: ['todo'],
      criterio: ['0'],
    });
  }

  ngOnInit(): void {}

  gerarRelatorio() {
    this.relatorioClientesFieis = [];
    this.periodo = this.formRelatorioClientesFieis.get('periodo')?.value;
    this.criterio = this.formRelatorioClientesFieis.get('criterio')?.value;

    const endDate = new Date(this.currentDate);
    let startDate: Date = new Date(0);

    switch (this.periodo) {
      case '7':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90':
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 90);
        break;
    }

    const dataInicio = startDate.toISOString().slice(0, 10);
    const dataFim = endDate.toISOString().slice(0, 10);

    let pedidosObservable: Observable<Pedido[]>;
    if (this.periodo === 'todo') {
      pedidosObservable = this.pedidosService.getPedidos();
    } else {
      pedidosObservable = this.pedidosService.getPedidosByDates(
        dataInicio,
        dataFim
      );
    }

    pedidosObservable.subscribe((pedidos) => {
      this.pedidos = pedidos;

      // Simulando dados de clientes como ClienteFiel diretamente
      this.pedidos.forEach((pedido) => {
        const clienteId = pedido.id;
        if (!this.clientePedidos[clienteId]) {
          this.clientePedidos[clienteId] = {
            id: clienteId,
            quantidadePedidos: 0,
            receita: 0,
          };
        }
        this.clientePedidos[clienteId].quantidadePedidos += 1;
        this.clientePedidos[clienteId].receita += pedido.orcamento.valor;
      });

      const clientesOrdenados = Object.values(this.clientePedidos)
        .sort((a, b) => {
          const valorA =
            this.criterio === '0' ? a.quantidadePedidos : a.receita;
          const valorB =
            this.criterio === '0' ? b.quantidadePedidos : b.receita;
          return valorB - valorA;
        })
        .slice(0, 3);

      this.relatorioClientesFieis = clientesOrdenados;

      this.relatorioClientesGerado = true;
    });
  }

  gerarPDF() {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(
      'Relatório de Clientes Fieis',
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: 'center' }
    );

    doc.setFontSize(12);
    doc.text('Empresa: LOL - Lavanderia On-Line', 14, 30, { align: 'left' });
    doc.text(
      'Período: ', //+ this.getPeriodoRelatorioClientes(),
      14,
      36,
      { align: 'left' }
    );

    const dadosTabela = this.relatorioClientesFieis.map((cliente) => {
      return [
        cliente.id.toString(), // Exibindo o ID como exemplo
        cliente.quantidadePedidos.toString(),
        this.formatarValor(cliente.receita),
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [['ID Cliente', 'Qntd Pedidos', 'Receita gerada']],
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: 0,
        fontStyle: 'bold',
      },
      body: dadosTabela,
      bodyStyles: { textColor: 0 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 30 },
        2: { cellWidth: 30 },
      },
    });

    doc.save('relatorio-clientes.pdf');
  }

  calcularDiferencaDias(dataInicial: string, dataFinal: string): number {
    const dataInicio = new Date(dataInicial);
    const dataFim = new Date(dataFinal);
    const diferencaMilissegundos = Math.abs(
      dataFim.getTime() - dataInicio.getTime()
    );
    const diferencaDias = Math.ceil(
      diferencaMilissegundos / (1000 * 3600 * 24)
    );
    return diferencaDias;
  }

  voltar() {
    this.router.navigate(['/']);
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}
