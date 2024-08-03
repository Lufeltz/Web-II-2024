import { Pedido } from "./pedido.model";
import { Roupa } from "./roupa.model";

export class PedidoRoupa {
    id: number = 0;
    quantidade: number = 0;
    pedido: Pedido = new Pedido();
    roupa: Roupa = new Roupa();
}
