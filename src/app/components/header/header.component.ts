import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/login.service';
import { MainSectionService } from '../../services/user-data/main-section.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  navbarOpen: boolean = false;
  profileMenuOpen: boolean = false;
  userProfile: any = {};  // Ajuste conforme o tipo do perfil
  private authSubscription!: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private mainSectionService: MainSectionService
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authStatus$.subscribe(status => {
      this.isAuthenticated = status;

      if (this.isAuthenticated) {
        const userId = this.authService.getLoggedInUserId();
        if (userId !== null) {
          this.userProfile = this.mainSectionService.getPeople().find(user => user.id === userId);
        }
      } else {
        this.userProfile = {}; // Limpa o perfil quando não autenticado
      }
    });
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

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
