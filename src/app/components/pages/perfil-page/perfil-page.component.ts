import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../models/person.model';
import { Locations } from '../../../models/locations.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MainSectionService } from '../../../services/user-data/main-section.service';
import { DataManagerService } from '../../../services/user-data/data-manager.service';
import { LoginService } from '../../../services/auth/login.service'; // Importar o LoginService

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
    name: "",
    age: 0,
    birth_date: "",
    images: [],
    infos: [],
    email: "",
    user_tag: "",
    gender_identity: "",
    interest: "",
    ageRange: "",
    bio: "",
    profession :"",
    pronouns: "",
    sexual_orientation: "",
    personality: "",
    hobbies: "",
    min_age_interest: 0,
    max_age_interest: 0,
    specific_interests: "",
    relationship_types : "",

  };
  locationCarregado: Locations = {
    id: 0,
    city: "",
    state: "",
    country: "",
    latitude: 0,
    longitude: 0,
    users_id: 0,
    created_at: "",
    updated_at: ""
  };
  
  selectedImage: string | null = null;
  private subscription: Subscription = new Subscription();
  userId: number | undefined;

  constructor(
    private personService: MainSectionService,
    private dataManagerService: DataManagerService,
    private route: ActivatedRoute,
    private mainSectionService: MainSectionService, // Injetar o MainSectionService
    private loginService: LoginService // Injetar o LoginService
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.userId = this.loginService.getUserId() ?? undefined;

    this.subscription.add(
      this.dataManagerService.getUserById(id).subscribe((loadedPerson: Person) => {
        this.personCarregado = loadedPerson;
        this.personCarregado.age = this.calculateAge(this.personCarregado.birth_date);
        this.loadUserById(id);
      })
    );
    this.getLocationUser(id);
  }

  getLocationUser(userId: number): void {
    this.dataManagerService.getLocationUser(userId).subscribe(
      (locationData) => this.updateLocationCarregado(locationData),
      (error) => console.error('Erro ao obter localização do usuário:', error)
    );
  }

  updateLocationCarregado(locationData: any): void {
    this.locationCarregado = {
      id: locationData.id,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      users_id: locationData.users_id,
      created_at: locationData.created_at,
      updated_at: locationData.updated_at
    };
    console.log('Localização Carregada:', this.locationCarregado);
  }

  loadUserById(id: number): void {
    this.dataManagerService.getUserById(id).subscribe(
      (data) => {
        this.personCarregado = data;
        console.log('Person Carregado:', this.personCarregado);
      },
      (error) => console.error('Erro ao carregar o perfil do usuário', error)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  like(): void {
    if (!this.userId || !this.personCarregado) {
      console.log('Like cancelado: userId ou personCarregado não definidos');
      return;
    }

    const likedUserId = this.personCarregado.id;
    this.mainSectionService.likeOrDislike(this.userId, likedUserId, true).subscribe(
      (response) => {
        console.log('Resposta do servidor após like:', response);
        if (response.isMutual) {
          console.log('Like mútuo detectado!');
          alert('Like Mútuo! 🎉');
        }
      },
      (error) => console.error('Erro ao dar like:', error)
    );
  }

  dislike(): void {
    if (!this.userId || !this.personCarregado) {
      console.log('Dislike cancelado: userId ou personCarregado não definidos');
      return;
    }

    const dislikedUserId = this.personCarregado.id;
    this.mainSectionService.likeOrDislike(this.userId, dislikedUserId, false).subscribe(
      () => console.log('Dislike processado com sucesso'),
      (error) => console.error('Erro ao dar dislike:', error)
    );
  }

  sendMessage(): void {
    alert(`Mensagem enviada para ${this.personCarregado.name}`);
  }

  getGalleryImages(maxImages: number = this.personCarregado.images.length): string[] {
    return this.personCarregado.images.slice(0, maxImages);
  }

  openPopup(image: string): void {
    this.selectedImage = image;
  }

  closePopup(): void {
    this.selectedImage = null;
  }

  calculateAge(birthDate: string): number {
    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const m = today.getMonth() - birthDateObj.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  }
}
