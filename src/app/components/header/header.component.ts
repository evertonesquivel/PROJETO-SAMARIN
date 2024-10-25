import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { LoginService } from '../../services/auth/login.service';
import { DataManagerService } from '../../services/user-data/data-manager.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule],
  providers: [LoginService] // Provide the AuthService here
})
export class HeaderComponent implements OnInit {
  
  isAuthenticated = false; // Exemplo inicial; altere conforme sua lógica
  userProfile: any = {}; // Defina a estrutura do userProfile de acordo com seu modelo
  profileMenuOpen = false;
  navbarOpen = false;

  constructor(private loginService: LoginService,
    private dataManagerService: DataManagerService,
     private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.isAuthenticated = this.loginService.isAuthenticated();
    if (this.isAuthenticated) {
      this.getUserProfile();
    }
  }

  getUserProfile(): void {
    this.dataManagerService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
        console.log(this.userProfile)
      },
      (error) => {
        console.error('Erro ao buscar o perfil do usuário', error);
      }
    );
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  goToMessages(): void {
    this.router.navigate(['/messages']);
  }

  logout(): void {
    this.isAuthenticated = false; 
    this.loginService.logout();
    this.router.navigate(['/login']); // Redirecionar para a página de login
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
