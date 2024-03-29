import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';
import { ManutencaoRoupasComponent } from './funcionario-pages/manutencao-roupas';

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

    //funcionario-pages
    { path: 'manutencao-roupa', title: 'Roupas Cadastradas', component: ManutencaoRoupasComponent },
    
    //components
    { path: '**', title: 'Error 404', component: PageNotFoundComponent },  // Rota para um component quando página der erro 404
];
