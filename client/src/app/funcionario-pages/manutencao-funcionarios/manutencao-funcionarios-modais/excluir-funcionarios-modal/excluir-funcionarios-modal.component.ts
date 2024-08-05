import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Router } from '@angular/router';
import { FuncionarioDto } from '../../../../shared/models/dto/funcionario-dto.model';

@Component({
  selector: 'app-excluir-funcionarios-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excluir-funcionarios-modal.component.html',
  styleUrl: './excluir-funcionarios-modal.component.css',
})
export class ExcluirFuncionariosModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() exclusaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaExcluir!: FuncionarioDto;

  //  ======================[NEW]======================
  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: FuncionarioDto[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  excluir(): void {
    this.mensagem = '';
    this.mensagem_detalhes = '';

    // console.log(this.roupaParaExcluir.idRoupa);
    this.funcionarioService
      .deleteFuncionario(this.funcionarioParaExcluir.idFuncionario)
      .subscribe({
        complete: () => {
          this.exclusaoConcluida.emit();
          this.listarFuncionarios();
        },
        error: (err) => {
          this.mensagem = `Erro removendo funcionario ${this.funcionarioParaExcluir.idFuncionario} - ${this.funcionarioParaExcluir.usuario.nome}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
  }

  listarFuncionarios(): FuncionarioDto[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: FuncionarioDto[] | null) => {
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

  ngOnInit(): void {
    // if (this.funcionarioParaExcluir) {
    //   this.nomeFuncionario = this.funcionarioParaExcluir.nome;
    //   this.emailFuncionario = this.funcionarioParaExcluir.email;
    //   this.dataNascimentoFuncionario =
    //     this.funcionarioParaExcluir.dataNascimento;
    // }
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }

  // excluir(): void {
  //   console.log(
  //     'Funcionário excluido com sucesso: ',
  //     this.funcionarioParaExcluir
  //   );
  //   this.exclusaoConcluida.emit();
  // }
}
