// chat-message.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ChatMessageComponent implements OnInit {
  @Input() message: any;
  isSentByUser: boolean = false;

  ngOnInit(): void {
    // Recupera o ID do usuário logado a partir do localStorage
    const userId = localStorage.getItem('userId');
    
    // Verifica se a mensagem foi enviada pelo usuário logado
    if (this.message) {
      // Verifica quem enviou a mensagem
      this.isSentByUser = this.message.sender_id === Number(userId);
    }
  }
}
