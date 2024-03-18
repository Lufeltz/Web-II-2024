import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login';
import { CadastroComponent } from './pages/cadastro';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { PedidosComponent } from '../app/pedidos/pedidos.component';
import { ConsultaPedidoComponent } from './pages/consulta-pedido';

export const routes: Routes = [
    { path: 'login', title: 'Login', component: LoginComponent },
    { path: 'cadastro', title: 'Cadastro', component: CadastroComponent },
    { path: 'pedido', component: PedidoComponent },
    { path: 'pedidos', component: PedidosComponent },
    { path: 'consulta-pedido', title: 'Consultar Pedido', component: ConsultaPedidoComponent },
    
    
    { path: '', redirectTo: 'login', pathMatch: 'full'}, // Rota padrão, se colocar o path do component em "redirectTo:", não precisará da tag/selector do seu component em app.component.html
    //{ path: '**', component: PageNotFoundComponent },  // Rota para um component quando página der erro 404 (PageNotFoundComponent ainda não criado)
];
