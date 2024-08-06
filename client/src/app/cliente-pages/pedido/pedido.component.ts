import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { RoupaService } from '../../services/roupa.service';
import { Roupa } from '../../shared/models/roupa.model';
import { Orcamento } from '../../shared/models/orcamento.model';
import { Pedido } from '../../shared/models/pedido.model';
import { Status } from '../../shared/models/status.enum';
import { PedidoRoupa } from '../../shared/models/pedido-roupa.model';
import { PedidosService } from '../../services/pedidos.service';
import { FormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css',
})
export class PedidoComponent {
  private roupas: Roupa[] = [];
  private roupaSelecionada: Roupa | undefined;
  private listaRoupas: PedidoRoupa[] = [];
  private orcamentoAtual: Orcamento = new Orcamento();
  private mostrarValores: boolean = false;
  private botoesHabilitados: boolean = false;

  constructor(
    private roupaService: RoupaService,
    private pedidoService: PedidosService
  ) {}

  ngOnInit(): void {
    this.loadRoupas();
  }

  loadRoupas(): Roupa[] {
    this.roupaService.getAllRoupas().subscribe({
      next: (data: Roupa[] | null) => {
        if (data == null) {
          this.roupas = [];
        } else {
          this.roupas = data;
        }
      },
      error: (err) => {
        console.log('Erro ao carregar roupas da base de dados');
      },
    });
    return this.roupas;
  }

  inserirRoupa(roupa: Roupa | undefined, qntd: string): void {
    if (roupa) {
      let nQntd = parseInt(qntd);
      let verificaItem = this.listaRoupas.find(
        (pedidoRoupa) => pedidoRoupa.roupa.descricao == roupa.descricao
      );
      if (verificaItem != undefined) {
        verificaItem.quantidade += nQntd;
      } else {
        let novoItem: PedidoRoupa = new PedidoRoupa();
        novoItem.roupa = roupa;
        novoItem.quantidade = nQntd;
        this.listaRoupas.push(novoItem);
      }
    }
  }

  removerRoupa(item: PedidoRoupa): void {
    let i = this.listaRoupas.indexOf(item);
    this.listaRoupas.splice(i, 1);
  }

  cadastrarPedido() {
    this.orcamentoAtual = new Orcamento();
    let i,
      diasMax: number = 0;
    for (i = 0; i < this.listaRoupas.length; i++) {
      this.orcamentoAtual.valor +=
        this.listaRoupas[i].roupa.preco * this.listaRoupas[i].quantidade;
      if (this.listaRoupas[i].roupa.prazoDias > diasMax) {
        diasMax = this.listaRoupas[i].roupa.prazoDias;
      }
    }
    this.orcamentoAtual.dataPrazo.setDate(
      this.orcamentoAtual.dataPrazo.getDate() + diasMax
    );
    this.orcamentoAtual.aprovado = false;
    this.mostrarValores = true;
    this.botoesAtivados = true;
  }

  aprovarPedido() {
    let novoPedido: Pedido = new Pedido();
    novoPedido.orcamento = this.orcamentoAtual;
    //novoPedido.cliente = null; obter o cliente através do usuario logado
    novoPedido.dataPedido = new Date();

    const prazoSimulado: Date = novoPedido.orcamento.dataPrazo;
    // Verifique se dataPrazo é um objeto Date
    if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
      novoPedido.orcamento.dataPrazo = new Date(); //reseta para data atual
    }
    // Calcule a diferença em milissegundos
    const diferencaMillis =
      novoPedido.orcamento.dataPrazo.getTime() - prazoSimulado.getTime();
    // Converter para dias
    const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);
    console.log(`Diferença em dias: ${diferencaDias}`);
    // Atualizar o valor de `dataPrazo` com a nova data ou diferença, se necessário
    novoPedido.orcamento.dataPrazo = new Date(
      prazoSimulado.getTime() + diferencaMillis
    );
    novoPedido.orcamento.aprovado = true;
    novoPedido.listaPedidoRoupas = this.listaRoupas; // Corrigido para `this.listaRoupas`
    novoPedido.situacao = Status.EM_ABERTO;

    this.pedidoService.postPedido(novoPedido).subscribe({
      next: (pedido) => {
        alert(
          'Seu pedido de número #' +
            pedido?.numeroPedido +
            ' foi enviado com sucesso!'
        );
      },
      error: (err) => {
        console.log('Erro ao enviar pedido!');
      },
    });
    // Limpar a lista de roupas e ocultar valores
    this.listaRoupas.splice(0, this.listaRoupas.length);
    this.mostrarValores = false;
    this.botoesAtivados = false;
  }

  rejeitarPedido() {
    let novoPedido: Pedido = new Pedido();
    novoPedido.orcamento = this.orcamentoAtual;
    //novoPedido.cliente = null; obter o login do cliente
    novoPedido.dataPedido = new Date();

    const prazoSimulado: Date = novoPedido.orcamento.dataPrazo;
    // Verifique se dataPrazo é um objeto Date
    if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
      novoPedido.orcamento.dataPrazo = new Date(); //reseta para data atual
    }

    // Calcule a diferença em milissegundos
    const diferencaMillis =
      novoPedido.orcamento.dataPrazo.getTime() - prazoSimulado.getTime();

    // Converter para dias
    const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);

    console.log(`Diferença em dias: ${diferencaDias}`);

    // Atualizar o valor de `dataPrazo` com a nova data ou diferença, se necessário
    novoPedido.orcamento.dataPrazo = new Date(
      prazoSimulado.getTime() + diferencaMillis
    );
    novoPedido.orcamento.aprovado = true;
    novoPedido.listaPedidoRoupas = this.listaRoupas; // Corrigido para `this.listaRoupas`
    novoPedido.situacao = Status.REJEITADO;

    this.pedidoService.postPedido(novoPedido).subscribe({
      next: (pedido) => {
        alert('O orçamento foi rejeitado');
      },
      error: (err) => {
        console.log('Erro ao enviar pedido!');
      },
    });

    // Limpar a lista de roupas e ocultar valores
    this.listaRoupas.splice(0, this.listaRoupas.length);
    this.mostrarValores = false;
    this.botoesAtivados = false;
  }

  get total(): number {
    return this.orcamentoAtual.valor;
  }

  get tempo(): Date {
    return this.orcamentoAtual.dataPrazo;
  }

  get tabela(): PedidoRoupa[] {
    return this.listaRoupas;
  }

  get exibir(): boolean {
    return this.mostrarValores;
  }

  get getRoupas(): Roupa[] {
    return this.roupas;
  }

  get selectedRoupa(): Roupa | undefined {
    return this.roupaSelecionada;
  }

  set selectedRoupa(value: Roupa | undefined) {
    this.roupaSelecionada = value;
  }

  get botoesAtivados(): boolean {
    return this.botoesHabilitados;
  }

  set botoesAtivados(value: boolean) {
    this.botoesHabilitados = value;
  }
}
