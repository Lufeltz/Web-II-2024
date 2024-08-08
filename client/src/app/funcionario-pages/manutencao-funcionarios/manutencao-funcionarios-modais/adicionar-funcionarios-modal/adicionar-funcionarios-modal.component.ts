import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { NgxMaskDirective } from 'ngx-mask';
import { NumericoDirective } from '../../../../shared/directives/numerico.directive';
import { LetrasSomenteDirective } from '../../../../shared/directives/letras-somente.directive';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adicionar-funcionarios-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    NgxMaskDirective,
    NumericoDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './adicionar-funcionarios-modal.component.html',
  styleUrl: './adicionar-funcionarios-modal.component.css',
})
export class AdicionarFuncionariosModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() adicaoConcluida = new EventEmitter<void>();
  @ViewChild('formAdicionarFuncionario') formAdicionarFuncionario!: NgForm;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: Funcionario[] = [];
  novoFuncionario: boolean = true;
  funcionario: Funcionario = new Funcionario();
  id!: string;
  loading!: boolean;
  mensagem: string = '';
  mensagem_detalhes: string = '';
  botaoDesabilitado: boolean = false;

  ngOnInit(): void {
    this.loading = false;
    this.novoFuncionario = !this.id;
  }

  adicionar(): void {
    this.loading = true;
    if (this.formAdicionarFuncionario.form.valid) {
      if (this.novoFuncionario) {
        this.funcionarioService.postFuncionario(this.funcionario).subscribe({
          next: (funcionario) => {
            this.loading = false;
            this.router.navigate(['/manutencao-funcionario']);
          },
          error: (err) => {
            this.loading = false;
            this.mensagem = `Erro inserindo funcionario ${this.funcionario.usuario.nome}`;
            if (err.status == 409) {
              this.mensagem_detalhes = `[${err.status}] ${err.message}`;
            }
          },
        });
      }
    } else {
      this.loading = false;
    }
    this.adicaoConcluida.emit();
    this.listarFuncionarios();
  }

  listarFuncionarios(): Funcionario[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[] | null) => {
        this.funcionarios = data ? data : [];
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de usuários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: Date | null = null;
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  formattedDataNascimento: string = '';

  cancelar(): void {
    this.voltarClicked.emit();
  }

  diasParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }

  updateDataNascimento(): void {
    const [day, month, year] = this.formattedDataNascimento.split('/').map(Number);
    if (day && month && year) {
      this.funcionario.dataNascimento = new Date(year, month - 1, day)
    }
  }
}
