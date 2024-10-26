import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../models/person.model';
import { Locations } from '../../../models/locations.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MainSectionService } from '../../../services/user-data/main-section.service';
import { DataManagerService } from '../../../services/user-data/data-manager.service';


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
    images: [],
    infos: [],
    email: "",
    user_tag: "",
    password: "",
    gender_identity: "",
    interest: "",
    ageRange: "",
    bio: "",
    birth_date : "",

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

  constructor(private personService: MainSectionService, 
    private dataManagerService : DataManagerService, 
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.subscription.add(
      this.dataManagerService.getUserById(id).subscribe((loadedPerson: Person) => {
        this.personCarregado = loadedPerson; 
        this.personCarregado.age = this.calculateAge(this.personCarregado.birth_date);
        this.loadUserById(id);// Aqui você já terá o objeto Person completo
      })
    );
    this.getLocationUser(id); // Chama o método para obter a localização 
  }
  getLocationUser (userId: number): void {
    this.dataManagerService.getLocationUser (userId).subscribe(
      (locationData) => {
        this.updateLocationCarregado(locationData); // Atualiza o objeto locationCarregado
      },
      (error) => {
        console.error('Erro ao obter localização do usuário:', error);
      }
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
    console.log('Localização Carregada:', this.locationCarregado); // Verifique os dados
  }


  loadUserById(id:number):void {
     // Exemplo de ID, substitua pelo ID correto
    this.dataManagerService.getUserById(id).subscribe(
      (data) => {
        this.personCarregado = data; // Atribuindo o objeto do usuário
        console.log('Person Carregado:', this.personCarregado); // Verifique os dados
      },
      (error) => {
        console.error('Erro ao carregar o perfil do usuário', error);
      }
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
