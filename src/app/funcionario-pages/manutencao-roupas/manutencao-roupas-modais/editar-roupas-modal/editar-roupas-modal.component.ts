import { Component, EventEmitter, Output, ViewChild, OnInit, Input } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RoupaModel } from '../../../../models/roupa.model';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-roupas-modal',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, NgxCurrencyDirective],
  templateUrl: './editar-roupas-modal.component.html',
  styleUrl: './editar-roupas-modal.component.css'
})
export class EditarRoupasModalComponent implements OnInit {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() roupaParaEditar: RoupaModel | undefined;
  @ViewChild('formEditarRoupa') formEditarRoupa!: NgForm;

  descricaoRoupa?: string;
  prazoRoupa?: number;
  precoRoupa: number = 0;

  valueInvalid: boolean = false;

  constructor() {

  }

  ngOnInit(): void {
    if (this.roupaParaEditar) {
      this.descricaoRoupa = this.roupaParaEditar.roupa;
      this.prazoRoupa = this.formatarMinutosParaDiasUteis(this.roupaParaEditar.tempoDeServicoMinutos);
      this.precoRoupa = this.roupaParaEditar.preco;
    }
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }

  salvar(): void {
    if (this.formEditarRoupa.form.valid && this.descricaoRoupa && this.prazoRoupa && this.precoRoupa > 0) {
      const editRoupa: RoupaModel = new RoupaModel();
      editRoupa.id = this.roupaParaEditar?.id || 0;
      editRoupa.roupa = this.descricaoRoupa;
      editRoupa.tempoDeServicoMinutos = this.formatarDiasUteisParaMinutos(this.prazoRoupa);
      editRoupa.preco = this.precoRoupa;
      console.log('Roupa editada: ', editRoupa);

      this.edicaoConcluida.emit();
    } else {
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
