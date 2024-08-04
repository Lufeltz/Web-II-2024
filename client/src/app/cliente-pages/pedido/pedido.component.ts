import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RoupaService } from '../../services/roupa.service';
import { Roupa } from '../../shared/models/roupa.model';
import { Orcamento } from '../../shared/models/orcamento.model';
import { Pedido } from '../../shared/models/pedido.model'; 
import { Status } from '../../shared/models/status.enum';
import { PedidoRoupa } from '../../shared/models/pedido-roupa.model';


@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {
    private roupas : Roupa[] = [];
    private listaRoupas : PedidoRoupa[] = [];
    private valorTotal : number = 0.0;
    private prazo: Date = new Date();
    private mostrarValores: boolean = false;

    constructor(private roupaService: RoupaService){

    }

    inserirRoupa(roupa: string, qntd: string): void{
      let nQntd = parseInt(qntd);
      let novoItem: PedidoRoupa = new PedidoRoupa();
      novoItem.roupa.descricao = roupa;
      novoItem.quantidade = nQntd;
      this.listaRoupas.push(novoItem);
      //busca na base de dados dos valores (A SER IMPLEMENTADO)
      /*
      this.roupaService.getRoupas().subscribe((roupas: Roupa[]) => {
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

    removerRoupa(item : PedidoRoupa): void{
      let i = this.listaRoupas.indexOf(item);
      this.listaRoupas.splice(i, 1);
    }

    cadastrarPedido(){
      let novoOrcamento: Orcamento = new Orcamento();
      novoOrcamento.dataPrazo = this.prazo;
      novoOrcamento.valor = this.valorTotal;
      novoOrcamento.aprovado = false;
      this.mostrarValores = true;
    }

    aprovarPedido() {
      let novoPedido: Pedido = new Pedido();
      novoPedido.dataPedido = new Date();
    
      // Verifique se dataPrazo é um objeto Date
      if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
        novoPedido.orcamento.dataPrazo = new Date(novoPedido.orcamento.dataPrazo);
      }
    
      // Calcule a diferença em milissegundos
      const diferencaMillis = this.prazo.getTime() - novoPedido.orcamento.dataPrazo.getTime();
    
      // Converter para dias
      const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);
    
      // Aqui você pode decidir como quer usar a diferença:
      // 1. Armazenar a diferença em dias em uma variável separada.
      // 2. Manipular diretamente a data.
    
      console.log(`Diferença em dias: ${diferencaDias}`);
    
      // Atualizar o valor de `dataPrazo` com a nova data ou diferença, se necessário
      novoPedido.orcamento.dataPrazo = new Date(this.prazo.getTime() + diferencaMillis);
    
      novoPedido.orcamento.valor = this.valorTotal;
      novoPedido.listaPedidoRoupa = this.listaRoupas; // Corrigido para `this.listaRoupas`
      novoPedido.situacao.tipoSituacao = Status.EM_ABERTO;
    
      alert("Seu pedido de número #00000 foi enviado com sucesso!");
    }

    rejeitarPedido() {
      let novoPedido: Pedido = new Pedido();
      novoPedido.dataPedido = new Date();
    
      // Certifique-se de que dataPrazo é um objeto Date
      if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
        novoPedido.orcamento.dataPrazo = new Date(novoPedido.orcamento.dataPrazo);
      }
    
      // Calcule a diferença em milissegundos e converta para dias
      const diferencaMillis = this.prazo.getTime() - novoPedido.orcamento.dataPrazo.getTime();
      const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);
    
      // Exibir a diferença em dias no console, se necessário
      console.log(`Diferença em dias: ${diferencaDias}`);
    
      // Atualize a dataPrazo com a nova data se necessário
      novoPedido.orcamento.dataPrazo = new Date(this.prazo.getTime() + diferencaMillis);
    
      novoPedido.orcamento.valor = this.valorTotal;
      novoPedido.listaPedidoRoupa = this.listaRoupas; // Corrigido para atribuir diretamente a listaRoupas
      novoPedido.situacao.tipoSituacao = Status.REJEITADO;
    
      // Limpar a lista de roupas e ocultar valores
      this.listaRoupas.splice(0, this.listaRoupas.length);
      this.mostrarValores = false;
    
      alert("O orçamento foi rejeitado!");
    }
    

    get total(): number{
      return this.valorTotal;
    }

    get tempo(): Date{
      return this.prazo;
    }

    get tabela(): PedidoRoupa[]{
      return this.listaRoupas;
    }
    
    get exibir(): boolean{
      return this.mostrarValores;
    }
}
