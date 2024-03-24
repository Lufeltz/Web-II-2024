import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RoupaModel } from '../../models/roupa.model';
import { RoupaService } from '../../services/roupa.service';

@Component({
  selector: 'app-manutencao-roupas',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './manutencao-roupas.component.html',
  styleUrl: './manutencao-roupas.component.css'
})

export class ManutencaoRoupasComponent implements OnInit {
  roupa: RoupaModel[] = [];
  orderRoupa: RoupaModel[] = [];
  roupasIsPresent: boolean | any = null;
  mapRoupas: Map<any, any> = new Map();

  constructor(private router: Router, private roupaService: RoupaService) {}

  ngOnInit(): void {
    this.loadRoupas();
  }

  loadRoupas() {
    this.roupaService.getRoupas().subscribe({
      next: (roupa: RoupaModel[]) => {
        this.roupa = roupa;
        this.orderRoupa = roupa
          .sort((a, b) => {
            const descricaoA = a.roupa.toLowerCase();
            const descricaoB = b.roupa.toLowerCase();
            return descricaoA.localeCompare(descricaoB);
          });
          this.roupasIsPresent = true;
        console.log('Roupas obtidas com sucesso!');
        console.log(roupa);
      },
      error: (error) => console.log('Erro ao requisitar as roupas: ', error),
    });

    if (this.roupa.length === 0) {
      this.roupasIsPresent = false;
    }
  }

  formatarTempoParaDiasUteis(tempoDeServicoMinutos: number): number {
    return Math.ceil(tempoDeServicoMinutos / 480);
  }

  adicionar() {

  }

  editar(roupa: RoupaModel) {
    console.log(roupa);
  }

  excluir(roupa: RoupaModel) {
    console.log(roupa);
  }

  voltar() {
    this.router.navigate(['/']);
  }

}
