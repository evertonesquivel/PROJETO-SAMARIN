import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importação do CommonModule

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css'],
  standalone: true,
  imports: [CommonModule]  // Importação do CommonModule aqui
})
export class ChatMessageComponent implements OnInit {
  @Input() message: any;
  isSentByUser: boolean = false;

  ngOnInit(): void {
    // Recupera o ID do usuário logado a partir do localStorage
    const userId = localStorage.getItem('userId');
    
    // Verifica se a mensagem foi enviada pelo usuário logado
    if (this.message && this.message.senderId === userId) {
      this.isSentByUser = true;
    }
  }
}
