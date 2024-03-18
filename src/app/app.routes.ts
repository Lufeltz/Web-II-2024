import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login';
import { CadastroComponent } from './pages/cadastro';
import { PedidoComponent } from './pages/pedido/pedido.component';
import { PedidosComponent } from '../app/pedidos/pedidos.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    { path: 'pedido', component: PedidoComponent},
    {path: 'pedidos', component: PedidosComponent}
    
];
