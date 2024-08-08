import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Roupa } from '../../../../shared/models/roupa.model';
import { NgxCurrencyDirective } from 'ngx-currency';
import { CommonModule } from '@angular/common';
import { RoupaDto } from '../../../../shared/models/dto/roupa-dto.model';
import { RoupaService } from '../../../../services/roupa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-roupas-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './editar-roupas-modal.component.html',
  styleUrl: './editar-roupas-modal.component.css',
})
export class EditarRoupasModalComponent implements OnInit {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() roupaParaEditar!: RoupaDto;
  @ViewChild('formEditarRoupa') formEditarRoupa!: NgForm;

  constructor(private roupaService: RoupaService, private router: Router) {}

  roupas: Roupa[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  salvar(): void {
    if (this.formEditarRoupa.form.valid) {
      this.roupaService.putRoupa(this.roupaParaEditar).subscribe({
        next: (roupa: RoupaDto | null) => {
          this.router.navigate(['/manutencao-roupa']);
          this.edicaoConcluida.emit();
          this.listarRoupas();
        },
        error: (err) => {
          this.mensagem = `Erro atualizando roupa ${this.roupaParaEditar.descricao}`;
          this.mensagem_detalhes = `[${err.status}] ${err.message}`;
        },
      });
    }
  }

  listarRoupas(): Roupa[] {
    this.roupaService.getAllRoupas().subscribe({
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

  descricaoRoupa?: string;
  prazoRoupa?: number;
  precoRoupa: number = 0;

  valueInvalid: boolean = false;

  ngOnInit(): void {
  }

  cancelar(): void {
    this.voltarClicked.emit();
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
