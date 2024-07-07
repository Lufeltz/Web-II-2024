import { RoupaModel } from './roupa.model';
import { Status } from './status.enum';

export class PedidoModel {
  id: number = 0;
  codigoPedido: number = 0;
  situacao: Status = Status.EM_ABERTO;
  dataCriacao: Date = new Date();
  roupas: RoupaModel[] = [];
  prazoServico: number = 0;
  precoTotal: number = 0.0;
}
