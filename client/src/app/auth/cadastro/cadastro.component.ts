import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { LetrasSomenteDirective } from '../../shared/directives/letras-somente.directive';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, NgxMaskDirective, LetrasSomenteDirective],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css',
})
export class CadastroComponent {
  @ViewChild('formCadastro') formCadastro!: NgForm;
  cadastroCPF?: string;
  cadastroNome?: string;
  cadastroEmail?: string;
  CadastroEndereco?: string;
  CadastroComplemento?: string;
  CadastroTelefone?: string;

  constructor() {}

  cadastro() {
    if (this.formCadastro.form.valid) {
      // Inserir aqui lógica para cadastro
    }
  }
}
