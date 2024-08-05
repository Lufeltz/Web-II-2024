import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Roupa } from '../../../../shared/models/roupa.model';
import { NumericoDirective } from '../../../../shared/directives/numerico.directive';
import { LetrasSomenteDirective } from '../../../../shared/directives/letras-somente.directive';
import { RoupaService } from '../../../../services/roupa.service';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterModule,
} from '@angular/router';

@Component({
  selector: 'app-adicionar-roupas-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
    NumericoDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './adicionar-roupas-modal.component.html',
  styleUrl: './adicionar-roupas-modal.component.css',
})
export class AdicionarRoupasModalComponent implements OnInit {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() adicaoConcluida = new EventEmitter<void>();
  @ViewChild('formAdicionarRoupa') formAdicionarRoupa!: NgForm;

  //  ======================[NEW]======================
  constructor(
    private roupasService: RoupaService,
    private router: Router
  ) {}

  roupas: Roupa[] = []
  novaRoupa: boolean = true;
  roupa: Roupa = new Roupa();
  id!: string;
  loading!: boolean;
  mensagem: string = '';
  mensagem_detalhes: string = '';
  botaoDesabilitado: boolean = false; // não está sendo utilizado

  ngOnInit(): void {
    this.loading = false;
    this.novaRoupa = !this.id;
  }

  adicionar(): void {
    this.loading = true;
    if (this.formAdicionarRoupa.form.valid) {
      if (this.novaRoupa) {
        this.roupasService.postRoupa(this.roupa).subscribe({
          next: (roupa) => {
            this.loading = false;
            this.router.navigate(['/manutencao-roupa']);
            // console.log(roupa);
          },
          error: (err) => {
            this.loading = false;
            this.mensagem = `Erro inserindo usuário ${this.roupa.descricao}`;
            if (err.status == 409) {
              this.mensagem_detalhes = `[${err.status}] ${err.message}`;
            }
          },
        });
      }
    }
    else {
      this.loading = false;
    }

    this.adicaoConcluida.emit()
    this.listarRoupas()
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

  //  ======================[NEW]======================

  valueInvalid: boolean = false;

  cancelar(): void {
    this.voltarClicked.emit();
  }

  // adicionar(): void {
  //   if (
  //     this.formAdicionarRoupa.form.valid &&
  //     this.roupa.descricao &&
  //     this.roupa.prazoDias &&
  //     this.roupa.preco > 0
  //   ) {
  //     const newRoupa: Roupa = new Roupa();
  //     newRoupa.id = 0;
  //     newRoupa.descricao = this.roupa.descricao;
  //     newRoupa.prazoDias = this.roupa.prazoDias;
  //     newRoupa.preco = this.roupa.preco;
  //     console.log('Roupa criada com sucesso: ', newRoupa);

  //     this.adicaoConcluida.emit();
  //   } else {
  //     console.log('Erro ao criar roupa!');
  //     this.valueInvalid = true;
  //   }
  // }

  diasParaMinutos(dias: number): number {
    const minutosPorDia = 24 * 60;
    return dias * minutosPorDia;
  }

  clearValueInvalid(): void {
    this.valueInvalid = false;
  }
}
