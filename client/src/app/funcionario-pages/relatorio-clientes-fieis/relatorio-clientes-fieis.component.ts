import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { PedidosService } from '../../services/pedidos.service';
import { PedidoModel } from '../../models/pedido.model';
import autoTable from 'jspdf-autotable';
import { PessoaModel } from '../../models/pessoa.model';
import { ClienteService } from '../../services/cliente.service';
import { Observable, forkJoin } from 'rxjs';

interface cliente_pedidos {
  idCliente: number;
  qntdPedidos: number;
  receita: number;
}

interface ClienteFiel {
  cliente: PessoaModel;
  qntdPedidos: number;
  receita: number;
}

@Component({
  selector: 'app-relatorio-clientes-fieis',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-clientes-fieis.component.html',
  styleUrl: './relatorio-clientes-fieis.component.css',
})

export class RelatorioClientesFieisComponent implements OnInit {
  currentDate: string;
  formRelatorioClientesFieis: FormGroup;
  periodo: string = "";
  criterio: string = "";
  relatorioClientesFieis: ClienteFiel[] = [];
  relatorioClientesGerado: boolean | null = null;
  pedidos!: PedidoModel[];
  diasTotais!: number;
  clienteTotal!: number;
  clientes: PessoaModel[] = [];
  clientePedidos: cliente_pedidos[] = [];


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
      criterio: ['0']
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
  
    let pedidosObservable: Observable<PedidoModel[]>;
    if (this.periodo === 'todo') {
      pedidosObservable = this.pedidosService.getPedidos();
    } else {
      pedidosObservable = this.pedidosService.getPedidosByDates(dataInicio, dataFim);
    }
  
    pedidosObservable.subscribe(pedidos => {
      this.pedidos = pedidos;
  
      const clientesObservable = this.pedidos.map(pedido => this.clienteService.getClienteById(pedido.id));
      
      forkJoin(clientesObservable).subscribe(clientes => {
        this.clientes = clientes;
        
        this.pedidos.forEach(pedido => {
          const clienteId = pedido.id; 
          if (!this.clientePedidos[clienteId]) {
            this.clientePedidos[clienteId] = { idCliente: clienteId, qntdPedidos: 0, receita: 0 };
          }
          this.clientePedidos[clienteId].qntdPedidos += 1;
          this.clientePedidos[clienteId].receita += pedido.precoTotal;
        });
        
        const clientesOrdenados = Object.entries(this.clientePedidos)
          .sort((a, b) => {
            const valorA = this.criterio === '0' ? a[1].qntdPedidos : a[1].receita;
            const valorB = this.criterio === '0' ? b[1].qntdPedidos : b[1].receita;
            return valorB - valorA;
          })
          .slice(0, 3);
  
        this.relatorioClientesFieis = clientesOrdenados.map(([id, clientePedidos]) => {
          const cliente = this.clientes.find(cliente => cliente.id === +id)!;
          return {
            cliente: cliente,
            qntdPedidos: clientePedidos.qntdPedidos,
            receita: clientePedidos.receita
          };
        });
  
        this.relatorioClientesGerado = true;
      });
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
  
    const dadosTabela = this.relatorioClientesFieis.map(cliente => {
      return [
        cliente.cliente.nome,
        cliente.cliente.cpf,
        cliente.cliente.email,
        cliente.cliente.telefone,
        cliente.cliente.endereco,
        cliente.qntdPedidos.toString(),
        this.formatarValor(cliente.receita)
      ];
    });
  
    autoTable(doc, {
      startY: 39,
      head: [['Nome:', 'CPF:', 'Email:', 'Telefone:', 'Endereço:', 'Qntd Pedidos', 'Receita gerada']],
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
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 50 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
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

  /*getPeriodoRelatorioClientes(): string {
    return `${this.formatarData(this.dataInicial)} a ${this.formatarData(
      this.dataFinal
    )}`;
  }*/

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}
