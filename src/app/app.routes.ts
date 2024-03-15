import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login';
import { CadastroComponent } from './pages/cadastro';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'cadastro', component: CadastroComponent },
    
];
