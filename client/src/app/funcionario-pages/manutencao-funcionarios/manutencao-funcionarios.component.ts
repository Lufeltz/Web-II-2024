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
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule, NgxMaskPipe],
  templateUrl: './manutencao-funcionarios.component.html',
  styleUrl: './manutencao-funcionarios.component.css',
})
export class ManutencaoFuncionariosComponent implements OnInit {
  funcionario: Funcionario[] = [];
  orderFuncionario: Funcionario[] = [];
  funcionariosIsPresent: boolean | any = null;
  funcionarioParaEditar: Funcionario | undefined;
  funcionarioParaExcluir: Funcionario | undefined;

  constructor(
    private router: Router,
    private funcionarioService: FuncionarioService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadFuncionarios();
  }

  loadFuncionarios() {
    this.funcionarioService.getFuncionarios().subscribe({
      next: (funcionario: Funcionario[]) => {
        this.funcionario = funcionario;
        // this.orderFuncionario = funcionario
        //   .sort((a, b) => {
        //     const descricaoA = a..toLowerCase();
        //     const descricaoB = b.funcionario.toLowerCase();
        //     return descricaoA.localeCompare(descricaoB);
        //   });
        if (this.funcionario.length === 0) {
          this.funcionariosIsPresent = false;
        } else {
          this.funcionariosIsPresent = true;
        }
      },
      error: (error) => console.log('Erro ao requisitar as roupas: ', error),
    });
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
      this.loadFuncionarios();
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
      this.loadFuncionarios();
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
      this.loadFuncionarios();
      modalRef.close();
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
