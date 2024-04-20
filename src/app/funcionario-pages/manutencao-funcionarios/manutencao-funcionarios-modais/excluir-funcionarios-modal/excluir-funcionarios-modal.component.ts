import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoupaModel } from '../../../../models/roupa.model';
import { CommonModule } from '@angular/common';
import { FuncionarioModel } from '../../../../models/funcionario.model';

@Component({
  selector: 'app-excluir-funcionarios-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excluir-funcionarios-modal.component.html',
  styleUrl: './excluir-funcionarios-modal.component.css'
})
export class ExcluirFuncionariosModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() exclusaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaExcluir: FuncionarioModel | undefined;

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: string = '';
  senhaFuncionario: string = '';

  constructor() {}

  ngOnInit(): void {
    if (this.funcionarioParaExcluir) {
      this.nomeFuncionario = this.funcionarioParaExcluir.nome;
      this.emailFuncionario = this.funcionarioParaExcluir.email
      this.dataNascimentoFuncionario = this.funcionarioParaExcluir.dataNascimento;
    }
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

  excluir(): void {
    console.log('Funcionário excluido com sucesso: ', this.funcionarioParaExcluir);
    this.exclusaoConcluida.emit();
  }
  
}
