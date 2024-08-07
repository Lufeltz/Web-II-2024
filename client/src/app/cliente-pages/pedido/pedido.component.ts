import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoupaService } from '../../services/roupa.service';
import { Orcamento } from '../../shared/models/orcamento.model';
import { Status } from '../../shared/models/status.enum';
import { PedidosService } from '../../services/pedidos.service';
import { FormsModule } from '@angular/forms';
import { PedidoDto } from '../../shared/models/dto/pedido-dto.model';
import { PedidoRoupaDto } from '../../shared/models/dto/pedido-roupa-dto.model';
import { RoupaDto } from '../../shared/models/dto/roupa-dto.model';
import { UsuarioResponseDto } from '../../shared/models/dto/usuario-response-dto.model';
import { LoginService } from '../../services/login.service';
import { ClienteDto } from '../../shared/models/dto/cliente-dto.model';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css',
})
export class PedidoComponent {
  usuario: UsuarioResponseDto = new UsuarioResponseDto();
  cliente: ClienteDto | null = null;
  private roupas: RoupaDto[] = [];
  private roupaSelecionada: RoupaDto | undefined;
  private listaRoupas: PedidoRoupaDto[] = [];
  private orcamentoAtual: Orcamento = new Orcamento();
  private mostrarValores: boolean = false;
  private botoesHabilitados: boolean = false;
  mensagem: string = '';
  mensagem_detalhes: string = '';

  constructor(private roupaService: RoupaService,private pedidoService: PedidosService, private loginService: LoginService, private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.usuario = this.loginService.getUsuarioLogado();
    this.obterClienteLogado();
    this.listarRoupas();
  }

  obterClienteLogado(): void {
    this.clienteService.consultarPorIdUsuario(this.usuario.idUsuario)
    .subscribe({
      next: (cliente) => {
        this.cliente = cliente;
      },
      error: (err) => {
        this.mensagem = 'Erro ao buscar dados do cliente';
        this.mensagem_detalhes = `[${err.status}] ${err.message}`;
      }
    });
  }

  listarRoupas(): RoupaDto[] {
    this.roupaService.listar().subscribe({
      next: (data: RoupaDto[] | null) => {
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

  inserirRoupa(roupa: RoupaDto | undefined, qntd: string): void {
    if (roupa) {
      let nQntd = parseInt(qntd);
      let verificaItem = this.listaRoupas.find(
        (pedidoRoupa) => pedidoRoupa.roupa.descricao == roupa.descricao
      );
      if (verificaItem != undefined) {
        verificaItem.quantidade += nQntd;
      } else {
        let novoItem: PedidoRoupaDto = new PedidoRoupaDto();
        novoItem.roupa = roupa;
        novoItem.quantidade = nQntd;
        this.listaRoupas.push(novoItem);
      }
    }
  }

  removerRoupa(item: PedidoRoupaDto): void {
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
    this.orcamentoAtual.dataPrazo.setDate(this.orcamentoAtual.dataPrazo.getDate() + diasMax);
    this.orcamentoAtual.aprovado = false;
    this.mostrarValores = true;
    this.botoesAtivados = true;
  }

  aprovarPedido() {
    let novoPedido: PedidoDto = new PedidoDto();
    if (this.cliente?.idCliente !== undefined) {
      novoPedido.idCliente = this.cliente.idCliente;
    } else {
      this.mensagem = 'ID do cliente não disponível.';
      return;
    }
    novoPedido.orcamento = this.orcamentoAtual;
    novoPedido.dataPedido = new Date();

    const prazoSimulado: Date = novoPedido.orcamento.dataPrazo;
    if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
      novoPedido.orcamento.dataPrazo = new Date();
    }
    const diferencaMillis = novoPedido.orcamento.dataPrazo.getTime() - prazoSimulado.getTime();
    const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);
    console.log(`Diferença em dias: ${diferencaDias}`);
    novoPedido.orcamento.dataPrazo = new Date(prazoSimulado.getTime() + diferencaMillis);
    novoPedido.orcamento.aprovado = true;
    novoPedido.listaPedidoRoupas = this.listaRoupas;
    novoPedido.situacao = Status.EM_ABERTO;

    this.pedidoService.cadastrar(novoPedido).subscribe({
      next: (pedido) => {
        alert(
          'Seu pedido de número #' + pedido?.numeroPedido + ' foi enviado com sucesso!'
        );
      },
      error: (err) => {
        console.log('Erro ao enviar pedido!');
      },
    });
    this.listaRoupas.splice(0, this.listaRoupas.length);
    this.mostrarValores = false;
    this.botoesAtivados = false;
  }

  rejeitarPedido() {
    let novoPedido: PedidoDto = new PedidoDto();
    if (this.cliente?.idCliente !== undefined) {
      novoPedido.idCliente = this.cliente.idCliente;
    } else {
      this.mensagem = 'ID do cliente não disponível.';
      return;
    }
    novoPedido.orcamento = this.orcamentoAtual;
    novoPedido.dataPedido = new Date();

    const prazoSimulado: Date = novoPedido.orcamento.dataPrazo;
    if (!(novoPedido.orcamento.dataPrazo instanceof Date)) {
      novoPedido.orcamento.dataPrazo = new Date();
    }

    const diferencaMillis = novoPedido.orcamento.dataPrazo.getTime() - prazoSimulado.getTime();
    const diferencaDias = diferencaMillis / (1000 * 60 * 60 * 24);

    console.log(`Diferença em dias: ${diferencaDias}`);

    novoPedido.orcamento.dataPrazo = new Date(
      prazoSimulado.getTime() + diferencaMillis
    );
    novoPedido.listaPedidoRoupas = this.listaRoupas;
    novoPedido.situacao = Status.REJEITADO;
    novoPedido.orcamento.aprovado = false;

    this.pedidoService.postPedido(novoPedido).subscribe({
      next: (pedido) => {
        alert('O orçamento foi rejeitado');
      },
      error: (err) => {
        console.log('Erro ao enviar pedido!');
      },
    });

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

  get tabela(): PedidoRoupaDto[] {
    return this.listaRoupas;
  }

  get exibir(): boolean {
    return this.mostrarValores;
  }

  get getRoupas(): RoupaDto[] {
    return this.roupas;
  }

  get selectedRoupa(): RoupaDto | undefined {
    return this.roupaSelecionada;
  }

  set selectedRoupa(value: RoupaDto | undefined) {
    this.roupaSelecionada = value;
  }

  get botoesAtivados(): boolean {
    return this.botoesHabilitados;
  }

  set botoesAtivados(value: boolean) {
    this.botoesHabilitados = value;
  }
}
