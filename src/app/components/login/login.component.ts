import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  credentials = { username: '', password: '' };
  loginError: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.credentials).subscribe(
      response => {
        localStorage.setItem('token', response.token); // Armazenar o token no localStorage
        this.router.navigate(['/home']); // Redirecionar para a página inicial
      },
      error => {
        this.loginError = 'Credenciais inválidas';
      }
    );
  }
}
