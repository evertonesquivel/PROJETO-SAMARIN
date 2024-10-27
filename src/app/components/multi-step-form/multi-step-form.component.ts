import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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

  personalidadeOptions = ['Aventureiro', 'Criativo', 'Analítico', 'Sociável']; // Exemplo de opções

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  // Inicializa todos os formulários das etapas
  initializeForms() {
    this.step1Form = this.fb.group({
      name: ['', Validators.required],
      sobrenome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', Validators.required],
      confirmarSenha: ['', Validators.required]
    });

    this.step2Form = this.fb.group({
      dataNascimento: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      profissao: ['', Validators.required],
      pronomes: ['', Validators.required],
      identificacaoGenero: ['', Validators.required]
    });

    this.step3Form = this.fb.group({
      nickname: ['', Validators.required],
      interesse: ['', Validators.required],
      faixaIdade: [18, Validators.required],
      personalidade: ['', Validators.required]
    });

    this.step4Form = this.fb.group({
      hobbies: ['', Validators.required],
      descricao: ['', Validators.required]
    });

    this.step5Form = this.fb.group({
      imagemPerfil: [null, Validators.required]
    });
  }

  // Função para avançar para a próxima etapa
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  // Função para voltar à etapa anterior
  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  // Função que submete todos os formulários quando a última etapa é concluída
  submitForm() {
    console.log('Formulário completo!', {
      ...this.step1Form.value,
      ...this.step2Form.value,
      ...this.step3Form.value,
      ...this.step4Form.value,
      ...this.step5Form.value
    });
    // Redirecione ou envie os dados ao backend aqui
  }
}
