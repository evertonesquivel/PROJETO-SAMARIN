import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoginService } from './services/auth/login.service'
import { Router } from '@angular/router';
import { SectionComponent } from './components/section/section.component';
import { MainSectionComponent } from './components/main-section/main-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SAMARIN';
  constructor(private router: Router, private loginService: LoginService) {
    this.checkLoginStatus();
  
  }
  checkLoginStatus(): void {
    if (this.loginService.isAuthenticated()) {
      // Se o usuário estiver autenticado, redireciona para /home
      this.router.navigate(['/home']);
    } else {
      // Caso contrário, redireciona para a tela inicial
      this.router.navigate(['/']);
    }
  }
}