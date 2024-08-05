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
import { FuncionarioDto } from '../../../../shared/models/dto/funcionario-dto.model';

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

  //  ======================[NEW]======================
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
  botaoDesabilitado: boolean = false; // não está sendo utilizado

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
            // console.log(roupa);
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
        if (data == null) {
          this.funcionarios = [];
        } else {
          this.funcionarios = data;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de usuários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  //  ======================[NEW]======================

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: Date = new Date();
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  cancelar(): void {
    this.voltarClicked.emit();
  }

  // adicionar(): void {
  //   if (
  //     this.formAdicionarFuncionario.form.valid &&
  //     this.nomeFuncionario &&
  //     this.emailFuncionario &&
  //     this.dataNascimentoFuncionario &&
  //     this.senhaFuncionario
  //   ) {
  //     const newFuncionario: Funcionario = new Funcionario();
  //     newFuncionario.id = 0;
  //     newFuncionario.nome = this.nomeFuncionario;
  //     newFuncionario.email = this.emailFuncionario;
  //     newFuncionario.dataNascimento = this.dataNascimentoFuncionario;
  //     newFuncionario.senha = this.senhaFuncionario;

  //     console.log('Funcionário criado com sucesso: ', newFuncionario);

  //     this.adicaoConcluida.emit();
  //   } else {
  //     console.log('Erro ao criar funcionário!');
  //     this.valueInvalid = true;
  //   }
  // }

  diasParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }
}
