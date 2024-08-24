import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true; // Permite o acesso à rota se o usuário estiver autenticado
    } else {
      this.snackBar.open('Login necessário para acessar esta página', 'Fechar', {
        duration: 4000,
      });
      this.router.navigate(['/login']); // Redireciona para a página de login se não autenticado
      return false; // Impede o acesso à rota
    }
  }
}
