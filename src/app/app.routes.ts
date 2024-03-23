import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login';
import { CadastroComponent } from './auth/cadastro';
import { PedidosComponent } from './cliente-pages/pedidos';
import { PedidoComponent } from './cliente-pages/pedido';
import { ConsultaPedidoComponent } from './cliente-pages/consulta-pedido';
import { PageNotFoundComponent } from './components/page-not-found';

export const routes: Routes = [
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },
    { path: 'pedidos', title:'Pedidos', component: PedidosComponent },
    { path: 'pedido', title:'Pedido', component: PedidoComponent },
    { path: 'consulta-pedido', title: 'Consultar Pedido', component: ConsultaPedidoComponent },
    
    
    { path: '', redirectTo: 'login', pathMatch: 'full'}, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html
    { path: '**', title: 'Error 404', component: PageNotFoundComponent },  // Rota para um component quando página der erro 404
];
