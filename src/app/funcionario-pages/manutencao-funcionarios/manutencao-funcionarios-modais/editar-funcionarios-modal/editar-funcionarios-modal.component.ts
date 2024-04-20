import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RoupaModel } from '../../../../models/roupa.model';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CommonModule } from '@angular/common';
import { FuncionarioModel } from '../../../../models/funcionario.model';

@Component({
  selector: 'app-editar-funcionarios-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './editar-funcionarios-modal.component.html',
  styleUrl: './editar-funcionarios-modal.component.css',
})
export class EditarFuncionariosModalComponent implements OnInit {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaEditar: FuncionarioModel | undefined;
  @ViewChild('formEditarFuncionario') formEditarFuncionario!: NgForm;

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: string = '';
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (this.funcionarioParaEditar) {
      this.nomeFuncionario = this.funcionarioParaEditar.nome;
      this.emailFuncionario = this.funcionarioParaEditar.email;
      this.dataNascimentoFuncionario =
        this.funcionarioParaEditar.dataNascimento;
      this.senhaFuncionario = this.funcionarioParaEditar.senha;
    }
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }

  salvar(): void {
    if (
      this.formEditarFuncionario.form.valid &&
      this.nomeFuncionario &&
      this.emailFuncionario &&
      this.dataNascimentoFuncionario &&
      this.senhaFuncionario
    ) {
      const editFuncionario: FuncionarioModel = new FuncionarioModel();
      editFuncionario.id = this.funcionarioParaEditar?.id || 0;
      editFuncionario.nome = this.nomeFuncionario;
      editFuncionario.email = this.emailFuncionario;
      editFuncionario.senha = this.senhaFuncionario;

      console.log('Roupa editada com sucesso: ', editFuncionario);

      this.edicaoConcluida.emit();
    } else {
      console.log('Erro ao editar funcionário!');
      this.valueInvalid = true;
    }
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarDiasUteisParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }
}
