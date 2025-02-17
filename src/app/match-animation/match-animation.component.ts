import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-match-animation',
  templateUrl: './match-animation.component.html',
  styleUrls: ['./match-animation.component.css'],
  standalone: true
})
export class MatchAnimationComponent implements OnInit {
  @Input() user1: string | undefined;
  @Input() user2: string | undefined;

  constructor() {}

  ngOnInit(): void {
    this.startAnimation();
  }

  startAnimation(): void {
    const matchText = document.getElementById('matchText') as HTMLElement;
    const leftProfile = document.querySelector('.profile-left') as HTMLElement;
    const rightProfile = document.querySelector('.profile-right') as HTMLElement;
    const heart = document.querySelector('.heart') as HTMLElement;
    const sparkContainer = document.getElementById('sparkContainer') as HTMLElement;
    const usernames = document.querySelectorAll('.username') as NodeListOf<HTMLElement>;

    // 🔥 1. Exibe "Deu Match!" com cor vibrante ANTES de tudo
    matchText.style.display = 'block';
    matchText.classList.add('fade-in');

    setTimeout(() => {
      matchText.style.display = 'none';
    }, 3000);

    // 2. Depois do "Deu Match!", exibe perfis e nomes
    setTimeout(() => {
      leftProfile.style.opacity = '1';
      rightProfile.style.opacity = '1';
      leftProfile.style.transform = 'translateX(0)';
      rightProfile.style.transform = 'translateX(0)';

      usernames.forEach((username) => {
        username.style.opacity = '1';
      });
    }, 3500);

    // 3. Exibe coração grande no centro
    setTimeout(() => {
      heart.style.opacity = '1';
      heart.style.transform = 'scale(1.5)';
      heart.classList.add('pulse');
    }, 4500);

    // 4. Dispara mini corações aleatórios
    setTimeout(() => {
      this.generateMiniHearts();
    }, 5500);

    // 5. Depois dos corações, adiciona as faíscas aleatórias
    setTimeout(() => {
      this.generateSparks();
    }, 6500);

    // 6. Finaliza a animação
    setTimeout(() => {
      heart.style.opacity = '0';
      heart.style.transform = 'scale(0)';
      sparkContainer.style.display = 'none';
      usernames.forEach((username) => {
        username.style.opacity = '0';
      });
      leftProfile.style.opacity = '0';
      rightProfile.style.opacity = '0';
    }, 8000);
  }

  generateSparks(): void {
    const sparkContainer = document.getElementById('sparkContainer') as HTMLElement;
    sparkContainer.innerHTML = ''; // Limpa faíscas anteriores
    sparkContainer.style.display = 'block';

    const colors = ['#FF4081', '#FFEA00', '#7B1FA2', '#2196F3'];
    const numSparks = 50; // Número de faíscas

    for (let i = 0; i < numSparks; i++) {
      const spark = document.createElement('div');
      spark.classList.add('spark');

      // Posicionamento aleatório dentro da tela
      const x = Math.random() * 100 + 'vw';
      const y = Math.random() * 100 + 'vh';

      spark.style.position = 'absolute';
      spark.style.left = x;
      spark.style.top = y;
      
      spark.style.background = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 12 + 'px';
      spark.style.width = size;
      spark.style.height = size;
      spark.style.borderRadius = '50%';

      sparkContainer.appendChild(spark);

      setTimeout(() => {
        spark.remove();
      }, 1200);
    }
  }

  generateMiniHearts(): void {
    const heartContainer = document.querySelector('.match-container') as HTMLElement;
    const numHearts = 30; // Número de mini corações

    for (let i = 0; i < numHearts; i++) {
      const miniHeart = document.createElement('div');
      miniHeart.classList.add('mini-heart');
      miniHeart.innerHTML = '❤️';

      // Posicionamento aleatório
      const x = Math.random() * 100 + 'vw';
      const y = Math.random() * 100 + 'vh';

      miniHeart.style.position = 'absolute';
      miniHeart.style.left = x;
      miniHeart.style.top = y;

      heartContainer.appendChild(miniHeart);

      setTimeout(() => {
        miniHeart.remove();
      }, 1000);
    }
  }
}
