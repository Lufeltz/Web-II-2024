import { Orcamento } from "../orcamento.model";
import { Status } from "../status.enum";
import { PedidoRoupaDto } from "./pedido-roupa-dto.model";

export class PedidoDto {
    idCliente: number= 0;
    numeroPedido: number = 0;
    dataPedido: Date = new Date();
    dataPagamento: Date = new Date();
    situacao!: Status;
    orcamento: Orcamento = new Orcamento();
    listaPedidoRoupas: PedidoRoupaDto[] = [];
}
