import { Component, OnInit, inject } from '@angular/core';
import { FuncionarioService } from '../../services/funcionario.service';
import { FuncionarioModel } from '../../models/funcionario.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdicionarFuncionariosModalComponent } from './manutencao-funcionarios-modais/adicionar-funcionarios-modal/adicionar-funcionarios-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manutencao-funcionarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './manutencao-funcionarios.component.html',
  styleUrl: './manutencao-funcionarios.component.css',
})
export class ManutencaoFuncionariosComponent implements OnInit{
  private modalService = inject(NgbModal);

  constructor(private _funcionarioService: FuncionarioService) {}

  funcionarios:FuncionarioModel[] = []

  ngOnInit(): void {
    this.obterFuncionarios();
  }

  obterFuncionarios() {
    this._funcionarioService.getFuncionarios().subscribe({
      next: (res) => {
        this.funcionarios = res;
      }
    })
  }

  adicionar(){
    const modalRef = this.modalService.open(AdicionarFuncionariosModalComponent, { centered: true});
    modalRef.componentInstance.formatarDataNascimento = this
  }
}
