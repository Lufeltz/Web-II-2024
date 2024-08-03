import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoupaModel } from '../../models/roupa.model';
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
  styleUrl: './manutencao-roupas.component.css'
})

export class ManutencaoRoupasComponent implements OnInit {
  roupa: Roupa[] = [];
  orderRoupa: Roupa[] = [];
  roupasIsPresent: boolean | any = null;
  roupaParaEditar: Roupa | undefined;
  roupaParaExcluir: Roupa | undefined;

  constructor(private router: Router, private roupaService: RoupaService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadRoupas();
  }

  loadRoupas() {
    this.roupaService.getRoupas().subscribe({
      next: (roupa: Roupa[]) => {
        this.roupa = roupa;
        this.orderRoupa = roupa
          .sort((a, b) => {
            const descricaoA = a.descricao.toLowerCase();
            const descricaoB = b.descricao.toLowerCase();
            return descricaoA.localeCompare(descricaoB);
          });
          if (this.roupa.length === 0) {
            this.roupasIsPresent = false;
          } else {
            this.roupasIsPresent = true;
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
    const modalRef = this.modalService.open(AdicionarRoupasModalComponent, { backdrop: 'static', centered: true});
    modalRef.componentInstance.voltarClicked.subscribe(() => {modalRef.close()});
    modalRef.componentInstance.adicaoConcluida.subscribe(() => {this.loadRoupas();modalRef.close()});
  }

  editar(roupa: Roupa) {
    this.roupaParaEditar = roupa;
    const modalRef = this.modalService.open(EditarRoupasModalComponent, { backdrop: 'static', centered: true});
    modalRef.componentInstance.roupaParaEditar = this.roupaParaEditar;
    modalRef.componentInstance.voltarClicked.subscribe(() => {modalRef.close()});
    modalRef.componentInstance.edicaoConcluida.subscribe(() => {this.loadRoupas();modalRef.close()});
  }

  excluir(roupa: Roupa) {
    this.roupaParaExcluir = roupa;
    const modalRef = this.modalService.open(ExcluirRoupasModalComponent, { backdrop: 'static', centered: true});
    modalRef.componentInstance.roupaParaExcluir = this.roupaParaExcluir;
    modalRef.componentInstance.voltarClicked.subscribe(() => {modalRef.close()});
    modalRef.componentInstance.exclusaoConcluida.subscribe(() => {this.loadRoupas();modalRef.close()});
  }

  voltar() {
    this.router.navigate(['/']);
  }

}
