import { UsuarioResponseDto } from './usuario-response-dto.model';

export class FuncionarioDto {
  idFuncionario: number = 0;
  dataNascimento: Date = new Date();
  usuario: UsuarioResponseDto = new UsuarioResponseDto();
}
