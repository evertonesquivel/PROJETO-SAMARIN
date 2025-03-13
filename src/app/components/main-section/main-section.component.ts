import { Component, OnInit } from '@angular/core';
import { MainSectionService } from '../../services/user-data/main-section.service';
import { Person } from '../../models/person.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../services/auth/login.service';
import { DataManagerService } from '../../services/user-data/data-manager.service';
import { FormsModule } from '@angular/forms';
import { MatchAnimationComponent } from '../../match-animation/match-animation.component';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatchAnimationComponent, FormsModule]
})
export class MainSectionComponent implements OnInit {
  users: Person[] = [];
  currentIndex = 0;
  currentImageIndex = 0;
  currentPerson: Person | undefined;
  currentImage: string | null = null;
  userId: number | undefined;
  showMatchAnimation = false;
  showLocationModal = false;
  newLatitude: number | null = null;
  newLongitude: number | null = null;
  filterDistance: number = 10;
  showAlert: boolean = false;

  constructor(
    private mainSectionService: MainSectionService,
    private loginService: LoginService,
    private dataManagerService: DataManagerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit chamado');

    const userId = this.loginService.getUserId();
    if (userId) {
      console.log('ID do usuário obtido:', userId);
      this.userId = userId;
      this.loadUsers();
    } else {
      console.error('Usuário não está logado ou ID não disponível');
    }
  }

  loadUsers(): void {
    this.users = []; // Limpa o array de usuários
    this.currentPerson = undefined; // Reseta o usuário atual
    this.currentImage = null; // Reseta a imagem atual
  
    this.dataManagerService.getUsers().subscribe(
      (data: Person[]) => {
        console.log('Dados de usuários obtidos:', data);
        this.users = data.map(user => ({
          ...user,
          images: user.images || [] // Garante que `images` seja um array
        }));
  
        // Busca as imagens para cada usuário
        this.users.forEach(user => {
          this.fetchUserImages(user.id);
        });
  
        if (this.users.length > 0) {
          this.currentPerson = this.users[this.currentIndex];
          console.log('Imagens do usuário atual:', this.currentPerson.images);
          this.updateCurrentImage();
        } else {
          console.log('Nenhum usuário obtido');
        }
      },
      error => {
        console.error('Erro ao obter usuários:', error);
      }
    );
  }
 

  fetchUserImages(userId: number): void {
    this.dataManagerService.fetchAndSaveUserImages(userId).pipe(
      switchMap((images) => {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.images = images.map(img => img.imageUrl);
        }
        return []; // Retorna um observable vazio para completar a assinatura
      })
    ).subscribe(
      () => {}, // Nada a fazer aqui
      (error) => console.error('Erro ao buscar imagens do usuário:', error)
    );
  }

  updateCurrentImage(): void {
    if (this.currentPerson) {
      if (!this.currentPerson.images || this.currentPerson.images.length === 0) {
        this.currentPerson.images = ['assets/placeholder.jpg'];
      }
      this.currentImage = this.currentPerson.images[this.currentImageIndex];
    } else {
      this.currentImage = 'assets/placeholder.jpg';
    }
    console.log('Imagem atualizada:', this.currentImage);
  }

  nextImage(): void {
    if (this.currentPerson && this.currentPerson.images && this.currentPerson.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentPerson.images.length;
      this.currentImage = this.currentPerson.images[this.currentImageIndex];
    }
  }

  prevImage(): void {
    if (this.currentPerson && this.currentPerson.images && this.currentPerson.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.currentPerson.images.length) % this.currentPerson.images.length;
      this.currentImage = this.currentPerson.images[this.currentImageIndex];
    }
  }

  nextPerson(): void {
    if (this.users.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.users.length;
      this.currentPerson = this.users[this.currentIndex];
      this.currentImageIndex = 0;
      this.updateCurrentImage();
    }
  }

  like(): void {
    if (!this.currentPerson || !this.userId) {
      return;
    }

    const likedUserId = this.currentPerson.id;
    this.mainSectionService.likeOrDislike(this.userId, likedUserId, true).subscribe(
      (response) => {
        if (response.isMutual) {
          this.showMatchAnimation = true;
          setTimeout(() => {
            this.showMatchAnimation = false;
          }, 6000);
        }
        this.nextPerson();
      },
      (error) => {
        console.error('Erro ao dar like:', error);
      }
    );
  }

  dislike(): void {
    if (!this.currentPerson || !this.userId) {
      return;
    }

    const dislikedUserId = this.currentPerson.id;
    this.mainSectionService.likeOrDislike(this.userId, dislikedUserId, false).subscribe(
      () => {
        this.nextPerson();
      },
      error => {
        console.error('Erro ao dar dislike:', error);
      }
    );
  }

  calculateAge(birthDate?: string): number | null {
    if (!birthDate) {
      return null;
    }

    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  navigateToProfile(id: number): void {
    this.router.navigate([`/perfil/${id}`]);
  }

  openLocationModal(): void {
    this.showLocationModal = true;
  }

  closeLocationModal(): void {
    this.showLocationModal = false;
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.newLatitude = position.coords.latitude;
          this.newLongitude = position.coords.longitude;
          console.log('Localização obtida:', this.newLatitude, this.newLongitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização. Atualize manualmente.');
        }
      );
    } else {
      alert('Geolocalização não suportada pelo navegador.');
    }
  }

  updateLocation(): void {
    if (this.newLatitude && this.newLongitude) {
      const userId = this.loginService.getUserId();
      if (userId) {
        this.dataManagerService.updateUserLocation(userId, this.newLatitude, this.newLongitude).subscribe(
          (response) => {
            console.log('Localização atualizada:', response);
            this.closeLocationModal();
            this.loadUsers();
          },
          (error) => {
            console.error('Erro ao atualizar localização:', error);
          }
        );
      } else {
        console.error('Usuário não está logado.');
      }
    } else {
      alert('Preencha a latitude e a longitude.');
    }
  }

  updateFilterDistance(): void {
    const userId = this.loginService.getUserId();
    if (userId) {
      this.dataManagerService.updateFilterDistance(userId, this.filterDistance).subscribe(
        (response) => {
          console.log('Distância de filtragem atualizada:', response);
          this.closeLocationModal();
          this.loadUsers();
        },
        (error) => {
          console.error('Erro ao atualizar distância de filtragem:', error);
        }
      );
    } else {
      console.error('Usuário não está logado.');
    }
  }

  sendMessage() {
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }
}