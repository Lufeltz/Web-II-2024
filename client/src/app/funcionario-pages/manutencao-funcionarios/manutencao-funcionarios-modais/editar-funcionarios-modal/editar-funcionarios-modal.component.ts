import {
  Component,
  EventEmitter,
  Output,
  ViewChild,
  OnInit,
  Input,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { LetrasSomenteDirective } from '../../../../shared/directives/letras-somente.directive';
import { NgxMaskDirective } from 'ngx-mask';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Router } from '@angular/router';
import { Permissao } from '../../../../shared/models/permissao.model';

@Component({
  selector: 'app-editar-funcionarios-modal',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    LetrasSomenteDirective,
  ],
  templateUrl: './editar-funcionarios-modal.component.html',
  styleUrl: './editar-funcionarios-modal.component.css',
})
export class EditarFuncionariosModalComponent implements OnInit {
  @Output() voltarClicked = new EventEmitter<void>();
  @Output() edicaoConcluida = new EventEmitter<void>();
  @Input() funcionarioParaEditar!: Funcionario;
  @ViewChild('formEditarFuncionario') formEditarFuncionario!: NgForm;

  constructor(
    private funcionarioService: FuncionarioService,
    private router: Router
  ) {}

  funcionarios: Funcionario[] = [];
  mensagem: string = '';
  mensagem_detalhes: string = '';

  salvar(): void {
    if (this.formEditarFuncionario.form.valid) {
      this.funcionarioParaEditar.usuario.permissao = new Permissao();
      this.funcionarioParaEditar.usuario.permissao.tipoPermissao =
        'FUNCIONARIO';
      // console.log(this.funcionarioParaEditar);
      this.funcionarioService
        .putFuncionario(this.funcionarioParaEditar)
        .subscribe({
          next: (funcionario: Funcionario | null) => {
            this.router.navigate(['/manutencao-funcionario']);
            this.edicaoConcluida.emit();
            this.listarFuncionarios();
          },
          error: (err) => {
            this.mensagem = `Erro atualizando funcionario ${this.funcionarioParaEditar.usuario.nome}`;
            this.mensagem_detalhes = `[${err.status}] ${err.message}`;
          },
        });
    }
  }

  listarFuncionarios(): Funcionario[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[] | null) => {
        if (data == null) {
          this.funcionarios = [];
        } else {
          this.funcionarios = data;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de usuários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  nomeFuncionario: string = '';
  emailFuncionario: string = '';
  dataNascimentoFuncionario: Date = new Date();
  senhaFuncionario: string = '';

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
