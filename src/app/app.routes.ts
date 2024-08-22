import { Routes } from '@angular/router';
import { PerfilPageComponent } from './components/pages/perfil-page/perfil-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';

export const routes: Routes = [
    {path:'', component: HomePageComponent},
    {path:'perfil/:id', component: PerfilPageComponent},
    {path:'login', component: LoginPageComponent},
];
