import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent {
  @ViewChild('formCadastro') formCadastro!: NgForm;
  cadastroCPF?: string;
  cadastroNome?: string;
  cadastroEmail?: string;
  CadastroEndereco?: string;
  CadastroComplemento?: string;
  CadastroTelefone?: string;

  constructor() {

  }

  cadastro() {
    if (this.formCadastro.form.valid) {

    }
  }
}
