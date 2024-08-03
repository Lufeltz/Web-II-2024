import { Usuario } from "./usuario.model";

export class Funcionario extends Usuario{
    dataNascimento: Date = new Date();
    usuario: Usuario = new Usuario();
}
