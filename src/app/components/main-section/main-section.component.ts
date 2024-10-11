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
  currentIndex = 0;
  currentPerson: any;
  currentImage: string = '';

  constructor(private mainSectionService: MainSectionService, private router: Router) {}

  ngOnInit(): void {
    this.mainSectionService.getUsers().subscribe((data) => {
      this.users = data;
      if (this.users.length > 0) {
        this.currentIndex = 0;
      }
    });
  }

  nextImage(): void {
    if (this.currentIndex < this.users.length - 1) {
      this.currentIndex++;
    }
  }

  prevImage(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  like(): void {
    const personId = this.users[this.currentIndex].id;
    this.mainSectionService.like(personId).subscribe();
  }

  dislike(): void {
    const personId = this.users[this.currentIndex].id;
    this.mainSectionService.dislike(personId).subscribe();
  }

  navigateToProfile(id: number): void {
    this.router.navigate([`/perfil/${id}`]);
  }

  getUserById(id: number): Person | undefined {
    return this.users.find(person => person.id === id);
  }
}
