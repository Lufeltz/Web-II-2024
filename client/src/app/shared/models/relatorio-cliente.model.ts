import { Endereco } from "./endereco.model";

export interface RelatorioCliente {
        id: number;
        nome: string;
        cpf: string;
        email: string;
        telefone: string;
        endereco: Endereco;
}
