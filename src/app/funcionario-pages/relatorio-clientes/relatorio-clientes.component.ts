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

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-clientes.component.html',
  styleUrl: './relatorio-clientes.component.css',
})
export class RelatorioClientesComponent implements OnInit {
  currentDate: string;
  formRelatorioClientes: FormGroup;
  dataInicial!: string;
  dataFinal!: string;
  relatorioClientes: PessoaModel[] = [];
  dataInicialMaiorDataFinal: boolean | null = null;
  relatorioClientesGerado: boolean | null = null;
  pedidos!: PedidoModel[];
  diasTotais!: number;
  clienteTotal!: number;
  clientes: PessoaModel[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private pedidosService: PedidosService,
    private clienteService: ClienteService
  ) {
    this.currentDate = new Date().toISOString().slice(0, 10);
    console.log(this.currentDate);
    this.formRelatorioClientes = this.formBuilder.group({
      dataInicial: [
        '',
        [Validators.required, this.dataMaxValidator(this.currentDate)],
      ],
      dataFinal: [
        '',
        [Validators.required, this.dataMaxValidator(this.currentDate)],
      ],
    });
  }

  ngOnInit(): void {}

  gerarRelatorio() {
    this.relatorioClientes = []
    this.dataInicial = this.formRelatorioClientes.get('dataInicial')?.value;
    this.dataFinal = this.formRelatorioClientes.get('dataFinal')?.value;

    if (this.dataInicial <= this.dataFinal) {
      this.clienteService.getClientes().subscribe({
        next: (clientes: PessoaModel[]) => {
          clientes.forEach((cliente) => {
            this.relatorioClientes.push({
              id: cliente.id,
              nome: cliente.nome,
              cpf: cliente.cpf,
              email: cliente.email,
              telefone: cliente.telefone,
              endereco: cliente.endereco,
              funcionario: cliente.funcionario,
            });
          });

          this.pedidosService
            .getPedidosByDates(this.dataInicial, this.dataFinal)
            .subscribe((pedidos: PedidoModel[]) => {
              this.relatorioClientesGerado = false;

              let dataAtual = new Date(this.dataInicial);
              while (dataAtual <= new Date(this.dataFinal)) {
                dataAtual.setDate(dataAtual.getDate() + 1);
              }

              this.relatorioClientesGerado = this.relatorioClientes.length > 0;
            });

          this.dataInicialMaiorDataFinal = false;
        },
      });
    } else {
      this.dataInicialMaiorDataFinal = true;
      this.relatorioClientesGerado = false;
    }
  }

  gerarPDF() {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(
      'Relatório de Clientes',
      doc.internal.pageSize.getWidth() / 2,
      15,
      { align: 'center' }
    );

    doc.setFontSize(12);
    doc.text('Empresa: LOL - Lavanderia On-Line', 14, 30, { align: 'left' });
    doc.text(
      'Período: ' +
        this.formatarData(this.dataInicial) +
        ' a ' +
        this.formatarData(this.dataFinal),
      14,
      36,
      { align: 'left' }
    );

    const dadosTabela = this.relatorioClientes.map((cliente) => {
      return [
        cliente.nome,
        cliente.cpf,
        cliente.email,
        cliente.telefone,
        cliente.endereco,
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [['Nome:', 'CPF:', 'Email:', 'Telefone:', 'Endereço:']],
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

  dataMaxValidator(maxDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputDate = new Date(control.value);
      const max = new Date(maxDate);
      return inputDate > max ? { dataMax: { value: control.value } } : null;
    };
  }

  dataFinalMaiorQueInicialValidator(
    dataInicial: string,
    dataFinal: string
  ): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dataInicialValue = new Date(dataInicial);
      const dataFinalValue = new Date(dataFinal);

      return dataFinalValue < dataInicialValue
        ? { dataFinalMenorQueInicial: true }
        : null;
    };
  }

  getPeriodoRelatorioClientes(): string {
    return `${this.formatarData(this.dataInicial)} a ${this.formatarData(
      this.dataFinal
    )}`;
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}
