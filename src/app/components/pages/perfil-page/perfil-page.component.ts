import { Component, OnInit } from '@angular/core';
import { Person } from '../../../models/person.model';
import { MainSectionService } from '../../../services/user-data/main-section.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor, CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [NgFor, CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.css']
})
export class PerfilPageComponent implements OnInit {
  personCarregado: Person = {
    id: 0,
    name: '',
    age: 0,
    images: [],
    infos: [],
    email: '',
    nickname: '',
    password: '',
    city: '',
    state: 'BA',
    identification: '',
    interest: '',
    ageRange: '',
    specificInterests: ''
  };

  selectedImage: string | null = null;

  constructor(private personService: MainSectionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    const loadedPerson = this.personService.getPersonById(id);
    if (loadedPerson) {
      this.personCarregado = loadedPerson;
    }
  }

  like() {
    alert(`Você deu like em ${this.personCarregado.name}`);
  }

  dislike() {
    alert(`Você deu dislike em ${this.personCarregado.name}`);
  }

  sendMessage() {
    alert(`Mensagem enviada para ${this.personCarregado.name}`);
  }

  getGalleryImages(): string[] {
    const images = this.personCarregado.images;
    return [images[0], images[1], images[0], images[1]];
  }

  openPopup(image: string) {
    this.selectedImage = image;
  }

  closePopup() {
    this.selectedImage = null;
  }
}
