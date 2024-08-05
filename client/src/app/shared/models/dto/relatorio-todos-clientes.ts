import { Endereco } from "../endereco.model";
import { UsuarioDto } from "./usuario-dto.model";

export class RelatorioTodosClientes {
    idCliente: number = 0;
    cpf: string = '';
    telefone: string = '';
    endereco: Endereco = new Endereco(); // criar um DTO provavelmente
    usuario: UsuarioDto = new UsuarioDto()
}
