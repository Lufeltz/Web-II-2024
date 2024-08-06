import { Cliente } from "./cliente.model";
import { Orcamento } from "./orcamento.model";
import { PedidoRoupa } from "./pedido-roupa.model";
import { Situacao } from "./situacao.model";

export class Pedido {
    id: number = 0;
    numeroPedido: number = 0;
    dataPedido: Date = new Date();
    dataPagamento: Date = new Date();
    cliente: Cliente = new Cliente();
    // situacao: Situacao = new Situacao();
    situacao:string = '';
    orcamento: Orcamento = new Orcamento();
    listaPedidoRoupas: PedidoRoupa[] = [];
}

