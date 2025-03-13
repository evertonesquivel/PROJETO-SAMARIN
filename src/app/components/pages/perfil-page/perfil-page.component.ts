import { Component, OnInit, OnDestroy } from '@angular/core';
import { Person } from '../../../models/person.model';
import { Locations } from '../../../models/locations.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MainSectionService } from '../../../services/user-data/main-section.service';
import { DataManagerService } from '../../../services/user-data/data-manager.service';
import { LoginService } from '../../../services/auth/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
    profession: "",
    pronouns: "",
    sexual_orientation: "",
    personality: "",
    hobbies: "",
    min_age_interest: 0,
    max_age_interest: 0,
    specific_interests: "",
    relationship_types: "",
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
  isCurrentUser: boolean = false;
  isEditing: boolean = false;
  tempPerson: Person | null = null;
  tempLocation: Locations | null = null;
  newImages: File[] = [];
  userImages: { userId: number, imageUrl: string }[] = [];

  constructor(
    private personService: MainSectionService,
    private dataManagerService: DataManagerService,
    private route: ActivatedRoute,
    private mainSectionService: MainSectionService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!);
    this.userId = this.loginService.getUserId() ?? undefined;
    this.selectedImage = null; // Inicializa como null

    this.subscription.add(
      this.dataManagerService.getUserById(id).subscribe((loadedPerson: Person) => {
        this.personCarregado = loadedPerson;
        this.personCarregado.age = this.calculateAge(this.personCarregado.birth_date);
        this.isCurrentUser = this.userId === this.personCarregado.id;
        this.loadUserById(id);
        this.fetchUserImages(id); // Busca as imagens do usuário
        this.updateCurrentImage(); // Atualiza as imagens do usuário
      })
    );
    this.getLocationUser(id);
  }

  updateCurrentImage(): void {
    if (this.personCarregado) {
      if (!this.personCarregado.images || this.personCarregado.images.length === 0) {
        this.personCarregado.images = ['assets/default-profile.png']; // Adiciona uma imagem de placeholder
      }
    } else {
      // Se this.personCarregado for null ou undefined, inicializa com valores padrão
      this.personCarregado = {
        id: 0,
        name: "",
        age: 0,
        birth_date: "",
        images: ['assets/default-profile.png'], // Fallback para o usuário atual
        infos: [],
        email: "",
        user_tag: "",
        gender_identity: "",
        interest: "",
        ageRange: "",
        bio: "",
        profession: "",
        pronouns: "",
        sexual_orientation: "",
        personality: "",
        hobbies: "",
        min_age_interest: 0,
        max_age_interest: 0,
        specific_interests: "",
        relationship_types: "",
      };
    }
    // console.log('Imagens atualizadas:', this.personCarregado.images);
  }

  fetchUserImages(userId: number): void {
    this.dataManagerService.fetchAndSaveUserImages(userId).subscribe(
      (images) => {
        this.userImages = images;
        if (images.length > 0) {
          this.personCarregado.images = images.map(img => img.imageUrl); // Atualiza as imagens do usuário
        } else {
          this.personCarregado.images = ['assets/default-profile.png']; // Fallback para placeholder
        }
        this.updateCurrentImage(); // Atualiza as imagens do usuário
      },
      (error) => console.error('Erro ao buscar imagens do usuário:', error)
    );
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
    // console.log('Imagem clicada:', image);
    this.selectedImage = image; // Define a imagem selecionada apenas ao clicar
  }

  closePopup(): void {
    this.selectedImage = null; // Fecha a popup
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

  startEditing(): void {
    this.isEditing = true;
    this.tempPerson = { ...this.personCarregado };
    this.tempLocation = { ...this.locationCarregado };
  }

  cancelEditing(): void {
    this.isEditing = false;
    if (this.tempPerson) {
      this.personCarregado = { ...this.tempPerson };
    }
    if (this.tempLocation) {
      this.locationCarregado = { ...this.tempLocation };
    }
    this.tempPerson = null;
    this.tempLocation = null;
  }

  saveChanges(): void {
    const updatedData = {
      name: this.personCarregado.name,
      sexual_orientation: this.personCarregado.sexual_orientation,
      gender_identity: this.personCarregado.gender_identity,
      interest: this.personCarregado.interest,
      hobbies: this.personCarregado.hobbies,
      specific_interests: this.personCarregado.specific_interests,
      relationship_types: this.personCarregado.relationship_types,
    };

    this.dataManagerService.updateUserProfile(updatedData).subscribe(
      (response) => {
        console.log('Perfil atualizado com sucesso:', response);
        this.isEditing = false;
      },
      (error) => {
        console.error('Erro ao atualizar perfil:', error);
      }
    );
  }
  uploadImages(): void {
    if (this.newImages.length > 0) {
      // Verifica se o número de novas imagens excede o limite (considerando que a primeira imagem não pode ser substituída)
      const maxImages = 5; // Defina o número máximo de imagens permitidas
      if (this.personCarregado.images.length + this.newImages.length > maxImages) {
        alert(`Você só pode adicionar até ${maxImages - this.personCarregado.images.length} imagens.`);
        return;
      }
  
      // Envia as novas imagens para o backend
      this.dataManagerService.uploadUserImages(this.personCarregado.id, this.newImages).subscribe(
        (response) => {
          console.log('Imagens enviadas com sucesso:', response);
          // Atualiza a lista de imagens no frontend
          this.personCarregado.images = [...this.personCarregado.images, ...response.imageUrls];
          this.newImages = []; // Limpa a lista de novas imagens
        },
        (error) => {
          console.error('Erro ao fazer upload das imagens:', error);
          alert('Erro ao fazer upload das imagens. Tente novamente.');
        }
      );
    } else {
      alert('Nenhuma imagem selecionada.');
    }
  }
  onFileChange(event: any): void {
    const files = Array.from(event.target.files) as File[]; // Type assertion
    const maxImages = 5; // Defina o número máximo de imagens permitidas
  
    // Verifica se o número de novas imagens excede o limite
    if (this.personCarregado.images.length + files.length > maxImages) {
      alert(`Você só pode adicionar até ${maxImages - this.personCarregado.images.length} imagens.`);
      return;
    }
  
    // Adiciona as novas imagens à lista
    this.newImages = files;
  }
  onProfileImageChange(event: any): void {
    const file = event.target.files[0]; // Pega o primeiro arquivo selecionado
    if (file) {
      // Verifica se o arquivo é uma imagem
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64Image = e.target.result; // Converte a imagem para base64
          this.uploadProfileImage(this.personCarregado.id, base64Image); // Envia para o backend
        };
        reader.readAsDataURL(file); // Converte o arquivo para base64
      } else {
        alert('Por favor, selecione um arquivo de imagem válido.');
      }
    }
  }
  
  uploadProfileImage(userId: number, base64Image: string): void {
    this.dataManagerService.uploadProfileImage(userId, base64Image).subscribe(
      (response) => {
        console.log('Imagem de perfil atualizada com sucesso:', response);
        // Atualiza a imagem de perfil no frontend
        this.personCarregado.images[0] = response.imageUrl;
      },
      (error) => {
        console.error('Erro ao atualizar a imagem de perfil:', error);
        alert('Erro ao atualizar a imagem de perfil. Tente novamente.');
      }
    );
  }
  
  onGalleryImagesChange(event: any): void {
    const files = Array.from(event.target.files) as File[];
    const maxImages = 5; // Defina o número máximo de imagens permitidas
  
    // Verifica se o número de novas imagens excede o limite
    if (this.personCarregado.images.length + files.length > maxImages) {
      alert(`Você só pode adicionar até ${maxImages - this.personCarregado.images.length} imagens.`);
      return;
    }
  
    // Adiciona as novas imagens à lista
    this.newImages = files;
  }
  
 uploadGalleryImages(userId: number, imageFiles: File[]): void {
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  imageFiles.forEach((file) => {
    formData.append('images', file);
  });

  this.dataManagerService.uploadImages(formData).subscribe(
    (response) => {
      console.log('Imagens enviadas com sucesso:', response);
      
      // Atualiza a galeria no frontend
      this.personCarregado.images = [...this.personCarregado.images, ...response.imageUrls];
    },
    (error) => {
      console.error('Erro ao fazer upload das imagens:', error);
      alert('Erro ao fazer upload das imagens. Tente novamente.');
    }
  );
}
}