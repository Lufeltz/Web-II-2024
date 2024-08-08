import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoupaService } from '../../services/roupa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdicionarRoupasModalComponent } from './manutencao-roupas-modais/adicionar-roupas-modal';
import { EditarRoupasModalComponent } from './manutencao-roupas-modais/editar-roupas-modal';
import { ExcluirRoupasModalComponent } from './manutencao-roupas-modais/excluir-roupas-modal';
import { Roupa } from '../../shared/models/roupa.model';

@Component({
  selector: 'app-manutencao-roupas',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './manutencao-roupas.component.html',
  styleUrl: './manutencao-roupas.component.css',
})
export class ManutencaoRoupasComponent implements OnInit {
  roupas: Roupa[] = [];
  mensagem: string = '';
  mensagem_detalhes = '';

  orderRoupa: Roupa[] = [];
  roupasIsPresent: boolean | any = null;
  roupaParaEditar: Roupa | undefined;
  roupaParaExcluir: Roupa | undefined;

  constructor(
    private router: Router,
    private roupaService: RoupaService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.listarRoupas();
  }

  listarRoupas(): Roupa[] {
    this.roupaService.getAllRoupas().subscribe({
      next: (data: Roupa[] | null) => {
        if (data == null) {
          this.roupas = [];
          this.roupasIsPresent = false;
        } else {
          this.roupas = data;
          this.roupasIsPresent = true;
        }
      },
      error: (err) => {
        this.mensagem = 'Erro buscando lista de roupas';
        this.mensagem_detalhes = `[${err.status} ${err.message}]`;
      },
    });
    return this.roupas;
  }

  formatarValor(valor: number): string {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }

  adicionar(): void {
    const modalRef = this.modalService.open(AdicionarRoupasModalComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.adicaoConcluida.subscribe(() => {
      this.listarRoupas();
      modalRef.close();
    });
  }

  editar(roupa: Roupa) {
    this.roupaParaEditar = roupa;
    const modalRef = this.modalService.open(EditarRoupasModalComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.roupaParaEditar = this.roupaParaEditar;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.edicaoConcluida.subscribe(() => {
      this.listarRoupas();
      modalRef.close();
    });
  }

  excluir(roupa: Roupa) {
    this.roupaParaExcluir = roupa;
    const modalRef = this.modalService.open(ExcluirRoupasModalComponent, {
      backdrop: 'static',
      centered: true,
    });
    modalRef.componentInstance.roupaParaExcluir = this.roupaParaExcluir;
    modalRef.componentInstance.voltarClicked.subscribe(() => {
      modalRef.close();
    });
    modalRef.componentInstance.exclusaoConcluida.subscribe(() => {
      this.listarRoupas();
      modalRef.close();
    });
  }

  voltar() {
    this.router.navigate(['/']);
  }
}
