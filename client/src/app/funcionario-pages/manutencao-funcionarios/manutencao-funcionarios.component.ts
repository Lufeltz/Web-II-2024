import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdicionarFuncionariosModalComponent } from './manutencao-funcionarios-modais/adicionar-funcionarios-modal/adicionar-funcionarios-modal.component';
import { EditarFuncionariosModalComponent } from './manutencao-funcionarios-modais/editar-funcionarios-modal/editar-funcionarios-modal.component';
import { ExcluirFuncionariosModalComponent } from './manutencao-funcionarios-modais/excluir-funcionarios-modal/excluir-funcionarios-modal.component';
import { FuncionarioService } from '../../services/funcionario.service';
import { Funcionario } from '../../shared/models/funcionario.model';
import { NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-manutencao-funcionarios',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    NgxMaskPipe,
  ],
  templateUrl: './manutencao-funcionarios.component.html',
  styleUrl: './manutencao-funcionarios.component.css',
})
export class ManutencaoFuncionariosComponent implements OnInit {
  orderFuncionario: Funcionario[] = [];
  funcionariosIsPresent: boolean | any = null;
  funcionarioParaEditar!: Funcionario;
  funcionarioParaExcluir!: Funcionario;

  funcionarios: Funcionario[] = [];
  mensagem: string = '';
  mensagem_detalhes = '';

  constructor(
    private router: Router,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listarFuncionarios();
  }

  listarFuncionarios(): Funcionario[] {
    this.funcionarioService.getAllFuncionarios().subscribe({
      next: (data: Funcionario[] | null) => {
        if (data == null) {
          this.funcionarios = [];
          this.funcionariosIsPresent = false;
        } else {
          this.funcionarios = data;
          this.funcionariosIsPresent = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de funcionários';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.funcionarios;
  }

  formatarMinutosParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 1440);
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  adicionar(): void {
    const modalRef = this.modalService.open(
      AdicionarFuncionariosModalComponent,
      { backdrop: 'static', centered: true }
    );
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.adicaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });
  }

  editar(funcionario: Funcionario) {
    this.funcionarioParaEditar = funcionario;
    const modalRef = this.modalService.open(EditarFuncionariosModalComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.funcionarioParaEditar =
      this.funcionarioParaEditar;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.edicaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });
  }

  excluir(funcionario: Funcionario) {
    this.funcionarioParaExcluir = funcionario;
    const modalRef = this.modalService.open(ExcluirFuncionariosModalComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.funcionarioParaExcluir =
      this.funcionarioParaExcluir;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.exclusaoConcluida.subscribe(() => {
      this.listarFuncionarios();
      modalRef.close();
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
