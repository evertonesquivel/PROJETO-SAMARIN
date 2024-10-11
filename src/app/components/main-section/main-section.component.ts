import { Component, OnInit } from '@angular/core';
import { MainSectionService } from '../../services/user-data/main-section.service';
import { Person } from '../../models/person.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-main-section',
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MainSectionComponent implements OnInit {
  users: Person[] = [];
  currentIndex = 0; // Para controlar o perfil atual
  currentImageIndex = 0; // Para controlar a imagem atual do perfil
  currentPerson: Person | undefined;
  currentImage: string = '';

  constructor(private mainSectionService: MainSectionService, private router: Router) {}

  ngOnInit(): void {
    this.mainSectionService.getUsers().subscribe((data) => {
      this.users = data;
      if (this.users.length > 0) {
        this.currentPerson = this.users[this.currentIndex];
        this.currentImage = this.currentPerson?.images[this.currentImageIndex] || '';
      }
    });
  }

  nextImage(): void {
    if (this.currentPerson && this.currentPerson.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentPerson.images.length; // Muda para a próxima imagem, se for a última, volta para a primeira
      this.currentImage = this.currentPerson.images[this.currentImageIndex];
    }
  }

  prevImage(): void {
    if (this.currentPerson && this.currentPerson.images.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.currentPerson.images.length) % this.currentPerson.images.length; // Volta para a imagem anterior, se for a primeira, vai para a última
      this.currentImage = this.currentPerson.images[this.currentImageIndex];
    }
  }

  like(): void {
    // Simplesmente avança para o próximo perfil
    if (this.currentIndex < this.users.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volta para o primeiro perfil se chegar ao fim
    }
    this.currentPerson = this.users[this.currentIndex];
    this.currentImage = this.currentPerson.images[0];
  }
  
  dislike(): void {
    // Simplesmente avança para o próximo perfil
    if (this.currentIndex < this.users.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0; // Volta para o primeiro perfil se chegar ao fim
    }
    this.currentPerson = this.users[this.currentIndex];
    this.currentImage = this.currentPerson.images[0];
  }
  nextPerson(): void {
    if (this.users.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.users.length; // Avança para o próximo perfil, se for o último, volta para o primeiro
      this.currentPerson = this.users[this.currentIndex];
      this.currentImageIndex = 0; // Reseta para a primeira imagem do próximo perfil
      this.currentImage = this.currentPerson?.images[this.currentImageIndex] || '';
    }
  }
  calculateAge(birthDate?: string): number | null {
    if (!birthDate) {
      return null; // Retorna null se a data de nascimento for indefinida
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
