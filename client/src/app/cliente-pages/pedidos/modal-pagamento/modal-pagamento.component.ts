import { Component, Input } from '@angular/core';
import { Pedido } from '../../../shared/models/pedido.model';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-pagamento',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-pagamento.component.html',
  styleUrl: './modal-pagamento.component.css'
})
export class ModalPagamentoComponent {
  @Input() pedido: Pedido = new Pedido();

  constructor(public activeModal: NgbActiveModal){}
}
