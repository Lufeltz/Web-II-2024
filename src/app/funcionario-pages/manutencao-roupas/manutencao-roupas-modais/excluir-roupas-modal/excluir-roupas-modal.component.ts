import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoupaModel } from '../../../../models/roupa.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-excluir-roupas-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excluir-roupas-modal.component.html',
  styleUrl: './excluir-roupas-modal.component.css'
})
export class ExcluirRoupasModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() exclusaoConcluida = new EventEmitter<void>();
  @Input() roupaParaExcluir: RoupaModel | undefined;

  descricaoRoupa?: string;
  prazoRoupa?: number;
  precoRoupa: number = 0;

  constructor() {

  }

  ngOnInit(): void {
    if (this.roupaParaExcluir) {
      this.descricaoRoupa = this.roupaParaExcluir.roupa;
      this.prazoRoupa = this.formatarMinutosParaDiasUteis(this.roupaParaExcluir.tempoDeServicoMinutos);
      this.precoRoupa = this.roupaParaExcluir.preco;
    }
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  cancelar(): void {
    this.voltarClicked.emit();
  }

  excluir(): void {
    console.log('Roupa excluida: ', this.roupaParaExcluir);
    this.exclusaoConcluida.emit();
  }
}
