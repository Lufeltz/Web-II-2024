import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Roupa } from '../../../../shared/models/roupa.model';
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
  @Input() roupaParaExcluir: Roupa | undefined;

  descricaoRoupa?: string;
  prazoRoupa?: number;
  precoRoupa: number = 0;

  constructor() {}

  ngOnInit(): void {
    if (this.roupaParaExcluir) {
      this.descricaoRoupa = this.roupaParaExcluir.descricao;
      this.prazoRoupa = this.formatarMinutosParaDiasUteis(this.roupaParaExcluir.prazoDias);
      this.precoRoupa = this.roupaParaExcluir.preco;
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
    console.log('Roupa excluida com sucesso: ', this.roupaParaExcluir);
    this.exclusaoConcluida.emit();
  }
  
}
