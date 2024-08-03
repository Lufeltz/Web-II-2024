import { Permissao } from './permissao.model';

export class Usuario{
  id: number = 0;
  nome: string = '';
  email: string = '';
  senha: string = '';
  permissao: Permissao = new Permissao();
}
