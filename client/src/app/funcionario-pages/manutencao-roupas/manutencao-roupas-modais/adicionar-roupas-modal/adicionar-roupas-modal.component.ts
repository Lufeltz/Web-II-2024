import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { RoupaModel } from '../../../../models/roupa.model';
import { NumericoDirective } from '../../../../shared/directives/numerico.directive';
import { LetrasSomenteDirective } from '../../../../shared/directives/letras-somente.directive';

@Component({
  selector: 'app-adicionar-roupas-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    NumericoDirective,
    LetrasSomenteDirective
  ],
  templateUrl: './adicionar-roupas-modal.component.html',
  styleUrl: './adicionar-roupas-modal.component.css',
})
export class AdicionarRoupasModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() adicaoConcluida = new EventEmitter<void>();
  @ViewChild('formAdicionarRoupa') formAdicionarRoupa!: NgForm;

  descricaoRoupa?: string;
  prazoRoupa?: number;
  precoRoupa: number = 0;

  valueInvalid: boolean = false;

  cancelar(): void {
    this.voltarClicked.emit();
  }

  adicionar(): void {
    if (
      this.formAdicionarRoupa.form.valid &&
      this.descricaoRoupa &&
      this.prazoRoupa &&
      this.precoRoupa > 0
    ) {
      const newRoupa: RoupaModel = new RoupaModel();
      newRoupa.id = 0;
      newRoupa.roupa = this.descricaoRoupa;
      newRoupa.tempoDeServicoMinutos = this.diasParaMinutos(this.prazoRoupa);
      newRoupa.preco = this.precoRoupa;
      console.log('Roupa criada com sucesso: ', newRoupa);

      this.adicaoConcluida.emit();
    } else {
      console.log('Erro ao criar roupa!');
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
