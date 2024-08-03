import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { PedidosService } from '../../services/pedidos.service';
import autoTable from 'jspdf-autotable';
import { ReceitaModel } from '../../models/receita.model';
import { Pedido } from '../../shared/models/pedido.model';

@Component({
  selector: 'app-relatorio-receitas',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './relatorio-receitas.component.html',
  styleUrl: './relatorio-receitas.component.css'
})

export class RelatorioReceitasComponent implements OnInit {
  currentDate: string;
  formRelatorioReceitas: FormGroup;
  dataInicial!: string;
  dataFinal!: string;
  relatorioReceitas: ReceitaModel[] = [];
  dataInicialMaiorDataFinal: boolean | null = null;
  relatorioReceitasGerado: boolean | null = null;
  pedidos!: Pedido[];
  diasTotais!: number;
  receitaTotal!: number;

  constructor(private router: Router, private formBuilder: FormBuilder, private pedidosService: PedidosService) {
    this.currentDate = new Date().toISOString().slice(0, 10);
    console.log(this.currentDate);
    this.formRelatorioReceitas = this.formBuilder.group({
      dataInicial: ['', [Validators.required, this.dataMaxValidator(this.currentDate)]],
      dataFinal: ['', [Validators.required, this.dataMaxValidator(this.currentDate)]],
    });
  }

  ngOnInit(): void {}

  gerarRelatorio() {
    this.dataInicial = this.formRelatorioReceitas.get('dataInicial')?.value;
    this.dataFinal = this.formRelatorioReceitas.get('dataFinal')?.value;

    if (this.dataInicial <= this.dataFinal) {
      this.pedidosService.getPedidosByDates(this.dataInicial, this.dataFinal).subscribe((pedidos: Pedido[]) => {
        this.pedidos = pedidos;
        const pedidosAgrupados: { [data: string]: Pedido[] } = {};
    
        for (const pedido of this.pedidos) {
          const dataCriacaoString = this.formatarData(pedido.dataPedido.toISOString().slice(0, 10));
          if (!pedidosAgrupados[dataCriacaoString]) {
            pedidosAgrupados[dataCriacaoString] = [];
          }
          pedidosAgrupados[dataCriacaoString].push(pedido);
        }
    
        this.relatorioReceitas = [];
    
        let dataAtual = new Date(this.dataInicial);
        while (dataAtual <= new Date(this.dataFinal)) {
          const dataAtualString = this.formatarData(dataAtual.toISOString().slice(0, 10));
          const pedidosDoDia = pedidosAgrupados[dataAtualString] || [];
          let receitaTotalDia = 0;
          for (const pedido of pedidosDoDia) {
            receitaTotalDia += pedido.orcamento.valor;
          }
    
          this.relatorioReceitas.push({ dataFormatada: dataAtualString, valor: receitaTotalDia });
          dataAtual.setDate(dataAtual.getDate() + 1);
        }
  
        this.diasTotais = this.calcularDiferencaDias(this.dataInicial, this.dataFinal) + 1;
        this.receitaTotal = this.relatorioReceitas.reduce((total, relatorio) => total + relatorio.valor, 0);
        this.relatorioReceitasGerado = this.relatorioReceitas.length > 0;
      });
      this.dataInicialMaiorDataFinal = false;
    } else {
      this.dataInicialMaiorDataFinal = true;
      this.relatorioReceitasGerado = false;
    }
  }
  
  gerarPDF() {
    const doc = new jsPDF();
  
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('Relatório de Receitas', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  
    doc.setFontSize(12);
    doc.text('Empresa: LOL - Lavanderia On-Line', 14, 30, { align: 'left' });
    doc.text('Período: ' + this.formatarData(this.dataInicial) + ' a ' + this.formatarData(this.dataFinal), 14, 36, { align: 'left' });
  
    const dadosTabela = this.relatorioReceitas.map(receita => {
      return [receita.dataFormatada,'R$' + receita.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })];
    });
  
    autoTable(doc, {
      startY: 39,
      head: [['Data:', 'Receita:']],
      headStyles: { fillColor: [204, 204, 204], textColor: 0, fontStyle: 'bold' },
      body: dadosTabela,
      bodyStyles: { textColor: 0 },
      foot: [['Dias totais: ' + this.diasTotais, 'Receita total: R$' + this.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) ]],
      footStyles: { fillColor: [204, 204, 204], textColor: 0, fontStyle: 'bold' },
      columnStyles: { 0: { cellWidth: 90,  }, 1: { cellWidth: 90 } }
    });
  
    doc.save('relatorio-receitas.pdf');
  }

  calcularDiferencaDias(dataInicial: string, dataFinal: string): number {
    const dataInicio = new Date(dataInicial);
    const dataFim = new Date(dataFinal);
    const diferencaMilissegundos = Math.abs(dataFim.getTime() - dataInicio.getTime());
    const diferencaDias = Math.ceil(diferencaMilissegundos / (1000 * 3600 * 24));
    return diferencaDias;
  }

  voltar() {
    this.router.navigate(['/']);
  }

  dataMaxValidator(maxDate: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const inputDate = new Date(control.value);
      const max = new Date(maxDate);
      return inputDate > max ? { 'dataMax': { value: control.value } } : null;
    };
  }

  dataFinalMaiorQueInicialValidator(dataInicial: string, dataFinal: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dataInicialValue = new Date(dataInicial);
      const dataFinalValue = new Date(dataFinal);
  
      return dataFinalValue < dataInicialValue ? { 'dataFinalMenorQueInicial': true } : null;
    };
  }

  getPeriodoRelatorioReceitas(): string {
    return `${this.formatarData(this.dataInicial)} a ${this.formatarData(this.dataFinal)}`;
  }

  formatarData(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

}
