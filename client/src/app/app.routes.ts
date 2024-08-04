import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';
import { ManutencaoRoupasComponent } from './funcionario-pages/manutencao-roupas';
import { PagarPedidoComponent } from './cliente-pages/pagar-pedido';
import { HomepageComponent } from './funcionario-pages/homepage/homepage.component';
import { RelatorioReceitasComponent } from './funcionario-pages/relatorio-receitas';
import { VisualizacaoPedidosComponent } from './funcionario-pages/visualizacao-pedidos/visualizacao-pedidos.component';
import { ManutencaoFuncionariosComponent } from './funcionario-pages/manutencao-funcionarios';
import { RelatorioClientesComponent } from './funcionario-pages/relatorio-clientes/relatorio-clientes.component';
import { RelatorioClientesFieisComponent } from './funcionario-pages/relatorio-clientes-fieis/relatorio-clientes-fieis.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  //default
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html

  //auth
  { path: 'login', title: 'Login', component: LoginComponent },
  { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },

  //cliente-pages
  {
    path: 'pedidos',
    title: 'Pedidos',
    component: PedidosComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'pedido',
    title: 'Pedido',
    component: PedidoComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'consulta-pedido',
    title: 'Consultar Pedido',
    component: ConsultaPedidoComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },
  {
    path: 'pagar-pedido',
    title: 'Pagar Pedido',
    component: PagarPedidoComponent,
    canActivate: [authGuard],
    data: {
      role: 'CLIENTE',
    },
  },

  //funcionario-pages
  {
    path: 'homepage',
    title: 'Homepage',
    component: HomepageComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'manutencao-roupa',
    title: 'Roupas Cadastradas',
    component: ManutencaoRoupasComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'manutencao-funcionario',
    title: 'Funcionários Cadastrados',
    component: ManutencaoFuncionariosComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'relatorio-receitas',
    title: 'Receitas',
    component: RelatorioReceitasComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'relatorio-clientes',
    title: 'Clientes',
    component: RelatorioClientesComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'visualizacao-pedidos',
    title: 'Visualização de pedidos',
    component: VisualizacaoPedidosComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },
  {
    path: 'relatorio-clientes-fieis',
    title: 'ClientesFieis',
    component: RelatorioClientesFieisComponent,
    canActivate: [authGuard],
    data: {
      role: 'FUNCIONARIO',
    },
  },

  //components
  { path: '**', title: 'Error 404', component: PageNotFoundComponent }, // Rota para um component quando página der erro 404
];
