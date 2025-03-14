import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataManagerService } from '../../services/user-data/data-manager.service';

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class MultiStepFormComponent implements OnInit {
  currentStep = 0;  // Controla o passo atual do formulário
  step1Form!: FormGroup;
  step2Form!: FormGroup;
  step3Form!: FormGroup;
  step4Form!: FormGroup;
  step5Form!: FormGroup;
  step6Form!: FormGroup;

  imagemPerfil: File | null = null;
  uploadedPhotos: string[] = []; // Para armazenar os caminhos das fotos
  images: (File | null)[] = Array(5).fill(null);
  showLocationMessage = false;

  passwordStrength = {
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  personalidadeOptions = ['Aventureiro', 'Criativo', 'Analítico', 'Sociável'];
  identificacaoGeneroOptions = [
    'Homem cisgênero', 'Mulher cisgênero', 'Homem transgênero', 'Mulher transgênero', 
    'Não-binário', 'Gênero fluido', 'Agênero', 'Bigênero', 'Gênero neutro', 
    'Pangênero', 'Intergênero'
  ];
  orientacaoSexualOptions = [
    'Gay', 'Lésbica', 'Bissexual', 'Pansexual', 'Assexual', 'Demissexual', 
    'Polissexual', 'Queer', 'Questionando', 'Androssexual', 'Ginessexual'
  ];
  pronomesOptions = ['Ele/Dele', 'Ela/Dela', 'Elu/Delu', 'Ile/Dile'];
  tipoRelacionamentoOptions = [
    'Casual', 'Sério', 'Amizade', 'Namoro', 'Aberto', 'Poliamoroso', 
    'Exploração', 'Não definido'
  ];

  constructor(private fb: FormBuilder, private dataManagerService: DataManagerService) { }

  ngOnInit(): void {
    this.initializeForms();
  }

  initializeForms() {
    this.step1Form = this.fb.group({
      name: ['', [Validators.required, this.stringValidator]],
      surname: ['', [Validators.required, this.stringValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\) \d{5}-\d{4}$/)]],
      
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/[A-Z]/),       // Pelo menos uma letra maiúscula
          Validators.pattern(/\d/),          // Pelo menos um número
          Validators.pattern(/[@$!%*?&]/),   // Pelo menos um caractere especial
        ],
      ],
      confirm_password: ['', Validators.required],
    });

    this.step1Form.get('password')?.valueChanges.subscribe(value => {
      this.checkPasswordStrength(value);
    });

    this.step2Form = this.fb.group({
      birth_date: ['', [Validators.required, this.minimumAgeValidator(18)]],
      state: ['', Validators.required],
      city: ['', Validators.required],
      profession: ['', Validators.required],
      gender_identity: ['', Validators.required],
      sexual_orientation: ['', Validators.required]
    });

    this.step3Form = this.fb.group({
      user_tag: ['', Validators.required],
      min_age_interest: [18, Validators.required],
      max_age_interest: [127, [Validators.required, Validators.min(18)]],
      personality: ['', Validators.required],
      relationship_types: ['', Validators.required],
      pronouns: ['', Validators.required]
    });

    this.step4Form = this.fb.group({
      hobbies: ['', Validators.required],
      specific_interests: ['', Validators.required]
    });

    this.step5Form = this.fb.group({
      imagemPerfil: [null, Validators.required]
    });

    this.step6Form = this.fb.group({});
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  validateAgeRange() {
    const minAge = this.step3Form.get('min_age_interest')?.value;
    const maxAge = this.step3Form.get('max_age_interest')?.value;

    if (minAge < 18) {
      alert("A idade mínima não pode ser inferior a 18 anos.");
      this.step3Form.get('min_age_interest')?.setValue(18);
    }
    if (maxAge > 127) {
      alert("A idade máxima não pode ser superior a 127 anos.");
      this.step3Form.get('max_age_interest')?.setValue(127);
    }
    if (minAge > maxAge) {
      alert("A idade mínima não pode ser maior que a idade máxima.");
    }if(maxAge < minAge){
      alert("A idade máxima não pode ser menor que a idade mínima.");

    }
  }
  minimumAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      const inputDate = new Date(control.value);
      if (isNaN(inputDate.getTime())) {
        // Retorna erro se o valor não for uma data válida
        return { invalidDate: true };
      }
  
      const today = new Date();
      const age = today.getFullYear() - inputDate.getFullYear();
      const hasBirthdayPassed =
        today.getMonth() > inputDate.getMonth() ||
        (today.getMonth() === inputDate.getMonth() && today.getDate() >= inputDate.getDate());
  
      const isOldEnough = hasBirthdayPassed ? age >= minAge : age - 1 >= minAge;
  
      return isOldEnough ? null : { minimumAge: { requiredAge: minAge, actualAge: age } };
    };
  }
  

  validateStringFields() {
    const fieldsToCheck = ['name', 'surname', 'city', 'profession'];
    fieldsToCheck.forEach(field => {
      const value = this.step1Form.get(field)?.value || this.step2Form.get(field)?.value;
      if (typeof value !== 'string') {
        alert(`O campo ${field} deve conter apenas texto.`);
      }
    });
  }

  stringValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value !== 'string' || !isNaN(Number(value))) {
      return { invalidString: true };
    }
    return null;
  }

  checkPasswordStrength(password: string) {
    this.passwordStrength = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[@$!%*?&]/.test(password),
    };
  }

  validatePasswordMatch(): boolean {
    return (
      this.step1Form.get('password')?.value ===
      this.step1Form.get('confirm_password')?.value
    );
  }

  onFileSelected(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.images[index] = target.files[0];
    }
  }

  isPhotoUploadValid(): boolean {
    return this.images.filter(photo => photo !== null).length > 0;
  }

  onPhotoSelected(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.uploadedPhotos[index] = `/assets/${file.name}`;
      this.step6Form.addControl(`photo${index + 1}`, this.fb.control(file));
    }
  }

  getImagePath(imageName: string): string {
    return `/assets/${imageName}`;
  }
  isPhoneNumberValid(phone: string): boolean {
    const phonePattern = /^\(\d{2}\)\s?\d{5}-\d{4}$/; // Formato (xx) xxxxx-xxxx
    return phonePattern.test(phone);
  }
  
  submitForm() {
    // Validações iniciais
    this.showLocationMessage = true;
    this.validateAgeRange();
  
    if (!this.validatePasswordMatch()) {
      alert("As senhas não coincidem.");
      return;
    }
  
    this.validateStringFields();
  
    if (!this.isPhoneNumberValid(this.step1Form.value.phone)) {
      alert('Por favor, insira um número de telefone válido.');
      return;
    }
  
    // Verifica se a geolocalização é suportada
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          // Converte a imagem de perfil para base64 (se existir)
          const profileImageBase64 = this.imagemPerfil ? await this.convertImageToBase64(this.imagemPerfil) : null;
  
          // Filtra as imagens nulas e converte as restantes para base64
          const galleryImagesBase64 = await Promise.all(
            this.images
              .filter((image): image is File => image !== null) // Filtra valores null e garante que o tipo é File
              .map(image => this.convertImageToBase64(image))
          );
  
          // Prepara os dados para envio
          const finalSubmission = {
            ...this.step1Form.value, // Dados do step1
            ...this.step2Form.value, // Dados do step2
            ...this.step3Form.value, // Dados do step3
            ...this.step4Form.value, // Dados do step4
            ...this.step5Form.value, // Dados do step5
            city: this.step2Form.value.city, // Cidade
            state: this.step2Form.value.state, // Estado
            latitude, // Latitude
            longitude, // Longitude
            profileImage: profileImageBase64, // Imagem de perfil em base64
            galleryImages: galleryImagesBase64 // Fotos da galeria em base64
          };
  
          console.log('Formulário completo!', finalSubmission);
  
          // Envia os dados para o backend
          this.dataManagerService.submitFormData(finalSubmission).subscribe(
            (response: any) => {
              console.log('Dados enviados com sucesso:', response);
              alert('Cadastro realizado com sucesso!');
            },
            (error: any) => {
              console.error('Erro ao enviar dados:', error);
              alert('Erro ao realizar cadastro. Tente novamente.');
            }
          );
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          alert('Não foi possível obter sua localização. Por favor, verifique as permissões de localização.');
        }
      );
    } else {
      alert('Geolocalização não é suportada por este navegador.');
    }
  }
  
  // Método para converter um arquivo de imagem para base64
  convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
}
