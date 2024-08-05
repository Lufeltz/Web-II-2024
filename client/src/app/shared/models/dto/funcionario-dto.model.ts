import { UsuarioDto } from './usuario-dto.model';

export class FuncionarioDto {
  idFuncionario: number = 0;
  dataNascimento: Date = new Date();
  usuario: UsuarioDto = new UsuarioDto();
}
