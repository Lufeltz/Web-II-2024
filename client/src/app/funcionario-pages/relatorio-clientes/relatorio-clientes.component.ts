import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { Pedido } from '../../shared/models/pedido.model';
import autoTable from 'jspdf-autotable';
import { RelatorioCliente } from '../../shared/models/relatorio-cliente.model';
import { RelatorioTodosClientes } from '../../shared/models/dto/relatorio-todos-clientes';
import { RelatorioService } from '../../services/relatorio.service';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-relatorio-clientes',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgxMaskPipe],
  templateUrl: './relatorio-clientes.component.html',
  styleUrl: './relatorio-clientes.component.css',
})
export class RelatorioClientesComponent implements OnInit {
  relatorioClientes: RelatorioCliente[] = [];
  relatorioClientesGerado: boolean | null = null;
  pedidos!: Pedido[];
  diasTotais!: number;
  clienteTotal!: number;

  clientes: RelatorioTodosClientes[] = [];
  mensagem: string = '';
  mensagem_detalhes = '';

  ngOnInit(): void {}

  formatarCpf(cpf: string): string {
    return cpf
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  formatarTelefone(telefone: string): string {
    return telefone
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4');
  }

  gerarRelatorio(): RelatorioTodosClientes[] {
    this.relatorioService.getAllClientes().subscribe({
      next: (data: RelatorioTodosClientes[] | null) => {
        if (data == null) {
          this.clientes = [];
        } else {
          this.clientes = data;
          // console.log(this.clientes);
          this.relatorioClientesGerado = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de clientes';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.clientes;
  }

  constructor(
    private router: Router,
    private relatorioService: RelatorioService
  ) {}

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

    const dadosTabela = this.clientes.map((cliente) => {
      return [
        cliente.usuario.nome,
        this.formatarCpf(cliente.cpf),
        cliente.usuario.email,
        this.formatarTelefone(cliente.telefone),
        `${cliente.endereco.rua}, ${cliente.endereco.numero} - ${cliente.endereco.cidade}`,
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [['Nome', 'CPF', 'Email', 'Telefone', 'Endereço']],
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

  get listaClientes(): RelatorioTodosClientes[] {
    return this.clientes;
  }
}
