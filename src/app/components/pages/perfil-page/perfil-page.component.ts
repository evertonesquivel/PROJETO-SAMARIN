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
  styleUrl: './perfil-page.component.css'
})
export class PerfilPageComponent implements OnInit {
  personCarregado: Person = new Person

  constructor(private person: MainSectionService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.personCarregado = this.person.getPersonById(parseInt(this.route.snapshot.paramMap.get('id')!))!
  }

}
