import { Component, OnInit } from '@angular/core';
import { MainSectionService } from '../../services/main-section.service';
import { Person } from '../../models/person.model';
import { MatDialog } from '@angular/material/dialog';
import { PerfilPopupComponent } from '../perfil-popup/perfil-popup.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './main-section.component.html',
  styleUrls: ['./main-section.component.css'],
  providers: [MainSectionService] // Provide the service here
})
export class MainSectionComponent implements OnInit {
  people: Person[] = [];
  currentPerson: Person | null = null;
  currentImageIndex: number = 0;
  infos: string[];

  constructor(private mainSectionService: MainSectionService, private dialog: MatDialog) {
    this.infos = []
  }

  ngOnInit(): void {
    this.people = this.mainSectionService.getPeople();
    this.currentPerson = this.people[0];
    this.currentImageIndex = 0;
    console.log(this.currentPerson.images);
  }

  prevImage(): void {
    if (this.currentPerson && this.currentPerson.images) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.currentPerson.images.length) % this.currentPerson.images.length;
    }
  }
  
  nextImage(): void {
    if (this.currentPerson && this.currentPerson.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.currentPerson.images.length;
    }
  }

  like(): void {
    if (this.currentPerson) {
      console.log(`You liked ${this.currentPerson.name}!`);
      this.nextPerson();
    }
  }

  dislike(): void {
    if (this.currentPerson) {
      console.log(`You disliked ${this.currentPerson.name}!`);
      this.nextPerson();
    }
  }

  nextPerson(): void {
    if (this.people && this.currentPerson) {
      const currentIndex = this.people.indexOf(this.currentPerson);
      this.currentPerson = this.people[(currentIndex + 1) % this.people.length];
      this.currentImageIndex = 0;
    }
  }

  verPerfil(): void {
    const dialogRef = this.dialog.open(PerfilPopupComponent, {
      width: '400px',
      height: '400px',
      data: { user: this.currentPerson }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Popup fechado`);
    });
  }

  get currentImage(): string {
    return this.currentPerson && this.currentPerson.images ? this.currentPerson.images[this.currentImageIndex] : '';
  }
}