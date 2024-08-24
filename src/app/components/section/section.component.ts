import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { NavigationService } from '../../services/navigation.service'; // Verifique o caminho correto

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
  standalone: true,
  imports: [CommonModule] // Adiciona CommonModule aos imports do componente
})
export class SectionComponent {
  @Input() isPrimary: boolean = false;
  @Input() sectionTitle: string = 'Um mundo de possibilidades';
  @Input() sectionText1: string = 'Buscando conhecer novas pessoas?';
  @Input() sectionText2: string = 'Sem problemas, aqui te apresentamos várias!!! Simples, rápido e fácil, com Samarin ficou muito mais prático encontrar a cara metade. Um lugar que reúne tudo que você precisa, sem mais.';
  @Input() buttonText1: string = 'Fazer Login';
  @Input() buttonText2: string = 'Cadastrar';
  @Input() secondaryText: string = 'Lorem Ipsum é simplesmente uma simulação de texto da indústria tipográfica e de impressos, e vem sendo utilizado desde o século XVI.';
  @Input() imageSrc: string = '../../../assets/Icons.png';
  @Input() imageSrcSecondary: string = '../../../assets/Secondaryimage.png';

  constructor(private navigationService: NavigationService) {}

  onLoginButtonClick() {
    this.navigationService.navigateToLogin();
  }
}
