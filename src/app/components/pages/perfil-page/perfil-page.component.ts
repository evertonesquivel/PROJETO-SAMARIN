import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../models/person.model';
import { MainSectionService } from '../../../services/user-data/main-section.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-page.component.html',
  styleUrls: ['./perfil-page.component.css']
})
export class PerfilPageComponent implements OnInit, OnDestroy {
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
  private subscription: Subscription = new Subscription();

  constructor(private personService: MainSectionService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.subscription.add(
      this.personService.getUserById(id).subscribe((loadedPerson: Person) => {
        this.personCarregado = loadedPerson; // Aqui você já terá o objeto Person completo
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe(); // Limpa a assinatura para evitar vazamentos de memória
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
    return this.personCarregado.images.slice(0, 2); // Retorna apenas as duas primeiras imagens
  }

  openPopup(image: string) {
    this.selectedImage = image;
  }

  closePopup() {
    this.selectedImage = null;
  }
}
