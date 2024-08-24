import { Component, OnInit } from '@angular/core';
import { Person } from '../../../models/person.model';
import { MainSectionService } from '../../../services/main-section.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [NgFor],
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
    password: ''
  };
  constructor(private person: MainSectionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    const loadedPerson = this.person.getPersonById(id);
    if (loadedPerson) {
      this.personCarregado = loadedPerson;
    }
  }
}

