import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { FuncionarioModel } from '../../../../models/funcionario.model';
import { NgxMaskDirective } from 'ngx-mask';
import { NumericoDirective } from '../../../../shared/directives/numerico.directive';
import { LetrasSomenteDirective } from '../../../../shared/directives/letras-somente.directive';

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
    LetrasSomenteDirective
  ],
  templateUrl: './adicionar-funcionarios-modal.component.html',
  styleUrl: './adicionar-funcionarios-modal.component.css',
})
export class AdicionarFuncionariosModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() adicaoConcluida = new EventEmitter<void>();
  @ViewChild('formAdicionarFuncionario') formAdicionarFuncionario!: NgForm;

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: string = '';
  senhaFuncionario: string = '';

  valueInvalid: boolean = false;

  cancelar(): void {
    this.voltarClicked.emit();
  }

  adicionar(): void {
    if (
      this.formAdicionarFuncionario.form.valid &&
      this.nomeFuncionario &&
      this.emailFuncionario &&
      this.dataNascimentoFuncionario &&
      this.senhaFuncionario
    ) {
      const newFuncionario: FuncionarioModel = new FuncionarioModel();
      newFuncionario.id = 0;
      newFuncionario.nome = this.nomeFuncionario;
      newFuncionario.email = this.emailFuncionario;
      newFuncionario.dataNascimento = this.dataNascimentoFuncionario;
      newFuncionario.senha = this.senhaFuncionario;

      console.log('Funcionário criado com sucesso: ', newFuncionario);

      this.adicaoConcluida.emit();
    } else {
      console.log('Erro ao criar funcionário!');
      this.valueInvalid = true;
    }
  }

  diasParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }
}
