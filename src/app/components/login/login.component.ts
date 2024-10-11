import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/auth/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  credentials = { email: '', password: '' };
  loginError: string | null = null;

  constructor(private loginService: LoginService, private router: Router) { }

  login() {
    this.loginService.login(this.credentials.email, this.credentials.password).subscribe(
      response => {
        // A verificação e armazenamento do token agora são feitos no LoginService
        this.router.navigate(['/home']); // Redirecionar para a página inicial
      },
      error => {
        this.loginError = 'Credenciais inválidas';
      }
    );
  }
}
