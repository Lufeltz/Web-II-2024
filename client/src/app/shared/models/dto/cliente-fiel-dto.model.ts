import { ClienteDto } from './cliente-dto.model';

export class ClienteFielDto {
  cliente: ClienteDto = new ClienteDto();
  quantidadePedidos: number = 0;
  receita: number = 0;
}
