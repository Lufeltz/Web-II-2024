// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import {
//   AbstractControl,
//   FormBuilder,
//   FormGroup,
//   FormsModule,
//   ReactiveFormsModule,
//   ValidatorFn,
//   Validators,
// } from '@angular/forms';
// import { Router } from '@angular/router';
// import { jsPDF } from 'jspdf';
// import { PedidosService } from '../../services/pedidos.service';
// import { Pedido } from '../../shared/models/pedido.model';
// import autoTable from 'jspdf-autotable';
// import { ClienteService } from '../../services/cliente.service';
// import { Cliente } from '../../shared/models/cliente.model';
// import { RelatorioCliente } from '../../shared/models/relatorio-cliente.model';
// import { RelatorioTodosClientes } from '../../shared/models/dto/relatorio-todos-clientes';
// import { RelatorioService } from '../../services/relatorio.service';

// @Component({
//   selector: 'app-relatorio-clientes',
//   standalone: true,
//   imports: [FormsModule, CommonModule, ReactiveFormsModule],
//   templateUrl: './relatorio-clientes.component.html',
//   styleUrl: './relatorio-clientes.component.css',
// })
// export class RelatorioClientesComponent implements OnInit {
//   currentDate: string;
//   formRelatorioClientes: FormGroup;
//   dataInicial!: string;
//   dataFinal!: string;
//   relatorioClientes: RelatorioCliente[] = [];
//   dataInicialMaiorDataFinal: boolean | null = null;
//   relatorioClientesGerado: boolean | null = null;
//   pedidos!: Pedido[];
//   diasTotais!: number;
//   clienteTotal!: number;
//   clientes: Cliente[] = [];

//   // ====================[NEW]====================
//   clientes2: RelatorioTodosClientes[] = []
//   mensagem: string = '';
//   mensagem_detalhes = '';

//   ngOnInit(): void {
//     this.listarClientes();
//   }

//   listarClientes(): RelatorioTodosClientes[] {
//     this.relatorioService.getAllClientes().subscribe({
//       next: (data: RelatorioTodosClientes[] | null) => {
//         if (data == null) {
//           this.clientes2 = [];
//         } else {
//           this.clientes2 = data;
//           console.log(this.clientes2);
//         }
//       },
//       error: (err) => {
//         this.mensagem = 'Erro buscando lista de clientes';
//         this.mensagem_detalhes = `[${err.status} ${err.message}]`;
//       },
//     });
//     return this.clientes2;
//   }

//   // ====================[NEW]====================

//   constructor(
//     private router: Router,
//     private formBuilder: FormBuilder,
//     private pedidosService: PedidosService,
//     private clienteService: ClienteService,
//     // novo
//     private relatorioService: RelatorioService
//   ) {
//     this.currentDate = new Date().toISOString().slice(0, 10);
//     console.log(this.currentDate);
//     this.formRelatorioClientes = this.formBuilder.group({
//       dataInicial: [
//         '',
//         [Validators.required, this.dataMaxValidator(this.currentDate)],
//       ],
//       dataFinal: [
//         '',
//         [Validators.required, this.dataMaxValidator(this.currentDate)],
//       ],
//     });
//   }

//   gerarRelatorio() {
//     this.relatorioClientes = []

//     if (this.dataInicial <= this.dataFinal) {
//       this.clienteService.getClientesRelatorio().subscribe({
//         next: (clientes: RelatorioCliente[]) => {
//           clientes.forEach((cliente) => {
//             this.relatorioClientes.push({
//               id: cliente.id,
//               nome: cliente.nome,
//               cpf: cliente.cpf,
//               email: cliente.email,
//               telefone: cliente.telefone,
//               endereco: cliente.endereco,
//             });
//           });

//           this.pedidosService
//             .getPedidosByDates(this.dataInicial, this.dataFinal)
//             .subscribe((pedidos: Pedido[]) => {
//               this.relatorioClientesGerado = false;

//               let dataAtual = new Date(this.dataInicial);
//               while (dataAtual <= new Date(this.dataFinal)) {
//                 dataAtual.setDate(dataAtual.getDate() + 1);
//               }

//               this.relatorioClientesGerado = this.relatorioClientes.length > 0;
//             });

//           this.dataInicialMaiorDataFinal = false;
//         },
//       });
//     } else {
//       this.dataInicialMaiorDataFinal = true;
//       this.relatorioClientesGerado = false;
//     }
//   }

//   gerarPDF() {
//     const doc = new jsPDF();

//     doc.setFont('helvetica', 'bold');
//     doc.setFontSize(20);
//     doc.text(
//       'Relatório de Clientes',
//       doc.internal.pageSize.getWidth() / 2,
//       15,
//       { align: 'center' }
//     );

//     doc.setFontSize(12);
//     doc.text('Empresa: LOL - Lavanderia On-Line', 14, 30, { align: 'left' });
//     doc.text(
//       'Período: ' +
//         this.formatarData(this.dataInicial) +
//         ' a ' +
//         this.formatarData(this.dataFinal),
//       14,
//       36,
//       { align: 'left' }
//     );

//     const dadosTabela = this.relatorioClientes.map((cliente) => {
//       return [
//         cliente.nome,
//         cliente.cpf,
//         cliente.email,
//         cliente.telefone,
//         cliente.endereco.rua,
//       ];
//     });

//     autoTable(doc, {
//       startY: 39,
//       head: [['Nome:', 'CPF:', 'Email:', 'Telefone:', 'Endereço:']],
//       headStyles: {
//         fillColor: [204, 204, 204],
//         textColor: 0,
//         fontStyle: 'bold',
//       },
//       body: dadosTabela,
//       bodyStyles: { textColor: 0 },
//       columnStyles: {
//         0: { cellWidth: 30 },
//         1: { cellWidth: 30 },
//         2: { cellWidth: 40 },
//         3: { cellWidth: 30 },
//         4: { cellWidth: 50 },
//       },
//     });

//     doc.save('relatorio-clientes.pdf');
//   }

//   voltar() {
//     this.router.navigate(['/']);
//   }

//   dataMaxValidator(maxDate: string): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       const inputDate = new Date(control.value);
//       const max = new Date(maxDate);
//       return inputDate > max ? { dataMax: { value: control.value } } : null;
//     };
//   }

//   dataFinalMaiorQueInicialValidator(
//     dataInicial: string,
//     dataFinal: string
//   ): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: any } | null => {
//       const dataInicialValue = new Date(dataInicial);
//       const dataFinalValue = new Date(dataFinal);

//       return dataFinalValue < dataInicialValue
//         ? { dataFinalMenorQueInicial: true }
//         : null;
//     };
//   }

//   getPeriodoRelatorioClientes(): string {
//     return `${this.formatarData(this.dataInicial)} a ${this.formatarData(
//       this.dataFinal
//     )}`;
//   }

//   formatarData(data: string): string {
//     const [ano, mes, dia] = data.split('-');
//     return `${dia}/${mes}/${ano}`;
//   }

//   formatarValor(valor: number): string {
//     return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
//   }
// }

// RODRIGO
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

  // ====================[NEW]====================
  clientes: RelatorioTodosClientes[] = [];
  mensagem: string = '';
  mensagem_detalhes = '';

  ngOnInit(): void {
    //this.listarClientes();
  }

  formatarCpf(cpf: string): string {
    return cpf
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  formatarTelefone(telefone: string): string {
    return telefone
      .replace(/\D/g, '') // Remove tudo que não é dígito
      .replace(/^(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4'); // Formata como (41) 9 7652-0932
  }
  
  

  gerarRelatorio(): RelatorioTodosClientes[] {
    this.relatorioService.getAllClientes().subscribe({
      next: (data: RelatorioTodosClientes[] | null) => {
        if (data == null) {
          this.clientes = [];
        } else {
          this.clientes = data;
          console.log(this.clientes);
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

  // ====================[NEW]====================

  constructor(
    private router: Router,
    // novo
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

    // Preparar os dados com formatação
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

  // voltar() {
  //   this.router.navigate(['/']);
  // }

  get listaClientes(): RelatorioTodosClientes[] {
    return this.clientes;
  }
}

// RODRIGO
