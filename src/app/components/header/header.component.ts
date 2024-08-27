import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/login.service';
import { MainSectionService } from '../../services/user-data/main-section.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  isAuthenticated: boolean = false;
  navbarOpen: boolean = false;
  profileMenuOpen: boolean = false;
  userProfile: any = {};  // Ajuste conforme o tipo do perfil

  constructor(
    private authService: AuthService,
    private router: Router,
    private mainSectionService: MainSectionService
  ) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();

    if (this.isAuthenticated) {
      // Supondo que getPeople() retorna um array de perfis, você pode precisar ajustar conforme a estrutura real dos dados
      const people = this.mainSectionService.getPeople();
      if (people.length > 0) {
        this.userProfile = people[0];  // Ajuste conforme necessário
      }
    }
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  toggleProfileMenu() {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  goToMessages() {
    this.router.navigate(['/messages']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
