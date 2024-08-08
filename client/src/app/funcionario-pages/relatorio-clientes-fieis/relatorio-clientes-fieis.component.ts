import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RelatorioService } from '../../services/relatorio.service';
import { ClienteFiel } from '../../shared/models/cliente-fiel.model';
import { Cliente } from '../../shared/models/cliente.model';
import { ClienteFielDto } from '../../shared/models/dto/cliente-fiel-dto.model';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-relatorio-clientes-fieis',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgxMaskPipe],
  templateUrl: './relatorio-clientes-fieis.component.html',
  styleUrls: ['./relatorio-clientes-fieis.component.css'],
})
export class RelatorioClientesFieisComponent implements OnInit {
  newClient: boolean = false;
  client: Cliente = new Cliente();
  id!: string;
  loading!: boolean;
  senhaAntiga: string = '';
  mensagem: string = '';
  mensagem_detalhes: string = '';
  botaoDesabilitado = false;

  relatorioClientesFieis: ClienteFiel[] = [];
  clientesFieis: ClienteFielDto[] = [];
  relatorioClientesGerado: boolean | null = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private relatorioService: RelatorioService,
    private route: ActivatedRoute
  ) {}

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

  ngOnInit(): void {}

  gerarRelatorio() {
    this.relatorioService.getAllClientesFieis().subscribe({
      next: (data: ClienteFielDto[] | null) => {
        if (data == null) {
          this.clientesFieis = [];
        } else {
          this.clientesFieis = data;
          this.relatorioClientesGerado = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de clientes';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.clientesFieis;
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
    doc.text('Empresa: LOL - Lavanderia On-Line', 5, 30, { align: 'left' });

    const dadosTabela = this.clientesFieis.map((cliente) => {
      return [
        cliente.cliente.usuario.nome.toString(),
        this.formatarCpf(cliente.cliente.cpf),
        cliente.cliente.usuario.email.toString(),
        this.formatarTelefone(cliente.cliente.telefone),
        cliente.cliente.endereco.cidade.toString(),
        cliente.quantidadePedidos.toString(),
        'R$ ' + this.formatarValor(cliente.receita),
      ];
    });

    autoTable(doc, {
      startY: 39,
      head: [
        [
          'Nome',
          'CPF',
          'Email',
          'Telefone',
          'Endereço',
          'Qntd Pedidos',
          'Receita gerada',
        ],
      ],
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
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 30 },
      },
      margin: { left: 5, right: 5 },
    });

    doc.save('relatorio-clientes.pdf');
  }

  voltar() {
    this.router.navigate(['/']);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  get listaCliente(): ClienteFielDto[] {
    return this.clientesFieis;
  }
}
