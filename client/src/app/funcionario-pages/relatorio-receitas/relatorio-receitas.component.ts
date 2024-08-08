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
import { RelatorioService } from '../../services/relatorio.service';
import autoTable from 'jspdf-autotable';
import { Receita } from '../../shared/models/receita.model';
import { Pedido } from '../../shared/models/pedido.model';
import { ReceitaDto } from '../../shared/models/dto/receita-dto.model';

@Component({
  selector: 'app-relatorio-receitas',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-receitas.component.html',
  styleUrl: './relatorio-receitas.component.css',
})
export class RelatorioReceitasComponent implements OnInit {
  currentDate: string;
  formRelatorioReceitas: FormGroup;
  dataInicial!: string;
  dataFinal!: string;
  relatorioReceitas: Receita[] = [];
  dataInicialMaiorDataFinal: boolean | null = null;
  relatorioReceitasGerado: boolean | null = null;
  receitas!: ReceitaDto[];
  pedidos!: Pedido[];
  diasTotais!: number;
  receitaTotal: number = 0;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private relatorioService: RelatorioService
  ) {
    this.currentDate = new Date().toISOString().slice(0, 10);
    // console.log(this.currentDate);
    this.formRelatorioReceitas = this.formBuilder.group({
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

  gerarRelatorio(): ReceitaDto[] {
    this.dataInicial = this.formRelatorioReceitas.get('dataInicial')?.value;
    this.dataFinal = this.formRelatorioReceitas.get('dataFinal')?.value;
    const dataI: Date = new Date(this.dataInicial);
    const dataF: Date = new Date(this.dataFinal);

    if (this.dataInicial <= this.dataFinal) {
      this.relatorioService.getAllReceitas(dataI, dataF).subscribe({
        next: (receita: ReceitaDto[] | null) => {
          if (receita == null) {
            this.receitas = [];
          } else {
            // console.log(receita);
            this.receitas = receita.map((r) => ({
              ...r,
              data: new Date(r.data),
            }));
            this.relatorioReceitas = this.receitas.map((receita) => ({
              dataFormatada: receita.data
                .toISOString()
                .split('T')[0]
                .replace(/-/g, '/'),
              valor: receita.receita,
            }));
            this.receitaTotal = this.receitas.reduce(
              (sum, receita) => sum + receita.receita,
              0
            );
          }
          this.diasTotais =
            this.calcularDiferencaDias(this.dataInicial, this.dataFinal) + 1;
        },
        error: (err) => {
          console.log('Erro ao gerar relatorio');
        },
      });
      this.dataInicialMaiorDataFinal = false;
      this.relatorioReceitasGerado = true;
    } else {
      this.dataInicialMaiorDataFinal = true;
      this.relatorioReceitasGerado = false;
    }
    return this.receitas;
  }

  gerarPDF() {
    const doc = new jsPDF();

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text(
      'Relatório de Receitas',
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

    const dadosTabela = this.relatorioReceitas.map((receita) => {
      return [
        this.formatarDataFormatada(receita.dataFormatada),
        'R$' +
          receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [['Data:', 'Receita:']],
      headStyles: {
        fillColor: [204, 204, 204],
        textColor: 0,
        fontStyle: 'bold',
      },
      body: dadosTabela,
      bodyStyles: { textColor: 0 },
      foot: [
        [
          'Dias totais: ' + this.diasTotais,
          'Receita total: R$' +
            this.receitaTotal.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            }),
        ],
      ],
      footStyles: {
        fillColor: [204, 204, 204],
        textColor: 0,
        fontStyle: 'bold',
      },
      columnStyles: { 0: { cellWidth: 90 }, 1: { cellWidth: 90 } },
    });

    doc.save('relatorio-receitas.pdf');
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

  getPeriodoRelatorioReceitas(): string {
    return `${this.formatarData(this.dataInicial)} a ${this.formatarData(
      this.dataFinal
    )}`;
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarDataFormatada(dataString: string): string {
    const [ano, mes, dia] = dataString.split('/');
    const data = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const diaFormatado = String(data.getDate()).padStart(2, '0');
    const mesFormatado = String(data.getMonth() + 1).padStart(2, '0');
    const anoFormatado = data.getFullYear();

    return `${diaFormatado}/${mesFormatado}/${anoFormatado}`;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }
}
