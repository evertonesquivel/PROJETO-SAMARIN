import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder) {}

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
      birth_date: ['', Validators.required],
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
    }
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

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const finalSubmission = {
            ...this.step1Form.value,
            ...this.step2Form.value,
            ...this.step3Form.value,
            ...this.step4Form.value,
            ...this.step5Form.value,
            photos: this.images.map(image => image ? this.getImagePath(image.name) : null).filter(path => path !== null),
            location: { latitude, longitude }
          };

          console.log('Formulário completo!', finalSubmission);
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
}
