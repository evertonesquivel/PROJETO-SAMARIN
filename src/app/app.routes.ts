import { Routes } from '@angular/router';
import { PerfilPageComponent } from './components/pages/perfil-page/perfil-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { AuthGuard } from './services/auth/auth-guard.service';
import { InicialPageComponent } from './components/pages/inicial-page/inicial-page.component';
import { ChatPageComponent } from './components/pages/chat-page/chat-page.component';
import { CreateAccountPageComponent } from './components/pages/create-account-page/create-account-page.component';

export const routes: Routes = [
    { path: '', component: InicialPageComponent }, // Página inicial
    { path: 'home', component: HomePageComponent, canActivate: [AuthGuard] }, // Página protegida
    { path: 'perfil/:id', component: PerfilPageComponent, canActivate: [AuthGuard] }, // Página de perfil, protegida
    { path: 'login', component: LoginPageComponent }, // Página de login
    { path : 'messages', component : ChatPageComponent, canActivate :[AuthGuard] },
    { path: 'createaccount', component: CreateAccountPageComponent },//pag cadastrar user 
];
