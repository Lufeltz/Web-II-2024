import { Component } from '@angular/core';
import { NgbDateStruct, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuncionarioModel } from '../../../../models/funcionario.model';
import { FuncionarioService } from '../../../../services/funcionario.service';

@Component({
  selector: 'app-adicionar-funcionarios-modal',
  standalone: true,
  imports: [NgbDatepickerModule, FormsModule, ReactiveFormsModule],
  templateUrl: './adicionar-funcionarios-modal.component.html',
  styleUrl: './adicionar-funcionarios-modal.component.css',
})
export class AdicionarFuncionariosModalComponent {
  model!: NgbDateStruct;
  funcionario: FuncionarioModel = new FuncionarioModel();
  novoFuncionario: FuncionarioModel = new FuncionarioModel();

  constructor(private _service: FuncionarioService) {}

  adicionarFuncionario() {
    this._service.createFuncionario(this.novoFuncionarioSemID()).subscribe({
      next: (novoFuncionario: FuncionarioModel) => {
        console.log(novoFuncionario);
      },
    });
  }

  novoFuncionarioSemID(): FuncionarioModel {
    const novoFuncionarioSemID: FuncionarioModel = {
      nome: this.novoFuncionario.nome,
      email: this.novoFuncionario.email,
      dataNascimento: this.formatarData(this.novoFuncionario.dataNascimento),
      senha: this.novoFuncionario.senha,
    };

    return novoFuncionarioSemID;
  }

  formatarData(dataNascimento: any): string {
    const dia = this.adicionarZero(dataNascimento.day);
    const mes = this.adicionarZero(dataNascimento.month);
    const ano = dataNascimento.year;

    return `${dia}-${mes}-${ano}`;
  }

  adicionarZero(numero: number): string {
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  listarFuncionarios() {
    this._service.getFuncionarios().subscribe({
      next: (funcionarios: FuncionarioModel[]) => {
        console.log('Funcionários: ', funcionarios);
      },
    });
  }

  // alterarFuncionario()
}
