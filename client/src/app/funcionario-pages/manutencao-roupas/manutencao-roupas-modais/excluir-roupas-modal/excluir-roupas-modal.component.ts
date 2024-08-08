import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoupaService } from '../../../../services/roupa.service';
import { Router } from '@angular/router';
import { RoupaDto } from '../../../../shared/models/dto/roupa-dto.model';
import { Roupa } from '../../../../shared/models/roupa.model';

@Component({
  selector: 'app-excluir-roupas-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './excluir-roupas-modal.component.html',
  styleUrl: './excluir-roupas-modal.component.css',
})
export class ExcluirRoupasModalComponent {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() exclusaoConcluida = new EventEmitter<void>();
  @Input() roupaParaExcluir!: RoupaDto;

  constructor(private roupasService: RoupaService, private router: Router) {}

  roupas: Roupa[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  excluir(): void {
    this.mensagem = '';
    this.mensagem_detalhes = '';
    this.roupasService.deleteRoupa(this.roupaParaExcluir.idRoupa).subscribe({
      complete: () => {
        this.exclusaoConcluida.emit();
        this.listarRoupas();
      },
      error: (err) => {
        this.mensagem = `Erro removendo roupa ${this.roupaParaExcluir.idRoupa} - ${this.roupaParaExcluir.descricao}`;
        this.mensagem_detalhes = `[${err.status}] ${err.message}`;
      },
    });
  }

  listarRoupas(): Roupa[] {
    this.roupasService.getAllRoupas().subscribe({
      next: (data: Roupa[] | null) => {
        if (data == null) {
          this.roupas = [];
        } else {
          this.roupas = data;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de usuários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.roupas;
  }

  ngOnInit(): void {
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
}
