import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login';
import { CadastroComponent } from './pages/cadastro';
import { PedidosComponent } from './pages/pedidos';
import { PedidoComponent } from './pages/pedido';
import { ConsultaPedidoComponent } from './pages/consulta-pedido';
import { PageNotFoundComponent } from './pages/page-not-found';

export const routes: Routes = [
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },
    { path: 'pedidos', title:'Pedidos', component: PedidosComponent },
    { path: 'pedido', title:'Pedido', component: PedidoComponent },
    { path: 'consulta-pedido', title: 'Consultar Pedido', component: ConsultaPedidoComponent },
    
    
    { path: '', redirectTo: 'login', pathMatch: 'full'}, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html
    { path: '**', component: PageNotFoundComponent },  // Rota para um component quando página der erro 404
];
