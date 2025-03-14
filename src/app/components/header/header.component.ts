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
  providers: [LoginService]
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false; // Estado de autenticação
  userProfile: any = {}; // Dados do perfil
  profileMenuOpen = false;
  navbarOpen = false;

  constructor(
    private loginService: LoginService,
    private dataManagerService: DataManagerService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // Inscreva-se no estado de autenticação
    this.loginService.isAuthenticated$.subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
      if (isAuthenticated) {
        this.getUserProfile();
      }
    });

    // Inscreva-se nos dados do perfil
    this.loginService.userProfile$.subscribe((profile) => {
      this.userProfile = profile;
    });

    // Verifique o estado inicial de autenticação
    this.isAuthenticated = this.loginService.isAuthenticated();
    if (this.isAuthenticated) {
      this.getUserProfile();
    }
  }

  getUserProfile(): void {
    this.dataManagerService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
        console.log('Perfil do usuário:', this.userProfile);

        // Busca a primeira imagem do usuário
        if (this.userProfile?.id) {
          this.fetchUserProfileImage(this.userProfile.id);
        }
      },
      (error) => {
        console.error('Erro ao buscar o perfil do usuário', error);
      }
    );
  }

  fetchUserProfileImage(userId: number): void {
    this.dataManagerService.fetchAndSaveUserImages(userId).subscribe(
      (images) => {
        if (images.length > 0) {
          // Atualiza apenas a primeira imagem no perfil do usuário
          this.userProfile.images = [images[0].imageUrl];
        } else {
          // Define uma imagem de placeholder se não houver imagens
          this.userProfile.images = ['assets/default-profile.png'];
        }
      },
      (error) => {
        console.error('Erro ao buscar a imagem do perfil:', error);
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
    this.loginService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToProfile(): void {
    if (this.userProfile?.id) {
      this.router.navigate([`/perfil/${this.userProfile.id}`]);
    } else {
      console.error('ID do usuário não disponível');
    }
  }
}