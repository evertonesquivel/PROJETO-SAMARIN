import { Component, OnInit } from '@angular/core';
import { MainSectionService } from '../../services/user-data/main-section.service';
import { Person } from '../../models/person.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LoginService } from '../../services/auth/login.service'; // Importa o LoginService
import { DataManagerService } from '../../services/user-data/data-manager.service';
import { Pipe, PipeTransform } from '@angular/core';
import { MatchAnimationComponent } from '../../match-animation/match-animation.component';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatchAnimationComponent]
})
export class MainSectionComponent implements OnInit {
  users: Person[] = [];
  currentIndex = 0;
  currentImageIndex = 0;
  currentPerson: Person | undefined;
  currentImage: string | null = null; // Inicializa como null
  userId: number | undefined; // Armazena o ID do usuário logado
  showMatchAnimation = false;

  constructor(
    private mainSectionService: MainSectionService,
    private loginService: LoginService, // Injetar o LoginService
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
      // Redirecionar para a página de login ou mostrar uma mensagem de erro
    }
  }

  loadUsers(): void {
    this.dataManagerService.getUsers().subscribe(
      (data: Person[]) => {
        console.log('Dados de usuários obtidos:', data);
        this.users = data.map(user => ({
          ...user,
          images: user.images || [] // Garante que `images` seja um array, mesmo que esteja undefined
        }));
        if (this.users.length > 0) {
          this.currentPerson = this.users[this.currentIndex];
          console.log('Imagens do usuário atual:', this.currentPerson.images);
          this.updateCurrentImage(); // Atualiza a imagem atual
        } else {
          console.log('Nenhum usuário obtido');
        }
      },
      error => {
        console.error('Erro ao obter usuários:', error);
      }
    );
  }
  updateCurrentImage(): void {
    if (this.currentPerson) {
      if (!this.currentPerson.images || this.currentPerson.images.length === 0) {
        this.currentPerson.images = ['assets/placeholder.jpg']; // Adiciona uma imagem de placeholder
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
      this.updateCurrentImage(); // Atualiza a imagem atual
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
          this.showMatchAnimation = true; // Exibe a animação
          setTimeout(() => {
            this.showMatchAnimation = false; // Oculta a animação após 6 segundos
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
    console.log('Função dislike() chamada');

    if (!this.currentPerson || !this.userId) {
      console.log('Dislike cancelado: currentPerson ou userId não definidos');
      console.log('currentPerson:', this.currentPerson);
      console.log('userId:', this.userId);
      return;
    }

    const dislikedUserId = this.currentPerson.id;
    console.log('Enviando dislike para o usuário:', dislikedUserId);

    this.mainSectionService.likeOrDislike(this.userId, dislikedUserId, false).subscribe(
      () => {
        console.log('Dislike processado com sucesso');
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

  getUserById(id: number): Person | undefined {
    return this.users.find(person => person.id === id);
  }
}

@Pipe({
  name: 'stringToArray'
})
export class StringToArrayPipe implements PipeTransform {
  transform(value: string, separator: string = ','): string[] {
    return value ? value.split(separator).map(item => item.trim()) : [];
  }
}