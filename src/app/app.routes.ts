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


export const routes: Routes = [
    //default
    { path: '', redirectTo: 'login', pathMatch: 'full'}, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html
    
    //auth
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },

    //cliente-pages
    { path: 'pedidos', title:'Pedidos', component: PedidosComponent },
    { path: 'pedido', title:'Pedido', component: PedidoComponent },
    { path: 'consulta-pedido', title: 'Consultar Pedido', component: ConsultaPedidoComponent },
    { path: 'pagar-pedido', title: 'Pagar Pedido', component: PagarPedidoComponent},

    //funcionario-pages
    { path: 'homepage', title: 'Homepage', component: HomepageComponent },
    { path: 'manutencao-roupa', title: 'Roupas Cadastradas', component: ManutencaoRoupasComponent },
    { path: 'manutencao-funcionario', title: 'Funcionários Cadastrados', component: ManutencaoFuncionariosComponent },
    { path: 'relatorio-receitas', title: 'Receitas', component: RelatorioReceitasComponent },
    { path: 'relatorio-clientes', title: 'Clientes', component: RelatorioClientesComponent },
    { path: 'visualizacao-pedidos', title: 'Visualização de pedidos', component: VisualizacaoPedidosComponent },
    
    //components
    { path: '**', title: 'Error 404', component: PageNotFoundComponent },  // Rota para um component quando página der erro 404
];
