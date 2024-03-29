import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RoupaService } from '../../services/roupa.service';
import { RoupaModel } from '../../models/roupa.model';
import { RoupaQuantidade } from '../../models/roupa-quantidade';
import { OrcamentoModel } from '../../models/orcamento.model';
import { PedidoModel } from '../../models/pedido.model';
import { Status } from '../../models/status.enum';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {
    private roupas : RoupaModel[] = [];
    private listaRoupas : RoupaQuantidade[] = [];
    private valorTotal : number = 0.0;
    private prazo: Date = new Date();
    private cont : number = 0;
    private mostrarValores: boolean = false;

    constructor(private roupaService: RoupaService){

    }

    inserirRoupa(roupa: string, qntd: string): void{
      let nQntd = parseInt(qntd);
      let novoItem: RoupaQuantidade = new RoupaQuantidade();
      novoItem.roupa = roupa;
      novoItem.quantidade = nQntd;
      this.listaRoupas[this.cont] = novoItem;
      this.cont++;
      //busca na base de dados dos valores (A SER IMPLEMENTADO)
      /*
      this.roupaService.getRoupas().subscribe((roupas: RoupaModel[]) => {
        const totalRoupas: number = roupas.length;
        for(let i=0;i<totalRoupas;i++){
          if(roupa == roupas[i].roupa){
            this.valorTotal += roupas[i].preco * nQntd;
            this.tempoEstim += roupas[i].tempoDeServicoMinutos * nQntd;
            this.roupas[this.cont] = roupas[i];
          }
        }        
      });  
      */            
    }

    cadastrarPedido(){
      let novoOrcamento: OrcamentoModel = new OrcamentoModel();
      novoOrcamento.prazo = this.prazo;
      novoOrcamento.valor = this.valorTotal;
      novoOrcamento.aprovado = false;
      this.mostrarValores = true;
    }

    aprovarPedido(){
      let novoPedido: PedidoModel = new PedidoModel();
      novoPedido.dataCriacao = new Date();
      novoPedido.prazoServico = ((this.prazo.getDate() - novoPedido.dataCriacao.getDate())/ 1000 * 60 * 60 * 24);
      novoPedido.precoTotal = this.valorTotal;
      novoPedido.roupas = this.roupas;
      novoPedido.situacao = Status.EM_ABERTO;
      alert("Seu pedido de número #00000 foi enviado com sucesso!");
    }

    get total(): number{
      return this.valorTotal;
    }

    get tempo(): Date{
      return this.prazo;
    }

    get tabela(): RoupaQuantidade[]{
      return this.listaRoupas;
    }
    
    get exibir(): boolean{
      return this.mostrarValores;
    }
}
